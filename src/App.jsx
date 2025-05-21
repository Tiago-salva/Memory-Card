import { useEffect, useState } from "react";
import "./App.css";
import Card from "./components/Card.jsx";

function App() {
  const [characters, setCharacters] = useState([]);
  const [randomCharacters, setRandomCharacters] = useState([]);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [message, setMessage] = useState("Vamos a jugar!");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  function selectRandomCharacters(data, number) {
    const selected = [];

    while (selected.length < number) {
      const randomIndex = Math.floor(Math.random() * data.length);
      const character = data[randomIndex];

      if (!selected.includes(character)) {
        selected.push(character);
      }
    }

    setRandomCharacters(selected);
  }

  function handleClick(index) {
    const clickedCharacter = randomCharacters[index];
    console.log(clickedCharacter);

    const alreadySelected = selectedCharacters.some(
      (character) => character.name === clickedCharacter.name
    );

    if (alreadySelected) {
      setMessage("Perdiste! Ya habias seleccionado ese personaje");
      setScore(0);
      selectRandomCharacters(characters, 3);
    } else {
      setMessage("Muy bien! Todavia no habias seleccionado ese personaje");
      const updated = [...selectedCharacters, clickedCharacter];
      setSelectedCharacters(updated);
      setScore(score + 1);
      selectRandomCharacters(characters, 3);
    }
  }

  useEffect(() => {
    fetch("../public/characters.json")
      .then((response) => response.json())
      .then((data) => {
        setCharacters(data);
        selectRandomCharacters(data, 3);
      });
  }, []);

  useEffect(() => {
    console.log(selectedCharacters);
  }, [selectedCharacters]);

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
