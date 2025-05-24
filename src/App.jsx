import { useEffect, useState } from "react";
import "./App.css";
import Card from "./components/Card.jsx";

function App() {
  // Se guarda la data del fetch
  const [characters, setCharacters] = useState([]);

  // Se guarda los cards generados aleatoriamente
  const [randomCharacters, setRandomCharacters] = useState([]);

  // Se guarda los cards ya seleccionados
  const [selectedCharacters, setSelectedCharacters] = useState([]);

  const [message, setMessage] = useState("Vamos a jugar!");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  function selectRandomCharacters(data, number, updated) {
    // Son los cards que no fueron seleccionados
    const charactersNotSelected = data.filter(
      (character) =>
        !(updated || selectedCharacters).some(
          (selected) => selected.name === character.name
        )
    );

    // Si no hay mas personajes para seleccionar,
    if (charactersNotSelected.length === 0) {
      restartGame("Felicitaciones! Haz ganado");
      return;
    }

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
    while (others.length < number - 1 && pool.length > 0) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      others.push(pool.splice(randomIndex, 1)[0]);
    }

    const finalCards = shuffleArray([guaranteedNew, ...others]);
    setRandomCharacters(finalCards);
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
      selectRandomCharacters(characters, 3, updated);

      // setSelectedCharacters((prev) => {
      //   const updated = [...prev, clickedCharacter];
      //   selectRandomCharacters(characters, 3, updated);
      //   return updated;
      // });
    }
  }

  function restartGame(message) {
    setMessage(message);
    setScore(0);
    selectRandomCharacters(characters, 3);
    setSelectedCharacters([]);
  }

  useEffect(() => {
    fetch("../public/characters.json")
      .then((response) => response.json())
      .then((data) => {
        setCharacters(data);
        selectRandomCharacters(data, 3);
      });
  }, []);

  return (
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
        {score} / {characters.length}
      </p>
    </>
  );
}

export default App;
