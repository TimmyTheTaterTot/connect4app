const EventType = {
    ChatMessage: 'chat-message-event',
    GameUpdate: 'game-update-event',
    SystemMessage: 'system-message-event'
};

class Event {
    constructor(type, value){
        this.type = type;
        this.value = value;
    }
}

export { Event, EventType }