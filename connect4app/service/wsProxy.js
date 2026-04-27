const { WebSocketServer, WebSocket } = require('ws');
const { EventType } = require('./event.js');
const db = require('./database.js');
const cookie = require('cookie');


function wsProxy(httpServer) {
    const activeMatches = new Map();
    const wsServer = new WebSocketServer({ server: httpServer });

    wsServer.on('connection', async (socket, req) => {
        socket.isAlive = true;
        socket.user = null;
        await loginClientWS(socket, req);

        socket.on('message', (data) => {
            console.log(`socket message from user ${socket.user}: ${data}`)
            const event = parseSocketMessage(data);

            // TESTING CODE LOCATION PLEASE MOVE
            if (event.type === EventType.Websocket) {
                switch (event.data) {
                    case 'login':
                        console.log(`logged in ${socket.user}`);
                        break;
                    case 'logout':
                        console.log(`logging out ${socket.user}`);
                        logoutClientWS(socket);                        
                        break;
                
                    default:
                        break;
                }
            }
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

function parseSocketMessage(data) {
    return JSON.parse(data);
}

async function loginClientWS(socket, req) {
    const cookies = cookie.parse(req.headers.cookie || '');
    const userAuthToken = cookies.authToken;
    const user = userAuthToken ? await db.getUserByToken(userAuthToken) : null;
    console.log(`user: ${user == null ? null : user.username}`);
    if (user) {
        socket.user = user.username;
        return 0;
    }
    console.log('login error');
    return -1;
}

function logoutClientWS(socket) {
    if (socket.user == null) return 1;

    socket.user = null;
    return 0;
}

module.exports = { wsProxy };