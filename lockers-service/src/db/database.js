import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, "database.db"));

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Converte $1, $2, $3... para ?, ?, ?...
function convertQuery(query) {
  return query.replace(/\$\d+/g, "?");
}

export async function getDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS lockers (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      endereco TEXT NOT NULL,
      condominio TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);
  db.exec(`
    CREATE TABLE IF NOT EXISTS compartimentos (
      id TEXT PRIMARY KEY,
      locker_id TEXT NOT NULL,
      tamanho TEXT NOT NULL CHECK(tamanho IN ('P','M','G','XG')),
      numero INTEGER NOT NULL,
      ocupado INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (locker_id) REFERENCES lockers(id)
    )
  `);
}

export async function dbAll(sql, params = []) {
  return db.prepare(convertQuery(sql)).all(params);
}

export async function dbGet(sql, params = []) {
  return db.prepare(convertQuery(sql)).get(params) ?? null;
}

export async function dbRun(sql, params = []) {
  db.prepare(convertQuery(sql)).run(params);
}
