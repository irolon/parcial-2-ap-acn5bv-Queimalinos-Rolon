/**
 * Modelo de dominio: RefreshToken.
 * Metadata de la entidad y helpers de estructura. SIN lógica de negocio.
 */

/** Nombre de la tabla en la base de datos. */
export const REFRESH_TOKENS_TABLE = 'refresh_tokens';

/** Roles válidos asociados a un refresh token. */
export const REFRESH_TOKEN_ROLES = ['trainer', 'student'];

/** Indica si un registro de refresh token está vigente (no revocado ni expirado). */
export function isActive(row, now = new Date()) {
  if (!row || row.revoked_at) return false;
  return new Date(row.expires_at) > now;
}
