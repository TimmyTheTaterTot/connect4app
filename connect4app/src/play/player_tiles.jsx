import React from "react";

import './play.css';

export function PlayerTile({ playerName }) {
    const [playerELO, setPlayerELO] = React.useState('...');

    React.useEffect(() => {
        const info = JSON.parse(localStorage.getItem('playerInfo'));
        if (info && playerName in info) {
            setPlayerELO(info[playerName])
            return;
        }
        setPlayerELO("Unknown")
    }, [])

    return (
        <div className="player-card rounded-4 p-3 bg-dark">
            <h3 className="text-white">{ playerName }</h3>
            <p className="text-white">Rating: { playerELO }</p>
            <div className="player-tile-buttons">
                <button className="btn btn-secondary me-1">View Profile</button>
                <button className="btn btn-secondary">Add Friend</button>
            </div>
        </div>
    );
}