import React from "react";
import { GameEventBroker, EventType } from '../event_broker';

export function FullscreenMenu({ username, setInfoMsg }) {
    const [inCustomLobby, setInCustomLobby] = React.useState(false);
    const [customGameCode, setCustomGameCode] = React.useState('');
    
    const customGameButtonDisabled = !(customGameCode.length == 6);

    return (
        <div className="p-3" style={{margin: "18vh auto 0 auto" }}>
            <h1 className="text-dark text-center p-3">Logged in as: <span className="text-primary-emphasis">{username.split('@')[0]}</span></h1>
            {!inCustomLobby && <div className="d-flex flex-column gap-3 align-items-center">
                <button className="btn btn-primary play-button" type="button" 
                    onClick={() => GameEventBroker.createEvent(username, EventType.PlayerStatus, 'enqueue')}>Random Match
                </button>
                <button className="btn btn-primary play-button" type="button"
                    onClick={() => {
                        GameEventBroker.createEvent(username, EventType.PlayerStatus, 'create custom game');
                        setInCustomLobby(true);}
                    }>Create Custom Game
                </button>
                <div className="input-group flex-nowrap" style={{ width: "400px" }}>
                    <button className="btn text-white input-group-text" disabled={ customGameButtonDisabled } type="button"
                        onClick={() => {joinCustomGame(username, customGameCode)}}>Join Custom Game</button>
                    <input className="form-control" type="text" placeholder="Room Code"
                        onKeyDown={(e) => {if (e.key == 'Enter') joinCustomGame(username, customGameCode)}}
                        onChange={e => setCustomGameCode(e.target.value)}/>
                </div>
            </div>}
            {inCustomLobby && <div className="d-flex flex-column gap-3 align-items-center">
                <button className="btn btn-primary play-button" type="button"
                    onClick={() => {
                        GameEventBroker.createEvent(username, EventType.PlayerStatus, 'delete custom game');
                        setInCustomLobby(false);
                        setInfoMsg('');}
                    }>Leave Custom Game
                </button>
            </div>}
        </div>
    )
}

function joinCustomGame(username, gameCode) {
    GameEventBroker.createEvent(username, EventType.PlayerStatus, 'join custom game', gameCode.toUpperCase());
}