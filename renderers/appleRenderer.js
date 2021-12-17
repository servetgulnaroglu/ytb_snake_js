export default class AppleRenderer {
    constructor(game, canvas) {
        this.game = game;
        this.ctx = canvas.getContext('2d');
    }
    draw() {

        this.ctx.fillStyle = this.game.apple.color;
        this.ctx.fillRect(this.game.apple.x, this.game.apple.y, this.game.apple.size, this.game.apple.size);

    }
}