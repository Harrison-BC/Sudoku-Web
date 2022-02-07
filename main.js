let currSudoku;

// '004050000900734600003021049035090480090000030076010920310970200009182003000060100'
// 111111111222222222333333333444444444555555555666666666777777777888888888999999999


function main(sudokuString){
    currSudoku = new Sudoku(sudokuString);

    document.addEventListener('keypress', (event) => {
        let name = event.key;
        let code = event.code;
        console.log(name);

        console.log(document.activeElement);
        if(code === "Space") currSudoku.updateNumber(0);
        else if(name === "a") currSudoku.arrowKeys("ArrowLeft");
        else if(name === "w") currSudoku.arrowKeys("ArrowUp");
        else if(name === "s") currSudoku.arrowKeys("ArrowDown");
        else if(name === "d") currSudoku.arrowKeys("ArrowRight");
        else currSudoku.updateNumber(name);

    }, false);

    document.onkeydown = function (event) {
        if(event.code == "Backspace") currSudoku.updateNumber(0);
        else currSudoku.arrowKeys(event.key);
    };
}

function clicked(id){
    currSudoku.setActiveTile(id);
    currSudoku.updateHtmlNumbers();
}

function parseTextInput(sudokuString){
    document.getElementById('input').value = '';    // clears input field after clicking import
    if(!(sudokuString.length == 81) || !(/^\d+$/.test(sudokuString))){
        console.log("lengthViolation? : " + !(sudokuString.length == 81) + "\n"
            + "character Violation? :" + !(/^\d+$/.test(sudokuString)));
        return false;
    }
    currSudoku.changeNumbers(sudokuString);
    currSudoku.setInvalidTiles();
    currSudoku.updateHtmlNumbers();
}



function solveSudoku(){
    if(currSudoku.isValidSudoku() && currSudoku.totalClues >= 17) {
        currSudoku.solve();
        currSudoku.updateHtmlNumbers();
    } else {
        console.log(currSudoku.totalClues);
    }
}

function onLoad(){
    main('000000000000000000000000000000000000000000000000000000000000000000000000000000000');
}