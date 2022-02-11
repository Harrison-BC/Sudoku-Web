class Tile {
    num;
    row;
    column;
    square;
    isKnown = false;
    pastTile;
    nextTile;
    partOfInvalidRowColOrSquare = false;
    partOfValidRowColOrSquare = true;
    responsibleForDiscrepancy = false;

    constructor(num, pastTile, rowNum, colNum) {
        this.num = num;
        this.pastTile = pastTile;
        this.rowNum = rowNum;
        this.colNum = colNum;
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
     * Checks for duplicates in an array.
     * Used for checking if rows and columns are valid.
     * @param array the row or column to check for duplicates
     * @returns {boolean}
     */
    duplicateInArray(array){
        let duplicatesPresent = false;

        let map = new Map();    // create a new map to then check for duplicates

        // loop through array and add to the map
        for(let j = 0; j < array.length; j++) {
            if(isNaN(map.get(array[j].num))) map.set(array[j].num, 1);
            else map.set(array[j].num, map.get(array[j].num) + 1);
        }

        // loop map and check if there are duplicates
        for (let [key, value] of map) {
            if (key != 0 && value > 1){
                // set responsible for discrepancy true so can be shown to user
                if(key == this.num) this.responsibleForDiscrepancy = true;
                duplicatesPresent = true;
            }
        }
        return duplicatesPresent;
    }

    /**
     * Checks if a Tile is valid.
     * @return
     */
     isValid(){
         let squareValid = this.squareIsValid();
         let rowValid = this.rowIsValid();
         let colValid = this.colIsValid();
         this.partOfInvalidRowColOrSquare = !squareValid || !rowValid || !colValid;

         if(squareValid || rowValid || colValid){
             this.partOfValidRowColOrSquare = true;
         }
        // console.log(this.rowNum + " " + this.colNum + "\t" + "isValid?: " + (!squareValid || !rowValid || !colValid));
         return (squareValid && rowValid && colValid);
    }

    squareIsValid(){
         let valid = true;
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
                valid = false;
            }
        }

        return valid;
    }

    rowIsValid(){
         // console.log("row check")
         // sets tiles to red if the row is invalid
        if (this.duplicateInArray(this.row)){
            return false;
        }

        return true;
    }

    colIsValid(){
        // sets tiles to red if the row is invalid
        if (this.duplicateInArray(this.column)){
            return false;
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
        // console.log("next tile: " + nextUnknownTile.getIsKnown());
        while(nextUnknownTile.getIsKnown()){
            nextUnknownTile = nextUnknownTile.getNextTile();
        }
        return nextUnknownTile;
    }

    setKnown(known) {this.isKnown = known;}

    /**
     *
     * @param add (boolean) whether to add or remove the selectedGroup attribute
     */
    setActiveGroups(add){
        for(let i = 0; i < this.row.length; i++){
            if(add) {
                if(this.row[i].partOfInvalidRowColOrSquare && this.row[i].partOfValidRowColOrSquare){
                    $('#' + this.row[i].id).addClass('validAndInvalid');
                } else if (this.row[i].partOfInvalidRowColOrSquare){
                    $('#' + this.row[i].id).addClass('redColour');
                } else {
                    $('#' + this.row[i].id).addClass('selectedGroup');
                }
            }
            else if (!add) {
                $('#' + this.row[i].id).removeClass('validAndInvalid');
                $('#' + this.row[i].id).removeClass('redColour');
                $('#' + this.row[i].id).removeClass('selectedGroup');
            }
        }

        for(let i = 0; i < this.column.length; i++){
            if(add) {
                if(this.column[i].partOfInvalidRowColOrSquare && this.column[i].partOfValidRowColOrSquare){
                    $('#' + this.column[i].id).addClass('validAndInvalid');
                } else if (this.column[i].partOfInvalidRowColOrSquare){
                    $('#' + this.column[i].id).addClass('redColour');
                } else {
                    $('#' + this.column[i].id).addClass('selectedGroup');
                }
            }
            else if (!add) {
                $('#' + this.column[i].id).removeClass('validAndInvalid');
                $('#' + this.column[i].id).removeClass('redColour');
                $('#' + this.column[i].id).removeClass('selectedGroup');
            }
        }

        for(let i = 0; i < this.square.length; i++) {
            for(let j = 0; j < this.square[i].length; j++) {
                if(add) {
                    //TODO: fix the two added if statements
                    if(this.square[i][j].partOfInvalidRowColOrSquare && this.square[i][j].partOfValidRowColOrSquare && !this.row.includes(this.square[i][j]) && !this.column.includes(this.square[i][j])){
                        $('#' + this.square[i][j].id).addClass('validAndInvalid');
                    } else if (this.square[i][j].partOfInvalidRowColOrSquare){
                        $('#' + this.square[i][j].id).addClass('redColour');
                    } else {
                        $('#' + this.square[i][j].id).addClass('selectedGroup');
                    }
                }
                else if (!add) {
                    $('#' + this.square[i][j].id).removeClass('validAndInvalid');
                    $('#' + this.square[i][j].id).removeClass('redColour');
                    $('#' + this.square[i][j].id).removeClass('selectedGroup');
                }
            }
        }
    }
}