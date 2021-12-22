import controls from '../controls.mjs';
 
export default class RemoveKeyboardListener {
 
    async listen(event, gameClient, playerId, roomId) {
        const { key } = event;
        if (!gameClient || !roomId) {   
              return;
        }
        
        var keys = controls[0];
        switch (event.key) {
            case keys.up:
            case keys.down:
            case keys.left:
            case keys.right:
                await gameClient.moveSnake(roomId, playerId, event.key);
                break;
            default:
                break;
        }

    }
}