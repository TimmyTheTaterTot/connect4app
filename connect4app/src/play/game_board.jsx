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

function buildBoardSpacesArray (gameGrid, onSpacePressed) {
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

export function GameBoard({ playerName, playerTurn, setPlayerTurn, setInfoMsg }){
    const sPlacePiece1 = new Audio('/place_piece_1.mp3');
    const sPlacePiece2 = new Audio('/place_piece_2.mp3');

    const [gameGrid, setGameGrid] = React.useState(Array.from({ length: ROWS }, 
        () => new Array(COLS).fill(null)));


    const placePiece = React.useCallback((x, y) => {
        setGameGrid((prevGrid) => {
            const nextGrid = prevGrid.map((row) => [...row]);
            nextGrid[x][y] = playerTurn;
            return nextGrid;
        });
        if (playerTurn) {
            setPlayerTurn(false);
            setInfoMsg(null);
        }
    }, [playerTurn]);
    
    const eventListener = React.useCallback((event) => {
        switch (event.type) {
            case EventType.GameMove:
                placePiece(event.code.x, event.code.y);
                sPlacePiece1.play();
                break;
            default:
                break;
        }
    }, [placePiece]);

    React.useEffect(() => {
        GameEventBroker.addHandler(eventListener);
        return () => GameEventBroker.removeHandler(eventListener);
    }, [eventListener]);

    const onSpacePressed = React.useCallback((x, y) => {
        if (!playerTurn) {
            return;
        }
        [x, y] = findColumnTopSpace(x, y, gameGrid);
        if (y < 0) {
            return;
        }

        GameEventBroker.createEvent(playerName, EventType.GameMove, {x: x, y: y});
        sPlacePiece2.play();
    }, [playerTurn, gameGrid]);
    
    const boardSpaces = React.useMemo(() => buildBoardSpacesArray(gameGrid, onSpacePressed), [gameGrid, onSpacePressed]);
    
    return (
        <div className="game-board bg-dark rounded-5">
            <div className="game-spaces-container p-3">
                { boardSpaces }
            </div>
        </div>
    );
}