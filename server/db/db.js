import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" }); // Assicurati che il percorso sia corretto

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Rimuovi l'oggetto `ssl` qui
});

export default pool;
