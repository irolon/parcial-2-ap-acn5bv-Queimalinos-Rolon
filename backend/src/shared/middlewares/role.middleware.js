import { Errors } from '../utils/errors.js';

/**
 * Restringe un endpoint a uno o más roles.
 * Debe usarse SIEMPRE después de authenticate.
 *
 *   router.post('/invitations', authenticate, requireRole('trainer'), ...)
 */
export function requireRole(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(Errors.unauthorized());
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(Errors.forbidden());
    }
    return next();
  };
}
