import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserBox from "../components/UserBox";
import "./UsernameSetup.css"; // Assicurati di avere uno stile per questa pagina

function UsernameSetup() {
  const [user, setUser] = useState(null);
  const [customName, setCustomName] = useState("");
  const [customTag, setCustomTag] = useState(""); // Aggiungi customTag per il tag personalizzato
  const [icon, setIcon] = useState("🐱"); // Icona di default
  const [showInput, setShowInput] = useState(false);
  const navigate = useNavigate();

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
        console.log("User data:", userData);
        if (userData.custom_name === null) {
          setUser(userData);
          setShowInput(true);
        } else {
          navigate("/"); // Se l'utente ha già un nome personalizzato, reindirizza alla home
        }
      } catch (err) {
        console.error("Errore nel recupero dei dati utente:", err);
        navigate("/"); // In caso di errore, reindirizza alla home
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("https://react-reaction-time-test.onrender.com/api/save-user", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        customName: customName.trim(),
        customTag: customTag.trim(),
        icon: icon.trim(),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("Custom name saved:", customName);
          navigate("/"); // Redirect to leaderboard after saving
        } else {
          console.error("Error saving custom name:", data);
        }
      });
  };

  if (!showInput) return <p>Loading...</p>;

  return (
    <div className="username-setup-container">
      <UserBox user={user} />
      <div className="username-setup">
        <h1>
          <span>Welcome</span>
          <span>{user.name || user.email}</span>
          <span>👋</span>{" "}
        </h1>
        <p>To start using the app, please set your custom name and tag.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="customName"
            id="name-input"
            placeholder="Es. NinjaReflex"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            required
          />
          <input
            type="text"
            name="customTag"
            id="tag-input"
            placeholder="Es. #1234"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            required
          />
          <select
            name="icon"
            id="icon-select"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="icon-select"
          >
            <option value="🐱">🐱</option>
            <option value="🐶">🐶</option>
            <option value="🐰">🐰</option>
            <option value="🐷">🐷</option>
            <option value="🐸">🐸</option>
            <option value="🦊">🦊</option>
            <option value="🐻">🐻</option>
            <option value="🐼">🐼</option>
            <option value="🐨">🐨</option>
            <option value="🐯">🐯</option>
            <option value="🦁">🦁</option>
            <option value="🐵">🐵</option>
            <option value="🐔">🐔</option>
            <option value="🦄">🦄</option>
            <option value="🐴">🐴</option>
            <option value="🐧">🐧</option>
            <option value="🐺">🐺</option>
            <option value="🐍">🐍</option>
            <option value="🐙">🐙</option>
          </select>
          <div className="icon-preview">
            <span className="selected-icon-preview">
              {icon.trim() ? icon : "🐱"}
            </span>
          </div>
          <button
            type="submit"
            disabled={!customName.trim() || !icon || !customTag.trim()}
          >
            Save Name
          </button>
        </form>
      </div>
    </div>
  );
}

export default UsernameSetup;
