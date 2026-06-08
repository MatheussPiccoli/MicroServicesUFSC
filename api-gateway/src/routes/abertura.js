import { Router } from "express";
import { forward } from "../services/proxy.js";
import { SERVICES } from "../config.js";

const router = Router();
const BASE = SERVICES.abertura;

router.post("/abrir", async (req, res) => {
  const { statusCode, body } = await forward(`${BASE}/abertura/abrir`, req);
  res.status(statusCode).json(body);
});

export default router;
