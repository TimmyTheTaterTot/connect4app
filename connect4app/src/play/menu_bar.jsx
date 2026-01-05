import React from "react";

export function MenuBar({ username }) {
    return (
        <div className="p-3">
            <h2 className="text-dark">Logged in as: <span className="text-primary-emphasis">{username}</span></h2>
            <div className="d-flex gap-2 align-items-center flex-wrap">
                <button className="btn btn-primary play-button" type="button">Free Play</button>
                <button className="btn btn-primary play-button" type="button">Create Custom Game</button>
                <div className="input-group flex-nowrap" style={{ width: "400px" }}>
                    <button className="btn text-white disabled input-group-text" type="button">Join Custom Game</button>
                    <input className="form-control" type="text" value="Room Code" />
                </div>
            </div>
        </div>
    )
}