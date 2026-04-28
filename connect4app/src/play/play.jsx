import React from 'react';
import { useNavigate } from 'react-router-dom';

import { GameEventBroker, EventType } from '../event_broker';
import { GameBoard } from './game_board';
import { PlayerTile } from './player_tiles';
import { ChatBox } from './chat_box';
import { MenuBar } from './menu_bar';
import { FullscreenMenu } from './fullscreen_menu';

import "./play.css";

export function Play({ username, loginState, authLoading }) {
    const navigate = useNavigate();
    const [inGame, setInGame] = React.useState(false);
    const [infoMsg, setInfoMsg] = React.useState(null);

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
                if (event.data === 'join match') {
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
                <PlayerTile playerName={ username } />
                <PlayerTile playerName="opponent" />
            </div>
            <GameBoard playerName={ username }/>
            <ChatBox playerName={ username }/>
        </div>}
    </main>
  );
}