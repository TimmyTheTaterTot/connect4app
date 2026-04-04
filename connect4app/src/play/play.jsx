import React from 'react';

import { GameBoard } from './game_board';
import { PlayerTile } from './player_tiles';
import { ChatBox } from './chat_box';
import { MenuBar } from './menu_bar';

import "./play.css";

export function Play({ username }) {
    return (
    <main className="justify-content-start">
        <MenuBar username={ username } />

        <div className="mx-auto p-3 game-region justify-content-between">
            <div className="player-card-area">
                <PlayerTile playerName={ username } />
                <PlayerTile playerName="opponent" />
            </div>
            <GameBoard />
            <ChatBox playerName={ username }/>
        </div>
    </main>
  );
}