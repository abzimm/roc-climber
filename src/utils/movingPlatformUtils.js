// New file: utils/movingPlatformUtils.js

export const createMovingPlatform = ({
  x,
  y,
  width,
  height,
  axis = "x",
  speed = 2,
  min,
  max,
}) => ({
  x,
  y,
  width,
  height,
  axis,
  speed,
  direction: 1,
  min: min ?? (axis === "x" ? x - 100 : y - 100),
  max: max ?? (axis === "x" ? x + 100 : y + 100),
  initialX: x,
  initialY: y,
});

export const updateMovingPlatforms = (platforms) => {
  return platforms.map((platform) => {
    if (!platform.speed) return platform;

    const newPlatform = { ...platform };
    const pos = platform.axis === "x" ? "x" : "y";

    newPlatform[pos] += platform.speed * platform.direction;

    if (newPlatform[pos] <= platform.min) {
      newPlatform[pos] = platform.min;
      newPlatform.direction = 1;
    } else if (newPlatform[pos] >= platform.max) {
      newPlatform[pos] = platform.max;
      newPlatform.direction = -1;
    }

    return newPlatform;
  });
};

export const drawMovingPlatforms = (ctx, platforms) => {
  ctx.fillStyle = "#4a9eff"; // Light blue to distinguish moving platforms
  platforms.forEach((platform) => {
    if (platform.speed) {
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

      // Add visual indicator of movement direction
      ctx.fillStyle = "#2176ff";
      const arrowSize = 8;
      const centerX = platform.x + platform.width / 2;
      const centerY = platform.y + platform.height / 2;

      if (platform.axis === "x") {
        ctx.beginPath();
        ctx.moveTo(centerX - arrowSize, centerY);
        ctx.lineTo(centerX + arrowSize, centerY);
        ctx.lineTo(
          centerX + (platform.direction > 0 ? arrowSize : -arrowSize),
          centerY - arrowSize / 2
        );
        ctx.lineTo(
          centerX + (platform.direction > 0 ? arrowSize : -arrowSize),
          centerY + arrowSize / 2
        );
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - arrowSize);
        ctx.lineTo(centerX, centerY + arrowSize);
        ctx.lineTo(
          centerX - arrowSize / 2,
          centerY + (platform.direction > 0 ? arrowSize : -arrowSize)
        );
        ctx.lineTo(
          centerX + arrowSize / 2,
          centerY + (platform.direction > 0 ? arrowSize : -arrowSize)
        );
        ctx.fill();
      }
    }
  });
};

// Function to make the player move with the platform
export const handleMovingPlatformCollision = (player, platform) => {
  if (!platform.speed) return player;

  const isOnPlatform =
    player.x + player.width > platform.x &&
    player.x < platform.x + platform.width &&
    Math.abs(player.y + player.height - platform.y) <= 2 &&
    player.yVelocity >= 0;

  if (isOnPlatform) {
    if (platform.axis === "x") {
      player.x += platform.speed * platform.direction;
    } else {
      player.y += platform.speed * platform.direction;
    }
  }

  return player;
};
