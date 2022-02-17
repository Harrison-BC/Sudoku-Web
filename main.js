let currSudoku;

// '004050000900734600003021049035090480090000030076010920310970200009182003000060100'
// 111111111222222222333333333444444444555555555666666666777777777888888888999999999


function main(sudokuString){
    currSudoku = new Sudoku(sudokuString);
    const elem = document.querySelector('#input');

    document.addEventListener('keypress', (event) => {
        let name = event.key;
        let code = event.code;

        if(document.activeElement !== elem) {
            if (code === "Space") currSudoku.updateNumber(0);
            else currSudoku.updateNumber(name);
        }
    }, false);

    document.onkeydown = function (event) {
        if(document.activeElement !== elem) {
            if (event.code == "Backspace") currSudoku.updateNumber(0);
            else currSudoku.arrowKeys(event.key);
        }
    };
}



function copyToClipboard(){

    /* Copy the text inside the text field */
    let $temp = $("<input>");
    $("body").append($temp);
    $temp.val($("#export").text()).select();
    document.execCommand("copy");
    $temp.remove();
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
    let isValidSudoku = currSudoku.isValidSudoku();
    if(isValidSudoku && currSudoku.totalClues >= 17) {
        currSudoku.solve();
        currSudoku.updateHtmlNumbers();
    } else {
        if(!isValidSudoku){
            window.alert("The sudoku you are trying to solve is invalid.");
        } else {
            window.alert("The sudoku you are trying to solve must contain a minimum of 17 clues.");
        }
    }
}

function onLoad(){
    main('000000000000000000000000000000000000000000000000000000000000000000000000000000000');
}