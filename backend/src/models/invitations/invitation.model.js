/**
 * Modelo de dominio: Invitation (onboarding de alumno por WhatsApp / QR).
 * Estructura, enums y helpers de estado. SIN lógica de negocio ni acceso a datos.
 */

/** Nombre de la tabla en la base de datos. */
export const INVITATIONS_TABLE = 'invitations';

/** Objetivos válidos del alumno. */
export const GOALS = ['tonify', 'weight_loss', 'hypertrophy', 'strength'];

/** Canales de envío de la invitación. */
export const DELIVERY_CHANNELS = ['whatsapp', 'qr', 'both'];

/** Horas de validez de una invitación desde su creación. */
export const INVITATION_EXPIRY_HOURS = 48;

/** ¿El canal elegido incluye envío por WhatsApp? */
export const includesWhatsapp = (channel) => channel === 'whatsapp' || channel === 'both';

/** ¿El canal elegido incluye generación de QR? */
export const includesQr = (channel) => channel === 'qr' || channel === 'both';

/** ¿La invitación ya fue usada? */
export const isUsed = (row) => Boolean(row?.used_at);

/** ¿La invitación expiró? */
export const isExpired = (row, now = new Date()) => new Date(row.expires_at) < now;

/**
 * Proyección pública para GET /invitations/:token: los datos precargados que
 * el alumno ve antes de aceptar. `student_goal` se expone como `goal`.
 */
export function toPublicInvitation(row) {
  if (!row) return null;
  return {
    trainer: row.trainer,
    student_name: row.student_name,
    student_email: row.student_email,
    goal: row.student_goal,
    expires_at: row.expires_at,
  };
}
