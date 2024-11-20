import { useRef, useEffect } from 'react';

export const useGameLoop = (canvasRef, update, draw, setGameTime, fixedTimeStep, isGameRunning) => {
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const lagRef = useRef(0);
  const gameTimeRef = useRef(0);

  const animate = time => {
    if (previousTimeRef.current !== undefined && isGameRunning) {
      const elapsedTime = time - previousTimeRef.current;
      lagRef.current += elapsedTime;

      let updateSteps = 0;
      while (lagRef.current >= fixedTimeStep) {
        update(fixedTimeStep);
        lagRef.current -= fixedTimeStep;
        gameTimeRef.current += fixedTimeStep;
        updateSteps++;

        // Prevent spiral of death
        if (updateSteps > 240) {  // 240 is 8 seconds worth of updates at 30 FPS
          console.warn('Game is running too slowly. Skipping updates to catch up.');
          lagRef.current = 0;
          break;
        }
      }

      setGameTime(gameTimeRef.current);

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        draw(ctx);
      }
    }

    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }

  useEffect(() => {
    if (isGameRunning) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current);
      previousTimeRef.current = undefined;
      lagRef.current = 0;
    }

    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [isGameRunning, update, draw]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, []);
};