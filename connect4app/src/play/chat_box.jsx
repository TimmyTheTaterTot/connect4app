import React from "react";
import { GameEventBroker, EventType } from './event_broker';

import './chat_box.css';

export function ChatBox({ playerName }) {
    const [events, setEvents] = React.useState([])
    const [chatMessage, setChatMessage] = React.useState('')

    function sendChatMessage() {
        if (chatMessage.trim()) {
            GameEventBroker.addEvent(playerName, EventType.ChatMessage, chatMessage);
            setChatMessage('');
        }
    }

    function handleEvent(event) {
        setEvents((prev) => {
            return [event, ...prev]
        })
    }

    React.useEffect(() => {
        GameEventBroker.addHandler(handleEvent);

        GameEventBroker.addEvent('Zack', EventType.ChatMessage, 'Wow this game is fun!');
        GameEventBroker.addEvent('Jeff', EventType.ChatMessage, 'Yeah, it is! This is my first time playing!');
        GameEventBroker.addEvent('GameMaster', EventType.ChatMessage, 'Zack placed their piece in column 4!');
        GameEventBroker.addEvent('System', EventType.ChatMessage, 'Servers will shutdown in 5 minutes for scheduled maintenance');
    }, []);


    function buildMessagesArray(){
        const messagesArray = [];
        for (const [index, event] of events.entries()) {
            messagesArray.push(
                <div key={index} className="chat-message-frame">
                    <p className={event.type}>{event.from}: {event.value}</p>
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