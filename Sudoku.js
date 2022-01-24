class Sudoku {
    grid = new Array(9).fill(null).map(()=>new Array(9).fill(null));
    rootTile = null;
    string;

    constructor(string) {
        this.string = string;
        const board = new Array(9).fill(null).map(()=>new Array(9).fill(0));

        // create Tiles as divs in html
        for (let i = 0; i < 81; i++) {
            let element = document.getElementById("sudoku")
            let tileDiv = document.createElement("div");
            let tileID = document.createElement("p");
            tileID.className = "number";
            tileDiv.setAttribute("onclick", "main()");
            tileDiv.className = "tile";
            tileDiv.id = i.toString();
            tileDiv.appendChild(tileID);
            element.appendChild(tileDiv);
        }

        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                board[i][j] = string[(i*9)+j];
                let idNum = (i*9)+j;

                let tileDiv = document.getElementById(idNum.toString());
                let paragraph = tileDiv.getElementsByClassName("number");
                if (string[(i*9)+j] != 0){
                    paragraph[0].innerHTML = string[(i*9)+j];
                }
            }
        }

        const tileBoard = new Array(9).fill(null).map(()=>new Array(9).fill(null));

        let pastTile = null;

        for(let i = 0; i < board.length; i++){
            for(let j = 0; j < board[0].length; j++){
                let currentTile = new Tile(board[i][j], pastTile);
                tileBoard[i][j] = currentTile;

                // set nextTile of pastTile
                if(pastTile != null) pastTile.setNextTile(tileBoard[i][j]);
                if(board[i][j] != 0) currentTile.setKnown(true);

                // set pastTile to currentTile
                pastTile = currentTile;
            }
        }

        this.parseBoard(tileBoard);
    }

    setRootTile(rootTile) {
        this.rootTile = rootTile;
    }

    parseBoard(tileBoard){
        var columns = new Array(9).fill(null).map(()=>new Array(9).fill(null));;
        var currentSquare = new Array(3).fill(null).map(()=>new Array(3).fill(null));;

        var leftSquare = new Array(3).fill(null).map(()=>new Array(3).fill(null));
        var middleSquare = new Array(3).fill(null).map(()=>new Array(3).fill(null));
        var rightSquare = new Array(3).fill(null).map(()=>new Array(3).fill(null));

        for(let row = 0; row < 9; row++){
            for (let column = 0; column < 9; column++){
                let currentTile = tileBoard[row][column];

                // set root tile
                if(row === 0 && column === 0) this.rootTile = currentTile;

                columns[column][row] = tileBoard[row][column];
                this.grid[row][column] = currentTile;

                currentTile.setRow(tileBoard[row]); // sets the row
                currentTile.setColumn(columns[column]); // sets the column

                currentTile.setSquare(currentSquare);
                currentSquare[row-Math.max(Math.max(row, row - 2), row - 5)][column-Math.max(Math.max(column, column - 2), column - 5)] = tileBoard[row][column];

                if(row < 3){
                    if(column < 3){
                        leftSquare[row][column] = tileBoard[row][column];
                        currentTile.setSquare(leftSquare);
                    } else if (column < 6) {
                        middleSquare[row][column - 3] = tileBoard[row][column];
                        currentTile.setSquare(middleSquare);
                    } else {
                        rightSquare[row][column - 6] = tileBoard[row][column];
                        currentTile.setSquare(rightSquare);
                    }
                } else if (row < 6) {
                    if(column < 3){
                        leftSquare[row - 3][column] = tileBoard[row][column];
                        currentTile.setSquare(leftSquare);
                    } else if (column < 6) {
                        middleSquare[row - 3][column - 3] = tileBoard[row][column];
                        currentTile.setSquare(middleSquare);
                    } else {
                        rightSquare[row - 3][column - 6] = tileBoard[row][column];
                        currentTile.setSquare(rightSquare);
                    }
                } else {
                    if(column < 3){
                        leftSquare[row - 6][column] = tileBoard[row][column];
                        currentTile.setSquare(leftSquare);
                    } else if (column < 6) {
                        middleSquare[row - 6][column - 3] = tileBoard[row][column];
                        currentTile.setSquare(middleSquare);
                    } else {
                        rightSquare[row - 6][column - 6] = tileBoard[row][column];
                        currentTile.setSquare(rightSquare);
                    }
                }

                if((row + 1) % 3 === 0 && (column === 2)) {
                    leftSquare = new Array(3).fill(null).map(()=>new Array(3).fill(null));
                } else if((row + 1) % 3 === 0 && (column === 5)){
                    middleSquare = new Array(3).fill(null).map(()=>new Array(3).fill(null));
                } else if((row + 1) % 3 === 0 && (column === 8)){
                    rightSquare = new Array(3).fill(null).map(()=>new Array(3).fill(null));
                }

            }
        }
    }
    
    getSudoku(){
        let sudoku = "";
        for(let i = 0; i < this.grid.length; i++) {
            sudoku += "\n";
            for(let j = 0; j < this.grid[0].length; j++) {
                sudoku += this.grid[i][j].getNum() + ", ";
            }
        }
        return sudoku;
    }

     setNextValidNumber(){
        this.rootTile.setNum(this.nextLowestPossible(this.rootTile));

        while(this.rootTile.getNum() < 9 && !this.rootTile.isValid()){
            this.rootTile.setNum(this.nextLowestPossible(this.rootTile));
        }

        if(this.rootTile.isValid() || (this.rootTile.getNum() === 9 && this.rootTile.isValid())) return true;
        else return false;
    }

     backtrack(){
        this.rootTile.setNum(0);
        this.rootTile = this.rootTile.getPastUnknownTile();

    }

     solve(){
        while(true){
            if(!this.rootTile.getIsKnown()){
                if(this.rootTile.getNum() < 9){
                    if(this.setNextValidNumber(this.rootTile)){
                        this.rootTile = this.rootTile.getNextUnknownTile();

                        if (this.rootTile === null) {
                            console.log("you won");
                            console.log(this);
                            return;
                        }
                    } else this.backtrack();

                } else this.backtrack();
            } else {
                this.rootTile = this.rootTile.getNextUnknownTile();

            }
        }
    }

     hasWon(){
        for(let i = 0; i < this.grid.length; i++) {
            for(let j = 0; j < this.grid[0].length; j++) {
                if(this.grid[i][j].getNum() === 0) return false;
            }
        }

        return true;
    }

     getRootTile() {
        return this.rootTile;
    }

     nextLowestPossible(t) {
        return t.getNum() + 1;
    }

    updateNumbers(){
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                let idNum = (i*9)+j;
                let tileDiv = document.getElementById(idNum.toString());
                let paragraph = tileDiv.getElementsByClassName("number");
                paragraph[0].innerHTML = this.grid[i][j].getNum();
            }
        }
    }
}