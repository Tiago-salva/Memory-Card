import { useEffect, useState } from "react";
import "./App.css";
import Home from "./components/Home.jsx";
import Card from "./components/Card.jsx";

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

  // Juego
  const [gameStarted, setGameStarted] = useState(false);
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
    checkWinner();
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
    const clickedCharacter = randomCharacters[index];
    console.log(clickedCharacter);

    const alreadySelected = selectedCharacters.some(
      (character) => character.name === clickedCharacter.name
    );

    if (alreadySelected) {
      restartGame("Perdiste! Ya habias seleccionado ese personaje");
    } else {
      setMessage("Muy bien! Todavia no habias seleccionado ese personaje");
      // Se actualizan los personajes ya seleccionados
      const updated = [...selectedCharacters, clickedCharacter];
      setScore(score + 1);
      setSelectedCharacters(updated);
      selectRandomCharacters(characters, numberOfCards, updated);
    }
  }

  function checkWinner() {
    if (score === numberOfHits) {
      restartGame("Felicitaciones! Haz ganado");
      return;
    }
  }

  function restartGame(message) {
    setMessage(message);
    setScore(0);
    selectRandomCharacters(characters, numberOfCards);
    setSelectedCharacters([]);
  }

  return (
    <>
      {!gameStarted ? (
        <Home
          setGameStarted={setGameStarted}
          setDifficulty={setDifficulty}
        ></Home>
      ) : (
        <>
          <h1 className="message">{message}</h1>
          <div className="characters-cards-container">
            {randomCharacters.map((character, index) => (
              <Card
                key={index}
                index={index}
                onClick={handleClick}
                image={character.image}
                name={character.name}
              />
            ))}
          </div>
          <p className="progress-text">
            {score} / {numberOfHits}
          </p>
        </>
      )}
    </>
  );
}

export default App;
