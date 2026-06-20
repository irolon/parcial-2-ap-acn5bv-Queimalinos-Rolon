import { Router } from 'express';
import { health, healthDb } from '../../controllers/health/health.controller.js';

const router = Router();

router.get('/', health);
router.get('/db', healthDb);

export default router;
