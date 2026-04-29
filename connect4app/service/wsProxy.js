const { WebSocketServer, WebSocket } = require('ws');
const { Event, EventType } = require('./event.js');
const db = require('./database.js');
const cookie = require('cookie');
const uuid = require('uuid');

function wsProxy(httpServer) {
    const activeMatches = new Map();
    const matchQueue = new Set();
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
                case EventType.GameMove:
                    GameMoveEventHandler(socket, event, activeMatches);
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
            matchQueue.add(socket);
            const enqueueEvent = new Event('Matchmaker', EventType.System, 'Looking for Opponents...')
            socket.send(JSON.stringify(enqueueEvent))
            console.log(`added ${socket.user} to play queue`);
            matchmake(matchQueue, activeMatches);
            break;
        case 'dequeue':
            matchQueue = matchQueue.delete(socket);
            break;
        case 'joined match':
            const match = activeMatches.get(socket.matchid);
            const chatEvent = new Event('System', EventType.ChatMessage, 
                `Joined match with players ${match.players[0].user} and ${match.players[1].user}`);
            socket.send(JSON.stringify(chatEvent));
            break;
            
    
        default:
            break;
    }
}

function GameMoveEventHandler(socket, event, activeMatches) {
    const match = activeMatches.get(socket.matchid);
    // check for valid move
    match.players.forEach((p) => p.send(JSON.stringify(event)));
}

function matchmake(matchQueue, activeMatches) {
    if (matchQueue.size < 2) return;

    const p1 = setPop(matchQueue);
    const p2 = setPop(matchQueue);
    const match = createMatch(activeMatches);
    joinMatch(p1, match);
    joinMatch(p2, match);
    
    const p1Event = new Event('Matchmaker', EventType.GameUpdate, 'join match y');
    const p2Event = new Event('Matchmaker', EventType.GameUpdate, 'join match r');
    p1.send(JSON.stringify(p1Event));
    p2.send(JSON.stringify(p2Event));

    return matchQueue;
}

function setPop(set) {
    for (const v of set) {
        set.delete(v);
        return v;
    }
}

module.exports = { wsProxy };