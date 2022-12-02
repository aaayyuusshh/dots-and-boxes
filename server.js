/* server side javascript in node.js */

//create a server on port 3000
const io = require('socket.io')(3000, {
    cors: {
        origin: ["http://127.0.0.1:5501"],
    },
});

let rooms = [];     //list of all room id's
let roomInfo = {};  //info regarding all rooms

io.on('connection', socket => {
    console.log("\n---connection established---\n");

    //handling a new room being created
    socket.on("create-game", roomCode => {
        debugLogs("create", socket.id, roomCode)
        rooms.push(roomCode);
        roomInfo[roomCode] = [];
        roomInfo[roomCode].push(socket.id);
        socket.join(roomCode);
        socket.emit("add-code-html", roomCode);
    });

    //handling an existing room being joined
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
});

function debugLogs(mode, socketId, roomCode) {
    if(mode === "create") {
        console.log("ROOM CREATED, CREATOR ID:", socketId);
        console.log("CODE:", roomCode);
    } else {
        console.log("ROOM JOINED, JOINER ID:", socketId);
    }
}