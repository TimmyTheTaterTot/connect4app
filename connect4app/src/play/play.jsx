import React from 'react';
import { useNavigate } from 'react-router-dom';

import { GameEventBroker, EventType } from '../event_broker';
import { GameBoard } from './game_board';
import { PlayerTile } from './player_tiles';
import { ChatBox } from './chat_box';
import { MenuBar } from './menu_bar';
import { FullscreenMenu } from './fullscreen_menu';

import "./play.css";

export function Play({ username, loginState }) {
    const navigate = useNavigate();
    const [inGame, setInGame] = React.useState(false);
    const [infoMsg, setInfoMsg] = React.useState(null);
    const [turnStart, setTurnStart] = React.useState(null);

    // Check if player is logged in and if not, redirect to login page
    React.useEffect(() => {
        if (loginState === null || loginState === true) return;
        navigate('/');
    }, [loginState]);

    function eventListener(event) {
        switch (event.type) {
            case EventType.System:
                setInfoMsg(event.data);
                break;
            case EventType.GameUpdate:
                if (event.data.startsWith('join match')) {
                    if (event.data.endsWith('y')) {
                        setTurnStart(false);
                    } else if (event.data.endsWith('r')) {
                        setTurnStart(true);
                    } else {
                        setTurnStart('oogabooga');
                    }
                    setInGame(true);
                }
                break;

            default:
                break;
        }
    }

    React.useEffect(() => {
        GameEventBroker.addHandler(eventListener);
        return () => GameEventBroker.removeHandler(eventListener);
    })


    return (
    <main className="justify-content-start">
        {!inGame && <FullscreenMenu username={ username } setInfoMsg={ setInfoMsg }/>}
        {!inGame && infoMsg && <h4 className="p-2 text-center">{infoMsg}</h4>}
        {inGame && <MenuBar username={ username } setInfoMsg={ setInfoMsg } />}

        {inGame && <div className="mx-auto p-3 game-region justify-content-between">
            <div className="player-card-area">
                <PlayerTile playerName={`${username} (y)`} />
                <PlayerTile playerName="opponent (r)" />
            </div>
            <GameBoard playerName={ username } turnStart={ turnStart }/>
            <ChatBox playerName={ username } />
        </div>}
    </main>
  );
}