const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.username}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('connect4club');
const userCollection = db.collection('users');
const matchCollection = db.collection('matches');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`Connected to database`);
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

function getUser(username) {
  return userCollection.findOne({ username: username });
}

function getUserByToken(token) {
  return userCollection.findOne({ authToken: token });
}

async function addUser(user) {
  await userCollection.insertOne(user);
}

async function updateUser(user) {
  await userCollection.updateOne({ username: user.username }, { $set: user });
}

async function updateUserRemoveAuth(user) {
  await userCollection.updateOne({ username: user.username }, { $unset: { token: 1 } });
}

async function uploadMatchResult(match) {
  return matchCollection.insertOne(match);
}

async function getLeaderboard() {
  const leaderboardData = await userCollection.aggregate([
    {
      $match: {
        "gameRecord.games": { $gt: 0 }
      }
    },
    {
      $project: {
        _id: 0,
        username: 1,
        wins: "$gameRecord.wins",
        losses: "$gameRecord.losses",
        winrate: "$gameRecord.winrate"
      }
    },
    { $sort: { winrate: -1 } },
    { $limit: 10 }
  ]).toArray();

  return leaderboardData;
}

module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  updateUserRemoveAuth,
  uploadMatchResult,
  getLeaderboard,
};
