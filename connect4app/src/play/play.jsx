import React from 'react';

import "./play.css";

export function Play() {
  return (
    <main className="justify-content-start">
        <div className="p-3">
            <h2 className="h2l">Logged in as: [Player Name]</h2>
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
                <div className="player-card rounded-4 p-3 bg-dark">
                    <h3 className="text-white">[Player Name]</h3>
                    <p className="text-white">Rating: 1200</p>
                    <div className="player-tile-buttons">
                        <button className="btn btn-secondary me-1">View Profile</button>
                        <button className="btn btn-secondary">Add Friend</button>
                    </div>
                </div>
                <div className="player-card rounded-4 p-3 bg-dark">
                    <h3 className="text-white">[Player Name]</h3>
                    <p className="text-white">Rating: 1200</p>
                    <div className="player-tile-buttons">
                        <button className="btn btn-secondary me-1">View Profile</button>
                        <button className="btn btn-secondary">Add Friend</button>
                    </div>
                </div>
            </div>
            <div className="game-board bg-dark rounded-5">
                <div className="game-spaces-container p-3">
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                    <div className="board-space"></div>
                </div>
            </div>
            <div className="chat-box">
                <div className="messages-area">
                    <p className="text-dark">Zack: Wow this game is fun</p>
                    <p className="text-dark">Jeff: Yeah, it is! This is my first time playing!</p>
                </div>
                <div className="input-group">
                    <input className="form-control" type="text" value="Chat Message..." />
                    <button className="btn btn-light" type="button">Send</button>
                </div>
            </div>
        </div>
    </main>
  );
}