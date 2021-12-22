import Snake from './snake.mjs';
import Apple from './apple.mjs';

import colors from './colors.mjs';
import controls from './controls.mjs';

export default class Game {
    constructor(canvasWidth, canvasHeight, numberOfPlayers, numberOfApples) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.numberOfPlayers = numberOfPlayers;
        this.numberOfApples = numberOfApples;
        this.snakes = [];
        this.apples = [];
    }

    getAliveSnakes() {
        return this.snakes.filter(snake => snake.alive);
    }

    
    removeSnake(playerId) {
        const snake = this.snakes.find(snake => snake.playerId === playerId);
        if (snake) {
            this.snakes.slice(this.snakes.indexOf(snake), 1);
        }
    }

    addSnake(playerId) {
        const snakeIndex = this.snakes.length;
        playerId = playerId || `Player ${snakeIndex + 1}`;
        const snakeInitialX = (snakeIndex * 100) + 20;
        this.snakes.push(new Snake(playerId, snakeInitialX, 20, 20, colors[snakeIndex], controls[snakeIndex]));
    }

    addApple() {
        this.apples.push(new Apple(this.getAliveSnakes(), 20));
    }

    checkEatenApples() {
        for (const apple of this.apples) {
            for (const snake of this.getAliveSnakes()) {
                if (snake.eat(apple)) {
                    this.apples.splice(this.apples.indexOf(apple), 1);
                    this.addApple();
                    snake.grow();
                }
            }
        }
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
            setTimeout(this.recoverSnake, 5000, snake);
        }
    }

    recoverSnake(snake) {
        snake.alive = true;
    }

    updateSnakes() {
        for (const snake of this.getAliveSnakes()) {
            snake.move();
            this.teleportFromBorders(snake)
        }
    }

    teleportFromBorders(snake) {
        if (snake.head.x <= -snake.size) {
            snake.head.x = this.canvasWidth - snake.size;
        } else if (snake.head.x >= this.canvasWidth) {
            snake.head.x = 0;
        } else if (snake.head.y <= -snake.size) {
            snake.head.y = this.canvasHeight - snake.size;
        } else if (snake.head.y >= this.canvasHeight) {
            snake.head.y = 0;
        }
    }

    start() {
        this.snakes = [];
        this.apples = [];

        if (this.numberOfPlayers > colors.length) {
            throw new Error("Too many players");
        }
        for (let i = 0; i < this.numberOfPlayers; i++) {
            this.addSnake();
        }
        for (let i = 0; i < this.numberOfApples; i++) {
            this.addApple();
        }
    }

    updateState() {
        this.updateSnakes();
        this.checkCollisions();
        this.checkEatenApples();

        return {
            snakes: this.snakes, 
            apples: this.apples,
            aliveSnakes: this.getAliveSnakes()
        }
    }

    keyPressed(key) {
        const snake = this.getAliveSnakes().find(snake => snake.controls.up === key || snake.controls.down === key || snake.controls.left === key || snake.controls.right === key);
        if (snake) {
            switch (key) {
                case snake.controls.up:
                    snake.turnUp();
                    break;
                case snake.controls.down:
                    snake.turnDown();
                    break;
                case snake.controls.left:
                    snake.turnLeft();
                    break;
                case snake.controls.right:
                    snake.turnRight();
                    break;
                default:
                    break;
            }
        }
    }
}
 

 