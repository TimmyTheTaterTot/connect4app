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
    const [oppName, setOppName] = React.useState('Loading...');
    const [playerTurn, setPlayerTurn] = React.useState(false);

    // Check if player is logged in and if not, redirect to login page
    React.useEffect(() => {
        if (loginState === null || loginState === true) return;
        navigate('/');
    }, [loginState]);

    const eventListener = React.useCallback((event) => {
        switch (event.type) {
            case EventType.System:
                if (event.data === 'set opponent name') {
                    setOppName(event.from);
                } else {
                    setInfoMsg(event.data);
                }
                break;
            case EventType.GameUpdate:
                if (event.data === 'join match') setInGame(true);
                else if (event.data === 'your turn') setPlayerTurn(true);
                break;

            default:
                break;
        }
    }, []);

    React.useEffect(() => {
        GameEventBroker.addHandler(eventListener);
        return () => GameEventBroker.removeHandler(eventListener);
    })


    return (
    <main className="justify-content-start">
        {!inGame && <FullscreenMenu username={ username } setInfoMsg={ setInfoMsg }/>}
        {!inGame && infoMsg && <h4 className="p-2 text-center">{ infoMsg }</h4>}
        {inGame && <MenuBar username={ username } setInfoMsg={ setInfoMsg } />}

        {inGame && <div className="mx-auto p-3 game-region justify-content-between">
            <div className="player-card-area">
                <PlayerTile playerName={ username } tileClass={ playerTurn ? 'player-turn' : '' } />
                <PlayerTile playerName={ oppName } tileClass={ playerTurn ? '' : 'opponent-turn' } />
            </div>
            <GameBoard playerName={ username } playerTurn={ playerTurn } setPlayerTurn={ setPlayerTurn } />
            <ChatBox playerName={ username } />
        </div>}
    </main>
  );
}