import Game from './game.mjs';
import controls from './controls.mjs';
export default class Room {
    constructor(ownerId, roomId, gameSettings) {
        this.ownerId = ownerId;
        this.roomId = roomId;
        this.game = new Game(gameSettings);
        this.speed = gameSettings.speed;
    }

    joinRoom(playerId) {
        //check if player is already in room
        if (this.game.snakes.find(snake => snake.playerId == playerId)) {
            return;
        }

        const acceptedPlayerId = this.game.addSnake(playerId, controls[0]);
        return {
            speed: this.speed,
            roomId: this.roomId,
            playerId: acceptedPlayerId,
        }
    }

    leaveRoom(playerId) {
   
        if (playerId == this.ownerId) {
            this.game.end();
        } else {
            this.game.removeSnake(playerId);
        }
    }

    updateState() {
        return this.game.updateState();
    }

    keyPressed(key, playerId) {
        this.game.keyPressed(key, playerId);
    }

    


} 