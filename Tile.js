class Tile {
    num;
    row;
    column;
    square;
    isKnown = false;
    pastTile;
    nextTile;
    partOfInvalidRowColOrSquare = false;
    responsibleForDiscrepancy = false;

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

    duplicateInArray(array){
        let map = new Map();
        for(let j = 0; j < array.length; j++) {
            if(isNaN(map.get(array[j].num))) map.set(array[j].num, 1);
            else map.set(array[j].num, map.get(array[j].num) + 1);
        }

        for (let [key, value] of map) {
            if (key != 0 && value > 1){
                if(key == this.num) this.responsibleForDiscrepancy = true;
                return true;
            }
        }
        return false;
    }

    /**
     * Checks if a Tile is valid.
     * @return
     */
     isValid(){
         let squareValid = this.squareIsValid();
         let rowValid = this.rowIsValid();
         let colValid = this.colIsValid();
         if(!squareValid || !rowValid || !colValid) this.partOfInvalidRowColOrSquare = true;
         return (squareValid && rowValid && colValid);
    }

    squareIsValid(){
        // create map and add numbers to it
        let map = new Map();
        for(let i = 0; i < this.square.length; i++) {
            for(let j = 0; j < this.square[0].length; j++) {
                if(this.square[i][j].num != 0) {
                    if(isNaN(map.get(this.square[i][j].num))) map.set(this.square[i][j].num, 1);
                    else map.set(this.square[i][j].num, map.get(this.square[i][j].num) + 1);
                }
            }
        }

        // loop through map and check for duplicates
        for (let [key, value] of map) {
            if (value > 1){
                if(key == this.num) this.responsibleForDiscrepancy = true;
                return false;
            }
        }

        return true;
    }

    setSquareDiscrepancy(discrepancy){
        for(let k = 0; k < this.square.length; k++) {
            for(let l = 0; l < this.square[0].length; l++) {
                if(discrepancy){
                    this.square[k][l].partOfDiscrepancy = discrepancy;
                } else if(!this.square[k][l].rowIsValid() || !this.square[k][l].colIsValid()){
                    this.square[k][l].partOfDiscrepancy = false;
                }
            }
        }
    }

    rowIsValid(){
         console.log("row check")
         // sets tiles to red if the row is invalid
        if (this.duplicateInArray(this.row)){
            return false;
        }

        return true;
    }

    setRowDiscrepancy(discrepancy){
        for(let i = 0; i < this.row.length; i++) {
            if(discrepancy){
                this.row[i].partOfDiscrepancy = discrepancy;
            } else if(!this.row[i].squareIsValid() || !this.row[i].colIsValid()){
                this.row[i].partOfDiscrepancy = discrepancy;
            }
        }
    }

    colIsValid(){
        // sets tiles to red if the row is invalid
        if (this.duplicateInArray(this.column)){
            return false;
        }

        return true;
    }

    setColDiscrepancy(discrepancy){
        for(let i = 0; i < this.column.length; i++) {
            if(discrepancy){
                this.column[i].partOfDiscrepancy = discrepancy;
            } else if(!this.column[i].squareIsValid() || !this.column[i].colIsValid()){
                this.column[i].partOfDiscrepancy = discrepancy;
            }
        }
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