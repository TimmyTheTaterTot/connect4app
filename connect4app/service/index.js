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
    res.send(matchResults);
});

// Add a new completed match
apiRouter.post('/matches', getAuthState, (req, res) => {
    matchResults.push(req.body);
    res.status(204).send({});
})

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
        authTokens: []
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

app.listen(port, () => {
        console.log(`Listening on port ${port}`);
});