export default class Snake {
    rotateX = 0;
    rotateY = 1;
    acceptInput = true;
    y;
    x;
    constructor(playerId, x, y, size, color, controls) {
        this.playerId = playerId;
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.alive = true;
        this.tail = [{ x: x, y: y }];
        this.head = this.tail[this.tail.length - 1];
        this.controls = controls;

        this.remainingBombs = 3;
    }

    move() {
        const newCoordinates = this.getNextCoordinates();

        this.tail.shift();
        this.tail.push(newCoordinates);
        this.head = this.tail[this.tail.length - 1];

        this.acceptInput = true;
    }

    keyDown(key) {
        switch (key) {
            case this.controls.up:
                this.turnUp();
                break;
            case this.controls.down:
                this.turnDown();
                break;
            case this.controls.left:
                this.turnLeft();
                break;
            case this.controls.right:
                this.turnRight();
                break;
            default:
                break;
        }
    }

    turnLeft() {
        if (!this.acceptInput || this.rotateX === 1)
            return;

        this.rotateX = -1;
        this.rotateY = 0;
        this.acceptInput = false;
    }

    turnUp() {
        if (!this.acceptInput || this.rotateY === 1)
            return;

        this.rotateX = 0;
        this.rotateY = -1;
        this.acceptInput = false;
    }

    turnRight() {
        if (!this.acceptInput || this.rotateX === -1)
            return;

        this.rotateX = 1;
        this.rotateY = 0;
        this.acceptInput = false;
    }

    turnDown() {
        if (!this.acceptInput || this.rotateY === -1)
            return;

        this.rotateX = 0;
        this.rotateY = 1;
        this.acceptInput = false;
    }

    eat(apple) {
        return (this.head.x === apple.x && this.head.y === apple.y)
    }

    grow() {
        this.tail[this.tail.length] = this.getNextCoordinates();
        this.head = this.tail[this.tail.length - 1];
    }

    getNextCoordinates() {
        let newCoordinates;
        if (this.rotateX === 1) {
            newCoordinates = {
                x: this.head.x + this.size,
                y: this.head.y
            }
        } else if (this.rotateX === -1) {
            newCoordinates = {
                x: this.head.x - this.size,
                y: this.head.y
            }
        } else if (this.rotateY === 1) {
            newCoordinates = {
                x: this.head.x,
                y: this.head.y + this.size
            }
        } else if (this.rotateY === -1) {
            newCoordinates = {
                x: this.head.x,
                y: this.head.y - this.size
            }
        }
        return newCoordinates;
    }

    exploded(bomb) {
        return (this.head.x === bomb.x && this.head.y === bomb.y)
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

    die() {
        this.rotateX = 0;
        this.rotateY = 1;
        this.acceptInput = true;
        this.tail = [{ x: this.x, y: this.y }];
        this.head = this.tail[this.tail.length - 1];
        this.alive = false;
    }

    recoverBomb() {
        setTimeout(() => {
            this.remainingBombs++;
        }, 10000);
    }

    //drop bomb right after the tail
    dropBomb() {
        if (this.remainingBombs > 0) {
            const bombPosition = this.tail[this.tail.length - 1];
            const bombDropped = { x: bombPosition.x, y: bombPosition.y, color: this.color, size: this.size - 5 };
            this.remainingBombs--;
            this.recoverBomb();
            return bombDropped;
        }
        return null;
    }
}