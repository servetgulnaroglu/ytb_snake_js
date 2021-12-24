import gameClient from "./gameClient.js";
import Game from "./game.mjs";
import KeyboardListener from './listeners/keyboardListener.js';
import SwipeGestureListener from './listeners/swipeGestureListener.js';
import ScoreRenderer from './renderers/scoreRenderer.js';
import SnakeRenderer from './renderers/snakeRenderer.js';
import AppleRenderer from './renderers/appleRenderer.js';
import BombRenderer from './renderers/bombRenderer.js';

const main = document.getElementsByTagName('main')[0];
const footer = document.getElementsByTagName('footer')[0];
const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");
const onlineSwitch = document.getElementById("online");

const scanline = document.getElementById("scanline");
const canvas = document.getElementById("canvas");
const screen = document.getElementById("screen");
const tv = document.getElementById("tv");

const createRoom = document.getElementById("create-room-button");
const joinRoom = document.getElementById("join-room-button");
const roomIdToJoinInput = document.getElementById("room-id-input");

const leaveRoom = document.getElementById("leave-room-button");

const playerIdInput = document.getElementById("player-id");
const roomIdInput = document.getElementById("room-id");
const roomIdLabel = roomIdInput.labels[0];


let animationHandle, lastFrameTimestamp = null;

let playerId = null;
let currentRoomId = null;
let currentGame = null;
let currentSpeed = 15;

function getGameSettings() {
    const numberOfPlayers = document.getElementById('players').value;
    const numberOfApples = document.getElementById('apples').value;
    const speed = document.getElementById('speed').value;
    return {
        numberOfPlayers,
        numberOfApples,
        canvasHeight: canvas.height,
        canvasWidth: canvas.width,
        playerId,
        speed 
    }
}

function startLocalGame() {
    const gameSettings = getGameSettings();
    currentSpeed = gameSettings.speed;
    currentGame = new Game(gameSettings);
    currentGame.start();
}

function keyboardHandler(key) {
    if (currentGame) {
        currentGame.keyPressed(key);
    } else if (currentRoomId) {
         gameClient.keyPressed(currentRoomId, key, playerId);
    }
}

function swipeGestureHandler(direction) {
    // map swipe direction to keyboard key
    const key = {
        "left": "ArrowLeft",
        "right": "ArrowRight",
        "up": "ArrowUp",
        "down": "ArrowDown"
    }[direction];

    keyboardHandler(key);
}




async function stopOnlineGameStart() {
    if (currentRoomId) {
        await gameClient.leaveRoom(currentRoomId, playerId);
    }
}



async function gameLoop(timestamp) {
    
    if (timestamp < lastFrameTimestamp + (1000 / currentSpeed)) {
        animationHandle = requestAnimationFrame(gameLoop);
        return;
    }

    lastFrameTimestamp = timestamp;
    const newState = currentGame ? currentGame.updateState() : await gameClient.updateState(currentRoomId);
    if (newState) {
        draw(newState);
    }
    animationHandle = requestAnimationFrame(gameLoop);
}

const scoreRenderer = new ScoreRenderer(canvas);
const appleRenderer = new AppleRenderer(canvas);
const snakeRenderer = new SnakeRenderer(canvas);
const bombRenderer = new BombRenderer(canvas);

function draw(state) {
    snakeRenderer.draw(state);
    scoreRenderer.draw(state);
    appleRenderer.draw(state);
    bombRenderer.draw(state);
}

function clearCanvas() {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function stopGameloop() {
    cancelAnimationFrame(animationHandle);
    clearCanvas()
}
const presentation = {
    resizeGameArea: function () {
        const width = tv.clientWidth + 5;
        const height = main.clientHeight < width
            ? main.clientHeight - footer.offsetHeight - 10
            : tv.clientHeight;
        screen.style.width = `${width}px`;
        screen.style.height = `${height}px`;
        canvas.width = screen.clientWidth % 20 == 0 ? screen.clientWidth : screen.clientWidth - 20 - screen.clientWidth % 20;
        canvas.height = screen.clientHeight % 20 == 0 ? screen.clientHeight : screen.clientHeight - 60 - screen.clientHeight % 20;
    },
    createRoom: async function () {
        createRoom.disabled = true;
        joinRoom.disabled = true;
        leaveRoom.disabled = false;
        roomIdToJoinInput.disabled = true;
        playerIdInput.disabled = true;
        roomIdInput.disabled = true;
        playerId = playerIdInput.value;
        const roomCreationResponse = await gameClient.createRoom(getGameSettings());
        playerId = roomCreationResponse.playerId;
        currentRoomId = roomCreationResponse.roomId;
        roomIdInput.value = currentRoomId;
        roomIdLabel.classList.add("active");
    },
    leaveRoom: async function () {
        createRoom.disabled = false;
        joinRoom.disabled = false;
        leaveRoom.disabled = true;
        roomIdToJoinInput.disabled = false;
        await presentation.stopGameStart();
        await gameClient.leaveRoom(currentRoomId, playerId);
        currentRoomId = null;
        roomIdInput.value = "";
        roomIdLabel.classList.remove("active");
    },
    joinRoom: async function () {
        createRoom.disabled = true;
        joinRoom.disabled = true;
        leaveRoom.disabled = false;
        roomIdToJoinInput.disabled = true;
        const joinRoomResponse  = await gameClient.joinRoom(roomIdToJoinInput.value, playerId);
        currentRoomId = joinRoomResponse.roomId;
        playerId = joinRoomResponse.playerId;
        currentSpeed = joinRoomResponse.speed;
        playerIdInput.value = playerId;
        roomIdInput.value = currentRoomId;
        roomIdLabel.classList.add("active");
        presentation.startGame();
    },
    startGame: function () {
        try {
            if (!online.checked) {
                startLocalGame();
            }

           
            const keyboardListener = new KeyboardListener();
            const swipeGestureListener = new SwipeGestureListener();

            // listen for swipe gestures
            window.addEventListener('touchstart', function (e) {
                swipeGestureListener.listen(e);
            });

            window.addEventListener('touchend', function (e) {
                swipeGestureListener.listen(e, swipeGestureHandler);
            });


            window.addEventListener("keydown", function (event) {
                keyboardListener.listen(event, keyboardHandler);
            });

            animationHandle = requestAnimationFrame(gameLoop);
            screen.classList.add("crt");
            scanline.classList.add("scanline");
            tv.style.backgroundColor = "white";
            screen.classList.remove("turn-off");
            startButton.disabled = true;
            stopButton.disabled = false;
            onlineSwitch.disabled = true;

        }
        catch (err) {
            alert(err);

        }
    },
    connectOnlineGame: async function (event) {
        const online = event.target.checked;

        playerIdInput.disabled =
            roomIdToJoinInput.disabled =
            createRoom.disabled =
            joinRoom.disabled = !online;

        if (online) {
            // connect socket 
            await gameClient.connectAsync();

        } else {
            // disconnect socket
            if (currentRoomId) {
                await gameClient.leaveRoom(currentRoomId, playerId);
                currentRoomId = null;
                roomIdInput.value = "";
                roomIdLabel.classList.remove("active");
            }

            await gameClient.disconnectAsync();
            // playerId = null;
            // playerIdLabel.classList.remove("active");
        }
        playerIdInput.value = playerId;

    },
    stopGameStart: async function () {
        tv.style.backgroundColor = "rgba(0,0,0,0.9)";
        screen.classList.add("turn-off");
        startButton.disabled = false;
        stopButton.disabled = true;
        onlineSwitch.disabled = false;
        if (online.checked) {
            await stopOnlineGameStart();
        }

    },
    stopGameEnd: function () {
        stopGameloop()
        screen.classList.remove("crt");
        scanline.classList.remove("scanline");
        screen.classList.remove("turn-off");
        tv.style.backgroundColor = "white";
        currentGame = null;
    },
    disablePageScrollOnCanvas: function () {
        canvas.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, { passive: false });
    }


}

export default presentation;