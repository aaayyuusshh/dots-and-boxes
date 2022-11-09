/* main script file */

//game constants
const GRID_HEIGHT = 550;
const GRID_WIDTH = 550;
const NUMBER_OF_CELLS = 5;   //number of cells in the grid
const CELL_HEIGHT = GRID_HEIGHT / (NUMBER_OF_CELLS + 2);  //height of an individual cell, +2 to account for t&b margins
const CELL_WIDTH = GRID_WIDTH / (NUMBER_OF_CELLS + 2);    //width of an individual cell, +2 to account for l&r margins

var canvas = document.getElementById("gameCanvas");
var ctx = getDrawingContext();

drawBoard();
drawCircles();

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

function calculateCircleXCoord(idx) {
    return CELL_WIDTH * (idx + 1);
}

function calculateCircleYCoord(idx) {
    return CELL_HEIGHT * (idx + 1);
}