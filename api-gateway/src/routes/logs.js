import { Router } from "express";
import { forward } from "../services/proxy.js";
import { SERVICES } from "../config.js";

const router = Router();
const BASE = SERVICES.logging;

// GET  /api/logs
router.get("/", async (req, res) => {
  const { statusCode, body } = await forward(`${BASE}/api/logs`, req);
  res.status(statusCode).json(body);
});

// GET  /api/logs/:logId
router.get("/:logId", async (req, res) => {
  const { statusCode, body } = await forward(`${BASE}/api/logs/${req.params.logId}`, req);
  res.status(statusCode).json(body);
});

// POST /api/logs
router.post("/", async (req, res) => {
  const { statusCode, body } = await forward(`${BASE}/api/logs`, req);
  res.status(statusCode).json(body);
});

export default router;
