import React from 'react';

import { useNavigate } from 'react-router-dom';
import { GameBoard } from './game_board';
import { PlayerTile } from './player_tiles';
import { ChatBox } from './chat_box';
import { MenuBar } from './menu_bar';

import "./play.css";
import { FullscreenMenu } from './fullscreen_menu';

export function Play({ username }) {
    const navigate = useNavigate();
    const [inGame, setInGame] = React.useState(false);

    // Check if player is logged in and if not, redirect to login page
    React.useEffect(() => {(async () => {
        const res = await fetch('/api/auth', {
            method: 'GET',
        });

        if (!res.ok) navigate('/');
    })()}, []);

    return (
    <main className="justify-content-start">
        {!inGame && <FullscreenMenu username={ username }/>}
        {inGame && <MenuBar username={ username } />}

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