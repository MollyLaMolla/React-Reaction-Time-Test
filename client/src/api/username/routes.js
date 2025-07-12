useEffect(() => {
  const checkUserRegistration = async () => {
    try {
      const res = await fetch(
        "https://react-reaction-time-test.onrender.com/api/me",
        {
          credentials: "include",
        }
      );
      const user = await res.json();
      if (!user?.id) return;

      const checkRes = await fetch(
        "https://react-reaction-time-test.onrender.com/check-user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        }
      );

      const data = await checkRes.json();

      if (data.exists) {
        navigate("/");
      } else {
        setShowUsernameInput(true);
      }
    } catch (err) {
      console.error("Errore nel login:", err);
    }
  };

  checkUserRegistration();
}, []);
