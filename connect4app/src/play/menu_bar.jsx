import React from "react";
import { GameEventBroker, EventType } from '../event_broker';

export function MenuBar({ username, setInGame }) {
    return (
        <div className="p-3">
            <h2 className="text-dark">Logged in as: <span className="text-primary-emphasis">{username}</span></h2>
            <div className="d-flex gap-2 align-items-center flex-wrap">
                <button className="btn btn-primary play-button" type="button" 
                    onClick={() => {
                        setInGame(false);
                        GameEventBroker.createEvent(username, EventType.PlayerStatus, 'leave match');
                    }}>Leave Match
                </button>
            </div>
        </div>
    )
}