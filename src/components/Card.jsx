export default function Card({ index, onClick, image, name }) {
  return (
    <div className="character-card-container">
      <button onClick={() => onClick(index)} className="character-card">
        <div className="character-card-frame">
          <img className="character-card-img" src={image} alt={name} />
          <p className="character-card-name">{name}</p>
        </div>
      </button>
    </div>
  );
}
