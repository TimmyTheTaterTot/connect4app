const EventType = {
    ChatMessage: 'chat-message-event',
    SystemStatus: 'system-status-event',
    PlayerStatus: 'player-status-event',
    PlayerMove: 'player-move-event',
    GameUpdate: 'game-update-event'
};

class Event {
    constructor(from, type, value){
        this.from = from;
        this.type = type;
        this.value = value;
    }
}

class EventBroker {
    events = []
    handlers = []
    
    constructor() {
        let port = window.location.port;
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${window.location.port}/ws`);

        this.socket.onopen = (event) => {
            this.createEvent('System', EventType.SystemStatus, 'connected to server');
        };

        this.socket.onclose = (event) => {
            this.createEvent('System', GameEvent.SystemStatus, 'disconnected from server');
        };

        this.socket.onmessage = async (msg) => {
            try {
                const event = JSON.parse(await msg.data.text());
                this.broadcastEvent(event);
            } catch {}
        };
    }

    createEvent (from, type, value) {
        const newEvent = new Event(from, type, value);
        this.events.push(newEvent);

        this.broadcastEvent(newEvent);
    }

    broadcastEvent (event) {
        this.handlers.forEach((handler) => handler(event));
    }

    addHandler (handler) {
        this.handlers.push(handler);
        this.events.forEach((event) => handler(event));
    }

    removeHandler (handler) {
        this.handlers = this.handlers.filter((existing) => existing != handler);
    }
}

const GameEventBroker = new EventBroker;

// GameEventBroker.createEvent('Zack', EventType.ChatMessage, 'Wow this game is fun!');
// GameEventBroker.createEvent('Jeff', EventType.ChatMessage, 'Yeah, it is! This is my first time playing!');
// GameEventBroker.createEvent('GameMaster', EventType.ChatMessage, 'Zack placed their piece in column 4!');
// GameEventBroker.createEvent('System', EventType.ChatMessage, 'Servers will shutdown in 5 minutes for scheduled maintenance');

export {GameEventBroker, EventType}