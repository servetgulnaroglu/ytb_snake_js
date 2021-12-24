// import game
import Room from './room.mjs';

const rooms = {};

function generateUniqueRoomId() {
    let roomId = Math.floor(Math.random() * 10000);
    while (rooms.hasOwnProperty(roomId)) {
        roomId = Math.floor(Math.random() * 10000);
    }
    return roomId;
}

const lobby = {
    createRoom: function (gameSettings) {
        const roomId = generateUniqueRoomId();
        rooms[roomId] = new Room(gameSettings.playerId, roomId, gameSettings);
        return roomId;
    },
    joinRoom(roomId, playerId) {
        const room = rooms[roomId];
        if (!room) return;
        const joinRoomResponse = room.joinRoom(playerId);
        return joinRoomResponse;
    },
    leaveRoom(roomId, playerId) {
        const room = rooms[roomId];
        if (!room) return;
        room.leaveRoom(playerId);
        if (room.ownerId == playerId) {
            delete rooms[roomId];
        }
    },
    updateState(roomId) {
        const room = rooms[roomId];
        if (!room) return;
        return room.updateState();

    },
    keyPressed(roomId, key, playerId) {
        const room = rooms[roomId];
        if (!room) return;
        room.keyPressed(key, playerId);
    },
    

}

export default lobby;