import Snake from '../snake.js';
import Apple from '../apple.js';
import KeyboardListener from './listeners/keyboardListener.js';
import ScoreRenderer from './renderers/scoreRenderer.js';
import SnakeRenderer from './renderers/snakeRenderer.js';
import AppleRenderer from './renderers/appleRenderer.js';
import colors from '../colors.js';

const canvas = document.getElementById("canvas");
let { width, height } = canvas;

// game logic
const game = {
    lastFrameTimestamp: 0,
    maxFPS: 15,
    snakes: [],
    apples: [],
    animationHandle: null,
    getAliveSnakes() {
        return this.snakes.filter(snake => snake.alive);
    },
    addSnake: function () {
        const snakeIndex = game.snakes.length;
        const snakeInitialX = (snakeIndex * 100) + 20;
        game.snakes.push(new Snake(snakeInitialX, 20, 20, width, height, colors[snakeIndex]));
    },
    addApple: function () {
        game.apples.push(new Apple(game.getAliveSnakes(), 20));
    },
    checkEatenApples: function () {
        for (const apple of game.apples) {
            for (const snake of game.getAliveSnakes()) {
                if (snake.eat(apple)) {
                    game.apples.splice(game.apples.indexOf(apple), 1);
                    game.addApple();
                    snake.grow();
                }
            }
        }
    },
    checkCollisions: function () {
        const snakesToDie = [];
        for (const snake of game.getAliveSnakes()) {
            for (const otherSnake of game.getAliveSnakes()) {
                if (snake.hasCollision(otherSnake)) {
                    snakesToDie.push(snake);
                }
            }
        }
        for (const snake of snakesToDie) {
            snake.die();
            setTimeout(game.recoverSnake, 5000, snake);
        }
    },
    recoverSnake: function (snake) {
        snake.alive = true;
    },
    updateSnakes: function () {
        for (const snake of game.getAliveSnakes()) {
            snake.move();
        }
    },
    start: function (numberOfPlayers, numberOfApples, speed) {
        game.snakes = [];
        game.apples = [];
       
        game.maxFPS = speed;
        if (numberOfPlayers > colors.length) {
            throw new Error("Too many players");
        }
        for (let i = 0; i < numberOfPlayers; i++) {
            game.addSnake();
        }
        for (let i = 0; i < numberOfApples; i++) {
            game.addApple();
        }

        game.animationHandle = requestAnimationFrame(game.gameLoop);
    },
    stop: function () {
        cancelAnimationFrame(game.animationHandle);
        game.clearCanvas()
    },
    clearCanvas: function () {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, width, height);
    },

    gameLoop: function (timestamp) {
        if (timestamp < game.lastFrameTimestamp + (1000 / game.maxFPS)) {
            game.animationHandle = requestAnimationFrame(game.gameLoop);
            return;
        }

        game.lastFrameTimestamp = timestamp;
        game.update();
        game.draw();
        game.animationHandle = requestAnimationFrame(game.gameLoop);
    },
    update: function () {
        game.updateSnakes();
        game.checkCollisions();
        game.checkEatenApples();
    },
    draw: function () {
        snakeRenderer.draw();
        scoreRenderer.draw();
        appleRenderer.draw();
    }

}

const scoreRenderer = new ScoreRenderer(game, canvas);
const appleRenderer = new AppleRenderer(game, canvas);
const snakeRenderer = new SnakeRenderer(game, canvas);
const keyboardListener = new KeyboardListener();

window.addEventListener("keydown", function (event) {
    if (!keyboardListener.listen(event, game.snakes)) {
        throw new Error("You cannot listen for more than 4 snakes");
    }
});

 
window.snakeGame = game;
