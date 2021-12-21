import Snake from '../snake';
import Apple from '../apple';
import colors from '../colors';

export default class Room {
    constructor(ownerId, roomId, gameSettings) {
        this.ownerId = ownerId;
        this.numberOfPlayers = gameSettings.numberOfPlayers;
        this.numberOfApples = gameSettings.numberOfApples;
        this.roomId = roomId;
        this.canvasWidth = gameSettings.canvasWidth;
        this.canvasHeight = gameSettings.canvasHeight;
        this.state = { snakes: [], apples: initApples() };
    }

    getAliveSnakes() {
        return this.state.snakes.filter(snake => snake.alive);
    }

    initApples() {
        const apples = [];
        for (let i = 0; i < this.numberOfApples; i++) {
            apples.push(new Apple([], 20));
        }
        return apples;
    }

    joinRoom(playerId) {
        const snakeIndex = this.snakes.length;
        const snakeInitialX = (snakeIndex * 100) + 20;
        this.state.snakes[playerId] = new Snake(snakeInitialX, 20, 20, this.canvasWidth, this.canvasHeight, game.colors[snakeIndex]);
    }

    updateState() {
        updateSnakes();
        this.state.diedSnakes = checkCollisions();
        checkEatenApples();
        return this.state;
    }

    updateSnakes() {
        for (const snake of this.getAliveSnakes()) {
            snake.move();
        }
    }

    leaveRoom(playerId) {
        this.state.snakes.splice(this.state.snakes.indexOf(playerId), 1);
    }

    checkCollisions() {
        const snakesToDie = [];
        for (const snake of this.getAliveSnakes()) {
            for (const otherSnake of this.getAliveSnakes()) {
                if (snake.hasCollision(otherSnake)) {
                    snakesToDie.push(snake);
                }
            }
        }
        for (const snake of snakesToDie) {
            snake.die();
             
        }
        return snakesToDie;

    }

    checkEatenApples() {
        for (const apple of this.state.apples) {
            for (const snake of this.getAliveSnakes()) {
                if (snake.eat(apple)) {
                    this.state.apples.splice(this.state.apples.indexOf(apple), 1);
                    this.state.addApple();
                    snake.grow();
                }
            }
        }
    }

    addApple() { 
        this.state.apples.push(new Apple(this.getAliveSnakes(), 20));
    }

    moveSnake(playerId, direction) {
        switch(direction)
        {
            case 'up':
                this.state.snakes[playerId].moveUp();
                break;
            case 'down':
                this.state.snakes[playerId].moveDown();
                break;
            case 'left':
                this.state.snakes[playerId].moveLeft();
                break;
            case 'right':
                this.state.snakes[playerId].moveRight();
                break;
        }
    }
} 