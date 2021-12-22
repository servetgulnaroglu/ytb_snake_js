import Game from './game.mjs';

export default class Room {
    constructor(ownerId, roomId, gameSettings) {
        this.ownerId = ownerId;
        this.roomId = roomId;
        const { numberOfApples, numberOfPlayers, canvasHeight, canvasWidth } = gameSettings 
        this.game = new Game(canvasWidth, canvasHeight, numberOfPlayers, numberOfApples);
    }
 
    joinRoom(playerId) {    
         this.game.addSnake(playerId);
    }

    leaveRoom(playerId) {
        this.game.removeSnake(playerId);
    }

    updateState() {
        return this.game.updateState();
    }

    startGame() {
        this.game.start();
    }
} 