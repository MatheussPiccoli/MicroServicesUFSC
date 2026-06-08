import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { getDb, dbAll, dbGet, dbRun } from "../db/database.js";

const LOCKERS_URL = process.env.LOCKERS_SERVICE_URL || "http://localhost:3005";
const ABERTURA_URL =
  process.env.ABERTURA_SERVICE_URL || "http://localhost:3006";

const RESIDENTS_URL =
  process.env.RESIDENTS_SERVICE_URL || "http://localhost:3002";

const LOGGING_URL = process.env.LOGGING_SERVICE_URL || "http://localhost:3004";

function gerarCodigoRetirada() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function getAllEntregas(req, res) {
  try {
    await getDb();
    const { status, condomino_id, locker_id } = req.query;
    let sql = "SELECT * FROM entregas WHERE 1=1";
    const params = [];
    let i = 1;
    if (status) {
      sql += ` AND status = $${i++}`;
      params.push(status);
    }
    if (condomino_id) {
      sql += ` AND condomino_id = $${i++}`;
      params.push(condomino_id);
    }
    if (locker_id) {
      sql += ` AND locker_id = $${i++}`;
      params.push(locker_id);
    }
    res.json(await dbAll(sql + " ORDER BY created_at DESC", params));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getEntregaById(req, res) {
  try {
    await getDb();
    const entrega = await dbGet("SELECT * FROM entregas WHERE id = $1", [
      req.params.id,
    ]);
    if (!entrega)
      return res.status(404).json({ error: "Entrega não encontrada" });
    res.json(entrega);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function registrarEntrega(req, res) {
  try {
    const { locker_id, condomino_id, tamanho, entregador } = req.body;
    if (!locker_id || !condomino_id || !tamanho)
      return res.status(400).json({
        error: "Campos obrigatórios: locker_id, condomino_id, tamanho",
      });
    if (!["P", "M", "G", "XG"].includes(tamanho))
      return res
        .status(400)
        .json({ error: "Tamanho inválido. Use P, M, G ou XG" });

    try {
      await axios.get(`${LOCKERS_URL}/lockers/${locker_id}`);
    } catch (err) {
      if (err.response?.status === 404)
        return res.status(404).json({ error: "Locker não encontrado" });
      return res.status(503).json({ error: "Serviço de lockers indisponível" });
    }

    let resident;

    try {
      const { data } = await axios.get(
        `${RESIDENTS_URL}/api/residents/${condomino_id}`,
      );

      resident = data;
    } catch (err) {
      if (err.response?.status === 404) {
        return res.status(404).json({
          error: "Condômino não encontrado",
        });
      }

      return res.status(503).json({
        error: "Serviço de condôminos indisponível",
      });
    }

    if (resident.locker_id !== locker_id) {
      return res.status(400).json({
        error: "Condômino não pertence a este locker",
      });
    }

    let compartimento;
    try {
      const { data } = await axios.get(
        `${LOCKERS_URL}/lockers/${locker_id}/compartimentos/disponiveis?tamanho=${tamanho}`,
      );
      if (!data.length)
        return res.status(409).json({
          error: `Nenhum compartimento ${tamanho} disponível neste locker`,
        });
      compartimento = data[0];
    } catch {
      return res
        .status(503)
        .json({ error: "Erro ao buscar compartimentos disponíveis" });
    }

    await axios.patch(`${LOCKERS_URL}/lockers/compartimentos/ocupacao`, {
      compartimento_id: compartimento.id,
      ocupado: true,
    });

    await getDb();
    const id = uuidv4();
    const codigo_retirada = gerarCodigoRetirada();
    const created_at = new Date().toISOString();

    await dbRun(
      `INSERT INTO entregas
        (id, locker_id, compartimento_id, condomino_id, tamanho, status, entregador, codigo_retirada, created_at)
       VALUES ($1, $2, $3, $4, $5, 'AGUARDANDO_RETIRADA', $6, $7, $8)`,
      [
        id,
        locker_id,
        compartimento.id,
        condomino_id,
        tamanho,
        entregador ?? null,
        codigo_retirada,
        created_at,
      ],
    );

    await axios.post(`${LOGGING_URL}/api/logs`, {
      delivery: id,
      email: resident.email,
      locker_id,
      action: "PACKAGE_STORED",
    });

    res.status(201).json({
      id,
      locker_id,
      condomino_id,
      tamanho,
      status: "AGUARDANDO_RETIRADA",
      compartimento_numero: compartimento.numero,
      codigo_retirada,
      created_at,
      mensagem: `Encomenda depositada no compartimento ${compartimento.numero}. Código de retirada: ${codigo_retirada}`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function retirarEntrega(req, res) {
  try {
    await getDb();
    const entrega = await dbGet("SELECT * FROM entregas WHERE id = $1", [
      req.params.id,
    ]);
    if (!entrega)
      return res.status(404).json({ error: "Entrega não encontrada" });
    if (entrega.status !== "AGUARDANDO_RETIRADA")
      return res.status(409).json({ error: "Entrega já foi retirada" });
    if (entrega.codigo_retirada !== req.body.codigo_retirada)
      return res.status(401).json({ error: "Código de retirada inválido" });
    let resident;

    try {
      const { data } = await axios.get(
        `${RESIDENTS_URL}/api/residents/${entrega.condomino_id}`,
      );

      resident = data;
    } catch {
      console.warn("[AVISO] Não foi possível obter dados do morador");
    }
    try {
      await axios.post(`${ABERTURA_URL}/abertura/abrir`, {
        locker_id: entrega.locker_id,
        compartimento_id: entrega.compartimento_id,
      });
    } catch {
      console.warn("[AVISO] Serviço de abertura indisponível");
    }

    const retirada_em = new Date().toISOString();
    await dbRun(
      "UPDATE entregas SET status = 'RETIRADA', retirada_em = $1 WHERE id = $2",
      [retirada_em, req.params.id],
    );

    await axios
      .patch(`${LOCKERS_URL}/lockers/compartimentos/ocupacao`, {
        compartimento_id: entrega.compartimento_id,
        ocupado: false,
      })
      .catch(() => {});
    if (resident) {
      await axios
        .post(`${LOGGING_URL}/api/logs`, {
          delivery: entrega.id,
          email: resident.email,
          locker_id: entrega.locker_id,
          action: "PACKAGE_COLLECTED",
        })
        .catch((err) => {
          console.warn(
            "[AVISO] Não foi possível registrar log de retirada:",
            err.message,
          );
        });
    }

    res.json({
      mensagem: "Compartimento aberto! Encomenda retirada com sucesso.",
      retirada_em,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
