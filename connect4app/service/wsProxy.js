const { WebSocketServer, WebSocket } = require('ws');
const { Event, EventType } = require('./event.js');
const db = require('./database.js');
const cookie = require('cookie');
const uuid = require('uuid');

function wsProxy(httpServer) {
    const activeMatches = new Map();
    const matchQueue = [];
    const wsServer = new WebSocketServer({ server: httpServer });

    wsServer.on('connection', async (socket, req) => {
        socket.isAlive = true;
        socket.user = null;
        await loginClientWS(socket, req);

        socket.on('message', (data) => {
            console.log(`socket message from user ${socket.user}: ${data}`)
            const event = JSON.parse(data);

            switch (event.type) {
                case EventType.Websocket:
                    WebsocketEventHandler(socket, event);
                    break;
                case EventType.ChatMessage:
                    ChatMessageEventHandler(socket, event, activeMatches);
                    break;
                case EventType.PlayerStatus:
                    PlayerStatusEventHandler(socket, event, matchQueue, activeMatches);
                    break;
            
                default:
                    break;
            }

            // wsServer.clients.forEach((client) => {
            //     if (client.readyState === WebSocket.OPEN) {
            //         client.send(data);
            //     }
            // });
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

async function loginClientWS(socket, req) {
    const cookies = cookie.parse(req.headers.cookie || '');
    const userAuthToken = cookies.authToken;
    const user = userAuthToken ? await db.getUserByToken(userAuthToken) : null;
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

function createMatch(activeMatches) {
    const matchid = uuid.v4();
    const newMatch = {
        id: matchid,
        time: Date.now(),
        players: [],
    }
    activeMatches.set(matchid, newMatch);
    return newMatch;
}

function joinMatch(psock, match) {
    psock.matchid = match.id;
    match.players.push(psock);
    return match;
}

function ChatMessageEventHandler(socket, event, activeMatches) {
    if (socket.matchid == null) return console.log('no matchid associated with socket');
    if (activeMatches.get(socket.matchid) == null) return console.log('unable to find match');

    const match = activeMatches.get(socket.matchid);
    match.players.forEach(p => {
        p.send(JSON.stringify(event));
    });
}

function WebsocketEventHandler(socket, event) {
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

function PlayerStatusEventHandler(socket, event, matchQueue, activeMatches) {
    switch (event.data) {
        case 'enqueue':
            matchQueue.push(socket);
            console.log(`added ${socket.user} to play queue`);
            matchmake(matchQueue, activeMatches);
            break;
        case 'dequeue':
            matchQueue = matchQueue.filter(s => s !== socket);
            break;
    
        default:
            break;
    }
}

function matchmake(matchQueue, activeMatches) {
    if (matchQueue.length < 2) return;

    const p1 = matchQueue.shift();
    const p2 = matchQueue.shift();    
    const match = createMatch(activeMatches);
    joinMatch(p1, match);
    joinMatch(p2, match);
    
    const event = new Event('System', EventType.System, 
        `Joined match with players ${p1.user} and ${p2.user}`);
    match.players.forEach(p => p.send(JSON.stringify(event)));

    return matchQueue;
}

module.exports = { wsProxy };