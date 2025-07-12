import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRankingStar } from "@fortawesome/free-solid-svg-icons";

function LeaderBoardButton({ user }) {
  return (
    <button
      className={"leaderboard-button" + (user !== null ? " center" : "")}
      onClick={() => {
        window.location.href = "/leaderboard"; // Redirect to the leaderboard page
      }}
    >
      <FontAwesomeIcon icon={faRankingStar} className="leaderboard-icon" />
      <span className="leaderboard-text">Leaderboard</span>
    </button>
  );
}

export default LeaderBoardButton;
