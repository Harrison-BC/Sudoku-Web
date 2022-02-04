class Tile {
    num;
    row;
    column;
    square;
    isKnown = false;
    pastTile;
    nextTile;
    hasDiscrepancy = false;

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
                for(let k = 0; k < this.square.length; k++) {
                    for(let l = 0; l < this.square[0].length; l++) {
                        this.square[k][l].hasDiscrepancy = true;
                    }
                }
                return false;
            }
        }

        for(let k = 0; k < this.square.length; k++) {
            for(let l = 0; l < this.square[0].length; l++) {
                this.square[k][l].hasDiscrepancy = false;
            }
        }
        return true;
    }

    duplicateInArray(array){
         let map = new Map();
         for(let j = 0; j < array.length; j++) {
             if(isNaN(map.get(array[j].num))) map.set(array[j].num, 1);
             else map.set(array[j].num, map.get(array[j].num) + 1);
         }

        for (let [key, value] of map) {
            if (key != 0 && value > 1){
                return true;
            }
        }
        return false;
    }

    rowIsValid(){
         // sets tiles to red if the row is invalid
        if (this.duplicateInArray(this.row)){
            for(let j = 0; j < this.row.length; j++) {
                this.row[j].hasDiscrepancy = true;
            }
            return false;
        }

        // unsets tiles to red if the row is valid
        for(let i = 0; i < this.row.length; i++) {
            this.row[i].hasDiscrepancy = false;
        }
        return true;
    }

    colIsValid(){
        // sets tiles to red if the row is invalid
        if (this.duplicateInArray(this.column)){
            for(let j = 0; j < this.column.length; j++) {
                this.column[j].hasDiscrepancy = true;
            }
            return false;
        }

        // unsets tiles to red if the row is valid
        for(let i = 0; i < this.column.length; i++) {
            this.column[i].hasDiscrepancy = false;
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