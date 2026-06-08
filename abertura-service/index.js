import 'dotenv/config';
import express from 'express';
import aberturaRouter from './src/routes/abertura.js';

const app = express();
const PORT = process.env.PORT || 3006;

app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'abertura-service' }));
app.use('/abertura', aberturaRouter);

app.use((req, res) => res.status(404).json({ error: 'Rota não encontrada' }));
app.use((err, req, res, next) => res.status(500).json({ error: err.message }));

app.listen(PORT, () => {
  console.log(`\n abertura-service rodando na porta ${PORT}`);
});
