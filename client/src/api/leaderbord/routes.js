useEffect(() => {
  fetch("/api/leaderboard")
    .then((res) => res.json())
    .then((data) => setLeaderboard(data));
}, []);
