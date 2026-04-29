const ROWS = 7;
const COLS = 6;

class GameController {
    constructor(p0, p1) {
        this.p0 = p0; // yellow for now
        this.p1 = p1; // red for now
        this.pTurn = 0;
        this.gameGrid = Array.from({ length: ROWS }, () => new Array(COLS).fill(null))
    }

    placePiece(x, y) {
        this.gameGrid[x][y] = this.pTurn;
        const winCon = this.checkForWin(x, y);

        this.pTurn = this.pTurn ? 0 : 1;
        return winCon;
    }

    checkWinInDir (x, y, xdir, ydir) {
        if (x + xdir < 0 || x + xdir > ROWS - 1 
            || y + ydir < 0 || y + ydir > COLS - 1) {
            return 0;
        }

        if (this.gameGrid[x + xdir][y + ydir] === this.pTurn) {
            return 1 + this.checkWinInDir(x + xdir, y + ydir, xdir, ydir);
        }

        return 0;
    }

    checkForWin (x, y) {
        // check for horizontal win
        if (1 + this.checkWinInDir(x, y, 1, 0) 
                + this.checkWinInDir(x, y, -1, 0) > 3) {
            console.log("horizontal win!");
            return "horizontal win";
        }

        // check for vertical win
        if (1 + this.checkWinInDir(x, y, 0, 1) 
                + this.checkWinInDir(x, y, 0, -1) > 3) {
            console.log("vertical win!");
            return "vertical win";
        }

        // check for '/' win
        if (1 + this.checkWinInDir(x, y, 1, 1) 
                + this.checkWinInDir(x, y, -1, -1) > 3) {
            console.log("/ win!");
            return "/ win";
        }

        // check for '\' win
        if (1 + this.checkWinInDir(x, y, 1, -1) 
                + this.checkWinInDir(x, y, -1, 1) > 3) {
            console.log("\\ win!");
            return "\\ win";
        }

        return false;
    }
}

module.exports = GameController;
