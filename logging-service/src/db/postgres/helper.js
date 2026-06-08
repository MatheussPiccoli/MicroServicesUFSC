import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, "database.db"));

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Cria a tabela se não existir (substitui o exec.js + 01-init.sql)
db.exec(`
  CREATE TABLE IF NOT EXISTS logs (
    id TEXT PRIMARY KEY,
    delivery VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    locker_id TEXT NOT NULL,
    action VARCHAR(50) NOT NULL CHECK (
      action IN ('PACKAGE_STORED', 'PACKAGE_COLLECTED', 'DOOR_OPENED')
    )
  )
`);

// Converte $1, $2, $3... para ?, ?, ?...
function convertQuery(query) {
  return query.replace(/\$\d+/g, "?");
}

export const PostgresHelper = {
  query: (query, params = []) => {
    const converted = convertQuery(query);
    const sql = converted.trim().toUpperCase();

    if (sql.startsWith("SELECT") || sql.includes("RETURNING")) {
      return db.prepare(converted).all(params);
    }

    db.prepare(converted).run(params);
    return [];
  },
};
