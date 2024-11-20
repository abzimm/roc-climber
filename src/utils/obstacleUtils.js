export const createObstacle = (x, y) => ({
  x,
  y,
  width: 16,
  height: 16,
  speed: 2.2,
});

export const updateObstacles = (obstacles, levelHeight) => {
  return obstacles.filter((obstacle) => {
    obstacle.y += obstacle.speed;
    return obstacle.y < levelHeight;
  });
};

export const drawObstacles = (ctx, obstacles) => {
  ctx.fillStyle = "#00FFFF"; // Cyan color for obstacles
  obstacles.forEach((obstacle) => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
};
