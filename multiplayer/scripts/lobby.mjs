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
    createRoom: function (ownerId, gameSettings) {
        const roomId = generateUniqueRoomId();
        rooms[roomId] = new Room(ownerId, roomId, gameSettings);
        return roomId;
    },
    joinRoom(roomId, playerId) {
        rooms[roomId].joinRoom(playerId);
    },
    leaveRoom(roomId, playerId) {
        rooms[roomId].leaveRoom(playerId);
    },
    updateState(roomId) {
        return rooms[roomId].updateState();
    },
    moveSnake(roomId, playerId, key) {
        rooms[roomId].moveSnake(playerId, key);
    },
    
}

export default lobby;