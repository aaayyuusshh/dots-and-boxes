/* main script file */

import {cell as cell} from "./cell.js"

//game constants
const GRID_HEIGHT = 550;
const GRID_WIDTH = 550;
const NUMBER_OF_CELLS = 4;   //number of cells in the grid
const CELL_HEIGHT = GRID_HEIGHT / (NUMBER_OF_CELLS + 2);  //height of an individual cell, +2 to account for t&b margins
const CELL_WIDTH = GRID_WIDTH / (NUMBER_OF_CELLS + 2);    //width of an individual cell, +2 to account for l&r margins

//game variables
var cellsArray;
var currHighlightedCells;
var currTurn; 

const Turn = {
    PlayerOne: 1,
    PlayerTwo: 2,
    PlayerThree: 3
}

var canvas = document.getElementById("gameCanvas");
var ctx = getDrawingContext();
ctx.lineWidth = 4;
var boundingCanvasRect = canvas.getBoundingClientRect();

//listening for events
canvas.addEventListener("mousemove", highlight);
canvas.addEventListener("click", move);

gameInitialization();

//game loop
setInterval(function(){
    drawBoard();
    checkForPotentialAnimations();
    drawCircles();
  
}, 10);

function checkForPotentialAnimations() {
    for(let row of cellsArray) {
        for(let cell of row) {
           checkForHighlights(cell);
           checkForMoves(cell);   
        }
    }
}

function checkForHighlights(cell) {
    if(cell.highlightSide != null) {
        drawHighlight(cell.highlightSide, cell, false, currTurn);
    }
}

function checkForMoves(cell) {
    if(cell.selected.left) {
        drawHighlight("left", cell, true, cell.owner.left);
    }
    if(cell.selected.right) {
        drawHighlight("right", cell, true, cell.owner.right);
    }
    if(cell.selected.top) {
        drawHighlight("top", cell, true, cell.owner.top);
    }
    if(cell.selected.bottom) {
        drawHighlight("bottom", cell, true, cell.owner.bottom);
    }

}

function drawHighlight(side, cell, isDark, player) {
     if(side == "left") {
        drawLine(cell.left, cell.top, cell.left, cell.bottom, isDark, player);
    }
    else if(side == "right") {
        drawLine(cell.right, cell.top, cell.right, cell.bottom, isDark, player);
    }
    else if(side == "top") {
        drawLine(cell.left, cell.top, cell.right, cell.top, isDark, player);
    }
    else if(side == "bottom") {
        drawLine(cell.left, cell.bottom, cell.right, cell.bottom, isDark, player);
    } 
}


function getDrawingContext() {
    return canvas.getContext("2d");
}

function drawBoard() {
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, GRID_HEIGHT, GRID_WIDTH);
}

function drawCircles() {
    for(let i = 0; i <= NUMBER_OF_CELLS; i++) {
        for(let j =0; j <= NUMBER_OF_CELLS; j++) {
            ctx.fillStyle = "white"
            ctx.beginPath();
            ctx.arc(calculateCircleXCoord(j), calculateCircleYCoord(i), 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}

function drawLine(initialX, initialY, destinationX, destinationY, isDark, player) {

    console.log("here");
    console.log(initialX, initialY, destinationX, destinationY);
    
    //color determination
    let color = null;
    if(isDark) {
        if(player == Turn.PlayerOne) {
            color = "blue";
        } else if(player == Turn.PlayerTwo) {
            color = "red";
        } else {
            color = "green"
        }
    } else {
        if(player == Turn.PlayerOne) {
            color = "lightblue ";
        } else if(player == Turn.PlayerTwo) {
            color = "pink";
        } else {
            color = "lightgreen"
        } 
    }

    //drawing
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(initialX, initialY);
    ctx.lineTo(destinationX, destinationY);
    ctx.stroke();
}

function calculateCircleXCoord(idx) {
    return CELL_WIDTH * (idx + 1);
}

function calculateCircleYCoord(idx) {
    return CELL_HEIGHT * (idx + 1);
}

function clearPreviousHighlighting() {
    //since a new mousemove is triggered, we must clear previous highlighting
    for(let row of cellsArray) {
        for(let cell of row) {
            cell.highlightSide = null;
        }
    }
}

//triggered when a "click" event occurs
function move(event) {

    if(currHighlightedCells.length == 0 || currHighlightedCells == null) {
        return;
    }

    for(let highlightedCell of currHighlightedCells) {
        setMove(cellsArray[highlightedCell.row][highlightedCell.col]);
    }

    //switch players after a successful move.
    if(currTurn == Turn.PlayerOne) {
        currTurn = Turn.PlayerTwo;
    } else if(currTurn == Turn.PlayerTwo) {
        currTurn = Turn.PlayerThree;
    } else if(currTurn == Turn.PlayerThree) {
        currTurn = Turn.PlayerOne;
    }
}

function setMove(cell) {
    if(cell.highlightSide == "left") {
        cell.selected.left = true;
        cell.owner.left = currTurn;
    } else if(cell.highlightSide == "right") {
        cell.selected.right = true;
        cell.owner.right = currTurn;
    } else if(cell.highlightSide == "top") {
        cell.selected.top = true;
        cell.owner.top = currTurn;
    } else if(cell.highlightSide == "bottom") {
        cell.selected.bottom = true;
        cell.owner.bottom = currTurn;
    }

    //clear highlighting bc now we're draw that line
    cell.highlightSide = null;
}

function lineHasNeighbour(i, j) {
    if(j < cellsArray[0].length - 1 && cellsArray[i][j].highlightSide == "right") {
        cellsArray[i][j + 1].highlightSide = "left";
        currHighlightedCells.push({row: i, col: j + 1});
     } 
     else if(j > 0 && cellsArray[i][j].highlightSide == "left") {
         cellsArray[i][j - 1].highlightSide = "right";
         currHighlightedCells.push({row: i, col: j - 1});
     }
     else if(i < cellsArray.length - 1 && cellsArray[i][j].highlightSide == "bottom") {
         cellsArray[i + 1][j].highlightSide = "top";
         currHighlightedCells.push({row: i + 1, col: j});
     }
     else if(i > 0 && cellsArray[i][j].highlightSide == "top") {
         cellsArray[i - 1][j].highlightSide = "bottom";
         currHighlightedCells.push({row: i - 1, col: j});
     }
     //else its a edge piece & has no neighbour
     else {
         //do nothing
     }
}

//triggered when there is a "mousemove" event
function highlight(event) {
    
    clearPreviousHighlighting();

    //coordinates relative to the DOM
    var screenX = event.clientX;
    var screenY = event.clientY;

    //extract coordiantes relative to the canvas
    var canvasX = screenX - boundingCanvasRect.left;
    var canvasY = screenY - boundingCanvasRect.top;

    currHighlightedCells = [];
    for(let i = 0; i < cellsArray.length; i++) {
        for(let j =0; j < cellsArray[0].length; j++) {
            if(cellsArray[i][j].isPartOf(canvasX, canvasY)) {
                //find closest and set highlight var of the square to the closest
                findClosestAndSetHighlight(cellsArray[i][j], canvasX, canvasY);

                if(cellsArray[i][j].highlightSide != null) {
                    currHighlightedCells.push({row: i, col: j});
                }     
                console.log("currHighlighted arr", currHighlightedCells);
                
                lineHasNeighbour(i, j);
            }
        }
    }
}

function findClosestAndSetHighlight(cell, x, y) {
    var distanceToLeft = x - cell.left;
    var distanceToRight = cell.right - x;
    var distanceToTop = y - cell.top;
    var distanceToBottom = cell.bottom - y;
    //calculate the side that's the closest to the x,y coords
    var closestSide =  Math.min(distanceToLeft, distanceToRight, distanceToTop, distanceToBottom);
    
    if(closestSide == distanceToLeft && !cell.selected.left) {
        cell.highlightSide = "left";
    } 
    else if(closestSide == distanceToRight && !cell.selected.right) {
        cell.highlightSide = "right";
    } 
    else if(closestSide == distanceToTop && !cell.selected.top) {
        cell.highlightSide = "top";
    } 
    else if(closestSide == distanceToBottom && !cell.selected.bottom) {
        cell.highlightSide = "bottom";
    }
}

//runs once every game
function gameInitialization() {

    //whose turn is it at the start of the game? - always playerOne(blue)
    currTurn = Turn.PlayerOne;

    //initializing the cellsArray with all cells in our board
    cellsArray = [];
    for(let i = 0; i < NUMBER_OF_CELLS; i++) {
        cellsArray[i] = [];
        for(let j = 0; j < NUMBER_OF_CELLS; j++) {
            cellsArray[i][j] = new cell(calculateCircleXCoord(j), calculateCircleYCoord(i));
        }
    }
}