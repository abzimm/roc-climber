import React from "react";

const Hearts = ({ health, isShaking }) => {
  return (
    <div
      style={{
        animation: isShaking
          ? "shake 0.2s cubic-bezier(.36,.07,.19,.97) both"
          : "none",
      }}
    >
      {[...Array(3)].map((_, index) => (
        <span
          key={index}
          style={{
            color: index < health ? "red" : "gray",
            fontSize: "36px",
            marginRight: "5px",
          }}
        >
          ❤
        </span>
      ))}
      <style>
        {`
          @keyframes shake {
            10%, 90% { transform: translate3d(-2px, 0, 0); }
            20%, 80% { transform: translate3d(4px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
          }
        `}
      </style>
    </div>
  );
};

export default Hearts;
