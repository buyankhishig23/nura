let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchX = 0;
  touchY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    const isTouchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints;

    const startEvent = isTouchDevice ? 'touchstart' : 'mousedown';
    const moveEvent = isTouchDevice ? 'touchmove' : 'mousemove';
    const endEvent = isTouchDevice ? 'touchend' : 'mouseup';

    document.addEventListener(moveEvent, (e) => {
      e.preventDefault(); // Prevent default touch behavior

      const touch = isTouchDevice ? e.touches[0] : e;
      
      if(!this.rotating) {
        this.touchX = touch.clientX;
        this.touchY = touch.clientY;
        
        this.velX = this.touchX - this.prevTouchX;
        this.velY = this.touchY - this.prevTouchY;
      }
        
      const dirX = touch.clientX - this.touchX;
      const dirY = touch.clientY - this.touchY;
      const dirLength = Math.sqrt(dirX*dirX+dirY*dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if(this.rotating) {
        this.rotation = degrees;
      }

      if(this.holdingPaper) {
        if(!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevTouchX = this.touchX;
        this.prevTouchY = this.touchY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    })

    paper.addEventListener(startEvent, (e) => {
      e.preventDefault(); // Prevent default touch behavior
      if(this.holdingPaper) return; 
      this.holdingPaper = true;
      
      paper.style.zIndex = highestZ;
      highestZ += 1;
      
      const touch = isTouchDevice ? e.touches[0] : e;

      this.touchX = touch.clientX;
      this.touchY = touch.clientY;
      this.prevTouchX = this.touchX;
      this.prevTouchY = this.touchY;

      if(isTouchDevice && e.touches.length > 1) {
        this.rotating = true;
      }
    });
    
    window.addEventListener(endEvent, () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
