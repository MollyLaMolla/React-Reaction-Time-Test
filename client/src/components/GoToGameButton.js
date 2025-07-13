import "./GoToGameButton.css";

function GoToGameButton({ user }) {
  const handleGoToGame = () => {
    window.location.href = "/";
  };

  return (
    <button
      className={`go-to-game-button ${user !== null && "centered"}`}
      onClick={handleGoToGame}
    >
      <span className="go-to-game-icon">⚡</span>
      <span className="go-to-game-text">Reaction Time test</span>
    </button>
  );
}

export default GoToGameButton;
// This component provides a button to navigate back to the game page.
