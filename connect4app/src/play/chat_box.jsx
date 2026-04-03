import React from "react";
import { GameEventBroker, EventType } from './event_broker';

import './chat_box.css';

export function ChatBox() {
    const [events, setEvents] = React.useState([])

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
                    <p className={event.type}>{event.value}</p>
                </div>
            );
        }
        return messagesArray.reverse()
    }

    return (
        <div className="chat-box">
            <div className="messages-area">
                { buildMessagesArray() }
            </div>
            <div className="input-group">
                <input className="form-control" type="text" value="Chat Message..." />
                <button className="btn btn-light" type="button">Send</button>
            </div>
        </div>
    );
}