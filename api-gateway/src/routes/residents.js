import { Router } from "express";
import { forward } from "../services/proxy.js";
import { SERVICES } from "../config.js";

const router = Router();
const BASE = SERVICES.residents;

// POST /api/residents
router.post("/", async (req, res) => {
  const { statusCode, body } = await forward(`${BASE}/api/residents`, req);
  res.status(statusCode).json(body);
});

// GET  /api/residents/locker/:lockerId
// Must be declared BEFORE /:id to avoid Express matching "locker" as an id
router.get("/locker/:lockerId", async (req, res) => {
  const { statusCode, body } = await forward(
    `${BASE}/api/residents/locker/${req.params.lockerId}`,
    req
  );
  res.status(statusCode).json(body);
});

// GET  /api/residents/:id
router.get("/:id", async (req, res) => {
  const { statusCode, body } = await forward(`${BASE}/api/residents/${req.params.id}`, req);
  res.status(statusCode).json(body);
});

// PATCH /api/residents/:id
router.patch("/:id", async (req, res) => {
  const { statusCode, body } = await forward(`${BASE}/api/residents/${req.params.id}`, req);
  res.status(statusCode).json(body);
});

// DELETE /api/residents/:id
router.delete("/:id", async (req, res) => {
  const { statusCode, body } = await forward(`${BASE}/api/residents/${req.params.id}`, req);
  res.status(statusCode).json(body);
});

export default router;
