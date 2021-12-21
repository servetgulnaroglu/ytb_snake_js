export default class RemoveKeyboardListener {
    // constructor with socket io client
    consctructor(socket, roomId, playerId) {
        this.socket = socket;
        this.roomId = roomId;
        this.playerId = playerId;
    }

    #listen(event, left, up, right, down) {
        if (event.keyCode === left) {
            this.socket.emit('moveSnake', this.roomId, this.playerId, 'left');
        } else if (event.keyCode === up) {
            this.socket.emit('moveSnake', this.roomId, this.playerId, 'up');
        } else if (event.keyCode === right) {
            this.socket.emit('moveSnake', this.roomId, this.playerId, 'right');
        } else if (event.keyCode === down) {
            this.socket.emit('moveSnake', this.roomId, this.playerId, 'down');
        }
    }

    #keyMap = [
        {
            left: 37,
            up: 38,
            right: 39,
            down: 40
        },
        {
            left: 65,
            up: 87,
            right: 68,
            down: 83
        },
        {
            left: 70,
            up: 84,
            right: 72,
            down: 71
        },
        {
            left: 74,
            up: 73,
            right: 76,
            down: 75
        }
    ]

    listen(event) {

        var keys = this.#keyMap[0];
        this.#listen(event, snake, keys.left, keys.up, keys.right, keys.down);

        return true;
    }
}