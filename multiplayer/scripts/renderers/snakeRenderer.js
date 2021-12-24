export default class SnakeRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    draw(state) {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (var snake of state.aliveSnakes) {
            this.ctx.fillStyle = snake.color;
            snake.tail.forEach(part => {
                this.ctx.fillRect(part.x + 2.5, part.y + 2.5, snake.size - 5, snake.size - 5);
            });
        }

    }
}