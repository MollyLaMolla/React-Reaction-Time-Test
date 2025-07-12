function GreenClickText() {
  return (
    <div className="green-click">
      <h1 className="points">...</h1>
      <h2>Click!</h2>
    </div>
  );
}

function WaitingGreenText() {
  return (
    <div className="wait-green">
      <h1 className="points">...</h1>
      <h2>Wait for green</h2>
    </div>
  );
}

export { GreenClickText, WaitingGreenText };
// This component displays the text shown when the user should click on the green box.
