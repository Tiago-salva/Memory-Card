export default function Card({ index, onClick, image, name, newCharacter }) {
  return (
    <button
      onClick={() => onClick(index)}
      className={newCharacter ? "character-card-front" : "character-card-inner"}
    >
      <div className="character-card-frame">
        <img className="character-card-img" src={image} alt={name} />
        <p className="character-card-name">{name}</p>
      </div>
    </button>
  );
}
