import React from "react";
import { GameEventBroker, EventType } from '../event_broker';

import './chat_box.css';

export function ChatBox({ playerName }) {
    const [events, setEvents] = React.useState([])
    const [chatMessage, setChatMessage] = React.useState('')

    function sendChatMessage() {
        if (chatMessage.trim()) {
            GameEventBroker.createEvent(playerName, EventType.ChatMessage, chatMessage);
            setChatMessage('');
        }
    }

    function eventListener(event) {
        if (event.type === EventType.ChatMessage) {
            setEvents((prev) => {
                return [event, ...prev]
            })
        }
    }

    React.useEffect(() => {
        GameEventBroker.addHandler(eventListener);
        GameEventBroker.createEvent(playerName, EventType.PlayerStatus, 'joined match');
        return () => GameEventBroker.removeHandler(eventListener);
    }, []);


    function buildMessagesArray(){
        const messagesArray = [];
        for (const [index, event] of events.entries()) {
            messagesArray.push(
                <div key={index} className="chat-message-frame">
                    <p className={event.type}>{event.from}: {event.data}</p>
                </div>
            );
        }
        return messagesArray.reverse()
    }

    return (
        <div className="chat-box">
            <div className="messages-area">
                <div className="messages-inner">
                    { buildMessagesArray() }
                </div>
            </div>
            <div className="input-group">
                <input className="form-control" type="text" placeholder='Chat Message...' 
                    value={chatMessage}
                    onChange={(msg) => setChatMessage(msg.target.value)}
                    onKeyDown={(e) => {if (e.key == 'Enter') sendChatMessage();}}/>
                <button className="btn btn-light" type="button"
                    onClick={sendChatMessage}>Send</button>
            </div>
        </div>
    );
}