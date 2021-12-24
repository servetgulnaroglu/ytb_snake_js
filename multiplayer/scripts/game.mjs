import Snake from './snake.mjs';
import Apple from './apple.mjs';

import colors from './colors.mjs';
import controls from './controls.mjs';

export default class Game {
    constructor(gameSettings) {
        this.canvasWidth = gameSettings.canvasWidth;
        this.canvasHeight = gameSettings.canvasHeight;
        this.numberOfPlayers = gameSettings.numberOfPlayers;
        this.numberOfApples = gameSettings.numberOfApples;
        this.snakes = [];
        this.apples = [];
        this.bombs = [];
    }

    initializeApples() {
        for (let i = 0; i < this.numberOfApples; i++) {
            this.addApple();
        }
    }


    getAliveSnakes() {
        return this.snakes.filter(snake => snake.alive);
    }


    removeSnake(playerId) {
        const snake = this.snakes.find(snake => snake.playerId === playerId);

        if (snake) {
            this.snakes.splice(this.snakes.indexOf(snake), 1);
        }
    }

    addSnake(playerId, keyMap) {
        const snakeIndex = this.snakes.length;
        playerId = playerId || `Player${snakeIndex + 1}`;
        const snakeInitialX = (snakeIndex * 100) + 20;
        this.snakes.push(new Snake(playerId, snakeInitialX, 20, 20, colors[snakeIndex], keyMap || controls[snakeIndex]));
        if (this.snakes.length == 1) {
            this.initializeApples();
        }
        return playerId;
    }

    addApple() {
        this.apples.push(new Apple(this.getAliveSnakes(), 20, this.canvasWidth, this.canvasHeight));
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
        if (this.numberOfApples > 10) {
            throw new Error('Too many apples. Limit is 10');
        }

        if (this.numberOfPlayers > colors.length) {
            throw new Error("Too many players. Limit is " + colors.length);
        }
        for (let i = 0; i < this.numberOfPlayers; i++) {
            this.addSnake();
        }

    }

    updateState() {
        this.updateSnakes();
        this.checkCollisions();
        this.checkEatenApples();
        this.checkExplodedBombs();
        return {
            snakes: this.snakes,
            apples: this.apples,
            aliveSnakes: this.getAliveSnakes() || [],
            bombs: this.bombs || [],
        }
    }

    checkExplodedBombs() {
        for (const snake of this.getAliveSnakes()) {
            for (const bomb of this.bombs) {
                if (snake.exploded(bomb)) {
                    snake.die();
                    setTimeout(this.recoverSnake, 5000, snake);
                    this.bombs.splice(this.bombs.indexOf(bomb), 1);
                }
            }
        }
    }

    keyPressed(key, playerId) {

        const snake = playerId ?
        this.snakes.find(snake => snake.playerId == playerId) :
        this.snakes.find(snake => snake.controls.up == key || snake.controls.down == key || snake.controls.left == key || snake.controls.right == key || snake.controls.bomb == key);
        
        if (snake) {
            if (key == snake.controls.bomb) {
                this.dropBomb(snake);
                 }
            else {
                snake.keyDown(key);
            }
        }
    }

    end() {
        this.snakes = [];
        this.apples = [];
        this.bombs = [];
    }

    dropBomb(snake) {
        const bomb = snake.dropBomb();
        if (bomb) {
            this.bombs.push(bomb);
        }

    }
}
