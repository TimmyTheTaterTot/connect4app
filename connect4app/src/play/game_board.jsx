import React from 'react';

import './play.css';

export function GameBoard(){
    const ROWS = 7;
    const COLS = 6;
    const [gameGrid, setGameGrid] = React.useState(Array.from({ length: ROWS }, 
        () => new Array(COLS).fill(null)));

    const [inputLocked, setInputLocked] = React.useState(true);
    const [playerTurn, setPlayerTurn] = React.useState(true);

    function buildBoardSpacesArray () {
        const grid = [];

        for (let col = COLS-1, i = 0; col >= 0; col--) {
            for (let row = 0; row < ROWS; row++) {
                const chipClass = gameGrid[row][col] === null ? '' : gameGrid[row][col] ? 'red-chip' : 'yellow-chip';
                grid.push(<div className={`board-space ${chipClass}`} key={i} x={row} y={col} 
                    onClick={() => {onSpacePressed(row, col)}}></div>);
                i++;
            }
        }
        return grid;
    }

    function onSpacePressed (x, y) {
        if (!playerTurn || inputLocked) {
            return;
        }
        console.log(`tile ${x},${y} pressed`);
        // find topmost free space
        let free_space = false;
        for (let i = 0; i < 6; i++) {
            if (gameGrid[x][i] == null) {
                y = i;
                free_space = true;
                break;
            }
        }
        if (free_space === false) {
            return -1;
        }

        setGameGrid((prevGrid) => {
            let nextGrid = prevGrid.map((row) => [...row]);
            nextGrid[x][y] = playerTurn;
            return nextGrid;
        })
    }

    const boardSpaces = buildBoardSpacesArray();

    return (
        <div className="game-board bg-dark rounded-5">
            <div className="game-spaces-container p-3">
                { boardSpaces }
            </div>
        </div>
    );
}