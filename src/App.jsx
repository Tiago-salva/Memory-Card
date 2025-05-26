import { useEffect, useState } from "react";
import "./App.css";
import Home from "./components/Home.jsx";
import Card from "./components/Card.jsx";
import Modal from "./components/Modal.jsx";

function App() {
  // Data from the fetch
  const [characters, setCharacters] = useState([]);

  const [randomCharacters, setRandomCharacters] = useState([]);

  const [selectedCharacters, setSelectedCharacters] = useState([]);

  // Message that will display at the end of the game
  const [message, setMessage] = useState("");

  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  // State that changes if a new character was added
  const [newCharacter, setNewCharacter] = useState(false);

  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [difficulty, setDifficulty] = useState("Easy");

  // Number of cards that will display
  const [numberOfCards, setNumberOfCards] = useState(0);

  // Number of correct answers to win
  const [numberOfHits, setNumberOfHits] = useState(10);

  // UseEffect's
  useEffect(() => {
    if (difficulty === "Easy") {
      setNumberOfCards(3);
      setNumberOfHits(5);
    } else if (difficulty === "Medium") {
      setNumberOfCards(5);
      setNumberOfHits(10);
    } else if (difficulty === "Hard") {
      setNumberOfCards(8);
      setNumberOfHits(16);
    }
  }, [difficulty]);

  useEffect(() => {
    fetch("/characters.json")
      .then((response) => response.json())
      .then((data) => setCharacters(data));
  }, []);

  useEffect(() => {
    if (characters.length > 0 && numberOfCards > 0) {
      selectRandomCharacters(characters, numberOfCards);
    }
  }, [characters, numberOfCards]);

  useEffect(() => {
    if (score > bestScore) setBestScore(score);
  }, [score]);

  useEffect(() => {
    setNewCharacter(true);
  }, [selectedCharacters]);

  // Functions
  function selectRandomCharacters(data, numberOfCards, updated) {
    const charactersNotSelected = data.filter(
      (character) =>
        !(updated || selectedCharacters).some(
          (selected) => selected.name === character.name
        )
    );

    // At least 1 card that wasnt selected
    const guaranteedNew =
      charactersNotSelected[
        Math.floor(Math.random() * charactersNotSelected.length)
      ];
    // Get the rest of the cards
    const pool = data.filter(
      (character) => character.name !== guaranteedNew.name
    );
    const others = [];
    while (others.length < numberOfCards - 1 && pool.length > 0) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      others.push(pool.splice(randomIndex, 1)[0]);
    }

    const finalCards = shuffleArray([guaranteedNew, ...others]);

    setRandomCharacters(finalCards);
  }

  function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  function handleClick(index) {
    setNewCharacter(false);
    const clickedCharacter = randomCharacters[index];

    const alreadySelected = selectedCharacters.some(
      (character) => character.name === clickedCharacter.name
    );

    if (alreadySelected) {
      setMessage("You lose!");
      setGameFinished(true);
    } else {
      const updated = [...selectedCharacters, clickedCharacter];
      const nextScore = score + 1;

      if (nextScore === numberOfHits) {
        setScore(nextScore);
        setSelectedCharacters(updated);
        setMessage("You won!");
        setGameFinished(true);
        setNewCharacter(true);
        return;
      } else {
        setScore(nextScore);
        setSelectedCharacters(updated);
        selectRandomCharacters(characters, numberOfCards, updated);
      }
    }
  }

  function restartGame() {
    setScore(0);
    selectRandomCharacters(characters, numberOfCards);
    setSelectedCharacters([]);
    setGameFinished(false);
    setGameStarted(false);
  }

  return (
    <>
      {gameFinished && (
        <Modal
          gameFinished={gameFinished}
          message={message}
          onClick={restartGame}
          score={score}
        ></Modal>
      )}
      {!gameStarted ? (
        <Home
          gameStarted={gameStarted}
          setGameStarted={setGameStarted}
          setDifficulty={setDifficulty}
        ></Home>
      ) : (
        <main className="game-container">
          <p className="best-score">Best score: {bestScore}</p>
          <img src="/img/title.png" className="game-title"></img>
          <div className="characters-cards-container">
            {randomCharacters.map((character, index) => (
              <Card
                key={index}
                index={index}
                onClick={handleClick}
                image={character.image}
                name={character.name}
                newCharacter={newCharacter}
              />
            ))}
          </div>
          <p className="progress-text">
            {score} / {numberOfHits}
          </p>
        </main>
      )}
    </>
  );
}

export default App;
