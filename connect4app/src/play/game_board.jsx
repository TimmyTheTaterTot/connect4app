import React from 'react';

import './play.css';

const ROWS = 7;
const COLS = 6;

function findColumnTopSpace (x, y, gameGrid) {
        let free_space = false;
        for (let i = 0; i < COLS; i++) {
            if (gameGrid[x][i] == null) {
                y = i;
                free_space = true;
                break;
            }
        }
        if (free_space === false) {
            return [x, -1];
        }
        return [x, y];
    }

export function GameBoard(){
    const [gameGrid, setGameGrid] = React.useState(Array.from({ length: ROWS }, 
        () => new Array(COLS).fill(null)));

    const [inputLocked, setInputLocked] = React.useState(false);
    const [playerTurn, setPlayerTurn] = React.useState(true);

    React.useEffect(() => {
        if (playerTurn) return;

        let randX = Math.floor(Math.random() * ROWS);
        let randY = -1;
        [randX, randY] = findColumnTopSpace(randX, randY, gameGrid);

        while (randY < 0) {
            randX = Math.floor(Math.random() * ROWS);
            [randX, randY] = findColumnTopSpace(randX, randY, gameGrid);
        }
        
        placePiece(randX, randY);
    }, [playerTurn]);

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

    function placePiece (x, y) {
        setGameGrid((prevGrid) => {
            let nextGrid = prevGrid.map((row) => [...row]);
            nextGrid[x][y] = playerTurn;
            return nextGrid;
        })
        setPlayerTurn(!playerTurn);
    }

    function onSpacePressed (x, y) {
        if (!playerTurn || inputLocked) {
            return;
        }
        console.log(`tile ${x},${y} pressed`);
        [x, y] = findColumnTopSpace(x, y, gameGrid);
        if (y < 0) {
            return;
        }

        placePiece(x, y);
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