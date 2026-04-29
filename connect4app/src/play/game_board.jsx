import React from 'react';

import { GameEventBroker, EventType } from '../event_broker';

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

function checkWinInDir (x, y, xdir, ydir, gameGrid, playerTurn) {
    if (x + xdir < 0 || x + xdir > ROWS - 1 
        || y + ydir < 0 || y + ydir > COLS - 1) {
        return 0;
    }

    if (gameGrid[x + xdir][y + ydir] === playerTurn) {
        return 1 + checkWinInDir(x + xdir, y + ydir, xdir, ydir, gameGrid, playerTurn);
    }

    return 0;
}

function checkForWin (x, y, gameGrid, playerTurn) {
    // check for horizontal win
    if (1 + checkWinInDir(x, y, 1, 0, gameGrid, playerTurn) 
            + checkWinInDir(x, y, -1, 0, gameGrid, playerTurn) > 3) {
        console.log("horizontal win!");
        return "horizontal win";
    }

    // check for vertical win
    if (1 + checkWinInDir(x, y, 0, 1, gameGrid, playerTurn) 
            + checkWinInDir(x, y, 0, -1, gameGrid, playerTurn) > 3) {
        console.log("vertical win!");
        return "vertical win";
    }

    // check for '/' win
    if (1 + checkWinInDir(x, y, 1, 1, gameGrid, playerTurn) 
            + checkWinInDir(x, y, -1, -1, gameGrid, playerTurn) > 3) {
        console.log("/ win!");
        return "/ win";
    }

    // check for '\' win
    if (1 + checkWinInDir(x, y, 1, -1, gameGrid, playerTurn) 
            + checkWinInDir(x, y, -1, 1, gameGrid, playerTurn) > 3) {
        console.log("\\ win!");
        return "\\ win";
    }

    return false;
}

async function sendGameResults(thisPlayer, thatPlayer, playerTurn) {
    const res = await fetch('/api/matches', {
        method: 'POST',
        body: JSON.stringify({ 
            time: Date.now(),
            winner: (playerTurn ? thisPlayer : thatPlayer),
            loser: (playerTurn ? thatPlayer : thisPlayer)
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    })

    if (res.ok) {
        return true;
    } else {
        return null;
    }
}

export function GameBoard({ playerName, turnStart }){
    const [gameGrid, setGameGrid] = React.useState(Array.from({ length: ROWS }, 
        () => new Array(COLS).fill(null)));

    const [inputLocked, setInputLocked] = React.useState(false);
    const [playerTurn, setPlayerTurn] = React.useState(turnStart);

    function eventListener(event) {
        if (event.type === EventType.GameMove) {
            placePiece(event.data.x, event.data.y);
        }
    }

    React.useEffect(() => {
        GameEventBroker.addHandler(eventListener);
        // if (playerTurn) return;

        // let randX = Math.floor(Math.random() * ROWS);
        // let randY = -1;
        // [randX, randY] = findColumnTopSpace(randX, randY, gameGrid);

        // while (randY < 0) {
        //     randX = Math.floor(Math.random() * ROWS);
        //     [randX, randY] = findColumnTopSpace(randX, randY, gameGrid);
        // }
        
        // placePiece(randX, randY);
        return () => GameEventBroker.removeHandler(eventListener);
    }, []);

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
            const nextGrid = prevGrid.map((row) => [...row]);
            nextGrid[x][y] = playerTurn;
            return nextGrid;
        });
        // const winCheck = checkForWin(x, y, gameGrid, playerTurn);
        // if (winCheck) {
        //     sendGameResults(playerName, 'opponent', playerTurn);
        //     GameEventBroker.createLocalEvent('System', EventType.ChatMessage, 
        //     playerTurn ? 'Congratulations! You won!' : 'Opponent won. Better luck next time.');
        //     setInputLocked(true);
        //     setPlayerTurn(true);
        //     return;
        // }
        setPlayerTurn((prevTurn) => {
            const nextTurn = !prevTurn;
            console.log(`playerturn1: ${prevTurn}`);
            console.log(`playerturn2: ${nextTurn}`);
            return nextTurn;
        });
    }

    function onSpacePressed (x, y) {
        console.log(`playerturn3: ${playerTurn}`);
        if (!playerTurn || inputLocked) {
            return;
        }
        console.log(`tile ${x},${y} pressed`);
        [x, y] = findColumnTopSpace(x, y, gameGrid);
        if (y < 0) {
            return;
        }

        GameEventBroker.createEvent(playerName, EventType.GameMove, {x: x, y: y});
        // placePiece(x, y);
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