import "dotenv/config";
import express from "express";
import entregasRouter from "./src/routes/entregas.js";

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());

app.get("/health", (req, res) =>
  res.json({ status: "ok", service: "entregas-service" }),
);
app.use("/entregas", entregasRouter);

app.use((req, res) => res.status(404).json({ error: "Rota não encontrada" }));
app.use((err, req, res, next) => res.status(500).json({ error: err.message }));

app.listen(PORT, () => {
  console.log(`\n entregas-service rodando na porta ${PORT}`);
});
