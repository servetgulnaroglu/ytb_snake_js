import controls from '../controls.mjs';
export default class KeyboardListener {
   listen(event, game) {
      if (!game) {
         return;
      }
      
      for (const keyMap of controls) {
         switch(event.key){
            case keyMap.up:
            case keyMap.down:
            case keyMap.left:
            case keyMap.right:
               game.moveSnakeByKey(event.key);
            default:
               break;
         }
      }
   }



}