// listen to swipe gestures
export default class SwipeGestureListener {
   listen(event, swipeGestureHandler) {

      if (event.type === "touchstart") {
         this.startX = event.touches[0].clientX;
         this.startY = event.touches[0].clientY;
      } else if (event.type === "touchend") {
         this.endX = event.changedTouches[0].clientX;
         this.endY = event.changedTouches[0].clientY;


         this.handleSwipe(swipeGestureHandler);
      }
   }

   SWIPE_MIN_LENGTH = 10;

   handleSwipe(swipeGestureHandler) {
      const xDiff = this.endX - this.startX;
      const yDiff = this.endY - this.startY;
      const swipeLength = Math.sqrt(xDiff * xDiff + yDiff * yDiff);

      if (swipeLength > this.SWIPE_MIN_LENGTH) {
         const swipeDirection = this.getSwipeDirection(xDiff, yDiff);

         swipeGestureHandler(swipeDirection);
      }
   }

   getSwipeDirection(xDiff, yDiff) {
      const angle = this.getAngle(xDiff, yDiff);
      console.log(angle);
      // swipe left
      if (angle <= -45 && angle >= -135) {
         console.log("swipe up");
         return "up";
      }
      // swipe right
      if (angle >= 45 && angle <= 135) {
         console.log("swipe down");

         return "down";
      }
      // swipe down
      if (angle >= -45 && angle <= 45) {
         console.log("swipe right");

         return "right";
      }
      // swipe up
      if (angle >= 135 || angle <= -135) {
         console.log("swipe left");

         return "left";
      }
     
   }

   getAngle(xDiff, yDiff) {
      const angle = Math.atan2(yDiff, xDiff);
      return Math.round(angle * 180 / Math.PI);
   }
}