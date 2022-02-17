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

// https://www.programming-idioms.org/idiom/154/halfway-between-two-hex-color-codes/1909/js
function colourBetween(){
    // c1 = = docume
    // var c = "#";
    // for(var i = 0; i<3; i++) {
    //     var sub1 = c1.substring(1+2*i, 3+2*i);
    //     var sub2 = c2.substring(1+2*i, 3+2*i);
    //     var v1 = parseInt(sub1, 16);
    //     var v2 = parseInt(sub2, 16);
    //     var v = Math.floor((v1 + v2) / 2);
    //     var sub = v.toString(16).toUpperCase();
    //     var padsub = ('0'+sub).slice(-2);
    //     c += padsub;
    // }
}