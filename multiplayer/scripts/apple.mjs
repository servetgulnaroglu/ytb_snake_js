export default class Apple {
    constructor(snakes, size, width, height) {
        this.color = "pink";
        this.size = size;
        this.width = width;
        this.height = height;
        this.setEmptyPlace(snakes);
    }

    setEmptyPlace(snakes) {
        

        while (true) {
            
            const xCandidate = Math.floor(Math.random() * this.width / this.size) * this.size;
            const yCandidate = Math.floor(Math.random() * this.height / this.size) * this.size;
         
            if (this.isEmptyPlace(snakes, xCandidate, yCandidate) && yCandidate > 0) {
                this.x = xCandidate;
                this.y = yCandidate;
                break;
            }
        }
    }

    isEmptyPlace(snakes, x, y) {
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