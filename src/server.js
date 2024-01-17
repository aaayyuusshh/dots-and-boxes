/* server side javascript in node.js */

const e = require('cors');

const { Server } = require("socket.io");

const io = new Server(3000, {
    cors: {
        origin: ["http://127.0.0.1:5501"],
    },
});

let rooms = [];     //list of all room id's
let roomInfo = {};  //info regarding all rooms

let clientRoomMapping = {};
let roomTurns = {};

io.on('connection', (socket) => {
    console.log("\n---server connection established---", socket.id, "\n");

    //handling a new room being created
    socket.on("create-game", (roomCode) => {
        debugLogs("create", socket.id, roomCode)
        rooms.push(roomCode);
        roomInfo[roomCode] = [];
        roomInfo[roomCode].push(socket.id);
        clientRoomMapping[socket.id] = roomCode;
        roomTurns[roomCode] = 1;
        console.log(roomTurns.roomCode);
        socket.join(roomCode);
        socket.emit("show-code", roomCode, ".playerOneScore");
    });

    //handling an existing room being joined
    //@TODO: need to use the .to("room name") to only send moves to clients in the same room (do this at the end)
    socket.on("join-game", roomCode => {
        console.log("--server recieved the join request--");
        if(rooms.includes(roomCode) && roomInfo[roomCode].length < 3) {
            debugLogs("join", socket.id, roomCode);
            roomInfo[roomCode].push(socket.id);
            clientRoomMapping[socket.id] = roomCode;
            socket.join(roomCode);
            socket.emit("allow-join");
            if(roomInfo[roomCode].length == 2){
                socket.emit("show-code", roomCode, ".playerTwoScore");
            } else {
                socket.emit("show-code", roomCode, ".playerThreeScore");
            }
        }
        
        if(roomInfo && roomInfo[roomCode].length == 3) {
            let clientsInRoom = roomInfo[roomCode];
            let currentTurn = roomTurns[roomCode];
            io.to(roomCode).emit("remove-wait-modal");
            socket.to(clientsInRoom[currentTurn-1]).emit("activate-event-listener");
        }

        console.log("All players inside this room: ", roomInfo.roomCode);
    });

    socket.on("switch-turns", () => {
        let roomCode = clientRoomMapping[socket.id];
        let clientsInRoom = roomInfo[roomCode];
        let currentTurn = roomTurns[roomCode];
        socket.emit("deactivate-event-listener");
        roomTurns[roomCode] = (currentTurn % 3) + 1;
        socket.to(clientsInRoom[currentTurn%3]).emit("activate-event-listener");
    })

    // socket.on("highlight-request", () => {
    //     let roomNumber = clientRoomMapping[socket.id];
    //     // console.log(`test: ${roomNumber}`);

    //     let clientsInRoom = roomInfo[roomNumber];
    //     // console.log(`clientInRoom test: ${clientsInRoom}`);
        
    //     let currTurn = roomTurns[roomNumber];
    //     // console.log(`test currTurn: ${currTurn}, ${typeof currTurn}`);
        
    //     if(socket.id === clientsInRoom[currTurn-1]){
    //         socket.emit("allow-highlight");
    //     }
    // });

    //handle highlighting
    socket.on("highlight-other-clients", (canvasX, canvasY) => {
        console.log(canvasX, canvasY);
        socket.to(clientRoomMapping[socket.id]).emit("allow-highlight-other-clients", canvasX, canvasY)
    });

    // socket.on("move-request", () => {
    //     //@TODO: put this in a function
    //     let roomNumber = clientRoomMapping[socket.id];
    //     let clientsInRoom = roomInfo[roomNumber];
    //     let currTurn = roomTurns[roomNumber];

    //     if(socket.id === clientsInRoom[currTurn-1]) {
    //         socket.emit("allow-move");
    //         currTurn = (currTurn % 3) + 1; //switching turns
    //     }
    // });

    //handling making a move
    socket.on("move-other-clients", currTurn => {
        socket.to(clientRoomMapping[socket.id]).emit("allow-move-other-clients");
    });
});

function debugLogs(mode, socketId, roomCode) {
    if(mode === "create") {
        console.log("ROOM CREATED, CREATOR ID:", socketId);
        console.log("ROOM CODE:", roomCode);
    } else {
        console.log("ROOM JOINED, JOINER ID:", socketId);
        console.log("ROOM CODE:", roomCode);
    }
}