export default class ScoreRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }
    draw(state) {
       
        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Score ", 10, 18);
        for(var snake of state.snakes) {
            this.ctx.fillStyle = snake.color;
            const playerIndex = state.snakes.indexOf(snake);
            const canvasWidthOffset = (playerIndex * 170); 
            this.ctx.fillText(`${snake.playerId}: ${snake.tail.length - 1} bomb:${snake.remainingBombs}`, canvasWidthOffset + 70, 18);
        }
    }
}