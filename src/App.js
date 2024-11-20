import React, { useState, useEffect } from "react";
import Game from "./components/Game";

const StartScreen = ({ onStart }) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === "Space") {
        onStart();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onStart]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        overflow: "hidden",
      }}
    >
      <p
        style={{
          fontFamily: "Courier New, Courier, monospace",
          fontWeight: "bold",
          fontSize: "48px",
          color: "white",
          textTransform: "uppercase",
          letterSpacing: "4px",
          animation: "blink 3s infinite",
          textShadow: "2px 2px 0px #333",
        }}
      >
        Press Space to Start
      </p>
      <p
        style={{
          fontFamily: "Courier New, Courier, monospace",
          fontWeight: "bold",
          fontSize: "32px",
          color: "gray",
          textTransform: "uppercase",
          letterSpacing: "4px",
          textShadow: "2px 2px 0px #333",
        }}
      >
        JOYSTICK TO MOVE, BUTTON TO JUMP
      </p>
      <style>
        {`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

const GameScreen = ({
  type,
  currentLevel,
  onRestart,
  onStart,
  message = "",
}) => {
  if (type === "start") {
    return <StartScreen onStart={onStart} />;
  }

  if (type === "game-over") {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "white",
          fontSize: "24px",
        }}
      >
        <h1>{message}</h1>
        <button
          onClick={onRestart}
          style={{
            fontFamily: "Courier",
            padding: "10px 20px",
            fontSize: "18px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Restart Game
        </button>
      </div>
    );
  }

  return null;
};

function App() {
  const [gameState, setGameState] = useState("start"); // start, playing, game-over
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameMessage, setGameMessage] = useState("");

  React.useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === "Space" && gameState === "start") {
        setGameState("playing");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState]);

  const handleLevelComplete = () => {
    if (currentLevel < 3) {
      setCurrentLevel(currentLevel + 1);
    } else {
      setGameMessage("Congratulations! You've completed all levels!");
      setGameState("game-over");
      setCurrentLevel(1);
    }
  };

  const handleGameOver = () => {
    setGameMessage("Game Over! You ran out of hearts.");
    setGameState("game-over");
  };

  const handleRestart = () => {
    setCurrentLevel(1);
    setGameState("playing");
    setGameMessage("");
  };

  return (
    <div className="App" style={{ position: "relative" }}>
      {gameState === "playing" && (
        <Game
          levelNumber={currentLevel}
          onLevelComplete={handleLevelComplete}
          onGameOver={handleGameOver}
        />
      )}
      <GameScreen
        type={gameState === "playing" ? null : gameState}
        currentLevel={currentLevel}
        onRestart={handleRestart}
        onStart={() => setGameState("playing")}
        message={gameMessage}
      />
    </div>
  );
}

export default App;
