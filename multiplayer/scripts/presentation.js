import gameClient from "./gameClient.js";
import Game from "./game.mjs";
import KeyboardListener from './listeners/keyboardListener.js';
import RemoteKeyboardListener from './listeners/remoteKeyboardListener.js';
import ScoreRenderer from './renderers/scoreRenderer.js';
import SnakeRenderer from './renderers/snakeRenderer.js';
import AppleRenderer from './renderers/appleRenderer.js';

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
const playerIdLabel = playerIdInput.labels[0];
const roomIdInput = document.getElementById("room-id");
const roomIdLabel = roomIdInput.labels[0];


let animationHandle, lastFrameTimestamp = null;

let playerId = null;
let currentRoomId = null;
let currentGame = null;

function getGameSettings() {
    const numberOfPlayers = document.getElementById('players').value;
    const numberOfApples = document.getElementById('apples').value;

    return {
        numberOfPlayers,
        numberOfApples,
        canvasHeight: canvas.height,
        canvasWidth: canvas.width,
        playerId
    }
}

function startLocalGame() {


    try {
        const gameSettings = getGameSettings();
        currentGame = new Game(canvas.width, canvas.height, gameSettings.numberOfPlayers, gameSettings.numberOfApples);
        currentGame.start();
        const keyboardListener = new KeyboardListener();

        window.addEventListener("keydown", function (event) {
            keyboardListener.listen(event, currentGame);
        });

        animationHandle = requestAnimationFrame(gameLoop);
    }
    catch (err) {
        alert(err);
    }

}

function startOnlineGame() {
    const keyboardListener = new RemoteKeyboardListener();

    window.addEventListener("keydown", function (event) {
        keyboardListener.listen(event, gameClient, playerId, currentRoomId);
    });

    animationHandle = requestAnimationFrame(gameLoop);
}

async function stopLocalGameStart() {

}

async function stopOnlineGameStart() {
    if (currentRoomId) {
        await gameClient.leaveRoom(currentRoomId, playerId);
    }
}

function stopLocalGameEnd() {


}

function stopOnlineGameEnd() {
    
}	

async function gameLoop(timestamp) {
    const speed = document.getElementById('speed').value;
    if (timestamp < lastFrameTimestamp + (1000 / speed)) {
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

function draw(state) {
    snakeRenderer.draw(state);
    scoreRenderer.draw(state);
    appleRenderer.draw(state);
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
        const height = tv.clientHeight + 5;
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
        const roomCreationResponse  = await gameClient.createRoom(getGameSettings());
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
        playerId = playerIdInput.value;
        currentRoomId = (await gameClient.joinRoom(roomIdToJoinInput.value, playerId)).roomId;
        roomIdInput.value = currentRoomId;
        roomIdLabel.classList.add("active");
        presentation.startGame();
    },
    startGame: function () {
        screen.classList.add("crt");
        scanline.classList.add("scanline");
        tv.style.backgroundColor = "white";
        screen.classList.remove("turn-off");
        startButton.disabled = true;
        stopButton.disabled = false;
        onlineSwitch.disabled = true;
        const startHandler = online.checked ? startOnlineGame : startLocalGame;
        startHandler();
    },
    connectOnlineGame: async function (event) {
        const online = event.target.checked;


        if (online) {
            // connect socket 
            await gameClient.connectAsync();
            playerIdInput.disabled = false;
            
            // playerIdLabel.classList.add("active");
            createRoom.disabled = false;
            joinRoom.disabled = false;
            roomIdToJoinInput.disabled = false;

        } else {
            // disconnect socket
            if (currentRoomId) {
                await gameClient.leaveRoom(currentRoomId, playerId);
                currentRoomId = null;
                roomIdInput.value = "";
                roomIdLabel.classList.remove("active");
                createRoom.disabled = false;
                joinRoom.disabled = false;
                leaveRoom.disabled = true;
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
        const stopHandler = online.checked ? stopOnlineGameStart : stopLocalGameStart;
        await stopHandler();
    },
    stopGameEnd: function () {
        stopGameloop()
        screen.classList.remove("crt");
        scanline.classList.remove("scanline");
        screen.classList.remove("turn-off");
        tv.style.backgroundColor = "white";
        const stopHandler = online.checked ? stopOnlineGameEnd : stopLocalGameEnd;
        stopHandler();
        currentGame = null;
    },
}

export default presentation;