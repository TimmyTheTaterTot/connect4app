import React from "react";

import './play.css';

export function ChatBox() {
    const [events, setEvents] = React.useState([])

    function handleEvent(event) {
        setEvents((prev) => {
            [event, ...prev]
        })
    }

    function buildMessagesArray(){
        const messagesArray = [];
        for (const [index, event] of events.entries()) {
            messagesArray.push(
                <p className={event.name}
            )
        }
    }

    return (
        <div className="chat-box">
            <div className="messages-area">
                { buildMessagesArray() }
                <p className="text-dark">Zack: Wow this game is fun</p>
                <p className="text-dark">Jeff: Yeah, it is! This is my first time playing!</p>
            </div>
            <div className="input-group">
                <input className="form-control" type="text" value="Chat Message..." />
                <button className="btn btn-light" type="button">Send</button>
            </div>
        </div>
    );
}