import "dotenv/config";
import express from "express";
import cors from "cors";

import lockersRouter from "./routes/lockers.js";
import residentsRouter from "./routes/residents.js";
import entregasRouter from "./routes/entregas.js";
import logsRouter from "./routes/logs.js";
import aberturaRouter from "./routes/abertura.js";

const app = express();
const PORT = process.env.GATEWAY_PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/lockers", lockersRouter);
app.use("/api/residents", residentsRouter);
app.use("/api/entregas", entregasRouter);
app.use("/api/logs", logsRouter);
app.use("/api/abertura", aberturaRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
