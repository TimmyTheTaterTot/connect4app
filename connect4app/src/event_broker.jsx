const EventType = {
    ChatMessage: 'chat-message-event',
    System: 'system-event',
    Websocket: 'websocket-event',
    PlayerStatus: 'player-status-event',
    GameMove: 'game-move-event',
    GameUpdate: 'game-update-event'
};

class Event {
    constructor(from, type, data){
        this.from = from;
        this.type = type;
        this.data = data;
    }
}

class EventBroker {
    events = []
    handlers = []
    
    constructor() {
        this.connectWebsocket();
    }

    connectWebsocket() {
        let port = window.location.port;
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${window.location.port}/ws`);

        this.socket.onopen = (event) => {
            this.createLocalEvent('System', EventType.Websocket, 'connected to server');
        };

        this.socket.onclose = (event) => {
            this.createLocalEvent('System', EventType.Websocket, 'disconnected from server');
        };

        this.socket.onmessage = async (msg) => {
            try {
                const event = JSON.parse(await msg.data.text());
                this.localProcessEvent(event);
            } catch {}
        };
    }

    async reconnectWebsocket() {
        await this.closeWebsocket();
        this.connectWebsocket();
    }

    async closeWebsocket() {
        if (!this.socket || this.socket.readyState === WebSocket.CLOSED) return;

        if (this.socket.readyState === WebSocket.CLOSING) {
            await new Promise((resolve) => {
                this.socket.addEventListener('close', resolve, { once: true });
            });
            return;
        }

        await new Promise((resolve) => {
            this.socket.addEventListener('close', resolve, { once: true });
            this.socket.close();
        });
    }

    createLocalEvent(from, type, data) {
        const newEvent = new Event(from, type, data);
        this.events.push(newEvent);
        this.localProcessEvent(newEvent);
    }

    localProcessEvent(event) {
        this.handlers.forEach((handler) => handler(event));
    }

    createEvent(from, type, data) {
        const newEvent = new Event(from, type, data);
        this.events.push(newEvent);
        this.broadcastEvent(newEvent);
    }

    broadcastEvent(event) {
        console.log(JSON.stringify(event));
        this.socket.send(JSON.stringify(event));
    }

    addHandler(handler) {
        this.handlers.push(handler);
        this.events.forEach((event) => handler(event));
    }

    removeHandler(handler) {
        this.handlers = this.handlers.filter((existing) => existing != handler);
    }
}

const GameEventBroker = new EventBroker();

// GameEventBroker.createLocalEvent('Zack', EventType.ChatMessage, 'Wow this game is fun!');
// GameEventBroker.createLocalEvent('Jeff', EventType.ChatMessage, 'Yeah, it is! This is my first time playing!');
// GameEventBroker.createLocalEvent('GameMaster', EventType.ChatMessage, 'Zack placed their piece in column 4!');
// GameEventBroker.createLocalEvent('System', EventType.ChatMessage, 'Servers will shutdown in 5 minutes for scheduled maintenance');

export {GameEventBroker, EventType}