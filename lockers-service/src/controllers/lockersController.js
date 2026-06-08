import { v4 as uuidv4 } from "uuid";
import { getDb, dbAll, dbGet, dbRun } from "../db/database.js";

export async function getAllLockers(req, res) {
  try {
    await getDb();
    const lockers = await dbAll(
      "SELECT * FROM lockers ORDER BY created_at DESC",
    );
    for (const locker of lockers) {
      locker.compartimentos = await dbAll(
        "SELECT * FROM compartimentos WHERE locker_id = $1 ORDER BY numero",
        [locker.id],
      );
    }
    res.json(lockers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getLockerById(req, res) {
  try {
    await getDb();
    const locker = await dbGet("SELECT * FROM lockers WHERE id = $1", [
      req.params.id,
    ]);
    if (!locker)
      return res.status(404).json({ error: "Locker não encontrado" });

    locker.compartimentos = await dbAll(
      "SELECT * FROM compartimentos WHERE locker_id = $1 ORDER BY numero",
      [locker.id],
    );
    res.json(locker);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createLocker(req, res) {
  try {
    const { nome, endereco, condominio, compartimentos } = req.body;
    if (!nome || !endereco || !condominio)
      return res
        .status(400)
        .json({ error: "Campos obrigatórios: nome, endereco, condominio" });

    await getDb();
    const id = uuidv4();
    const created_at = new Date().toISOString();
    await dbRun(
      "INSERT INTO lockers (id, nome, endereco, condominio, created_at) VALUES ($1, $2, $3, $4, $5)",
      [id, nome, endereco, condominio, created_at],
    );

    const criados = [];
    if (Array.isArray(compartimentos)) {
      let numero = 1;
      for (const { tamanho, quantidade = 1 } of compartimentos) {
        if (!["P", "M", "G", "XG"].includes(tamanho)) continue;
        for (let i = 0; i < quantidade; i++) {
          const cid = uuidv4();
          await dbRun(
            "INSERT INTO compartimentos (id, locker_id, tamanho, numero, ocupado) VALUES ($1, $2, $3, $4, 0)",
            [cid, id, tamanho, numero++],
          );
          criados.push({
            id: cid,
            tamanho,
            numero: numero - 1,
            ocupado: false,
          });
        }
      }
    }

    res.status(201).json({
      id,
      nome,
      endereco,
      condominio,
      created_at,
      compartimentos: criados,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function getCompartimentosDisponiveis(req, res) {
  try {
    await getDb();
    const locker = await dbGet("SELECT * FROM lockers WHERE id = $1", [
      req.params.id,
    ]);
    if (!locker)
      return res.status(404).json({ error: "Locker não encontrado" });

    const { tamanho } = req.query;
    let sql =
      "SELECT * FROM compartimentos WHERE locker_id = $1 AND ocupado = 0";
    const params = [req.params.id];

    if (tamanho) {
      if (!["P", "M", "G", "XG"].includes(tamanho))
        return res
          .status(400)
          .json({ error: "Tamanho inválido. Use P, M, G ou XG" });
      sql += " AND tamanho = $2";
      params.push(tamanho);
    }

    res.json(await dbAll(sql + " ORDER BY numero", params));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function setOcupado(req, res) {
  try {
    const { compartimento_id, ocupado } = req.body;
    if (!compartimento_id || ocupado === undefined)
      return res
        .status(400)
        .json({ error: "Campos obrigatórios: compartimento_id, ocupado" });

    await getDb();
    const comp = await dbGet("SELECT * FROM compartimentos WHERE id = $1", [
      compartimento_id,
    ]);
    if (!comp)
      return res.status(404).json({ error: "Compartimento não encontrado" });

    await dbRun("UPDATE compartimentos SET ocupado = $1 WHERE id = $2", [
      ocupado ? 1 : 0,
      compartimento_id,
    ]);

    res.json(
      await dbGet("SELECT * FROM compartimentos WHERE id = $1", [
        compartimento_id,
      ]),
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
