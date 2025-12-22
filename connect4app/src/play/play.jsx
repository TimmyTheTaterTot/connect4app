import React from 'react';

import { GameBoard } from './game_board';
import { PlayerTile } from './player_tiles';
import { ChatBox } from './chat_box';

import "./play.css";

export function Play({ username }) {
    return (
    <main className="justify-content-start">
        <div className="p-3">
            <h2 className="text-primary-emphasis">Logged in as: <span className="text-dark">{username}</span></h2>
            <div className="d-flex gap-2 align-items-center flex-wrap">
                <button className="btn btn-primary play-button" type="button">Free Play</button>
                <button className="btn btn-primary play-button" type="button">Create Custom Game</button>
                <div className="input-group flex-nowrap" style={{ width: "400px" }}>
                    <button className="btn text-white disabled input-group-text" type="button">Join Custom Game</button>
                    <input className="form-control" type="text" value="Room Code" />
                </div>
            </div>
        </div>

        <div className="mx-auto p-3 game-region justify-content-between">
            <div className="player-card-area">
                <PlayerTile playerName={ username } />
                <PlayerTile playerName='opponent' />
            </div>
            <GameBoard />
            <ChatBox />
        </div>
    </main>
  );
}