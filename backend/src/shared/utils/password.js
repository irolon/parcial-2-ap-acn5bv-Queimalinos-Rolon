import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/** Genera el hash de una contraseña en texto plano. */
export function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

/** Compara una contraseña en texto plano contra su hash. */
export function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}
