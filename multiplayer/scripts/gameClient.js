import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
let socket = null

async function asyncEmit(eventName, data) {
    return await (new Promise(function (resolve, reject) {
        socket.emit(eventName, data);
        socket.on(eventName, result => {
            socket.off(eventName);
            
            resolve(result);
        });
    })); 
}

const game = {
    connectAsync: async function () {
        const playerId = await (new Promise(function (resolve, reject) {
            try {
                socket = io("/");
                socket.on("connection", (id) => {
                    resolve(id);
                });
               
            } catch (e) {
                reject(e);
            }
        }));

        return playerId;
    },
    disconnectAsync: async function () {
        await (new Promise(function (resolve, reject) {
            try {
                socket.disconnect();
                resolve();
            } catch (e) {
                reject(e);
            }
        }));
    },
    createRoom: async function (gameSettings) {
        return await asyncEmit("createRoom", gameSettings);
    },
    leaveRoom: async function (roomId) {
        return await asyncEmit("leaveRoom", roomId);
    },
    joinRoom: async function (roomId) {
        return await asyncEmit("joinRoom", roomId);
    },
    startGame: async function (roomId) {
        return await asyncEmit("startGame", roomId);
    },
    moveSnake: async function (roomId, direction) {
        return await asyncEmit("moveSnake", {roomId, direction});
    }
}

export default game;