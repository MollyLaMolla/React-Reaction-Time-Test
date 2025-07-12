import "./LeaderBoard.css";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import UserBox from "../components/UserBox"; // Assicurati che il percorso sia corretto
import GoogleLoginButton from "../components/GoogleLoginButton";

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [userLogged, setUserLogged] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingScoresFirstTime, setIsLoadingScoresFirstTime] =
    useState(true);
  const [isLoadingScores, setIsLoadingScores] = useState(true);
  const [itemsPosition, setItemsPosition] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [scrollToMe, setScrollToMe] = useState(null);
  const userRef = useRef(null);
  const listRef = useRef(null);
  const [shouldScrollToMeNow, setShouldScrollToMeNow] = useState(false);
  const limit = 50;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/me", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Errore risposta API");
        const userData = await res.json();
        if (userData && userData.email) {
          setUserLogged(userData);
        }
      } catch (err) {
        console.error("Errore nel recupero dei dati utente:", err);
      } finally {
        setIsLoadingUser(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const offset = (page - 1) * limit;
        const res = await fetch(
          `/api/leaderboard?limit=${limit}&offset=${offset}`
        );
        if (!res.ok) throw new Error("Errore risposta API");
        const data = await res.json();
        setUsers(data.users);
        setTotal(data.total);
        setTimeout(() => {
          setIsLoadingScoresFirstTime(false);
          setIsLoadingScores(false);

          const newPositions = data.users.map((_, index) => index + 1 + offset);
          setItemsPosition(newPositions);
        }, 0); // Imposta un timeout di 0 per evitare il blocco del thread principale

        // 👇 Scrolla in alto
        if (listRef.current) {
          listRef.current.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      }
    };

    fetchLeaderboard();
  }, [page, limit]);

  useEffect(() => {
    const fetchMyPosition = async () => {
      if (userLogged === null) return;
      if (userLogged.best_score === null) return; // Non ha ancora giocato
      try {
        const res = await fetch(`/api/my-position?email=${userLogged.email}`);
        if (!res.ok) throw new Error("Errore risposta API");
        const data = await res.json();
        if (data.position) {
          const myPage = Math.ceil(data.position / limit);
          setScrollToMe(myPage);
        }
      } catch (err) {
        console.error("Failed to fetch user position:", err);
      }
    };

    fetchMyPosition();
  }, [userLogged, limit]);

  useEffect(() => {
    if (
      shouldScrollToMeNow &&
      users.length > 0 &&
      page === scrollToMe &&
      userRef.current
    ) {
      setTimeout(() => {
        userRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        setShouldScrollToMeNow(false);
      }, 100);
    }
  }, [shouldScrollToMeNow, users, page, scrollToMe]);

  useLayoutEffect(() => {
    if (!isLoadingScores && users.length > 0) {
      const delay = users.length * 10 + 120; // attende il completamento dell'animazione
      const timer = setTimeout(() => {
        const newPositions = users.map(
          (_, index) => index + 1 + (page - 1) * limit
        );
        setItemsPosition(newPositions);
      }, delay); // attende che gli li abbiano animato

      return () => clearTimeout(timer); // pulizia
    }
  }, [users, page, isLoadingScores]);

  return (
    <>
      {!isLoadingUser && userLogged !== null && <UserBox user={userLogged} />}

      {!isLoadingScoresFirstTime ? (
        <div className="leaderboard">
          <h2>🏆 Leaderboard</h2>
          <div className="leaderboard-list-box">
            <ul className="leaderboard-list" ref={listRef}>
              {users.map((user, index) => (
                <li
                  key={`${user.email}-${index}`}
                  ref={user.email === userLogged?.email ? userRef : null}
                  className={`leaderboard-item fade-in-left ${
                    user.email === userLogged?.email ? "highlighted" : ""
                  }`}
                  style={{ animationDelay: `${index * 10 + 100}ms` }} // Delay progressivo 👈
                >
                  <span
                    className={`position ${
                      itemsPosition[index] ? "visible" : ""
                    }`}
                  >
                    {(() => {
                      const position = itemsPosition[index];
                      if (position === undefined) return "";
                      if (position < 10) return `0${position}`;
                      return position;
                    })()}
                  </span>

                  <span className="divider"></span>
                  <span className="icon">{user.icon}</span>
                  <span className="divider"></span>
                  <span className="name">
                    {user.custom_name}{" "}
                    <span className="tag">#{user.custom_tag}</span>
                  </span>
                  <span className="divider"></span>
                  <span className="score">{user.best_score}ms</span>
                </li>
              ))}
            </ul>
            {scrollToMe && (
              <button
                onClick={() => {
                  if (scrollToMe === page && userRef.current) {
                    setShouldScrollToMeNow(true);
                  } else {
                    setPage(scrollToMe);
                    setShouldScrollToMeNow(true);
                  }
                }}
                className="go-to-me-button"
              >
                🎯 My Score 🎯
              </button>
            )}
          </div>

          <div className="pagination">
            {/* fist page button */}
            <button
              onClick={() => {
                setPage(1);
                setItemsPosition([]);
              }}
              disabled={page === 1}
              className="first-page"
            >
              First
            </button>
            {/* previous page button */}
            <button
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                setItemsPosition([]);
              }}
              disabled={page === 1}
              className="prev-page"
            >
              <span className="arrow">◀</span>
              <span className="txt-cp">Prev</span>
            </button>
            {/* current page and total pages */}
            <span className="current-page">
              Page {page} of {Math.ceil(total / limit)}
            </span>
            {/* next page button */}
            <button
              onClick={() => {
                setPage((p) => p + 1);
                setItemsPosition([]);
              }}
              disabled={page * limit >= total}
              className="next-page"
            >
              <span className="txt-cp">Next</span>
              <span className="arrow">▶</span>
            </button>
            {/* last page button */}
            <button
              onClick={() => {
                setPage(Math.ceil(total / limit));
                setItemsPosition([]);
              }}
              disabled={page * limit >= total}
              className="last-page"
            >
              Last
            </button>
          </div>
        </div>
      ) : (
        <div className="loader">
          <span className="spinner"></span>
          <p>Loading leaderboard...</p>
        </div>
      )}
      {userLogged === null && !isLoadingUser && <GoogleLoginButton />}
    </>
  );
}

export default Leaderboard;
