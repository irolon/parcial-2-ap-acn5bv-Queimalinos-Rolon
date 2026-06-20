import { Router } from 'express';
import { validate } from '../../shared/middlewares/validation.middleware.js';
import { authenticate } from '../../shared/middlewares/auth.middleware.js';
import { requireRole } from '../../shared/middlewares/role.middleware.js';
import {
  validateRegisterFromInvitation,
  validateListQuery,
} from '../../validations/students/students.validation.js';
import * as studentsController from '../../controllers/students/students.controller.js';

const router = Router();

// Lista de alumnos del trainer autenticado.
router.get('/', authenticate, requireRole('trainer'), validate(validateListQuery, 'query'), studentsController.list);

// Alta del alumno desde invitación — público (lo ejecuta el alumno con su token).
router.post('/', validate(validateRegisterFromInvitation), studentsController.registerFromInvitation);

export default router;
