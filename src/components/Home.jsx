import { useEffect, useState } from "react";

export default function Home({ setGameStarted, setDifficulty }) {
  const [showTitle, setShowTitle] = useState(false);
  const difficulties = [
    {
      id: 0,
      className: "easy",
      difficulty: "Easy",
    },
    {
      id: 1,
      className: "medium",
      difficulty: "Medium",
    },
    {
      id: 2,
      className: "hard",
      difficulty: "Hard",
    },
  ];

  function startGame(difficulty) {
    setDifficulty(difficulty);
    setGameStarted(true);
  }

  useEffect(() => {
    setShowTitle(true);
  }, []);

  return (
    <div className="home-container">
      <img
        src="/img/title.png"
        className={`${showTitle ? "home-title-displayed" : "home-title"}`}
      ></img>
      <div className="difficulty-container">
        {difficulties.map((btn) => (
          <button
            key={btn.id}
            onClick={() => startGame(btn.difficulty)}
            className={`difficulty-btn-${btn.className}`}
          >
            {btn.difficulty}
          </button>
        ))}
      </div>
    </div>
  );
}
