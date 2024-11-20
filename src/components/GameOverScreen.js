import React, { useEffect } from "react";

const GameOverScreen = ({ onReturn, isWin }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onReturn();
    }, 6000);

    return () => clearTimeout(timer);
  }, [onReturn]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        zIndex: 1000,
      }}
    >
      <h1
        style={{
          color: isWin ? "#4CAF50" : "#ff4444",
          fontFamily: "Courier New, Courier, monospace",
          fontSize: "64px",
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: "4px",
          animation: "fadeInOut 3s",
        }}
      >
        {isWin ? "You Win!" : "You Lose!"}
      </h1>
      <p
        style={{
          fontFamily: "Courier New, Courier, monospace",
          fontWeight: "bold",
          fontSize: "32px",
          color: "gray",
          textTransform: "uppercase",
          letterSpacing: "4px",
        }}
      >
        LEADERBOARD ADDED SOON
      </p>
      <p
        style={{
          fontFamily: "Courier New, Courier, monospace",
          fontWeight: "bold",
          fontSize: "32px",
          color: "gray",
          textTransform: "uppercase",
          letterSpacing: "4px",
        }}
      >
        LEAVE IDEAS ON QR CODE!
      </p>
      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: scale(0.5); }
            50% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0.8); }
          }
        `}
      </style>
    </div>
  );
};

export default GameOverScreen;
