import React from "react";

import './play.css';

export function PlayerTile({ playerName, tileClass }) {
    const [playerELO, setPlayerELO] = React.useState("unknown");

    return (
        <div className={`player-card rounded-4 p-3 bg-dark ${tileClass}`}>
            <h3 className="text-white">{ playerName }</h3>
            <p className="text-white">Rating: { playerELO }</p>
            <div className="player-tile-buttons">
                <button className="btn btn-secondary disabled me-1">View Profile</button>
                <button className="btn btn-secondary disabled">Add Friend</button>
            </div>
        </div>
    );
}