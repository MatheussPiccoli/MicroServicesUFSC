import { Router } from 'express';
import {
  getAllLockers,
  getLockerById,
  createLocker,
  getCompartimentosDisponiveis,
  setOcupado,
} from '../controllers/lockersController.js';

const router = Router();

router.get('/', getAllLockers);
router.get('/:id', getLockerById);
router.post('/', createLocker);
router.get('/:id/compartimentos/disponiveis', getCompartimentosDisponiveis);

router.patch('/compartimentos/ocupacao', setOcupado);

export default router;
