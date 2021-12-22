export default class AppleRenderer {
    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
    }
    draw(state) {
        for(const apple of state.apples) {
            this.ctx.fillStyle = apple.color;
            this.ctx.fillRect(apple.x, apple.y, apple.size, apple.size);
        }
    }
}