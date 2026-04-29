const { WebSocketServer, WebSocket } = require('ws');
const { Event, EventType } = require('./event.js');
const GameController = require('./gameController.js');
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
            
            match.players[0].send(JSON.stringify(
                new Event(match.players[1].user, EventType.System, 'set opponent name')));
            match.players[1].send(JSON.stringify(
                new Event(match.players[0].user, EventType.System, 'set opponent name')));

            const chatEvent = new Event('System', EventType.ChatMessage, 
                `Joined match with players ${match.players[0].user} and ${match.players[1].user}`);
            socket.send(JSON.stringify(chatEvent));

            if (socket === match.controller.p0) {
                const nextTurnEvent = new Event('GameController', EventType.GameUpdate, 'your turn');
                socket.send(JSON.stringify(nextTurnEvent));
            }
            break;
            
    
        default:
            break;
    }
}

function GameMoveEventHandler(socket, event, activeMatches) {
    const match = activeMatches.get(socket.matchid);
    let other = socket === match.controller.p0 ? match.controller.p1 : match.controller.p0;

    if (socket === match.controller.p0 && match.controller.pTurn === 0 || 
        socket === match.controller.p1 && match.controller.pTurn === 1) {
        const gameResult = match.controller.placePiece(event.data.x, event.data.y)        
        match.players.forEach((p) => p.send(JSON.stringify(event)));
        
        if (!gameResult) {
            const nextTurnEvent = new Event('GameController', EventType.GameUpdate, 'your turn');
            other.send(JSON.stringify(nextTurnEvent));
        } else {
            const winEvent = new Event('System', EventType.ChatMessage, 'You won!');
            const loseEvent = new Event('System', EventType.ChatMessage, 'You lost :(');
            socket.send(JSON.stringify(winEvent));
            other.send(JSON.stringify(loseEvent))
            delete match.controller;
        }
    }
    // check for valid move
}

function matchmake(matchQueue, activeMatches) {
    if (matchQueue.size < 2) return;

    const p0 = setPop(matchQueue);
    const p1 = setPop(matchQueue);
    const match = createMatch(activeMatches);
    joinMatch(p0, match);
    joinMatch(p1, match);
    match.controller = new GameController(p0, p1);
    
    const joinEvent = new Event('Matchmaker', EventType.GameUpdate, 'join match');
    match.players.forEach((p) => p.send(JSON.stringify(joinEvent)));

    return matchQueue;
}

function setPop(set) {
    for (const v of set) {
        set.delete(v);
        return v;
    }
}

module.exports = { wsProxy };