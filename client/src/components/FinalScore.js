import { useState, useEffect, useRef } from "react";
import "./FinalScore.css"; // Import the CSS file for styling
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function FinalScore({ hooks }) {
  const { user } = hooks;
  const [isScoresUpdated, setIsScoresUpdated] = useState(false);
  const [bestScore, setBestScore] = useState(undefined);
  const hasUpdatedScores = useRef(false);
  const [leaderboardPosition, setLeaderboardPosition] = useState(null);
  const [percentilePlacement, setPercentilePlacement] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showFinal, setShowFinal] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => setShowFinal(true), 10); // breve delay per attivare la transizione
    }
  }, [isLoading]);

  useEffect(() => {
    let cancelled = false;
    const doUpdate = async () => {
      if (user !== null && !hasUpdatedScores.current && !cancelled) {
        console.log("User is logged in, proceeding to update scores.");
        try {
          const response = await fetch(
            "https://react-reaction-time-test.onrender.com/api/check-and-update-best-score",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                avgScore: hooks.averageScore,
              }),
            }
          );
          const data = await response.json();
          if (data.success) {
            if ("position" in data) setLeaderboardPosition(data.position);
            if ("percentile" in data) setPercentilePlacement(data.percentile);
            if ("totalUsers" in data) setTotalUsers(data.totalUsers);
            if (data.updated) {
              console.log("User scores updated successfully.");
              setIsScoresUpdated(true);
              toast.success(
                <div style={{ fontSize: "1.1rem" }}>
                  🏅 <strong>New Record!</strong> <br />
                  You've saved {hooks.averageScore}ms!
                </div>,
                {
                  icon: "🚀",
                  style: {
                    backgroundColor: "#1abc9c",
                    color: "white",
                    padding: "12px",
                    borderRadius: "8px",
                  },
                }
              );
            } else {
              console.log("No update needed, best score remains the same.");
              setBestScore(data.bestScore);
              toast.info(
                <div style={{ fontSize: "1.05rem" }}>
                  💡 <strong>No new record.</strong> <br />
                  Keep trying to beat your best score!
                </div>,
                {
                  icon: "📊",
                  style: {
                    backgroundColor: "#3498db", // blue
                    color: "#ffffff",
                    padding: "12px",
                    borderRadius: "8px",
                  },
                }
              );
            }
          } else {
            console.error("Failed to update user scores:", data.message);
            toast.error(
              <div style={{ fontSize: "1.05rem" }}>
                ❌ <strong>Update Failed</strong> <br />
                There was a problem saving your score.
              </div>,
              {
                icon: "⚠️",
                style: {
                  backgroundColor: "#e74c3c", // red
                  color: "#fff",
                  padding: "12px",
                  borderRadius: "8px",
                },
              }
            );
          }
        } catch (error) {
          console.error("Error updating user scores:", error);
        }
        console.log("Scores update process completed.");
        hasUpdatedScores.current = true; // Mark that scores have been updated
        setIsLoading(false); // Set loading to false after the update
      } else if (user === null) {
        console.log("User is not logged in, skipping scores update.");
        toast.info(
          <div style={{ fontSize: "1.05rem" }}>
            🔐 <strong>You're not logged in.</strong> <br />
            Please log in to save your score.
          </div>,
          {
            icon: "🔒",
            style: {
              backgroundColor: "#2980b9",
              color: "#fff",
              padding: "12px",
              borderRadius: "8px",
            },
          }
        );
        setIsLoading(false); // Set loading to false even if user is not logged in
      }
    };
    doUpdate();
    return () => {
      cancelled = true; // Cleanup function to prevent state updates if component unmounts
    };
  }, [user, hooks.averageScore]);

  return (
    <>
      {isLoading && (
        <div className="loader">
          <span className="spinner"></span>
          <p>Updating your score and rank...</p>
        </div>
      )}
      {!isLoading && (
        <div className={`final-score ${showFinal ? "fade-in" : ""}`}>
          <h1 className="h1-emoji">⚡</h1>
          <h2>Reaction Time</h2>
          <h1 className="average-score">{hooks.averageScore}ms</h1>
          <p>
            Best Score:<span className="best-score">{hooks.bestScore}ms</span>
          </p>
          <p>
            Worst Score:{" "}
            <span className="worst-score">{hooks.worstScore}ms</span>
          </p>
          {leaderboardPosition !== null && (
            <p className="leaderboard-position">
              🏁 Ranking Position: <strong>#{leaderboardPosition}</strong>
            </p>
          )}

          {percentilePlacement !== null && (
            <p className="leaderboard-percentile">
              📊 You're in the{" "}
              <strong>
                {percentilePlacement >= 50
                  ? `top ${(100 - percentilePlacement).toFixed(2)}%`
                  : `bottom ${percentilePlacement}%`}
              </strong>{" "}
              off all players!
            </p>
          )}
          {totalUsers > 0 && (
            <p className="total-users">
              👥 Total Players: <strong>{totalUsers.toLocaleString()}</strong>
            </p>
          )}
          <button onClick={hooks.resetScores}>
            <span className="emoji">🔄</span>
            <span className="text">Try Again</span>
          </button>
          {isScoresUpdated && (
            <p className="update-message">
              New best score, {hooks.averageScore}ms, has been saved!
            </p>
          )}
          {user === null && (
            <p className="login-prompt">
              Please log in to save your best score in the leaderboard and track
              your progress.
            </p>
          )}
          {bestScore !== undefined && (
            <p className="best-score-message">
              Your best score is {bestScore}ms. Keep trying to beat it!
            </p>
          )}
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        closeButton={false}
      />
    </>
  );
}

export default FinalScore;
// This component displays the final score and statistics after the reaction time test is completed.
