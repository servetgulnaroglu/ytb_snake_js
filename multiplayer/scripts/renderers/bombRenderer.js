export default class BombRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }
    draw(state) {
        for(var bomb of state.bombs)
        {
            this.ctx.fillStyle = bomb.color;
            this.ctx.fillRect(bomb.x, bomb.y, bomb.size, bomb.size);
        }
    }
}