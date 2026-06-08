import { Router } from "express";
import { forward } from "../services/proxy.js";
import { SERVICES } from "../config.js";

const router = Router();
const BASE = SERVICES.lockers;

// GET  /api/lockers
router.get("/", async (req, res) => {
  const { statusCode, body } = await forward(`${BASE}/lockers`, req);
  res.status(statusCode).json(body);
});

// GET  /api/lockers/:id/compartimentos/disponiveis
router.get("/:id/compartimentos/disponiveis", async (req, res) => {
  const { statusCode, body } = await forward(
    `${BASE}/lockers/${req.params.id}/compartimentos/disponiveis`,
    req,
  );
  res.status(statusCode).json(body);
});

// GET  /api/lockers/:id
router.get("/:id", async (req, res) => {
  const { statusCode, body } = await forward(
    `${BASE}/lockers/${req.params.id}`,
    req,
  );
  res.status(statusCode).json(body);
});

// POST /api/lockers
router.post("/", async (req, res) => {
  const { statusCode, body } = await forward(`${BASE}/lockers`, req);
  res.status(statusCode).json(body);
});

// PATCH /api/lockers/compartimentos/ocupacao
router.patch("/compartimentos/ocupacao", async (req, res) => {
  const { statusCode, body } = await forward(
    `${BASE}/lockers/compartimentos/ocupacao`,
    req,
  );
  res.status(statusCode).json(body);
});

export default router;
