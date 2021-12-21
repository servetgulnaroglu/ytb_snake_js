// import game
import Room from './room';

const lobby = {  
    rooms: [],
    createRoom: function(ownerId, gameSettings) {
        const roomId = generateUniqueRoomId();
        rooms[roomId] = new Room(ownerId, roomId, gameSettings);
        return roomId;
    },
    generateUniqueRoomId: function() {
        let roomId = Math.floor(Math.random() * 10000);
        while (rooms.hasOwnProperty(roomId)) {
            roomId = Math.floor(Math.random() * 10000);
        }
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
    moveSnake(roomId, playerId, direction) {
        rooms[roomId].moveSnake(playerId, direction);
    },
}

export default lobby;