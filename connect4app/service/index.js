const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();

const authCookieName = 'authToken';

const port = process.argv.length > 2 ? process.argv[2] : 4000;

// temp database
const users = [];
const matchResults = [];

let leaderboardData = [];
let cachedResultsLength = 0;

// Custom Middleware
const getAuthState = async (req, res, next) => {
    const user = await getUser('authTokens', req.cookies[authCookieName]);
    if (user) {
        next();
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
}

app.use(express.json()); // middleware to auto parse json http responses
app.use(cookieParser()); // middlware to work with cookies
app.use(express.static('public')); // middleware to serve up static files from the 'public' directory

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Login route
apiRouter.put('/auth', async (req, res) => {
    const user = await getUser('username', req.body.username);
    if (user && (await bcrypt.compare(req.body.password, user.passwordHash))) {
        setAuthCookie(res, user);
        res.send({ username: user.username });
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
});

// Register Route
apiRouter.post('/auth', async (req, res) => {
    if (await getUser('username', req.body.username)) {
        res.status(409).send({ msg: 'User Already Exists' });
    } else {
        const user = await createUser(req.body.username, req.body.password);
        setAuthCookie(res, user);

        res.send({ username: user.username });
    }
});

// Logout Route
apiRouter.delete('/auth', async (req, res) => {
    const user = await getUser('authTokens', req.cookies['authToken']);
    if (user) {
        deleteAuthCookie(req, res, user);
        res.send({ msg: 'Logged out successfully' });
    } else {
        res.status(400).send({ msg: 'Invalid Request' });
    }
});

apiRouter.get('/auth', async (req, res) => {
    const user = await getUser('authTokens', req.cookies['authToken']);
    if (user) {
        res.send({ username: user.username });
    } else {
        res.status(401).send({ msg: 'Not Logged In' });
    }
}); 

// Get recent matches list
apiRouter.get('/matches', getAuthState, (req, res) => {

    // Check for cache miss and update data if so
    if (matchResults.length != cachedResultsLength) {
        formatLeaderboardData();
    }

    res.send(leaderboardData);
});

// Add a new completed match
apiRouter.post('/matches', getAuthState, async (req, res) => {
    matchResults.push(req.body);
    const result = await processGameResult(req);

    if (result == null) {
        res.status(400).send({ msg: 'Error occured while processing game results'});
    } else {
        res.status(204).send({});
    }
});

// Helper functions
async function getUser(field, value) {
    if (!value) return null;

    if (field === 'authTokens') {
        return users.find((user) => user.authTokens.includes(value));
    } else {
        return users.find((user) => user[field] === value);
    }
}

async function createUser(username, password) {
    const hash = await bcrypt.hash(password, 10);

    const user = {
        username: username,
        passwordHash: hash,
        authTokens: [],
        gameRecord: {
            wins: 0,
            losses: 0,
            games: 0
        }
    };
    users.push(user);

    return user;
}

function setAuthCookie(res, user) {
    const authToken = uuid.v4();
    user.authTokens.push(authToken);

    res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

function deleteAuthCookie(req, res, user) {
    user.authTokens.filter((token) => token != req.cookies[authCookieName]);
    res.clearCookie(authCookieName);
}

async function processGameResult(req) {
    const winningPlayer = await getUser('username', req.body.winner);
    const losingPlayer = await getUser('username', req.body.loser);
    if (winningPlayer == null || losingPlayer == null) {
        return null;
    }

    winningPlayer.gameRecord.wins++;
    winningPlayer.gameRecord.games++;
    losingPlayer.gameRecord.losses++;
    losingPlayer.gameRecord.games++;

    return true;
}

function formatLeaderboardData() {
    const topPlayers = [...users];
    topPlayers.sort((p) => p.gameRecord.wins / p.gameRecord.games);
    topPlayers.slice(0, 10);

    leaderboardData = [];
    for (const p of topPlayers) {
        leaderboardData.push({
            name: p.username,
            wins: p.gameRecord.wins,
            losses: p.gameRecord.losses,
            games: p.gameRecord.games
        })
    }
}

app.listen(port, () => {
        console.log(`Listening on port ${port}`);
});