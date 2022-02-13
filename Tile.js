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
         this.partOfInvalidRow = !rowValid;
         this.partOfInvalidCol = !colValid;
         this.partofInvalidSquare = !squareValid;
         this.partOfInvalidRowColOrSquare = !squareValid || !rowValid || !colValid;

         if(squareValid || rowValid || colValid){
             // this.partOfInvalidRow = true;
             // this.partOfInvalidCol = true;
             // this.partofInvalidSquare = true;

             // this.partOfValidRowColOrSquare = true;
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

    getArrayOfActiveTiles(){
        let arrayOfAllActiveTiles = new Set;

        for(let i = 0; i < 9; i++){
            arrayOfAllActiveTiles.add(this.row[i]);
            arrayOfAllActiveTiles.add(this.column[i]);
        }

        for(let i = 0; i < this.square.length; i++) {
            for(let j = 0; j < this.square[i].length; j++) {
                arrayOfAllActiveTiles.add(this.square[i][j]);
            }
        }

        return Array.from(arrayOfAllActiveTiles);
    }

    /**
     *
     * @param add (boolean) whether to add or remove the selectedGroup attribute
     */
    setActiveGroups(){
        // clear all old active groups
        for(let i = 0; i < 9; i++){
            for (let j = 0; j < 9; j++){
                $('#' + currSudoku.grid[i][j].id).removeClass('validAndInvalid');
                $('#' + currSudoku.grid[i][j].id).removeClass('redColour');
                $('#' + currSudoku.grid[i][j].id).removeClass('selectedGroup');
            }
        }

        let arrayOfAllActiveTiles = this.getArrayOfActiveTiles();

        for(let i = 0; i < arrayOfAllActiveTiles.length; i++) {
                    let rowInvalid = arrayOfAllActiveTiles[i].partOfInvalidRow && this.row === arrayOfAllActiveTiles[i].row;
                    let colInvalid = arrayOfAllActiveTiles[i].partOfInvalidCol && this.column === arrayOfAllActiveTiles[i].column;
                    let squareInvalid = arrayOfAllActiveTiles[i].partofInvalidSquare && this.square === arrayOfAllActiveTiles[i].square;

                    // if invalid, and also valid
                    if(((rowInvalid || colInvalid || squareInvalid)
                        &&  ((!arrayOfAllActiveTiles[i].partOfInvalidCol && this.column === arrayOfAllActiveTiles[i].column)
                            || (!arrayOfAllActiveTiles[i].partOfInvalidRow && this.row === arrayOfAllActiveTiles[i].row)
                            || (!arrayOfAllActiveTiles[i].partofInvalidSquare && this.square === arrayOfAllActiveTiles[i].square))
                    )){
                        $('#' + arrayOfAllActiveTiles[i].id).addClass('validAndInvalid');
                    } else
                        if ((arrayOfAllActiveTiles[i].partOfInvalidCol && this.column === arrayOfAllActiveTiles[i].column)
                        || (arrayOfAllActiveTiles[i].partOfInvalidRow && this.row === arrayOfAllActiveTiles[i].row)
                        || (arrayOfAllActiveTiles[i].partofInvalidSquare && this.square === arrayOfAllActiveTiles[i].square)){
                        $('#' + arrayOfAllActiveTiles[i].id).addClass('redColour');
                    } else {
                        $('#' + arrayOfAllActiveTiles[i].id).addClass('selectedGroup');
                    }
                }
        console.log(arrayOfAllActiveTiles);
    }

    contains(array){
        for(let i = 0; i < array.length; i++){
            if(this.row == array[i].row && this.column == array[i].column){
                return true;
            }
        }
        return false;
    }

    isIn(array){
        for(let i = 0; i < array.length; i++){
            if(this.id == array[i].id){
                return true;
            }
        }
        return false;
    }

    isInSquare(array){
        for(let i = 0; i < array.length; i++){
            for(let j = 0; j < array[0].length; j++){
                if(this.id == array[i][j].id){
                    return true;
                }
            }
        }
        return false;
    }
}