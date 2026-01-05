import React from 'react';

import './play.css';

export function GameBoard(){
    const game_grid = Array.from({ length: 6 }, () => new Array(7).fill(null));
    const board_spaces = buildBoardSpacesArray();

    const [inputLocked, setInputLocked] = React.useState(true);
    const [playerTurn, setPlayerTurn] = React.useState(0);

    function buildBoardSpacesArray () {
        const board_spaces = [];

        for (let y = 6, i = 0; y >= 0; y--) {
            for (let x = 0; x < 7; x++) {
                board_spaces.push(<div className="board-space" key={i} x={x} y={y} onClick={() => {onSpacePressed(x, y)}}></div>);
                i++;
            }
        }
        return board_spaces;
    }

    function onSpacePressed ({ x, y }) {
        console.log(`tile ${x},${y} pressed`);
        // find topmost free space
        let free_space = false;
        for (let i = 0; i < 7; i++) {
            if (game_grid[x][i] == null) {
                y = i;
                free_space = document.querySelector(`[x="${x}"][y=${y}]`);
                break;
            }
        }
        if (!free_space) {
            return -1;
        }

        game_grid[x][y] = playerTurn;
        free_space.classList.add("red-chip");
    }

    return (
        <div className="game-board bg-dark rounded-5">
            <div className="game-spaces-container p-3">
                { board_spaces }
            </div>
        </div>
    );
}