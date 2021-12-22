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
        return room.joinRoom(playerId);
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
    moveSnake(roomId, playerId, key) {
        const room = rooms[roomId];
        if (!room) return;
        room.moveSnake(playerId, key);
    },

}

export default lobby;