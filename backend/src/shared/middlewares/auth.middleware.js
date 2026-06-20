import { verifyAccessToken } from '../utils/jwt.js';
import { Errors } from '../utils/errors.js';

/**
 * Valida el header Authorization: Bearer <jwt> y adjunta el usuario
 * autenticado a req.user = { id, role, email }.
 * Si no hay token o es inválido → 401 (vía error.middleware).
 */
export function authenticate(req, _res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(Errors.unauthorized('Falta el token de autenticación'));
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role, email: payload.email };
    return next();
  } catch {
    return next(Errors.unauthorized('Token inválido o expirado'));
  }
}
