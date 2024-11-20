import React, { useRef, useEffect, useState, useCallback } from "react";
import { useGameLoop } from "../hooks/useGameLoop";
import { useKeyPress } from "../hooks/useKeyPress";
import { createLevel, drawLevel } from "../utils/levelUtils";
import {
  createPlayer,
  updatePlayer,
  drawPlayer,
  loadPlayerSprite,
} from "../utils/playerUtils";
import {
  setupCanvas,
  clearCanvas,
  getCameraOffset,
} from "../utils/canvasUtils";
import {
  updateMovingPlatforms,
  drawMovingPlatforms,
  handleMovingPlatformCollision,
} from "../utils/movingPlatformUtils";
import {
  createEnemy,
  updateEnemy,
  drawEnemy,
} from "../utils/enemyUtils";
import { updateObstacles, drawObstacles } from "../utils/obstacleUtils";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  LEVEL_WIDTH,
  LEVEL_HEIGHT,
  FIXED_TIME_STEP,
  INITIAL_PLAYER_HEALTH,
} from "../constants/gameConstants";
import GameOverScreen from "./GameOverScreen";
import Hearts from "./Hearts";

const Game = ({ onGameOver, onWin }) => {
  const canvasRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [level, setLevel] = useState(null);
  const [enemy, setEnemy] = useState(null);
  const [obstacles, setObstacles] = useState([]);
  const [gameTime, setGameTime] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [isGameRunning, setIsGameRunning] = useState(true);
  const [isShaking, setIsShaking] = useState(false);
  const [shakeOffset, setShakeOffset] = useState({ x: 0, y: 0 });

  const keys = useKeyPress();

  const startShake = useCallback(() => {
    setIsShaking(true);
    let startTime = Date.now();
    const shakeIntensity = 8;
    const shakeDuration = 200;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < shakeDuration) {
        const intensity = shakeIntensity * (1 - elapsed / shakeDuration);
        setShakeOffset({
          x: (Math.random() * 2 - 1) * intensity,
          y: (Math.random() * 2 - 1) * intensity,
        });
        requestAnimationFrame(animate);
      } else {
        setShakeOffset({ x: 0, y: 0 });
        setIsShaking(false);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  const loadGame = useCallback(async (levelNumber) => {
    try {
      await Promise.all([loadPlayerSprite()]);
      const newLevel = createLevel(levelNumber);
      setLevel(newLevel);
      const bottomPlatform = newLevel.platforms[0];
      setPlayer(createPlayer(50, bottomPlatform.y - 32 * 2));
      // Make sure you're passing the enemy data from the level
      setEnemy(createEnemy(newLevel.enemy)); // This line is crucial
      setObstacles([]);
      setIsLoading(false);
      setIsGameRunning(true);
    } catch (err) {
      console.error("Error loading game:", err);
      setError("Error loading game: " + err.message);
    }
  }, []);

  useEffect(() => {
    loadGame(currentLevel);
  }, [currentLevel, loadGame]);

  useEffect(() => {
    if (canvasRef.current) {
      setupCanvas(canvasRef.current);
    }
    document.body.style.backgroundColor = "#000";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  const updateGame = useCallback(
    (deltaTime) => {
      if (!player || !level || !enemy || !isGameRunning) return;

      const updatedPlatforms = updateMovingPlatforms(level.platforms);
      setLevel((prev) => ({ ...prev, platforms: updatedPlatforms }));

      let updatedPlayer = updatePlayer(
        player,
        keys,
        LEVEL_WIDTH,
        LEVEL_HEIGHT,
        updatedPlatforms,
        level.ladders,
        deltaTime
      );

      updatedPlatforms.forEach((platform) => {
        updatedPlayer = handleMovingPlatformCollision(updatedPlayer, platform);
      });

      const { updatedEnemy, newObstacle } = updateEnemy(enemy, gameTime);
      setEnemy(updatedEnemy);

      if (newObstacle) {
        setObstacles((prevObstacles) => [...prevObstacles, newObstacle]);
      }

      setObstacles((prevObstacles) =>
        updateObstacles(prevObstacles, LEVEL_HEIGHT)
      );

      const isColliding = obstacles.some(
        (obstacle) =>
          updatedPlayer.x < obstacle.x + obstacle.width &&
          updatedPlayer.x + updatedPlayer.width > obstacle.x &&
          updatedPlayer.y < obstacle.y + obstacle.height &&
          updatedPlayer.y + updatedPlayer.height > obstacle.y
      );

      if (isColliding) {
        updatedPlayer.health -= 1;
        if (updatedPlayer.health <= 0) {
          setGameOver(true);
          setIsGameRunning(false);
          onGameOver();
        } else {
          startShake();
          setObstacles((prevObstacles) =>
            prevObstacles.filter(
              (obstacle) =>
                !(
                  updatedPlayer.x < obstacle.x + obstacle.width &&
                  updatedPlayer.x + updatedPlayer.width > obstacle.x &&
                  updatedPlayer.y < obstacle.y + obstacle.height &&
                  updatedPlayer.y + updatedPlayer.height > obstacle.y
                )
            )
          );
        }
      }

      setPlayer(updatedPlayer);

      if (Math.abs(updatedPlayer.y - enemy.y) < 10) {
        if (currentLevel < 3) {
          setCurrentLevel((prevLevel) => prevLevel + 1);
        } else {
          setHasWon(true);
          setIsGameRunning(false);
          onWin();
        }
      }

      setGameTime((prevTime) => prevTime + deltaTime);
    },
    [
      player,
      level,
      enemy,
      keys,
      gameTime,
      currentLevel,
      obstacles,
      isGameRunning,
      onGameOver,
      onWin,
      startShake,
    ]
  );

  const drawGame = useCallback(
    (ctx) => {
      if (!ctx || !player || !level || !enemy) return;

      clearCanvas(ctx);

      const { x: cameraX, y: cameraY } = getCameraOffset(
        player.x,
        player.y,
        LEVEL_WIDTH,
        LEVEL_HEIGHT,
        shakeOffset
      );

      ctx.save();
      ctx.translate(-cameraX, -cameraY);

      drawLevel(ctx, level);
      drawMovingPlatforms(ctx, level.platforms);
      drawPlayer(ctx, player);
      drawEnemy(ctx, enemy);
      drawObstacles(ctx, obstacles);

      ctx.restore();

      ctx.font = "16px Arial";
      ctx.fillStyle = "white";
      //   ctx.fillText(`Level: ${currentLevel}`, 10, 20);
      // ctx.fillText(`Time: ${Math.floor(gameTime / 1000)}s`, 10, 40);
    },
    [player, level, enemy, obstacles, shakeOffset]
  );

  useGameLoop(
    canvasRef,
    updateGame,
    drawGame,
    setGameTime,
    FIXED_TIME_STEP,
    isGameRunning
  );

  if (error) return <div>Error: {error}</div>;
  if (isLoading) return <div>Loading level {currentLevel}...</div>;
  if (gameOver) return <GameOverScreen isWin={false} onReturn={onGameOver} />;
  if (hasWon) return <GameOverScreen isWin={true} onReturn={onWin} />;

  return (
    <div
      style={{
        position: "relative",
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
      }}
    >
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
      <div style={{ position: "absolute", top: 10, left: 10 }}>
        <Hearts
          health={player ? player.health : INITIAL_PLAYER_HEALTH}
          isShaking={isShaking}
        />
      </div>
    </div>
  );
};

export default Game;
