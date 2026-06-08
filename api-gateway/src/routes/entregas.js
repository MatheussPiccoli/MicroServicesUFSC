import { Router } from "express";
import { forward } from "../services/proxy.js";
import { SERVICES } from "../config.js";

const router = Router();
const BASE = SERVICES.deliveries;

router.get("/", async (req, res) => {
  const { statusCode, body } = await forward(`${BASE}/entregas`, req);
  res.status(statusCode).json(body);
});

router.post("/:id/retirar", async (req, res) => {
  const { statusCode, body } = await forward(
    `${BASE}/entregas/${req.params.id}/retirar`,
    req,
  );
  res.status(statusCode).json(body);
});

router.get("/:id", async (req, res) => {
  const { statusCode, body } = await forward(
    `${BASE}/entregas/${req.params.id}`,
    req,
  );
  res.status(statusCode).json(body);
});

router.post("/", async (req, res) => {
  const { statusCode, body } = await forward(`${BASE}/entregas`, req);
  res.status(statusCode).json(body);
});

export default router;
