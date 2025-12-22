import React from "react";
import { Event, EventType } from './events';

import './chat_box.css';

export function ChatBox() {
    const [events, setEvents] = React.useState([])

    function handleEvent(event) {
        setEvents((prev) => {
            return [event, ...prev]
        })
    }

    React.useEffect(() => {
        handleEvent(new Event(EventType.ChatMessage, 'Zack: Wow this game is fun'));
        handleEvent(new Event(EventType.ChatMessage, 'Jeff: Yeah, it is! This is my first time playing!'))
        handleEvent(new Event(EventType.GameUpdate, 'Zack placed their piece in column 4!'))
        handleEvent(new Event(EventType.SystemMessage, 'Servers will shutdown in 5 minutes for sch'))
    }, []);


    function buildMessagesArray(){
        const messagesArray = [];
        for (const [index, event] of events.entries()) {
            messagesArray.push(
                <p key={index} className={event.type}>{event.value}</p>
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