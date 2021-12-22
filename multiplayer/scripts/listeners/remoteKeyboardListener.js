import controls from '../controls.mjs';
import gameClient from '../gameClient.js';
export default class RemoveKeyboardListener {

    


    listen(event, gameClient, roomId) {
        if (!gameClient || !roomId) {   
              return;
        }
        
        var keys = controls[0];
        switch (event.key) {
            case keys.up:
            case keys.down:
            case keys.left:
            case keys.right:
                this.gameClient.moveSnake(this.roomId, event.key);
                break;
            default:
                break;
        }

    }
}