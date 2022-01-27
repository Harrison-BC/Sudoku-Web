let currSudoku;

// '004050000900734600003021049035090480090000030076010920310970200009182003000060100'


function main(sudokuString){
    currSudoku = new Sudoku(sudokuString);
    // test = new Sudoku("004050000" +
    //     "900734600" +
    //     "003021049" +
    //     "035090480" +
    //     "090000030" +
    //     "076010920" +
    //     "310970200" +
    //     "009182003" +
    //     "000060100");
    // test.solve();
    // console.log(test.getSudoku());

    // const test2 = new Sudoku("900800000" +
    //     "000000500" +
    //     "000000000" +
    //     "020010003" +
    //     "010000050" +
    //     "000400070" +
    //     "708600000" +
    //     "000030100" +
    //     "400000200");
    // test2.solve();
    // console.log(test2.getSudoku());
}

function clicked(id){
    currSudoku.setActiveTile(id);
}

function parseInput(sudokuString){
    document.getElementById('input').value = '';    // clears input field after clicking import
    if(!(sudokuString.length == 81) || !(/^\d+$/.test(sudokuString))){
        console.log("lengthViolation? : " + !(sudokuString.length == 81) + "\n"
            + "character Violation? :" + !(/^\d+$/.test(sudokuString)));
        return false;
    }
    main(sudokuString);
}

function solveSudoku(){
    currSudoku.solve();
    if(currSudoku.isValidSudoku()) currSudoku.updateNumbers();
}