import { Router } from 'express';
import { validate } from '../../shared/middlewares/validation.middleware.js';
import { authenticate } from '../../shared/middlewares/auth.middleware.js';
import { requireRole } from '../../shared/middlewares/role.middleware.js';
import {
  validateCreateInvitation,
  validateTokenParam,
} from '../../validations/invitations/invitations.validation.js';
import * as invitationsController from '../../controllers/invitations/invitations.controller.js';

const router = Router();

// Genera invitación — solo trainers autenticados.
router.post(
  '/',
  authenticate,
  requireRole('trainer'),
  validate(validateCreateInvitation),
  invitationsController.create
);

// Valida token y devuelve datos precargados — público (lo abre el alumno).
router.get('/:token', validate(validateTokenParam, 'params'), invitationsController.getByToken);

export default router;
