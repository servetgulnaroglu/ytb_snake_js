export default class Snake {
    #rotateX = 0;
    #rotateY = 1;
    #acceptInput = true;

    constructor(x, y, size, width, height, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.width = width;
        this.height = height;
        this.color = color;
        
        this.tail = [{ x: x, y: y }];
        this.head = this.tail[this.tail.length - 1];
    }

    move() {
        const newCoordinates = this.#getNextCoordinates();
        this.x = newCoordinates.x;
        this.y = newCoordinates.y;
        
        this.tail.shift();
        this.tail.push(newCoordinates);
        this.head = this.tail[this.tail.length - 1];
        
        this.#acceptInput  = true;
        
        this.#teleportFromBorders();
        return !this.#hasBodyCollision();
    }

    turnLeft() {
        if (!this.#acceptInput || this.#rotateX === 1)
            return;

        this.#rotateX = -1;
        this.#rotateY = 0;
        this.#acceptInput  = false;
    }

    turnUp() {
        if (!this.#acceptInput || this.#rotateY === 1)
            return;

        this.#rotateX = 0;
        this.#rotateY = -1;
        this.#acceptInput  = false;
    }

    turnRight() {
        if (!this.#acceptInput  || this.#rotateX === -1)
            return;

        this.#rotateX = 1;
        this.#rotateY = 0;
        this.#acceptInput  = false;
    }

    turnDown() {
        if (!this.#acceptInput  || this.#rotateY === -1)
            return;

        this.#rotateX = 0;
        this.#rotateY = 1;
        this.#acceptInput  = false;
    }

    eat(apple) {
        if (this.head.x === apple.x && this.head.y === apple.y) {
            this.tail[this.tail.length] = this.#getNextCoordinates();
            this.head = this.tail[this.tail.length - 1];
            return true;
        }
        return false;
    }

    #getNextCoordinates() {
        let newCoordinates;
        if (this.#rotateX === 1) {
            newCoordinates = {
                x: this.tail[this.tail.length - 1].x + this.size,
                y: this.tail[this.tail.length - 1].y
            }
        } else if (this.#rotateX === -1) {
            newCoordinates = {
                x: this.tail[this.tail.length - 1].x - this.size,
                y: this.tail[this.tail.length - 1].y
            }
        } else if (this.#rotateY === 1) {
            newCoordinates = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y + this.size
            }
        } else if (this.#rotateY === -1) {
            newCoordinates = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y - this.size
            }
        }
        return newCoordinates;
    }

    #hasBodyCollision() {
        for (let i = 1; i < this.tail.length - 1; i++) {
            if (this.head.x === this.tail[i].x && this.head.y === this.tail[i].y) {
                return true;
            }
        }
        return false;
    }

    #teleportFromBorders() {
        if (this.head.x <= -this.size) {
            this.head.x = this.width - this.size;
        } else if (this.head.x >= this.width) {
            this.head.x = 0;
        } else if (this.head.y <= -this.size) {
            this.head.y = this.height - this.size;
        } else if (this.head.y >= this.height) {
            this.head.y = 0;
        }
    }

    die() {
        this.tail = [{ x: this.x, y: this.y }];
        this.head = this.tail[this.tail.length - 1];
    }
}