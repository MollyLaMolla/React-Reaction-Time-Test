import express from "express";
import db from "../db/db.js"; // Assicurati che il percorso sia corretto
import jwt from "jsonwebtoken";
const router = express.Router();

router.get("/me", async (req, res) => {
  // estrai dal cookie il token JWT
  const token = req.cookies.token;
  if (!token) {
    console.log("Token non trovato nei cookie");
    return res.json(null);
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    try {
      // Verifica se l'utente esiste nel database
      const result = await db.query("SELECT * FROM users WHERE email = $1", [
        decoded.email,
      ]);
      if (result.rows.length > 0) {
        if (result.rows[0].custom_name !== null) {
          // Utente trovato, ritorna i dati
          console.log("Utente trovato:", result.rows[0]);
          res.json(result.rows[0]);
        } else {
          // Utente trovato ma senza custom_name, ritorna i dati con custom_name come null
          console.log("Utente trovato senza custom_name:", result.rows[0]);
          res.json({
            ...result.rows[0],
            custom_name: null,
            custom_tag: null, // Aggiungi custom_tag se necessario
            icon: null, // Aggiungi icon se necessario
          });
        }
      } else {
        // Utente non trovato, ritorna null
        res.json(null);
      }
    } catch (err) {
      console.error("Errore nel recupero dell'utente:", err);
      res.status(500).json({ success: false });
    }
  } catch (err) {
    console.error("Token non valido:", err);
    res.status(401).json(null);
  }
});

router.post("/check-user", async (req, res) => {
  const { email } = req.body;
  console.log("Controllo utente con email:", email);
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      if (result.rows[0].custom_name) {
        if (result.rows[0].custom_name !== null) {
          // Utente esiste e ha un custom_name
          res.json({ exists: true, customName: result.rows[0].custom_name });
        } else {
          // Utente esiste ma non ha un custom_name
          res.json({ exists: true, customName: null });
        }
      }
    } else {
      // Utente non esiste
      res.json({ exists: false, customName: null });
    }
  } catch (err) {
    console.error("Errore nel controllo utente:", err);
    res.status(500).json({ success: false });
  }
});

router.post("/save-user", async (req, res) => {
  const { email, customName, icon, customTag } = req.body;
  try {
    await db.query(
      `INSERT INTO users (email, custom_name, icon)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE
       SET custom_name = $2, icon = $3, custom_tag = $4`,
      [email, customName, icon, customTag]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Errore nel salvataggio utente:", err);
    res.status(500).json({ success: false });
  }
});

router.get("/verify-token", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json(null);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json(decoded);
  } catch (err) {
    console.error("Token non valido:", err);
    res.status(401).json(null);
  }
});

router.post("/check-and-update-best-score", async (req, res) => {
  const { email, avgScore } = req.body;
  console.log("body:", req.body);
  console.log(
    "Controllo e aggiornamento del miglior punteggio per:",
    email,
    "con punteggio:",
    avgScore
  );
  try {
    // Controlla se l'utente esiste
    const result = await db.query(
      "SELECT best_score FROM users WHERE email = $1",
      [email]
    );
    console.log("Risultato della query:", result.rows);
    const bestScore = result.rows[0].best_score;
    console.log("Miglior punteggio attuale:", bestScore);
    // Calcola il ranking
    const countResult = await db.query(
      `
  SELECT COUNT(*) AS total_users,
         COUNT(*) FILTER (WHERE best_score <= $1) AS better_than_count
  FROM users
  WHERE best_score IS NOT NULL
`,
      [avgScore]
    );

    const totalUsers = parseInt(countResult.rows[0].total_users);
    const betterThan = parseInt(countResult.rows[0].better_than_count);
    const position = betterThan + 1; // può essere +1 se preferisci partire da 1
    const percentile = ((1 - (position - 1) / totalUsers) * 100).toFixed(2);
    if (avgScore < bestScore || bestScore === null) {
      // Se il nuovo punteggio è migliore, aggiorna il record
      await db.query("UPDATE users SET best_score = $1 WHERE email = $2", [
        avgScore,
        email,
      ]);
      console.log("Miglior punteggio aggiornato a:", avgScore);
      res.json({
        success: true,
        updated: true,
        position: position,
        percentile: percentile,
        totalUsers: totalUsers,
      });
    } else {
      console.log(
        "Il nuovo punteggio non è migliore del miglior punteggio attuale."
      );
      res.json({
        success: true,
        updated: false,
        bestScore: bestScore,
        position: position,
        percentile: percentile,
        totalUsers: totalUsers,
      });
    }
  } catch (err) {
    console.error("Errore nel controllo del miglior punteggio:", err);
    res.status(500).json({ success: false });
  }
});

router.post("/logout", (req, res) => {
  // Rimuovi il cookie del token JWT
  res.clearCookie("token");
  res.json({ success: true });
});

router.get("/leaderboard", async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const offset = parseInt(req.query.offset) || 0;

  const usersResult = await db.query(
    `
    SELECT custom_name, custom_tag, icon, best_score, email
    FROM users
    WHERE best_score IS NOT NULL
    ORDER BY best_score ASC
    LIMIT $1 OFFSET $2
  `,
    [limit, offset]
  );

  const countResult = await db.query(
    `SELECT COUNT(*) FROM users WHERE best_score IS NOT NULL`
  );
  const totalUsers = parseInt(countResult.rows[0].count);

  res.json({ users: usersResult.rows, total: totalUsers });
});

router.get("/my-position", async (req, res) => {
  const email = req.query.email;

  if (!email) return res.status(400).json({ error: "Missing email." });

  try {
    const userScoreResult = await db.query(
      "SELECT best_score FROM users WHERE email = $1 AND best_score IS NOT NULL",
      [email]
    );

    if (userScoreResult.rows.length === 0) {
      return res.status(404).json({ error: "User score not found." });
    }

    const userScore = userScoreResult.rows[0].best_score;

    const positionResult = await db.query(
      `
      SELECT COUNT(*) + 1 AS position
      FROM users
      WHERE best_score < $1 AND best_score IS NOT NULL
    `,
      [userScore]
    );

    const position = parseInt(positionResult.rows[0].position);
    res.json({ position });
  } catch (err) {
    console.error("Error fetching user position:", err);
    res.status(500).json({ error: "Server error." });
  }
});

export default router;
