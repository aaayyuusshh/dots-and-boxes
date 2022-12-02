/* client script file (landing page) */

const socket = io("http://127.0.0.1:3000");

//handling a new room being created
var createGameButton = document.querySelector(".playNowButton");
createGameButton.addEventListener("click", e => {
    var roomCode = generateRoomCode(7);
    socket.emit("create-game", roomCode);
});

//handling an existing room being joined
var joinRoomContainer = document.querySelector(".joinRoomContainer");
var roomCodeInput = document.getElementById("roomCodeInput");
joinRoomContainer.addEventListener("submit", e => {
    e.preventDefault();
    console.log("clicked join!");

    var roomCode = roomCodeInput.value;
    socket.emit("join-game", roomCode);
});

socket.on("allow-join", () => {
    window.open("/game.html", "_self");
});

/* helper functions below */

function generateRoomCode(length) {
    //@TODO: need an algo or API to generate random codes
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for(let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
