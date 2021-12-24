import controls from '../controls.mjs';
export default class KeyboardListener {
   listen(event, keyboardHandler) {
      for (const keyMap of controls) {
         switch (event.key) {
            case keyMap.up:
            case keyMap.down:
            case keyMap.left:
            case keyMap.right:
            case keyMap.bomb:
               keyboardHandler(event.key);
            default:
               break;
         }
      }
   }
}