import { supabase } from '../../shared/supabase.js';
import { Errors } from '../../shared/utils/errors.js';
import { INVITATIONS_TABLE } from '../../models/invitations/invitation.model.js';
import { STUDENTS_TABLE } from '../../models/students/student.model.js';

// Datos del trainer embebidos en la invitación (para los datos precargados).
const INVITATION_WITH_TRAINER =
  'id, token, student_name, student_email, student_goal, expires_at, used_at, ' +
  'trainer:trainer_id (id, name, specialty, avatar_url)';

/** Crea una invitación y devuelve id, token y expiración. */
export async function createInvitation(data) {
  const { data: row, error } = await supabase
    .from(INVITATIONS_TABLE)
    .insert({
      trainer_id: data.trainerId,
      token: data.token,
      student_name: data.studentName,
      student_email: data.studentEmail,
      student_phone: data.studentPhone,
      student_goal: data.studentGoal,
      delivery_channel: data.deliveryChannel,
      expires_at: data.expiresAt,
    })
    .select('id, token, expires_at')
    .single();
  if (error) throw Errors.internal(error.message);
  return row;
}

/** Busca una invitación por token, con los datos del trainer embebidos. */
export async function findInvitationByToken(token) {
  const { data, error } = await supabase
    .from(INVITATIONS_TABLE)
    .select(INVITATION_WITH_TRAINER)
    .eq('token', token)
    .maybeSingle();
  if (error) throw Errors.internal(error.message);
  return data;
}

/** Marca una invitación como usada (used_at = now). */
export async function markInvitationUsed(id) {
  const { error } = await supabase
    .from(INVITATIONS_TABLE)
    .update({ used_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw Errors.internal(error.message);
}

/** Indica si ya existe un alumno registrado con ese email. */
export async function studentEmailExists(email) {
  const { data, error } = await supabase
    .from(STUDENTS_TABLE)
    .select('id')
    .eq('email', email)
    .maybeSingle();
  if (error) throw Errors.internal(error.message);
  return Boolean(data);
}
