export default class Snake {
    #rotateX = 0;
    #rotateY = 1;
    #acceptInput = true;
    #y;
    #x;
    constructor(x, y, size, width, height, color) {
        this.#x = x;
        this.#y = y;
        this.size = size;
        this.width = width;
        this.height = height;
        this.color = color;
        this.alive = true;
        this.tail = [{ x: x, y: y }];
        this.head = this.tail[this.tail.length - 1];
    }
    
    move() {
        const newCoordinates = this.#getNextCoordinates();
 
        this.tail.shift();
        this.tail.push(newCoordinates);
        this.head = this.tail[this.tail.length - 1];
        
        this.#acceptInput  = true;
        
        this.#teleportFromBorders();
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
        return (this.head.x === apple.x && this.head.y === apple.y) 
    }

    grow() {
        this.tail[this.tail.length] = this.#getNextCoordinates();
        this.head = this.tail[this.tail.length - 1];
    }

    #getNextCoordinates() {
        let newCoordinates;
        if (this.#rotateX === 1) {
            newCoordinates = {
                x: this.head.x + this.size,
                y: this.head.y
            }
        } else if (this.#rotateX === -1) {
            newCoordinates = {
                x: this.head.x - this.size,
                y: this.head.y
            }
        } else if (this.#rotateY === 1) {
            newCoordinates = {
                x: this.head.x,
                y: this.head.y + this.size
            }
        } else if (this.#rotateY === -1) {
            newCoordinates = {
                x: this.head.x,
                y: this.head.y - this.size
            }
        }
        return newCoordinates;
    }

    hasCollision(otherSnake) {
        if (this !== otherSnake && this.head.x === otherSnake.head.x && this.head.y === otherSnake.head.y) {
            return true;
        }
        for (let i = 0; i < otherSnake.tail.length - 1; i++) {
            if (this.head.x === otherSnake.tail[i].x && this.head.y === otherSnake.tail[i].y) {
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
        this.#rotateX = 0;
        this.#rotateY = 1;
        this.#acceptInput = true;
        this.tail = [{ x: this.#x, y:  this.#y }];
        this.head = this.tail[this.tail.length - 1];
        this.alive = false;
    }
}