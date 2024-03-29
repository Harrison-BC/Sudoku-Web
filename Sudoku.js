class Sudoku {
    grid = new Array(9).fill(null).map(()=>new Array(9).fill(null));
    numberBoard = new Array(9).fill(null).map(()=>new Array(9).fill(0));
    rootTile = null;
    string;
    templateIsValid = true;
    activeTile = null;
    totalClues = 0;

    constructor(string) {
        this.string = string;

        let j = 0;
        // create Tiles as divs in html
        for (let i = 0; i < 81; i++) {
            if ((i % 9 == 0)) j = 0;
            let element = document.getElementById("sudoku")
            let tileDiv = document.createElement("div");
            let tileID = document.createElement("p");
            tileID.className = "number";

            tileDiv.setAttribute("onclick", "clicked(" + i + ")");
            tileDiv.className = "tile";
            if((i >= 18 && i < 27) || (i >= 45 && i < 54)) tileDiv.style.borderBottom = "2px solid black";
            if((j == 2 || j == 5)) tileDiv.style.borderRight = "2px solid black";
            tileDiv.id = i.toString();
            tileDiv.appendChild(tileID);
            element.appendChild(tileDiv);
            j++;
        }

        this.changeNumbers(string);

        if(!this.isValidSudoku()) {
            this.templateIsValid = false;
            console.log("incorrect sudoku entered");
        }
    }

    changeNumbers(string){
        // these loops try the boards
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                // set
                this.numberBoard[i][j] = parseInt(string[(i*9)+j]);
                let idNum = (i*9)+j;

                let tileDiv = document.getElementById(idNum.toString());
                let paragraph = tileDiv.getElementsByClassName("number");
                if (string[(i*9)+j] != 0){
                    paragraph[0].innerHTML = string[(i*9)+j];
                } else paragraph[0].innerHTML = "";
            }
        }

        const tileBoard = new Array(9).fill(null).map(()=>new Array(9).fill(null));

        let pastTile = null;

        for(let i = 0; i < this.numberBoard.length; i++){
            for(let j = 0; j < this.numberBoard[0].length; j++){
                let currentTile = new Tile(this.numberBoard[i][j], pastTile, i, j);
                if(this.numberBoard[i][j] != 0) this.totalClues++;
                tileBoard[i][j] = currentTile;
                currentTile.id = (i*9)+j;
                // set nextTile of pastTile
                if(pastTile != null) pastTile.setNextTile(tileBoard[i][j]);
                if(this.numberBoard[i][j] != 0) currentTile.setKnown(true);

                // set pastTile to currentTile
                pastTile = currentTile;
            }
        }
        this.setColsRowsAndSquares(tileBoard);
    }

    setInvalidTiles(){
        for(let i = 0; i < this.grid.length; i++) {
            for(let j = 0; j < this.grid[0].length; j++) {
                this.grid[i][j].partOfInvalidRowColOrSquare = false;
                this.grid[i][j].responsibleForDiscrepancy = false;
            }
        }

        for(let i = 0; i < this.grid.length; i++) {
            for(let j = 0; j < this.grid[0].length; j++) {
                this.grid[i][j].isValid();
            }
        }
    }

    isValidSudoku(){
        for(let i = 0; i < this.grid.length; i++) {
            for(let j = 0; j < this.grid[0].length; j++) {
                if(!this.grid[i][j].isValid()){
                    return false;
                }
            }
        }
        return true;
    }

    setRootTile(rootTile) {
        this.rootTile = rootTile;
    }

    setColsRowsAndSquares(tileBoard){
        let columns = new Array(9).fill(null).map(()=>new Array(9).fill(null));;
        let currentSquare = new Array(3).fill(null).map(()=>new Array(3).fill(null));;

        let leftSquare = new Array(3).fill(null).map(()=>new Array(3).fill(null));
        let middleSquare = new Array(3).fill(null).map(()=>new Array(3).fill(null));
        let rightSquare = new Array(3).fill(null).map(()=>new Array(3).fill(null));

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
    
    toString(){
        let sudoku = "";
        for(let i = 0; i < this.grid.length; i++) {
            for(let j = 0; j < this.grid[0].length; j++) {
                sudoku += this.grid[i][j].getNum();
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
        while(this.templateIsValid){
            if(!this.rootTile.getIsKnown()){
                if(this.rootTile.getNum() < 9){
                    if(this.setNextValidNumber(this.rootTile)){
                        this.rootTile = this.rootTile.getNextUnknownTile();

                        if (this.rootTile === null) {
                            // this.won();
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

     nextLowestPossible(t) {
        return t.getNum() + 1;
    }

    /**
     * Updates the numbers
     */
    updateHtmlNumbers(){
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                let idNum = (i*9)+j;
                let tileDiv = document.getElementById(idNum.toString());
                let paragraph =  tileDiv.getElementsByClassName("number");
                if(this.grid[i][j].getNum() != 0) {
                    paragraph[0].innerHTML = this.grid[i][j].getNum();
                } else {
                    paragraph[0].innerHTML = "";
                }

                if(this.grid[i][j].partOfInvalidRowColOrSquare) {

                    // if it is responsible for invalid group
                    if(this.grid[i][j].responsibleForDiscrepancy){
                        $('#' + this.grid[i][j].id).addClass('redText');
                    } else {
                        $('#' + this.grid[i][j].id).removeClass('redText');
                    }
                    // $('#' + this.grid[i][j].id).addClass('redColour');
                } else {
                    // $('#' + this.grid[i][j].id).removeClass('redColour');
                    $('#' + this.grid[i][j].id).removeClass('redText');
                }
            }
        }
        document.getElementById("export").innerHTML = currSudoku.toString();
    }

    setActiveTile(id){
        if(this.activeTile == null) {
            this.activeTile = this.grid[0][0];
        }
        $('#' + this.activeTile.id).removeClass('activeTile');

        let col = id % 9;
        let row = ((id -col) / 9);
        this.activeTile = this.grid[row][col];
        // set the active tile colour

        // TODO: Change this to JQuery??
        let activeTileElement = document.getElementById(this.activeTile.id);
        activeTileElement.classList.add('activeTile');
        console.log(this.activeTile.id);
        // activeTileElement.style.backgroundColor = "dodgerblue";
        this.activeTile.setActiveGroups();
    }

    updateNumber(number){
        if(!isNaN(number)){
            this.activeTile.setNum(parseInt(number));
            // console.log("number is now: " + this.activeTile.getNum());
            this.setInvalidTiles();
            this.activeTile.setActiveGroups();
            this.updateHtmlNumbers();
        }
    }

    arrowKeys(key){
        if(this.activeTile == null) {
            this.setActiveTile(this.grid[0][0].id);
            this.updateHtmlNumbers();
            return;
        }
        switch (key) {
            case 'a':
            case ("ArrowLeft"):
                if(this.activeTile.getPastTile() != null) {
                    this.setActiveTile(this.activeTile.getPastTile().id);
                } else {
                    this.setActiveTile(this.grid[8][8].id);
                }
                break;
            case 'w':
            case ("ArrowUp"):
                if(this.activeTile.id > 8) {
                    this.setActiveTile(this.activeTile.id-9);
                } else {
                    this.setActiveTile(this.grid[8][this.activeTile.colNum].id)
                }
                break;
            case 'd':
            case ("ArrowRight"):
                if(this.activeTile.getNextTile() != null) {
                    this.setActiveTile(this.activeTile.getNextTile().id);
                } else {
                    this.setActiveTile(this.grid[0][0].id);
                }
                break;
            case 's':
            case ("ArrowDown"):
                if(this.activeTile.id < 72) {
                    this.setActiveTile(this.activeTile.id+9);
                } else {
                    this.setActiveTile(this.grid[0][this.activeTile.colNum].id)
                }
                break;
        }
        this.updateHtmlNumbers();
    }
}