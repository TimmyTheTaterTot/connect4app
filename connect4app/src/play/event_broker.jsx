const EventType = {
    ChatMessage: 'chat-message-event',
    GameUpdate: 'game-update-event',
    SystemMessage: 'system-message-event'
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

    addEvent (from, type, value) {
        const newEvent = new Event(from, type, value);
        this.events.push(newEvent);

        this.broadcastEvent(newEvent);
    }

    broadcastEvent (event) {
        this.handlers.forEach((handler) => handler(event));
    }

    addHandler (handler) {
        this.handlers.push(handler);
    }

    removeHandler (handler) {
        this.handlers = this.handlers.filter((existing) => existing != handler);
    }
}

const GameEventBroker = new EventBroker;
export {GameEventBroker, EventType}