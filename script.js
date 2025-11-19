let highestZ = 1;

class Paper {
  holdingPaper = false;
  pointerStartX = 0;
  pointerStartY = 0;
  pointerX = 0;
  pointerY = 0;
  prevPointerX = 0;
  prevPointerY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Works for both mouse and touch
    document.addEventListener("pointermove", (e) => {
      if (!this.rotating) {
        this.pointerX = e.clientX;
        this.pointerY = e.clientY;

        this.velX = this.pointerX - this.prevPointerX;
        this.velY = this.pointerY - this.prevPointerY;
      }

      const dirX = e.clientX - this.pointerStartX;
      const dirY = e.clientY - this.pointerStartY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY) || 1;

      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;

      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevPointerX = this.pointerX;
        this.prevPointerY = this.pointerY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    });

    paper.addEventListener("pointerdown", (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.setPointerCapture(e.pointerId);

      paper.style.zIndex = highestZ;
      highestZ += 1;

      if (e.button === 0 || e.button === -1) {
        // left mouse or touch
        this.pointerX = e.clientX;
        this.pointerY = e.clientY;
        this.pointerStartX = this.pointerX;
        this.pointerStartY = this.pointerY;
        this.prevPointerX = this.pointerX;
        this.prevPointerY = this.pointerY;
      }

      if (e.button === 2) {
        this.rotating = true;
      }
    });

    window.addEventListener("pointerup", () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll(".paper"));

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});

// Lightbox / preview click handlers
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

document.querySelectorAll('.preview-img').forEach(img => {
  img.addEventListener('click', (e) => {
    // show full image in lightbox
    lightboxImg.src = img.src;
    lightbox.classList.remove('hidden');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});

lightbox && lightbox.addEventListener('click', () => {
  lightbox.classList.add('hidden');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImg.src = '';
});
