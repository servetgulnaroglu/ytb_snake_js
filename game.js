const canvas = document.getElementById("canvas")
const canvasContext = canvas.getContext('2d')
const HardButton = document.getElementById('HardMode')
let HardModeOn = false



window.onload = () => {
    gameLoop()
}

function gameLoop() {
    setInterval(show, 1000 / 20) // here 15 is our fps value
}

function show() {
    update()
    draw()
}

function update() {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height)
    snake.move()
    SnakeHitCheck();
    if (HardModeOn) {
        checkHitWallHard()
    } else {
        checkHitWall()
    }
    eatApple()
}

function eatApple() {
    if (snake.tail[snake.tail.length - 1].x == apple.x &&
        snake.tail[snake.tail.length - 1].y == apple.y) {
        snake.tail[snake.tail.length] = {
            x: apple.x,
            y: apple.y
        }
        apple = new Apple();
    }
}

function SnakeHitCheck() {
    let headTail = snake.tail[snake.tail.length - 1];
    for (let i = 0; i < snake.tail.length - 1; i++) {
        if (headTail.x == snake.tail[i].x && headTail.y == snake.tail[i].y) {
            snake = new Snake(20, 20, 20);
        }
    }
}

function checkHitWall() {
    let headTail = snake.tail[snake.tail.length - 1]
    if (headTail.x == -snake.size) {
        headTail.x = canvas.width - snake.size
    } else if (headTail.x == canvas.width) {
        headTail.x = 0
    } else if (headTail.y == -snake.size) {
        headTail.y = canvas.height - snake.size
    } else if (headTail.y == canvas.height) {
        headTail.y = 0
    }
}

function checkHitWallHard() {
    let headTail = snake.tail[snake.tail.length - 1]
    let WallHit = false
    if (headTail.x == -snake.size || headTail.x == canvas.width || headTail.y == -snake.size || headTail.y == canvas.height) {
        WallHit = true
    }
    if (WallHit) {
        record = (snake.tail.length - 1);
        snake = new Snake(20, 20, 20);
    }
}

function draw() {
    createRect(0, 0, canvas.width, canvas.height, "black")

    for (let i = 0; i < snake.tail.length; i++) {
        createRect(snake.tail[i].x + 2.5, snake.tail[i].y + 2.5,
            snake.size - 5, snake.size - 5, "white")
    }

    canvasContext.font = "20px Arial"
    canvasContext.fillStyle = "#00FF42"
    canvasContext.fillText("Score: " + (snake.tail.length - 1), canvas.width - 120, 18)
    createRect(apple.x, apple.y, apple.size, apple.size, apple.color)
}

function createRect(x, y, width, height, color) {
    canvasContext.fillStyle = color
    canvasContext.fillRect(x, y, width, height)

}

window.addEventListener("keydown", (event) => {
    setTimeout(() => {
        if (event.keyCode == 37 && snake.rotateX != 1) {
            snake.rotateX = -1
            snake.rotateY = 0
        } else if (event.keyCode == 38 && snake.rotateY != 1) {
            snake.rotateX = 0
            snake.rotateY = -1
        } else if (event.keyCode == 39 && snake.rotateX != -1) {
            snake.rotateX = 1
            snake.rotateY = 0
        } else if (event.keyCode == 40 && snake.rotateY != -1) {
            snake.rotateX = 0
            snake.rotateY = 1
        }
    }, 1)
})

HardButton.addEventListener('click', function onClick(event) {
    if (HardModeOn) {
        canvas.width = "800"
        canvas.height = "800"
        HardModeOn = false
        event.target.style.color = 'white';
    } else {
        canvas.width = "500"
        canvas.height = "500"
        HardModeOn = true
        event.target.style.color = 'red';
    }
    snake = new Snake(20, 20, 20);
    apple = new Apple();
});

class Snake {
    constructor(x, y, size) {
        this.x = x
        this.y = y
        this.size = size
        this.tail = [{
            x: this.x,
            y: this.y
        }]
        this.rotateX = 0
        this.rotateY = 1
    }

    move() {
        let newRect

        if (this.rotateX == 1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x + this.size,
                y: this.tail[this.tail.length - 1].y
            }
        } else if (this.rotateX == -1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x - this.size,
                y: this.tail[this.tail.length - 1].y
            }
        } else if (this.rotateY == 1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y + this.size
            }
        } else if (this.rotateY == -1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y - this.size
            }
        }

        this.tail.shift()
        this.tail.push(newRect)
    }
}

class Apple {
    constructor() {
        let isTouching

        while (true) {
            isTouching = false;
            this.x = Math.floor(Math.random() * canvas.width / snake.size) * snake.size
            this.y = Math.floor(Math.random() * canvas.height / snake.size) * snake.size

            for (let i = 0; i < snake.tail.length; i++) {
                if (this.x == snake.tail[i].x && this.y == snake.tail[i].y) {
                    isTouching = true
                }
            }

            this.size = snake.size
            this.color = "red"

            if (!isTouching) {
                break;
            }
        }
    }
}

let snake = new Snake(20, 20, 20);
let apple = new Apple();
