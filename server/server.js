import express from "express";
import cors from "cors";
import passport from "passport";
import "./passport.js"; // Assicurati di avere un file passport.js configurato correttamente
import session from "express-session";
import db from "./db/db.js"; // Assicurati di avere il tuo database configurato correttamente
import apiRoutes from "./routes/api.js"; // Assicurati di avere le tue rotte API configurate correttamente
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configura il database PostgreSQL
try {
  const res = await db.query("SELECT NOW()");
  console.log("Connesso! Ora:", res.rows[0].now);
} catch (error) {
  console.error("Database connection failed:", error);
  process.exit(1); // Esci se la connessione fallisce
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "https://react-reaction-time-test-client.onrender.com",
    credentials: true, // ← essenziale per i cookie!
  })
);
app.use(
  session({
    secret: "reaction-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
// Usa le tue route API
app.use("/api", apiRoutes);
// Route di base

app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World from Express Backend!");
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),

  // Successo, crea il token JWT e imposta il cookie
  async (req, res) => {
    console.log(req.user);
    const payload = {
      email: req.user._json.email,
    };

    try {
      // Controlla se l'utente esiste già nel database
      const result = await db.query("SELECT * FROM users WHERE email = $1", [
        payload.email,
      ]);
      if (result.rows.length === 0) {
        // Se l'utente non esiste, crealo
        await db.query(
          "INSERT INTO users (email, custom_name, icon) VALUES ($1, $2, $3)",
          [payload.email, null, null]
        );
      }
    } catch (err) {
      console.error("Errore nel salvataggio dell'utente:", err);
      return res.status(500).json({ success: false });
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d", // 👈 durata del token
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 giorni
      sameSite: "Lax",
      secure: false, // true in produzione con HTTPS
    });

    res.redirect(
      `https://react-reaction-time-test-client.onrender.com/username/setup`
    );
  }
);

app.listen(PORT, () => {
  console.log(`🚀 Server attivo su http://localhost:${PORT}`);
});
