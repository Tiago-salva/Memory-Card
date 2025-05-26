import { useEffect, useState } from "react";
import "./App.css";
import Home from "./components/Home.jsx";
import Card from "./components/Card.jsx";
import Modal from "./components/Modal.jsx";

function App() {
  // Se guarda la data del fetch
  const [characters, setCharacters] = useState([]);

  // Se guarda los cards generados aleatoriamente
  const [randomCharacters, setRandomCharacters] = useState([]);

  // Se guarda los cards ya seleccionados
  const [selectedCharacters, setSelectedCharacters] = useState([]);

  const [message, setMessage] = useState("Vamos a jugar!");

  // Puntaje actual y puntaje mas alto
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const [newCharacter, setNewCharacter] = useState(false);

  // Juego
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [difficulty, setDifficulty] = useState("Easy");
  const [numberOfCards, setNumberOfCards] = useState(0);
  const [numberOfHits, setNumberOfHits] = useState(10);

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
    fetch("../public/characters.json")
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

  function selectRandomCharacters(data, numberOfCards, updated) {
    // Son los cards que no fueron seleccionados
    const charactersNotSelected = data.filter(
      (character) =>
        !(updated || selectedCharacters).some(
          (selected) => selected.name === character.name
        )
    );

    console.log(charactersNotSelected);

    // Se consigue un card no seleccionado aleatoriamente
    const guaranteedNew =
      charactersNotSelected[
        Math.floor(Math.random() * charactersNotSelected.length)
      ];

    // Se consiguen el resto de cards excluyendo el guaranteedNew
    const pool = data.filter(
      (character) => character.name !== guaranteedNew.name
    );

    // Se eligen el resto de cards
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
    console.log(clickedCharacter);

    const alreadySelected = selectedCharacters.some(
      (character) => character.name === clickedCharacter.name
    );

    if (alreadySelected) {
      setMessage("Haz perdido");
      setGameFinished(true);
    } else {
      const updated = [...selectedCharacters, clickedCharacter];
      const nextScore = score + 1;

      if (nextScore === numberOfHits) {
        setScore(nextScore);
        setSelectedCharacters(updated);
        setMessage("Haz ganado!");
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

  useEffect(() => {
    setNewCharacter(true);
  }, [selectedCharacters]);

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
          <img src="/src/img/title.png" className="game-title"></img>
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
