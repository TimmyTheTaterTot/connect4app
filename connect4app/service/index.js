const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;

// temp database
const users = [];

app.use(express.json()); // middleware to auto parse json http responses
app.use(cookieParser()); // middlware to work with cookies
app.use(express.static('public')); // middleware to serve up static files from the 'public' directory

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Login route
apiRouter.put("/auth", async (req, res) => {
    const user = await getUser(username, req.body.username);
    if (user && bcrypt.compare(req.body.password, user.passwordHash)) {
        setAuthCookie(res, user);
        res.send({'username': username});
    } else {
        res.status(401).send({'msg':'Unauthorized'});
    }
});

// Register Route

// Helper functions
async function getUser(field, value) {
    if (!value)
        return null;

    return users.find((user) => user[field] === value);
}

async function createUser(username, password) {
    const hash = await bcrypt.hash(password, 10);

    const user = {
        username: username,
        passwordHash: hash,
        authTokens: []
    };
    users.push(user);
}

function setAuthCookie(res, user) {
  user.authTokens.push(uuid.v4());

  res.cookie('authToken', user.token, {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}