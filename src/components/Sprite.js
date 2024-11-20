export class Sprite {
  constructor(image, scale = 1.8) {
    this.image = image;
    this.frameWidth = 32;
    this.frameHeight = 32;
    this.columns = 2;
    this.rows = 3;
    this.scale = scale;
    this.animations = {
      run: { startFrame: 0, endFrame: 2, frameDuration: 200 },
      idle: { startFrame: 3, endFrame: 4, frameDuration: 1000 },
      climb: { frame: 5 }, // Single frame for climb, last frame in the spritesheet
    };
    this.currentAnimation = "idle";
    this.currentFrame = this.animations.idle.startFrame;
    this.elapsedTime = 0;
  }

  setAnimation(animationName) {
    if (
      this.animations[animationName] &&
      this.currentAnimation !== animationName
    ) {
      this.currentAnimation = animationName;
      if (animationName === "climb") {
        this.currentFrame = this.animations.climb.frame;
      } else {
        this.currentFrame = this.animations[animationName].startFrame;
      }
      this.elapsedTime = 0;
    }
  }

  update(deltaTime) {
    if (this.currentAnimation !== "climb") {
      const animation = this.animations[this.currentAnimation];
      this.elapsedTime += deltaTime;
      if (this.elapsedTime >= animation.frameDuration) {
        this.currentFrame++;
        if (this.currentFrame > animation.endFrame) {
          this.currentFrame = animation.startFrame;
        }
        this.elapsedTime = 0;
      }
    }
  }

  draw(ctx, x, y, direction = 1) {
    const col = this.currentFrame % this.columns;
    const row = Math.floor(this.currentFrame / this.columns);

    ctx.save();
    ctx.imageSmoothingEnabled = false; // Disable anti-aliasing for crisp pixels
    if (direction === -1 && this.currentAnimation !== "climb") {
      ctx.scale(-1, 1);
      x = -x - this.frameWidth * this.scale;
    }

    ctx.drawImage(
      this.image,
      col * this.frameWidth,
      row * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      Math.round(x),
      Math.round(y),
      this.frameWidth * this.scale,
      this.frameHeight * this.scale
    );

    ctx.restore();
  }
}
