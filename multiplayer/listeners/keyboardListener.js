export default class KeyboardListener {
   listenArrows(event, snake) {
      if (event.keyCode === 37) {
         snake.turnLeft();
      } else if (event.keyCode === 38) {
         snake.turnUp();
      } else if (event.keyCode === 39) {
         snake.turnRight();
      } else if (event.keyCode === 40) {
         snake.turnDown();
      }
   }

   listenASDW(event, snake) {
      if (event.keyCode === 65) {
         snake.turnLeft();
      } else if (event.keyCode === 87) {
         snake.turnUp();
      } else if (event.keyCode === 68) {
         snake.turnRight();
      } else if (event.keyCode === 83) {
         snake.turnDown();
      }
   }

   listenFGHT(event, snake) {
      if (event.keyCode === 70) {
         snake.turnLeft();
      } else if (event.keyCode === 84) {
         snake.turnUp();
      } else if (event.keyCode === 72) {
         snake.turnRight();
      } else if (event.keyCode === 71) {
         snake.turnDown();
      }
   }

   listenJKLI(event, snake) {
      if (event.keyCode === 74) {
         snake.turnLeft();
      } else if (event.keyCode === 73) {
         snake.turnUp();
      } else if (event.keyCode === 76) {
         snake.turnRight();
      } else if (event.keyCode === 75) {
         snake.turnDown();
      }
   }

}