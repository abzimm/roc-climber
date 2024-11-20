import { CANVAS_HEIGHT } from "../constants/gameConstants";

// Constants
const PLATFORM_HEIGHT = 12;
export const LEVEL_HEIGHT = CANVAS_HEIGHT * 2;

// Platform factory function
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

// Level definitions
const LEVELS = [
  {
    platforms: [
      { x: 0, y: 580, width: 800, height: PLATFORM_HEIGHT },
      { x: 100, y: 460, width: 600, height: PLATFORM_HEIGHT },
      createMovingPlatform({
        x: 300,
        y: 340,
        width: 170,
        height: PLATFORM_HEIGHT,
        axis: "x",
        speed: 2,
      }),
      { x: 650, y: 340, width: 600, height: PLATFORM_HEIGHT },
      { x: 240, y: 220, width: 110, height: PLATFORM_HEIGHT },
      { x: 100, y: 100, width: 600, height: PLATFORM_HEIGHT },
    ],
    ladders: [
      { x: 150, y: 460, height: 120 },
      { x: 650, y: 340, height: 120 },
      { x: 350, y: 220, height: 80 },
      { x: 150, y: 100, height: 64 },
    ],
    enemy: { x: 350, y: 68, width: 32, height: 32 },
    advancedEnemy: { x: 500, y: 68, width: 32, height: 32 },
  },
  {
    platforms: [
      { x: 0, y: 580, width: 800, height: PLATFORM_HEIGHT },
      { x: 0, y: 460, width: 300, height: PLATFORM_HEIGHT },
      createMovingPlatform({
        x: 500,
        y: 460,
        width: 200,
        height: PLATFORM_HEIGHT,
        axis: "x",
        speed: 2.5,
        min: 400,
        max: 600,
      }),
      createMovingPlatform({
        x: 200,
        y: 340,
        width: 200,
        height: PLATFORM_HEIGHT,
        axis: "y",
        speed: 1.8,
        min: 300,
        max: 400,
      }),
      { x: 0, y: 220, width: 300, height: PLATFORM_HEIGHT },
      { x: 500, y: 220, width: 300, height: PLATFORM_HEIGHT },
      { x: 200, y: 100, width: 400, height: PLATFORM_HEIGHT },
    ],
    ladders: [
      { x: 250, y: 460, height: 120 },
      { x: 550, y: 460, height: 120 },
      { x: 350, y: 340, height: 120 },
      { x: 250, y: 220, height: 120 },
      { x: 550, y: 220, height: 120 },
      { x: 0, y: 100, height: 100 },
    ],
    enemy: { x: 380, y: 68, width: 32, height: 32 },
    advancedEnemy: { x: 250, y: 68, width: 32, height: 32 },
  },
  {
    platforms: [
      { x: 0, y: 580, width: 800, height: PLATFORM_HEIGHT },
      createMovingPlatform({
        x: 100,
        y: 500,
        width: 200,
        height: PLATFORM_HEIGHT,
        axis: "x",
        speed: 3,
        min: 50,
        max: 250,
      }),
      createMovingPlatform({
        x: 500,
        y: 500,
        width: 200,
        height: PLATFORM_HEIGHT,
        axis: "x",
        speed: 3,
        min: 450,
        max: 650,
      }),
      { x: 300, y: 420, width: 200, height: PLATFORM_HEIGHT },
      createMovingPlatform({
        x: 100,
        y: 340,
        width: 200,
        height: PLATFORM_HEIGHT,
        axis: "y",
        speed: 2,
        min: 300,
        max: 380,
      }),
      createMovingPlatform({
        x: 500,
        y: 340,
        width: 200,
        height: PLATFORM_HEIGHT,
        axis: "y",
        speed: 2,
        min: 300,
        max: 380,
      }),
      { x: 300, y: 260, width: 200, height: PLATFORM_HEIGHT },
      { x: 100, y: 180, width: 200, height: PLATFORM_HEIGHT },
      { x: 500, y: 180, width: 200, height: PLATFORM_HEIGHT },
      { x: 300, y: 100, width: 200, height: PLATFORM_HEIGHT },
    ],
    ladders: [
      { x: 150, y: 500, height: 80 },
      { x: 550, y: 500, height: 80 },
      { x: 350, y: 420, height: 80 },
      { x: 150, y: 340, height: 80 },
      { x: 550, y: 340, height: 80 },
      { x: 350, y: 260, height: 80 },
      { x: 150, y: 180, height: 80 },
      { x: 550, y: 180, height: 80 },
    ],
    enemy: { x: 380, y: 68, width: 32, height: 32 },
    advancedEnemy: { x: 180, y: 68, width: 32, height: 32 },
  },
];

// Level creation
export const createLevel = (levelNumber) => {
  const validLevelNumber = Math.max(1, Math.min(levelNumber, LEVELS.length));
  const levelIndex = validLevelNumber - 1;
  const level = LEVELS[levelIndex];

  if (!level) {
    throw new Error(`Level ${validLevelNumber} not found`);
  }

  return level;
};

// Drawing functions
const drawMovingPlatformIndicator = (ctx, platform) => {
  const arrowSize = 8;
  ctx.fillStyle = "#2176ff";

  if (platform.axis === "x") {
    ctx.beginPath();
    ctx.moveTo(-arrowSize, 0);
    ctx.lineTo(arrowSize, 0);
    ctx.lineTo(platform.direction > 0 ? arrowSize : -arrowSize, -arrowSize / 2);
    ctx.lineTo(platform.direction > 0 ? arrowSize : -arrowSize, arrowSize / 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(0, -arrowSize);
    ctx.lineTo(0, arrowSize);
    ctx.lineTo(-arrowSize / 2, platform.direction > 0 ? arrowSize : -arrowSize);
    ctx.lineTo(arrowSize / 2, platform.direction > 0 ? arrowSize : -arrowSize);
    ctx.fill();
  }
};

const drawPlatform = (ctx, platform) => {
  ctx.fillStyle = platform.speed ? "#4a9eff" : "#7e7e7e";

  ctx.save();
  ctx.translate(
    platform.x + platform.width / 2,
    platform.y + platform.height / 2
  );

  if (platform.rotation) {
    ctx.rotate((platform.rotation * Math.PI) / 180);
  }

  ctx.fillRect(
    -platform.width / 2,
    -platform.height / 2,
    platform.width,
    platform.height
  );

  if (platform.speed) {
    drawMovingPlatformIndicator(ctx, platform);
  }

  ctx.restore();
};

const drawLadder = (ctx, ladder) => {
  ctx.save();
  ctx.translate(ladder.x + 10, ladder.y + ladder.height / 2);

  if (ladder.rotation) {
    ctx.rotate((ladder.rotation * Math.PI) / 180);
  }

  // Draw vertical sides
  ctx.fillRect(-10, -ladder.height / 2, 4, ladder.height);
  ctx.fillRect(8, -ladder.height / 2, 4, ladder.height);

  // Draw rungs
  for (let y = -ladder.height / 2; y < ladder.height / 2; y += 18) {
    ctx.fillRect(-10, y, 20, 4);
  }

  ctx.restore();
};

export const drawLevel = (ctx, level) => {
  if (!level?.platforms) {
    throw new Error("Invalid level structure");
  }

  // Draw platforms
  level.platforms.forEach((platform) => drawPlatform(ctx, platform));

  // Draw ladders
  if (level.ladders) {
    ctx.fillStyle = "#FFA500";
    level.ladders.forEach((ladder) => drawLadder(ctx, ladder));
  }
};
