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

module.exports = {Event, EventType}