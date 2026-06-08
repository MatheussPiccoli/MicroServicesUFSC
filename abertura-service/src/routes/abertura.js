import { Router } from 'express';
import { abrirCompartimento } from '../controllers/aberturaController.js';

const router = Router();

router.post('/abrir', abrirCompartimento);

export default router;
