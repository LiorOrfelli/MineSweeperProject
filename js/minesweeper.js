'use strict';

var gBoard;

//This is an object by which the board size is set (in this case: 4x4 board and how many mines to put)
var gLevel;

//This is an object in which you can keep and update the current game state: isOn: Boolean, when true we let the user play
// shownCount: How many cells are shown 
//markedCount: How many cells are marked (with a flag)
//I also decided to add 2 more attributes beyond recommendations - nonMineCells which will assist me in determining victory
//by checking if all showCount(Which will increse only in a case of left clicking a non cell mine) is equal to  nonMineCells
//The second attribute is buttonsPressesCounter which will help me in initializing the timer (on first button press)
//the last attribute is - secsPassed: How many seconds passed
var gGame;

var gTimeStarted;

function init() {
    gLevel = { SIZE: 4, MINES: 2 };
    gGame = { isOn: true, shownCount: 0, markedCount: 0, flags: gLevel.MINES, flagsMarkedRight: gLevel.MINES, lives: 3, nonMineCells: ((gLevel.SIZE * gLevel.SIZE) - gLevel.MINES), buttonsPressesCounter: 0, secsPassed: 0 };
    gBoard = buildInitialMatrix();
    setMinesInTheModel();
    updateMinesAroundCellinEachCell();
    renderBoard(gBoard);
    localStorage.setItem('1',0);

}

function reset() {
    var smileySection = document.querySelector('.smiley');
    smileySection.innerHTML = `<img src="pics/smiley.png">`;
    var timerSection = document.querySelector('.timer');
    timerSection.innerHTML = `0.000`;
    var gameSection = document.querySelector('.game');
    //Clearing the existing table
    gameSection.innerHTML = '';
    //placing a new one inside
    init();
    //Now I can update lives and flags since they are based on the init function
    var flagSection = document.querySelector('.flags-left');
    flagSection.innerHTML = `Flags ${gGame.flags}`;
    var livesSection = document.querySelector('.lives-left');
    livesSection.innerHTML = `Total lives left ${gGame.lives}`;

}

function level2() {
    var smileySection = document.querySelector('.smiley');
    smileySection.innerHTML = `<img src="pics/smiley.png">`;
    var timerSection = document.querySelector('.timer');
    timerSection.innerHTML = `0.000`;
    var gameSection = document.querySelector('.game');
    //Clearing the existing table
    gameSection.innerHTML = '';
    //placing a new one inside
    gLevel = { SIZE: 8, MINES: 12 };
    gGame = { isOn: true, shownCount: 0, markedCount: 0, flags: gLevel.MINES, flagsMarkedRight: gLevel.MINES, lives: 3, nonMineCells: ((gLevel.SIZE * gLevel.SIZE) - gLevel.MINES), buttonsPressesCounter: 0, secsPassed: 0 };
    gBoard = buildInitialMatrix();
    setMinesInTheModel();
    updateMinesAroundCellinEachCell();
    renderBoard(gBoard);
    //Now I can update lives and flags since they are based on the init function
    var flagSection = document.querySelector('.flags-left');
    flagSection.innerHTML = `Flags ${gGame.flags}`;
    var livesSection = document.querySelector('.lives-left');
    livesSection.innerHTML = `Total lives left ${gGame.lives}`;
    localStorage.setItem('2',0);
}

function level3() {
    var smileySection = document.querySelector('.smiley');
    smileySection.innerHTML = `<img src="pics/smiley.png">`;
    var timerSection = document.querySelector('.timer');
    timerSection.innerHTML = `0.000`;
    var gameSection = document.querySelector('.game');
    //Clearing the existing table
    gameSection.innerHTML = '';
    //placing a new one inside
    gLevel = { SIZE: 12, MINES: 30 };
    gGame = { isOn: true, shownCount: 0, markedCount: 0, flags: gLevel.MINES, flagsMarkedRight: gLevel.MINES, lives: 3, nonMineCells: ((gLevel.SIZE * gLevel.SIZE) - gLevel.MINES), buttonsPressesCounter: 0, secsPassed: 0 };
    gBoard = buildInitialMatrix();
    setMinesInTheModel();
    updateMinesAroundCellinEachCell();
    renderBoard(gBoard);
    //Now I can update lives and flags since they are based on the init function
    var flagSection = document.querySelector('.flags-left');
    flagSection.innerHTML = `Flags ${gGame.flags}`;
    var livesSection = document.querySelector('.lives-left');
    livesSection.innerHTML = `Total lives left ${gGame.lives}`;
    localStorage.setItem('3',0);
}


//The following function will create a cell object
//with specific default settings
function createCell() {
    var cell = {
        minesAroundCounter: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    }
    return cell;
}

//Creating the initial matrix of each level composed of empty cells with their default values
function buildInitialMatrix() {
    //Creating an empty 2D array first
    var arr = new Array(gLevel.SIZE);
    for (var i = 0; i < gLevel.SIZE; i++) {
        arr[i] = new Array(gLevel.SIZE);
    }
    //pushing empty cell objects into each and every one of the matrix cells
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            arr[i][j] = createCell();
            //Adding 2 more attributes to each cell - its
            //x coordinate (i) and its y coordinate (j)
            arr[i][j].i = i;
            arr[i][j].j = j;
        }
    }
    return arr;
}


//This function will set the amount of mines defined for each level
//on random available locations on the board
function setMinesInTheModel() {
    var minesAvailable = gLevel.MINES;
    var mineX = generateRandomCoordinate(gLevel.SIZE);
    var mineY = generateRandomCoordinate(gLevel.SIZE);
    while (minesAvailable > 0) {
        if (isMine(gBoard, mineX, mineY)) {
            mineX = generateRandomCoordinate(gLevel.SIZE);
            mineY = generateRandomCoordinate(gLevel.SIZE);
        }
        else {
            minesAvailable--;
            gBoard[mineX][mineY].isMine = true;
        }
    }
}


//This function will rely on the "neighbors" algorithm
function countMinesAroundCell(cellI, cellJ) {
    var minesCounter = 0;
    var currCell;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= (gLevel.SIZE)) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= (gLevel.SIZE)) continue;
            currCell = gBoard[i][j];
            if (currCell.isMine) {
                minesCounter++;
            }
        }
    }
    return minesCounter;

}

function updateMinesAroundCellinEachCell() {
    var currCell;
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            currCell = gBoard[i][j];
            currCell.minesAroundCounter = countMinesAroundCell(i, j);
        }
    }
}



function renderBoard(board) {
    var result = `<table border=1>`;
    for (var i = 0; i < board[0].length; i++) {
        result += `<tr>`;
        for (var j = 0; j < board.length; j++) {
            result += `<td><button id = ${i * (board.length) + j} i=${i} j=${j} onmousedown="cellClicked(event,this)"></button></td>`;
        }
        result += "</tr>";
    }
    result += "</table>";

    var elMatrix = document.querySelector('.game');
    elMatrix.innerHTML += result;
}

//This function will be "seperated" into 2 cases -
//1) Left click - left click is represented by event.button = 0
//2) Right click - right click is represented by even.button = 2
function cellClicked(elButtonMouseEvent, elButton) {
    var xCell = parseInt(elButton.getAttribute("i"));
    var yCell = parseInt(elButton.getAttribute("j"));
    var flagsSection = document.querySelector('.flags-left');
    console.log(elButton.innerHTML);
    console.log(xCell, yCell);
    gGame.buttonsPressesCounter++;
    if (gGame.buttonsPressesCounter === 1) {
        gTimeStarted = Date.now();
        var myVar = setInterval(function () {
            var timeElapsed = Date.now() - gTimeStarted;
            document.querySelector('.timer').innerHTML = (timeElapsed / 1000).toFixed(3);
            isVictory(myVar);
        }, 1);
    }
    //Left click pressed
    if (elButtonMouseEvent.button === 0) {
        ExposeCellsAround(elButton, xCell, yCell);
        /*         if (isVictory()) {
                    console.log(gGame.flagsMarkedRight, gGame.nonMineCells);
                    console.log('sdf');
                    //Stop timer
                    //User should press restart
                    //Smiley changes
                } */
    }
    //right click presses
    if (elButtonMouseEvent.button === 2) {
        if ((!((gBoard[xCell][yCell]).isShown)) && (elButton.innerHTML) === '') {
            gBoard[xCell][yCell].isMarked = true;
            elButton.innerHTML = `<img src="pics/Flag.png">`;
            console.log(elButton.innerHTML);
            (gGame.flags)--;
            flagsSection.innerHTML = `Flags ${gGame.flags}`;
            if ((gBoard[xCell][yCell]).isMine === true) {
                (gGame.flagsMarkedRight)--;
                /*                 isVictory(); */
            }
        }
        else {
            (gBoard[xCell][yCell]).isMarked = false;
            elButton.innerHTML = '';
            if (!(gBoard[xCell][yCell]).isMine) {
                (gGame.flags)++;
            }
            flagsSection.innerHTML = `Flags ${gGame.flags}`;
        }

        /*         if(isVictory()){
                    console.log('dsf');
                    //Stop timer
                    //User should press restart
                    //Smiley changes
                } */
    }
}



//This function will implement the extended exposure recursively
//Based on 3 cases - 
//The clicked cell is a mine
//The clicked cell is a number greater than 0
//The clicked cell is a 0 --
//In the last case - leads to the recursion -
//If the cell contains 0 - it means we can open up all of its neighbors 
//And then - implement the function ExposeCellsAround them as long as they 
//aren't marked or shown
function ExposeCellsAround(cell, cellRow, cellCol) {
    var neighCell;
    var neighCellId;
    var livesSection = document.querySelector(".lives-left");
    if ((gBoard[cellRow][cellCol]).isShown === false && (gBoard[cellRow][cellCol]).isMarked === false) {
        if ((gBoard[cellRow][cellCol]).isMine === true) {
            gGame.lives--;
            livesSection.innerHTML = `Total lives left ${gGame.lives}`;
            cell.innerHTML = `<img src="pics/mine.png">`;
            var smiley = document.querySelector('.smiley');
            smiley.innerHTML = `<img src="pics/sadSmiley.png">`;
            setTimeout(changeBackToHappy, 500);

        }
        if ((gBoard[cellRow][cellCol]).isMine === false && (gBoard[cellRow][cellCol]).isMarked === false) {
            if ((gBoard[cellRow][cellCol]).minesAroundCounter > 0) {
                (gBoard[cellRow][cellCol]).isShown = true;
                cell.innerHTML = (gBoard[cellRow][cellCol]).minesAroundCounter;
                cell.classList.add('uncovered');
                gGame.nonMineCells--;


            }
            if ((gBoard[cellRow][cellCol]).minesAroundCounter === 0 && (gBoard[cellRow][cellCol]).isMarked === false) {
                (gBoard[cellRow][cellCol]).isShown = true;
                cell.classList.add('uncovered');
                gGame.nonMineCells--;
                for (var i = cellRow - 1; i <= cellRow + 1; i++) {
                    if (i < 0 || i >= gLevel.SIZE) continue;
                    for (var j = cellCol - 1; j <= cellCol + 1; j++) {
                        if (i === cellRow && j === cellCol) continue;
                        if (j < 0 || j >= gLevel.SIZE) continue;
                        if (!(gBoard[i][j].isMarked) && (!(gBoard[i][j].isShown))) {
                            neighCellId = (i * (gLevel.SIZE) + j).toString();
                            neighCell = document.getElementById(neighCellId);
                            console.log(neighCellId);
                            ExposeCellsAround(neighCell, i, j);
                        }
                    }
                }

            }
        }

    }


}


//=====ASSISTING FUNCTIONS=====

//This function will check whether a cell cotains a mine or not based on its isMine attribute's value
function isMine(matrix, xCord, yCord) {
    var matrixCell;
    matrixCell = matrix[xCord][yCord];
    return (matrixCell.isMine);
}

//Assisting function which will be used in order to place mines
function generateRandomCoordinate(size) {
    return (Math.floor(Math.random() * size));
}

function isVictory(myVar) {
    var smiley = document.querySelector('.smiley');
    //Win
    if ((gGame.nonMineCells === 0 && gGame.flagsMarkedRight === 0)) {
        clearInterval(myVar);
        smiley.innerHTML = `<img src="pics/smileyvic.png">`;
        gGame.isOn = false;
        if(gLevel.MINES === 2){
            if(parseInt(document.querySelector('.timer').innerHTML) < localStorage.getItem('1'))
            localStorage.setItem('1',document.querySelector('.timer').innerHTML)
            var best1 = document.querySelector('.best-score-1');
            best1.innerHTML = localStorage.getItem('1');
        }
        if(gLevel.MINES === 12){
            if(parseInt(document.querySelector('.timer').innerHTML) < localStorage.getItem('2'))
            localStorage.setItem('2',document.querySelector('.timer').innerHTML)
            var best1 = document.querySelector('.best-score-2');
            best1.innerHTML = localStorage.getItem('2');
        }
        if(gLevel.MINES ==30){
            if(parseInt(document.querySelector('.timer').innerHTML) < localStorage.getItem('3'))
            localStorage.setItem('3',document.querySelector('.timer').innerHTML)
            var best1 = document.querySelector('.best-score-3');
            best1.innerHTML = localStorage.getItem('3');
        }

    }
    //GameOver
    if (gGame.lives === 0) {
        clearInterval(myVar);
        smiley.innerHTML = `<img src="pics/sadSmiley.png">`;
        gGame.isOn = false;
    }
}

function changeBackToHappy() {
    var smiley = document.querySelector('.smiley');
    smiley.innerHTML = `<img src = "pics/smiley.png">`
}

function bulbHint(){
    //Change bulb to
    var bulbPic = document.querySelector('.bulb');
    bulbPic.src = "pics/ONbulb.jpg";


}