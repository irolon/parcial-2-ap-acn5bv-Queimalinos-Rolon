import { Router } from 'express';
import { validate } from '../../shared/middlewares/validation.middleware.js';
import { authenticate } from '../../shared/middlewares/auth.middleware.js';
import {
  validateRegister,
  validateLogin,
  validateRefresh,
} from '../../validations/auth/auth.validation.js';
import * as authController from '../../controllers/auth/auth.controller.js';

const router = Router();

router.post('/register', validate(validateRegister), authController.register);
router.post('/login', validate(validateLogin), authController.login);
router.post('/refresh', validate(validateRefresh), authController.refresh);
router.post('/logout', authenticate, validate(validateRefresh), authController.logout);

export default router;
