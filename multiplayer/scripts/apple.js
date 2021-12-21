export default class Apple {
    constructor(snakes, size) {
        this.color = "pink";
        this.size = size;

        this.#setEmptyPlace(snakes);
    }

    #setEmptyPlace(snakes) {
        const snake = snakes[0];
        while (true) {
            const xCandidate = Math.floor(Math.random() * canvas.width / snake.size) * snake.size;
            const yCandidate = Math.floor(Math.random() * (canvas.height) / snake.size) * snake.size;
            if (this.#isEmptyPlace(snakes, xCandidate, yCandidate) && yCandidate > 0) {
                this.x = xCandidate;
                this.y = yCandidate;
                break;
            }
        }
    }

    #isEmptyPlace(snakes, x, y) {
        for (const snake of snakes) {
            for (let i = 0; i < snake.tail.length; i++) {
                if (x === snake.tail[i].x && y === snake.tail[i].y) {
                    return false;
                }
            }
        }
        return true;
    }
    
}