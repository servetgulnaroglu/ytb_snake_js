export default class KeyboardListener {
   #listen(event, snake, left, up, right, down) {
      if (event.keyCode === left) {
         snake.turnLeft();
      } else if (event.keyCode === up) {
         snake.turnUp();
      } else if (event.keyCode === right) {
         snake.turnRight();
      } else if (event.keyCode === down) {
         snake.turnDown();
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

   listen(event, snakes) {
      if (snakes.lenfth > 4) {
         return false;
      }
      
      for (let i = 0; i < snakes.length; i++) {
         const snake = snakes[i];
         var keys = this.#keyMap[i];
         this.#listen(event, snake, keys.left, keys.up, keys.right, keys.down);
      }
      return true;
   }
   


}