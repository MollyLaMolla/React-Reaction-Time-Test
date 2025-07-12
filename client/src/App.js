// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";
import UsernameSetup from "./pages/UsernameSetup"; // futura username setup page
import LeaderBoard from "./pages/LeaderBoard"; // futura leaderboard page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/username/setup" element={<UsernameSetup />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
      </Routes>
    </Router>
  );
}

export default App;
