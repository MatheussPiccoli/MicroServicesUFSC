import { Router } from 'express';
import {
  getAllEntregas,
  getEntregaById,
  registrarEntrega,
  retirarEntrega,
} from '../controllers/entregasController.js';

const router = Router();

router.get('/', getAllEntregas);
router.get('/:id', getEntregaById);
router.post('/', registrarEntrega);
router.post('/:id/retirar', retirarEntrega);

export default router;
