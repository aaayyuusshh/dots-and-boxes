/* main script file */

import {cell as cell} from "./cell.js"

//game constants
const GRID_HEIGHT = 550;
const GRID_WIDTH = 550;
const NUMBER_OF_CELLS = 5;   //number of cells in the grid
const CELL_HEIGHT = GRID_HEIGHT / (NUMBER_OF_CELLS + 2);  //height of an individual cell, +2 to account for t&b margins
const CELL_WIDTH = GRID_WIDTH / (NUMBER_OF_CELLS + 2);    //width of an individual cell, +2 to account for l&r margins

//game variables
var cellsArray;

var canvas = document.getElementById("gameCanvas");
var ctx = getDrawingContext();
var boundingCanvasRect = canvas.getBoundingClientRect();

//listening for events
canvas.addEventListener("mousemove", highlight);

gameInitialization();

//game loop
setInterval(function(){
    drawBoard();
    drawCircles();
    checkForHighlights();
}, 10);

function checkForHighlights() {
    for(let row of cellsArray) {
        for(let cell of row) {
            if(cell.highlightSide != null) {
                drawHighlight(cell);
            }
        }
    }
}

function drawHighlight(cell) {
    if(cell.highlightSide == "left") {
        drawLine(cell.left, cell.top, cell.left, cell.bottom);
    }
    else if(cell.highlightSide == "right") {
        drawLine(cell.right, cell.top, cell.right, cell.bottom);
    }
    else if(cell.highlightSide == "top") {
        drawLine(cell.left, cell.top, cell.right, cell.top);
    }
    else if(cell.highlightSide == "bottom") {
        drawLine(cell.left, cell.bottom, cell.right, cell.bottom);
    } 
}


function getDrawingContext() {
    return canvas.getContext("2d");
}

function drawBoard() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, GRID_HEIGHT, GRID_WIDTH);
}

function drawCircles() {
    for(let i = 0; i <= NUMBER_OF_CELLS; i++) {
        for(let j =0; j <= NUMBER_OF_CELLS; j++) {
            ctx.strokeStyle = "white"
            ctx.beginPath();
            ctx.arc(calculateCircleXCoord(j), calculateCircleYCoord(i), 5, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }
}

function drawLine(initialX, initialY, destinationX, destinationY) {
    console.log("here");
    console.log(initialX, initialY, destinationX, destinationY);
    //@TODO: draws line from initial x,y to desitnation x ,y
    ctx.beginPath();
    ctx.strokeStyle = "red";
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

//triggerd when there is a "mousemove" event
function highlight(event) {
    //coordinates relative to the DOM
    var screenX = event.clientX;
    var screenY = event.clientY;

    //extract coordiantes relative to the canvas
    var canvasX = screenX - boundingCanvasRect.left;
    var canvasY = screenY - boundingCanvasRect.top;

    for(let i = 0; i < cellsArray.length; i++) {
        for(let j =0; j < cellsArray[0].length; j++) {
            if(cellsArray[i][j].isPartOf(canvasX, canvasY)) {
                //find closest and set highlight var of the square to the closest
                findClosestAndSetHighlight(cellsArray[i][j], canvasX, canvasY);
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
    
    if(closestSide == distanceToLeft) {
        cell.highlightSide = "left";
    } 
    else if(closestSide == distanceToRight) {
        cell.highlightSide = "right";
    } 
    else if(closestSide == distanceToTop) {
        cell.highlightSide = "top";
    } 
    else if(closestSide == distanceToBottom) {
        cell.highlightSide = "bottom";
    }
}

//runs once every game
function gameInitialization() {
    //initializing the cellsArray with all cells in our board
    cellsArray = [];
    for(let i = 0; i < NUMBER_OF_CELLS; i++) {
        cellsArray[i] = [];
        for(let j = 0; j < NUMBER_OF_CELLS; j++) {
            cellsArray[i][j] = new cell(calculateCircleXCoord(j), calculateCircleYCoord(i));
        }
    }
}