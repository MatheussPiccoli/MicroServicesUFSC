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
    CREATE TABLE IF NOT EXISTS entregas (
      id TEXT PRIMARY KEY,
      locker_id TEXT NOT NULL,
      compartimento_id TEXT NOT NULL,
      condomino_id TEXT NOT NULL,
      tamanho TEXT NOT NULL CHECK(tamanho IN ('P','M','G','XG')),
      status TEXT NOT NULL DEFAULT 'AGUARDANDO_RETIRADA'
        CHECK(status IN ('AGUARDANDO_RETIRADA','RETIRADA')),
      entregador TEXT,
      codigo_retirada TEXT NOT NULL,
      created_at TEXT NOT NULL,
      retirada_em TEXT
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
