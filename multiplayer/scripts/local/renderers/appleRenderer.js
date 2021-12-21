export default class AppleRenderer {
    constructor(game, canvas) {
        this.game = game;
        this.ctx = canvas.getContext('2d');
    }
    draw() {
        for(const apple of this.game.apples) {
            this.ctx.fillStyle = apple.color;
            this.ctx.fillRect(apple.x, apple.y, apple.size, apple.size);
        }
    }
}