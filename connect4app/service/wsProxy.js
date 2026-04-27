const { WebSocketServer, WebSocket } = require('ws');
const db = require('./database.js');
const cookie = require('cookie');

function wsProxy(httpServer) {
    const activeMatches = new Map();
    const wsServer = new WebSocketServer({ server: httpServer });

    wsServer.on('connection', async (socket, req) => {
        socket.isAlive = true;
        socket.user = null;
        await authenticateClientWS(socket, req);

        socket.on('message', (data) => {
            console.log(`socket message from user ${socket.user}: ${data}`)
            wsServer.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(data);
                }
            });
        });

        socket.on('pong', () => {
            socket.isAlive = true;
        });
    });

    setInterval(() => {
        wsServer.clients.forEach((client) => {
            if (!client.isAlive) {
                client.terminate();
                return;
            }

            client.isAlive = false;
            client.ping();
        });
    }, 10000);
}

async function authenticateClientWS(socket, req) {
    const cookies = cookie.parse(req.headers.cookie || '');
    const userAuthToken = cookies.authToken;
    const user = userAuthToken ? await db.getUserByToken(userAuthToken) : null;
    if (user) {
        socket.user = user.username;
        return 0;
    }
    return -1;
}

module.exports = { wsProxy };