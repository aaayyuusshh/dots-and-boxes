import {cell as cell} from "./cell.js"
import {socket} from "./socket.js"

const GRID_HEIGHT = 550;
const GRID_WIDTH = 550;
const NUMBER_OF_CELLS = 4;  
const CELL_HEIGHT = GRID_HEIGHT / (NUMBER_OF_CELLS + 2);  //height of an individual cell, +2 to account for t&b margins
const CELL_WIDTH = GRID_WIDTH / (NUMBER_OF_CELLS + 2);    //width of an individual cell, +2 to account for l&r margins

const Turn = {
    PlayerOne: 1,
    PlayerTwo: 2,
    PlayerThree: 3
}

let cellsArray; //contains each cell in the grid & its properties
let currHighlightedCells;
let currTurn;
let scores = {playerOne: 0, playerTwo: 0, playerThree: 0};

let canvas = document.getElementById("gameCanvas");
let ctx = getDrawingContext();

let playerOneScore = document.querySelectorAll(".playerOneScore .score");
let playerTwoScore = document.querySelectorAll(".playerTwoScore .score");
let playerThreeScore = document.querySelectorAll(".playerThreeScore .score");
let gameOverModal = document.querySelector(".gameOverModal");
let gameOverModalWinnerText = document.querySelector(".winnerText");
let restartButton = document.querySelector(".restartButton");

socket.on("activate-event-listener", ()=> {
    console.log("here");
    listenForGameBoardEvents();
});

socket.on("deactivate-event-listener", ()=> {
    console.log("here");
    removeGameBoardEventListeners();
});

gameInitialization();
runGameLoop();
listenForRefreshEvent();

//runs once every game
function gameInitialization() {
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

function runGameLoop() {
    setInterval(function(){
        drawBoard();
        checkForPotentialAnimations();
        drawCircles();
        updateScores();
    }, 10);
}

function listenForGameBoardEvents() {
    canvas.addEventListener("mousemove", highlight);
    canvas.addEventListener("click", move);
}

function removeGameBoardEventListeners() {
      canvas.removeEventListener("mousemove", highlight)
      canvas.removeEventListener("click", move);
}

function listenForRefreshEvent() {
    restartButton.addEventListener("click", refreshPage);
}

function refreshPage() {
    window.location.reload();
}

//updating already made moves throughout the interval
function checkForPotentialAnimations() {
    for(let row of cellsArray) {
        for(let cell of row) {
           checkForHighlights(cell);
           checkForMoves(cell);  
           checkForTexts(cell); 
        }
    }
}

function checkForTexts(cell) {
    if(cell.cellOwner != null) {
        drawPlayerName(cell);
    }
}

function updateScores() {
    for(let item of playerOneScore) {
        item.textContent = scores.playerOne;
    }
    for(let item of playerTwoScore) {
        item.textContent = scores.playerTwo;
    }
    for(let item of playerThreeScore) {
        item.textContent = scores.playerThree;
    }
}

function drawPlayerName(cell) {
    //color determination
    let color = null;
    if(cell.cellOwner == Turn.PlayerOne) {
        color = "blue";
    } 
    else if(cell.cellOwner == Turn.PlayerTwo) {
        color = "red";
    } 
    else if(cell.cellOwner == Turn.PlayerThree) {
        color = "green"
    }

    ctx.font = "25px Lato";
    ctx.fillStyle = color;
    ctx.fillText ("Me", cell.left + (CELL_WIDTH/2), cell.top + (CELL_HEIGHT/2));
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
    ctx.fillStyle = "rgb(201, 211, 216)"
    ctx.fillRect(0, 0, GRID_HEIGHT, GRID_WIDTH);
}

function drawCircles() {
    for(let i = 0; i <= NUMBER_OF_CELLS; i++) {
        for(let j =0; j <= NUMBER_OF_CELLS; j++) {
            ctx.fillStyle = "black"
            ctx.beginPath();
            ctx.arc(calculateCircleXCoord(j), calculateCircleYCoord(i), 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}

function drawLine(initialX, initialY, destinationX, destinationY, isDark, player) {
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
    ctx.lineWidth = 4;
    ctx.strokeStyle = color;
    ctx.moveTo(initialX, initialY);
    ctx.lineTo(destinationX, destinationY);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"
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

socket.on("allow-move-other-clients", () => {
    move2();
});

function move2() {
    if(currHighlightedCells.length == 0 || currHighlightedCells == null) {
        return;
    }
    let switchPlayers = true;

    for(let highlightedCell of currHighlightedCells) {
        if(!setMove(cellsArray[highlightedCell.row][highlightedCell.col])) {
            switchPlayers = false;
        }
    }

    //switch players after a successful move.
    if(switchPlayers) {
        if(currTurn == Turn.PlayerOne) {
            currTurn = Turn.PlayerTwo;
        } 
        else if(currTurn == Turn.PlayerTwo) {
            currTurn = Turn.PlayerThree;
        } 
        else if(currTurn == Turn.PlayerThree) {
            currTurn = Turn.PlayerOne;
        }
    }
}

//triggered when a "click" event occurs
function move(event) {
    socket.emit("move-other-clients", currTurn);

    if(currHighlightedCells.length == 0 || currHighlightedCells == null) {
        return;
    }
    let switchPlayers = true;

    for(let highlightedCell of currHighlightedCells) {
        if(!setMove(cellsArray[highlightedCell.row][highlightedCell.col])) {
            switchPlayers = false;
        }
    }

    //switch players after a successful move.
    if(switchPlayers) {
        socket.emit("switch-turns");

        if(currTurn == Turn.PlayerOne) {
            currTurn = Turn.PlayerTwo;
        } 
        else if(currTurn == Turn.PlayerTwo) {
            currTurn = Turn.PlayerThree;
        } 
        else if(currTurn == Turn.PlayerThree) {
            currTurn = Turn.PlayerOne;
        }
    }
}

function setMove(cell) {
    if(cell.highlightSide == "left") {
        cell.selected.left = true;
        cell.owner.left = currTurn;
    } 
    else if(cell.highlightSide == "right") {
        cell.selected.right = true;
        cell.owner.right = currTurn;
    } 
    else if(cell.highlightSide == "top") {
        cell.selected.top = true;
        cell.owner.top = currTurn;
    } 
    else if(cell.highlightSide == "bottom") {
        cell.selected.bottom = true;
        cell.owner.bottom = currTurn;
    }
    //clear highlighting bc now we're drawing that line
    cell.highlightSide = null;

    cell.linesDrawn++;
    if(cell.linesDrawn == 4) {
        cell.cellOwner = currTurn;
        incrementScores();
        checkForGameOver();
        console.log(sumScores());
        return false;
    }

    return true;
}

function returnWinnerName() {
    let maxScore = Math.max(scores.playerOne, scores.playerTwo, scores.playerThree);
    
    if(maxScore == scores.playerOne) {
        return "Player 1";
    } 
    else if(maxScore == scores.playerTwo) {
        return "Player 2";
    } 
    else if(maxScore == scores.playerThree) {
        return "Player 3"
    }
}

function sumScores() {
    return scores.playerOne + scores.playerTwo + scores.playerThree;
}

function checkForGameOver() {
    if(sumScores() == NUMBER_OF_CELLS * NUMBER_OF_CELLS) {

        gameOverModal.style.display = "flex";
        gameOverModalWinnerText.textContent = `${returnWinnerName()} Wins!`;

        removeGameBoardEventListeners();
    }
}

function incrementScores() {
    if(currTurn == Turn.PlayerOne) {
        scores.playerOne++;
    } 
    else if(currTurn == Turn.PlayerTwo) {
        scores.playerTwo++;
    } 
    else if(currTurn == Turn.PlayerThree) {
        scores.playerThree++;
    }
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

socket.on("allow-highlight-other-clients", (canvasX, canvasY) => {
    highlight2(canvasX, canvasY);
});

function highlight2(canvasX, canvasY) {
    clearPreviousHighlighting();

    currHighlightedCells = [];
    for(let i = 0; i < cellsArray.length; i++) {
        for(let j =0; j < cellsArray[0].length; j++) {
            if(cellsArray[i][j].isPartOf(canvasX, canvasY)) {
                //find closest and set highlight let of the square to the closest
                findClosestAndSetHighlight(cellsArray[i][j], canvasX, canvasY);

                if(cellsArray[i][j].highlightSide != null) {
                    currHighlightedCells.push({row: i, col: j});
                }     
                lineHasNeighbour(i, j);
            }
        }
    }
}

//triggered when there is a "mousemove" event
function highlight(event) {

    clearPreviousHighlighting();

    //coordinates relative to the DOM
    let screenX = event.clientX;
    let screenY = event.clientY;
    let boundingCanvasRect = canvas.getBoundingClientRect();

    //extract coordiantes relative to the canvas
    let canvasX = screenX - boundingCanvasRect.left;
    let canvasY = screenY - boundingCanvasRect.top;

    socket.emit("highlight-other-clients", canvasX, canvasY);

    currHighlightedCells = [];
    for(let i = 0; i < cellsArray.length; i++) {
        for(let j =0; j < cellsArray[0].length; j++) {
            if(cellsArray[i][j].isPartOf(canvasX, canvasY)) {
                //find closest and set highlight let of the square to the closest
                findClosestAndSetHighlight(cellsArray[i][j], canvasX, canvasY);

                if(cellsArray[i][j].highlightSide != null) {
                    currHighlightedCells.push({row: i, col: j});
                }     
                lineHasNeighbour(i, j);
            }
        }
    }
}

function findClosestAndSetHighlight(cell, x, y) {
    let distanceToLeft = x - cell.left;
    let distanceToRight = cell.right - x;
    let distanceToTop = y - cell.top;
    let distanceToBottom = cell.bottom - y;
    //calculate the side that's the closest to the x,y coords
    let closestSide =  Math.min(distanceToLeft, distanceToRight, distanceToTop, distanceToBottom);
    
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

/* ------------------------------------------ */

socket.on("connect", () => {
   console.log("--client connected--"); 
});

//handling a new room being created
let createGameButton = document.querySelector(".playNowButton");
createGameButton.addEventListener("click", e => {
    let landingPage = document.querySelector(".landingPageBody");
    let gamePage = document.getElementById("gamePage");
    landingPage.style.display = "none";
    gamePage.style.display = "flex";
    let roomCode = generateRoomCode(7);

    socket.emit("create-game", roomCode);
});

socket.on("show-code", (roomCode, scoreContainer) => {
    let gameCodeTitle = document.querySelector(".gameCodeTitle");
    let gameCode = document.querySelector(".gameCode");
    gameCode.textContent = " " + roomCode;

    let playerOneScoreContainer = document.querySelector(scoreContainer);
    let turnImage = document.createElement("img");
    turnImage.src = "img/you.png";
    let firstChild = playerOneScoreContainer.firstChild;

    playerOneScoreContainer.insertBefore(turnImage, firstChild);
});

socket.on("remove-wait-modal", () => {
    console.log("remove-wait-modal");
    let waitContainer = document.querySelector(".waitContainer");
    waitContainer.style.display = "none";
});

//handling an existing room being joined
let joinRoomContainer = document.querySelector(".joinRoomContainer");
let roomCodeInput = document.getElementById("roomCodeInput");
joinRoomContainer.addEventListener("submit", e => {
    e.preventDefault();
    console.log("clicked join!");

    let roomCode = roomCodeInput.value;
    socket.emit("join-game", roomCode);
});

socket.on("allow-join", () => {
    let landingPage = document.querySelector(".landingPageBody");
    let gamePage = document.getElementById("gamePage");
    landingPage.style.display = "none";
    gamePage.style.display = "flex";
    gamePage.scrollIntoView();
});

function generateRoomCode(length) {
    let result = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for(let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
