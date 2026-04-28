import React from "react";
import { GameEventBroker, EventType } from '../event_broker';

export function FullscreenMenu({ username }) {
    return (
        <div className="p-3" style={{margin: "18vh auto 0 auto" }}>
            <h1 className="text-dark text-center p-3">Logged in as: <span className="text-primary-emphasis">{username}</span></h1>
            <div className="d-flex flex-column gap-3 align-items-center">
                <button className="btn btn-primary play-button" type="button" 
                    onClick={() => GameEventBroker.createEvent(username, EventType.PlayerStatus, 'enqueue')}>Random Match
                </button>
                <button className="btn btn-primary play-button" type="button">Create Custom Game</button>
                <div className="input-group flex-nowrap" style={{ width: "400px" }}>
                    <button className="btn text-white disabled input-group-text" type="button">Join Custom Game</button>
                    <input className="form-control" type="text" value="Room Code" />
                </div>
            </div>
        </div>
    )
}