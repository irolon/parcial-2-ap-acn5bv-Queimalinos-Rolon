import { Errors } from '../../shared/utils/errors.js';

const isString = (v) => typeof v === 'string';

/**
 * Valida el body de POST /students (alta desde invitación).
 * El contrato pide solo: token y password (mínimo 8 caracteres).
 */
export function validateRegisterFromInvitation(body) {
  const details = [];

  if (!isString(body.token) || body.token.trim() === '') {
    details.push({ field: 'token', message: 'token es requerido' });
  }
  if (!isString(body.password) || body.password.length < 8) {
    details.push({ field: 'password', message: 'La contraseña debe tener al menos 8 caracteres' });
  }

  if (details.length > 0) throw Errors.validation('Error de validación', details);

  return { token: body.token.trim(), password: body.password };
}

/** Valida la query de GET /students (active, search, page, limit). */
export function validateListQuery(query) {
  const out = {};
  if (query.active !== undefined) out.active = query.active !== 'false';
  if (isString(query.search) && query.search.trim() !== '') out.search = query.search.trim();

  const page = Number.parseInt(query.page, 10);
  out.page = Number.isInteger(page) && page > 0 ? page : 1;

  const limit = Number.parseInt(query.limit, 10);
  out.limit = Number.isInteger(limit) && limit > 0 ? Math.min(limit, 100) : 20;

  return out;
}
