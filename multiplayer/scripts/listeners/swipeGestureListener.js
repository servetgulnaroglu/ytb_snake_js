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

   SWIPE_MIN_LENGTH = 150;

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
      switch (angle) {
         case 0:
            return "right";
         case 1:
            return "up";
         case 2:
            return "down";
         case 3:
            return "left";
      }
     
   }

   getAngle(xDiff, yDiff) {
      return Math.abs(Math.round(Math.atan2(yDiff, xDiff)));
   }
}