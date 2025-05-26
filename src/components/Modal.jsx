import { useEffect, useState } from "react";

export default function Modal({ gameFinished, message, onClick, score }) {
  return (
    <div className={"end-game-modal-container"}>
      <div
        className={
          gameFinished ? "end-game-modal-displayed" : "end-game-modal-hidden"
        }
      >
        <h2 className="modal-title">{message}</h2>
        <p className="modal-final-score">{`Your final score is: ${score}`}</p>
        <img src="/img/chicken.png" className="chicken-img" alt="chicken"></img>
        <button className="modal-btn" onClick={() => onClick()}>
          Restart
        </button>
      </div>
    </div>
  );
}
