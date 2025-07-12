import { useState } from "react";
import "./UserBox.css"; // Assicurati di avere uno stile per il dropdown

function UserBox({ user }) {
  const { email, custom_name, icon } = user || {};
  const [isVisible, setIsVisible] = useState(false);
  const [clicked, setClicked] = useState(false);

  const toggleBox = () => {
    setIsVisible(!isVisible);
    setClicked(true);
    setTimeout(() => setClicked(false), 400); // reset dopo animazione
  };

  async function handleLogout() {
    try {
      const res = await fetch(
        "https://react-reaction-time-test.onrender.com/api/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (res.ok) {
        // Rimuovi i dati dell'utente dallo stato
        console.log("Logout successful");
        window.location.href = "http://localhost:3000"; // Reindirizza alla home
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Errore durante il logout:", err);
    }
  }
  return (
    <div className="userbox">
      <div
        className={`userbox-icon ${clicked ? "clicked" : ""}`}
        onClick={() => toggleBox()}
      >
        <span>{icon || "👤"}</span>
      </div>

      <div className={`userbox-dropdown ${isVisible ? "visible" : ""}`}>
        <h2>
          <span className="userbox-name">{custom_name || "Guest"}</span>
          <span className="userbox-tag">#{user?.custom_tag || "1234"}</span>
        </h2>
        <p>{email || "Not logged in"}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default UserBox;
