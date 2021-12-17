export default class ScoreRenderer {
    constructor(game, canvas) {
        this.canvas = canvas;
        this.game = game;
        this.ctx = canvas.getContext('2d');
    }
    draw() {
       
        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Score ", 10, 18);
        for(var snake of this.game.snakes) {
            this.ctx.fillStyle = snake.color;
            const playerNumber = this.game.snakes.indexOf(snake) + 1;
            const canvasWidthOffset = ((playerNumber-1) * 80); 
            this.ctx.fillText(`P${playerNumber}: ${snake.tail.length - 1}`, canvasWidthOffset + 70, 18);
        }
    }
}