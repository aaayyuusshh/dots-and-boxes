const e = require("cors");
const {Server} = require("socket.io");
const io = new Server(3000, {
    cors: {
        origin: ["http://127.0.0.1:5501"],
    },
});

let rooms = [];
let roomInfo = {};
let clientRoomMapping = {};
let roomTurns = {};

io.on("connection", (socket) => {
    console.log("\n---server connection established---", socket.id, "\n");

    socket.on("create-game", (roomCode) => {
        debugLogs("create", socket.id, roomCode);
        rooms.push(roomCode);
        roomInfo[roomCode] = [];
        roomInfo[roomCode].push(socket.id);
        clientRoomMapping[socket.id] = roomCode;
        roomTurns[roomCode] = 1;
        socket.join(roomCode);
        socket.emit("show-code", roomCode, ".playerOneScore");
    });

    socket.on("join-game", (roomCode) => {
        console.log("--server recieved the join request--");
        if (!rooms.includes(roomCode)) {
            socket.emit("show-wrong-join", roomCode);
        } else if (rooms.includes(roomCode) && roomInfo[roomCode].length < 3) {
            debugLogs("join", socket.id, roomCode);
            roomInfo[roomCode].push(socket.id);
            clientRoomMapping[socket.id] = roomCode;
            socket.join(roomCode);
            socket.emit("allow-join");
            if (roomInfo[roomCode].length == 2) {
                socket.emit("show-code", roomCode, ".playerTwoScore");
                io.to(roomCode).emit("update-num-of-players", 2, "🐶", "_");
            } else {
                socket.emit("show-code", roomCode, ".playerThreeScore");
                io.to(roomCode).emit("update-num-of-players", 3, "🐶", "🐮");
            }
        }
        if (roomInfo[roomCode] && roomInfo[roomCode].length == 3) {
            let clientsInRoom = roomInfo[roomCode];
            let currentTurn = roomTurns[roomCode];
            setTimeout(() => {
                io.to(roomCode).emit("remove-wait-modal");
                socket.to(clientsInRoom[currentTurn - 1]).emit("activate-event-listener");
            }, 2000);
        }

        console.log("All players inside this room: ", roomInfo[roomCode]);
    });

    socket.on("switch-turns", () => {
        let roomCode = clientRoomMapping[socket.id];
        let clientsInRoom = roomInfo[roomCode];
        let currentTurn = roomTurns[roomCode];
        socket.emit("deactivate-event-listener");
        roomTurns[roomCode] = (currentTurn % 3) + 1;
        io.emit("highlight-turn", roomTurns[roomCode]);
        socket.to(clientsInRoom[currentTurn % 3]).emit("activate-event-listener");
    });

    socket.on("highlight-other-clients", (canvasX, canvasY) => {
        console.log(canvasX, canvasY);
        socket
            .to(clientRoomMapping[socket.id])
            .emit("allow-highlight-other-clients", canvasX, canvasY);
    });

    socket.on("move-other-clients", (currTurn) => {
        socket.to(clientRoomMapping[socket.id]).emit("allow-move-other-clients");
    });
});

function debugLogs(mode, socketId, roomCode) {
    if (mode === "create") {
        console.log("ROOM CREATED, CREATOR ID:", socketId);
        console.log("ROOM CODE:", roomCode);
    } else {
        console.log("ROOM JOINED, JOINER ID:", socketId);
        console.log("ROOM CODE:", roomCode);
    }
}
