const EventType = {
    ChatMessage: 'chat-message-event',
    System: 'system-event',
    Websocket: 'websocket-event',
    PlayerStatus: 'player-status-event',
    GameMove: 'game-move-event',
    GameUpdate: 'game-update-event'
};

class Event {
    constructor(from, type, code, data = null){
        this.from = from;
        this.type = type;
        this.code = code;
        this.data = data;
    }
}

module.exports = {Event, EventType}