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

const gameClient = {
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
    leaveRoom: async function (roomId, playerId) {
        return await asyncEmit("leaveRoom", { roomId, playerId });
    },
    joinRoom: async function (roomId, playerId) {
        return await asyncEmit("joinRoom", { roomId, playerId });
    },
    keyPressed: function (roomId, key, playerId) {
        return asyncEmit("keyPressed", {roomId, playerId, key});
    },
    updateState: async function (roomId) {
        return await asyncEmit("updateState", roomId);
    },
  
}

export default gameClient;