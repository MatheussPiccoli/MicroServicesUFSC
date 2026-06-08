import "dotenv/config";
import express from "express";
import lockersRouter from "./src/routes/lockers.js";

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());

app.get("/health", (req, res) =>
  res.json({ status: "ok", service: "lockers-service" }),
);
app.use("/lockers", lockersRouter);

app.use((req, res) => res.status(404).json({ error: "Rota não encontrada" }));
app.use((err, req, res, next) => res.status(500).json({ error: err.message }));

app.listen(PORT, () => {
  console.log(`\n lockers-service rodando na porta ${PORT}`);
});
