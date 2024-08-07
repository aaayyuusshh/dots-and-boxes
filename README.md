# Dots & Boxes Multiplayer Game

## Overview

dots-and-boxes is an online multiplayer implementation of the classic Dots and Boxes game. This project brings the traditional paper-and-pencil game to the digital world, enabling users to play with up to three players in real-time. The game leverages web sockets for seamless communication between players, ensuring an engaging and low-latency multiplayer experience.

## Screenshots
<img width="1434" alt="Screen Shot 2024-01-16 at 10 50 49 PM" src="https://github.com/aaayyuusshh/dots-and-boxes/assets/80851741/b82b1729-3e6c-4f81-996c-1f1b3b5a8e14">


**Waiting for players:**
<img width="1438" alt="Screenshot 2024-05-30 at 6 06 39 AM" src="https://github.com/aaayyuusshh/dots-and-boxes/assets/80851741/2c316c57-a46f-4380-a442-e2c414798c86">

**Game screen of one client:**
<img width="1438" alt="Screenshot 2024-05-30 at 6 08 52 AM" src="https://github.com/aaayyuusshh/dots-and-boxes/assets/80851741/3adf6c45-b38f-4a89-975e-4aabd5650d06">

**Gameplay with 3 clients:**
![Screenshot 2024-05-30 at 6 14 06 AM](https://github.com/aaayyuusshh/dots-and-boxes/assets/80851741/46c4ebd9-8889-44cf-81ea-0a1003e3c403)

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js, Socket.io
- **Database:** MongoDB

## Game Logic and Architecture

### 1. Frontend (`main.js`) 
- **Game Initialization:**
  - The game starts by initializing the game board and necessary variables.
  - Cells are represented using the `cell` class defined in `cell.js`.
    
- **Game Loop:**
  * The `runGameLoop` function runs continuously, updating the game state and rendering changes on the canvas.
- **Event Listeners:**
  - Event listeners are added to the canvas for mouse movements and clicks to detect player actions.
  - Socket.io is used to emit and receive events related to game moves and turns.

- **Highlighting and Moves:**
  - Cells are highlighted based on mouse movements, indicating potential moves.
  - Players can click to make moves, and the game logic processes and updates the board accordingly.

- **Scoring and Game Over:**
  - Scores are tracked for each player based on the number of squares formed.
  - The game ends when all possible squares are formed, and a modal displays the winner and scores.

### 2. Backend (`server.js`)

- **Server Initialization:**
  - The server is set up using Node.js and Socket.io to handle real-time communication.
  - The server manages game rooms, tracks player turns, and facilitates interactions between clients.

- **Room Creation and Joining:**
  - Players can create a new game, generating a unique room code.
  - Existing games are joined by entering the room code.

- **Turn Switching:**
  - Turns are managed on the server, ensuring synchronized gameplay.
  - Players take turns, and the server emits events to activate and deactivate event listeners accordingly.

- **Real-time Communication:**
  - Socket.io is employed for real-time communication between clients and the server.
  - Events such as moves, highlights, and turn switches are broadcasted to all players in the same room.

## How to Play

1. **Create a New Game:**
   - Click the "Create Game" button on the landing page.
   - Share the generated game code with others to join.

2. **Join an Existing Game:**
   - Enter the provided game code on the landing page and click "Join."

3. **Gameplay:**
   - Players take turns making moves to form squares.
   - Highlighting and moves made from one player is transmitted to other players through web sockets.
   - Scores are updated based on the number of squares claimed.

## Miscellaneous Planning

![dots-and-boxes-1](https://github.com/aaayyuusshh/dots-and-boxes/assets/80851741/169a05fb-494c-4320-9c72-6600a220b78e)

![dots-and-boxes-2](https://github.com/aaayyuusshh/dots-and-boxes/assets/80851741/23aa2e3e-68a7-457e-95e3-3a11c124b972)

![dots-and-boxes-3](https://github.com/aaayyuusshh/dots-and-boxes/assets/80851741/30d12c2e-1f6f-4d88-9c21-d6c160f7f000)

![dots-and-boxes-4](https://github.com/aaayyuusshh/dots-and-boxes/assets/80851741/4e76c1bd-9dae-49a4-a6e3-f344c8f1daf3)

![dots-and-boxes-5](https://github.com/aaayyuusshh/dots-and-boxes/assets/80851741/197e29a1-3cdb-4742-bd37-24c606d3e77e)

![dots-and-boxes-6](https://github.com/aaayyuusshh/dots-and-boxes/assets/80851741/fe0b3dbc-6da7-40e6-80a3-967bc30eba53)

![dots-and-boxes-7](https://github.com/aaayyuusshh/dots-and-boxes/assets/80851741/c04b0775-7bda-4c70-82f0-655d0802a92f)
