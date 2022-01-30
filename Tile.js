class Tile {
    num;
    row;
    column;
    square;
    isKnown = false;
    pastTile;
    nextTile;

    constructor(num, pastTile) {
        this.num = num;
        this.pastTile = pastTile;
    };

    getIsKnown(){
        return this.isKnown;
    }
    
     setPastTile(pastTile) {
        this.pastTile = pastTile;
    }

     setNextTile(nextTile) {
        this.nextTile = nextTile;
    }

     getPastTile() {
        return this.pastTile;
    }

     getNextTile() {
        return this.nextTile;
    }

     setNum(num) {
        this.num = num;
    }

     setRow(row) {
        this.row = row;
    }

     setColumn(column) {
        this.column = column;
    }

    getNum() {
        return this.num;
    }

     getRow() {
        return this.row;
    }

     getColumn() {
        return this.column;
    }

     setSquare(square){
        this.square = square;
    }

     getSquare(){
        return this.square;
    }

    /**
     * Checks if a Tile is valid.
     * @return
     */
     isValid(){
         return this.squareIsValid() && this.rowIsValid() && this.colIsValid();
    }

    squareIsValid(){
        for(let i = 0; i < this.square.length; i++) {
            for(let j = 0; j < this.square[0].length; j++) {
                if (this.square[i][j] !== this && this.square[i][j].num == this.num && this.square[i][j].num != 0) return false;
            }
        }
        return true;
    }

    rowIsValid(){
        // check if contains more than 1 of same number
        for(let i = 0; i < this.row.length; i++) {
            if (this.row[i] !== this && this.row[i].num == this.num && this.row[i].num != 0){
                return false;
            }
        }
        return true;
    }

    colIsValid(){
        for(let i = 0; i < this.row.length; i++) {
            if (this.column[i] !== this && this.column[i].num == this.num && this.column[i].num != 0){
                return false;
            }
        }
        return true;
    }


    /**
     * Gets the closest past Tile that has an unknown number.
     * @return
     */
     getPastUnknownTile(){
        let pastUnknownTile = this.getPastTile();
        if(pastUnknownTile == null) return this;
        while(pastUnknownTile.getIsKnown()){
            pastUnknownTile = pastUnknownTile.getPastTile();
            if(pastUnknownTile == null) {
                console.log("unsolvable sudoku");
                return;
            }
        }
        return pastUnknownTile;
    }

    /**
     * Gets the next Tile that has an unknown number.
     * @return
     */
     getNextUnknownTile(){
        let nextUnknownTile = this.getNextTile();
        if(nextUnknownTile == null) return null;
        console.log("next tile: " + nextUnknownTile.getIsKnown());
        while(nextUnknownTile.getIsKnown()){
            nextUnknownTile = nextUnknownTile.getNextTile();
        }
        return nextUnknownTile;
    }

    setKnown(known) {this.isKnown = known;}

}