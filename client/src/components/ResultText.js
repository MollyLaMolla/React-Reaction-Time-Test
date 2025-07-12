function ResultText({ result }) {
  return (
    <div className="result">
      <h1>🕓</h1>
      <h2>{result}ms</h2>
      <p>Click to keep going</p>
    </div>
  );
}

export default ResultText;
// This component displays the final result of the reaction time test.
