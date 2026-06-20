import { Errors } from '../../shared/utils/errors.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isString = (v) => typeof v === 'string';
const trimmed = (v) => (isString(v) ? v.trim() : v);

/** Acumula errores de campo y lanza un único VALIDATION_ERROR si hay alguno. */
function throwIfInvalid(details) {
  if (details.length > 0) {
    throw Errors.validation('Error de validación', details);
  }
}

function checkEmail(email, details) {
  if (!isString(email) || !EMAIL_RE.test(email.trim())) {
    details.push({ field: 'email', message: 'Email con formato inválido' });
  }
}

function checkPassword(password, details, { full = true } = {}) {
  if (!isString(password) || password.length < 8) {
    details.push({ field: 'password', message: 'La contraseña debe tener al menos 8 caracteres' });
    return;
  }
  if (full && !/[A-Z]/.test(password)) {
    details.push({ field: 'password', message: 'La contraseña debe incluir al menos 1 mayúscula' });
  }
  if (full && !/[0-9]/.test(password)) {
    details.push({ field: 'password', message: 'La contraseña debe incluir al menos 1 número' });
  }
}

/** Valida el body de POST /auth/register. */
export function validateRegister(body) {
  const details = [];
  const name = trimmed(body.name);
  const email = trimmed(body.email);
  const { password, specialty } = body;

  if (!isString(name) || name.length < 2 || name.length > 100) {
    details.push({ field: 'name', message: 'El nombre debe tener entre 2 y 100 caracteres' });
  }
  checkEmail(email, details);
  checkPassword(password, details);
  if (specialty !== undefined && !isString(specialty)) {
    details.push({ field: 'specialty', message: 'specialty debe ser texto' });
  }

  throwIfInvalid(details);
  return {
    name,
    email: email.toLowerCase(),
    password,
    specialty: specialty ? trimmed(specialty) : null,
  };
}

/** Valida el body de POST /auth/login. */
export function validateLogin(body) {
  const details = [];
  const email = trimmed(body.email);
  checkEmail(email, details);
  if (!isString(body.password) || body.password.length === 0) {
    details.push({ field: 'password', message: 'La contraseña es requerida' });
  }
  throwIfInvalid(details);
  return { email: email.toLowerCase(), password: body.password };
}

/** Valida el body de POST /auth/refresh y /auth/logout. */
export function validateRefresh(body) {
  if (!isString(body.refresh_token) || body.refresh_token.trim() === '') {
    throw Errors.validation('Error de validación', [
      { field: 'refresh_token', message: 'refresh_token es requerido' },
    ]);
  }
  return { refresh_token: body.refresh_token.trim() };
}
