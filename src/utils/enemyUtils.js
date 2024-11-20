import { createObstacle } from "./obstacleUtils";

export const createEnemy = (levelEnemy) => ({
  ...levelEnemy,
  speed: 1.2,
  direction: 1,
  movementRange: 200,
  startX: levelEnemy.x,
  lastSpawnTime: 0,
  spawnInterval: 3800,
});

export const updateEnemy = (enemy, gameTime) => {
  const newEnemy = { ...enemy };


  newEnemy.x += newEnemy.speed * newEnemy.direction;


  if (
    newEnemy.x > newEnemy.startX + newEnemy.movementRange ||
    newEnemy.x < newEnemy.startX - newEnemy.movementRange
  ) {
    newEnemy.direction *= -1;
  }

  let newObstacle = null;
 
  if (gameTime - newEnemy.lastSpawnTime > newEnemy.spawnInterval) {
    newObstacle = createObstacle(
      newEnemy.x + newEnemy.width / 2,
      newEnemy.y + newEnemy.height
    );
    newEnemy.lastSpawnTime = gameTime;
  }

  return { updatedEnemy: newEnemy, newObstacle };
};

export const drawEnemy = (ctx, enemy) => {
  ctx.fillStyle = "#FF00FF"; 
  ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
};
