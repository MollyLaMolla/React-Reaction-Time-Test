import { useState, useEffect, useReducer, useRef } from "react";
import StartText from "../components/StartText";
import { GreenClickText, WaitingGreenText } from "../components/PlayingText";
import ResultText from "../components/ResultText";
import FinalScore from "../components/FinalScore";
import TooSoonText from "../components/TooSoonText";
import GoogleLoginButton from "../components/GoogleLoginButton";
import LeaderBoardButton from "../components/LeaderBoardButton";
import UserBox from "../components/UserBox";

function Home() {
  // State to manage the game state
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(
          "https://react-reaction-time-test.onrender.com/api/me",
          {
            credentials: "include",
          }
        );
        const userData = await res.json();
        if (userData && userData.email) {
          setUser(userData);
        }
      } catch (err) {
        console.error("Errore nel recupero dei dati utente:", err);
      } finally {
        setIsLoadingUser(false);
      }
    };
    fetchUserData();
  }, []);

  if (user !== null) {
    if (user.custom_name === null || user.icon === null) {
      window.location.href =
        "https://react-reaction-time-test.onrender.com/setup";
    }
  }

  console.log("User data:", user);

  const timerRef = useRef(null);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);

  const initialState = {
    gameStarted: false,
    isWaiting: false,
    showGreen: false,
    tooSoon: false,
    showReactionTime: false,
    gameEnded: false,
  };

  function reducer(state, action) {
    switch (action.type) {
      case "START_GAME":
        return { ...state, gameStarted: true, isWaiting: true };
      case "WAIT_FOR_GREEN":
        return {
          ...state,
          isWaiting: true,
          showGreen: false,
          tooSoon: false,
          showReactionTime: false,
          gameEnded: false,
        };
      case "SHOW_GREEN":
        return {
          ...state,
          showGreen: true,
          isWaiting: false,
          tooSoon: false,
          showReactionTime: false,
          gameEnded: false,
        };
      case "CLICKED_GREEN":
        return {
          ...state,
          showGreen: false,
          isWaiting: false,
          showReactionTime: true,
          tooSoon: false,
          gameEnded: false,
        };
      case "TOO_SOON":
        return {
          ...state,
          tooSoon: true,
          isWaiting: false,
          showGreen: false,
          showReactionTime: false,
          gameEnded: false,
        };
      case "RESET":
        return initialState;
      case "END_GAME":
        return {
          ...state,
          gameEnded: true,
          showGreen: false,
          isWaiting: false,
          showReactionTime: false,
        };
      case "RESTART_GAME":
        return { ...initialState, gameStarted: true, isWaiting: true };
      case "CONTINUE_GAME_AFTER_TOO_SOON":
        return {
          ...state,
          tooSoon: false,
          isWaiting: true,
          showGreen: false,
          showReactionTime: false,
          gameEnded: false,
        };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  // Function to handle click event

  function handleClick() {
    if (state.gameEnded) {
      return; // Do nothing if the game has ended
    }
    if (!state.gameStarted) {
      dispatch({ type: "START_GAME" });
      dispatch({ type: "WAIT_FOR_GREEN" });
      timerRef.current = setTimeout(() => {
        dispatch({ type: "SHOW_GREEN" });
        setCurrentTime(Date.now());
      }, Math.floor(Math.random() * 3500) + 1500); // Random time between 1.5s and 5s
    } else if (state.isWaiting) {
      // If the game is waiting for the green box
      clearTimeout(timerRef.current);
      timerRef.current = null;
      dispatch({ type: "TOO_SOON" });
    } else if (state.showGreen) {
      // If the green box is shown
      const reactionTime = Date.now() - currentTime;
      console.log("Reaction Time:", reactionTime);
      setReactionTimes([...reactionTimes, reactionTime]);
      dispatch({ type: "CLICKED_GREEN" });
    } else if (state.showReactionTime) {
      // If the reaction time is shown
      dispatch({ type: "WAIT_FOR_GREEN" });
      timerRef.current = setTimeout(() => {
        dispatch({ type: "SHOW_GREEN" });
        setCurrentTime(Date.now());
      }, Math.random() * 2000 + 1000);
    } else if (state.tooSoon) {
      // If the user clicked too soon
      dispatch({ type: "CONTINUE_GAME_AFTER_TOO_SOON" });
      timerRef.current = setTimeout(() => {
        dispatch({ type: "SHOW_GREEN" });
        setCurrentTime(Date.now());
      }, Math.random() * 2000 + 1000);
    }
  }

  useEffect(() => {
    if (reactionTimes.length >= 5) {
      // If the game has ended after 5 reactions
      dispatch({ type: "END_GAME" });
    }
  }, [reactionTimes]);

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  function calculateStats() {
    if (reactionTimes.length === 0) return { average: 0, best: 0, worst: 0 };
    const average =
      reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
    const best = Math.min(...reactionTimes);
    const worst = Math.max(...reactionTimes);
    return { average, best, worst };
  }

  return (
    <div
      className={
        "App" +
        (state.isWaiting ? " background-red" : "") +
        (state.showGreen ? " background-green" : "")
      }
    >
      {!isLoadingUser &&
        user === null &&
        (!state.gameStarted || state.gameEnded) && <GoogleLoginButton />}

      {!isLoadingUser && (!state.gameStarted || state.gameEnded) && (
        <LeaderBoardButton user={user} />
      )}

      {user !== null && (!state.gameStarted || state.gameEnded) && (
        <UserBox user={user} />
      )}

      <div className="game-container" onMouseDown={handleClick}>
        {!state.gameStarted && <StartText />}
        {state.isWaiting && <WaitingGreenText />}
        {state.showGreen && <GreenClickText />}
        {state.tooSoon && <TooSoonText />}
        {state.showReactionTime && (
          <ResultText result={reactionTimes[reactionTimes.length - 1]} />
        )}
        {state.gameEnded && (
          <FinalScore
            hooks={{
              user: user,
              averageScore: calculateStats().average.toFixed(0),
              bestScore: calculateStats().best.toFixed(0),
              worstScore: calculateStats().worst.toFixed(0),
              resetScores: () => {
                setReactionTimes([]);
                dispatch({ type: "RESET" });
              },
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Home;
