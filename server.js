/* server side javascript in node.js */

//create a server on port 3000
const io = require('socket.io')(3000, {
    cors: {
        origin: ["http://127.0.0.1:5501"],
    },
});

let rooms = [];     //list of all room id's
let roomInfo = {};  //info regarding all rooms
let roomTurns = {};

const Turn = {
    PlayerOne: 1,
    PlayerTwo: 2,
    PlayerThree: 3
}

io.on('connection', socket => {
    console.log("\n---connection established---", socket.id, "\n");

    //handling a new room being created
    socket.on("create-game", roomCode => {
        debugLogs("create", socket.id, roomCode)
        rooms.push(roomCode);
        roomInfo[roomCode] = [];
        roomInfo[roomCode].push(socket.id);
        roomTurns[roomCode] = socket.id;    //setting whose turn it is currently
        socket.join(roomCode);
    });

    //handling an existing room being joined
    //@TODO: need to use the .to("room name") to only send moves to clients in the same room (do this at the end)
    socket.on("join-game", roomCode => {
        console.log("~~server recieved the click~~");
        if(rooms.includes(roomCode) && roomInfo[roomCode].length < 3) {
            debugLogs("join", socket.id, roomCode);
            roomInfo[roomCode].push(socket.id);
            socket.join(roomCode);
            socket.emit("allow-join");
        }
        console.log("All players inside this room: ", roomInfo[roomCode]);
    });

    socket.on("check-for-start", () => {
        var allRooms = socket.rooms;
        console.log(allRooms);
    });

    //handle highlighting
    socket.on("highlight", (canvasX, canvasY) => {
        console.log(canvasX, canvasY);
        socket.broadcast.emit("highlight-clients", canvasX, canvasY)
    });

    //handling making a move
    socket.on("move", () => {
        socket.broadcast.emit("move-clients");
    });
});

function debugLogs(mode, socketId, roomCode) {
    if(mode === "create") {
        console.log("ROOM CREATED, CREATOR ID:", socketId);
        console.log("CODE:", roomCode);
    } else {
        console.log("ROOM JOINED, JOINER ID:", socketId);
    }
}