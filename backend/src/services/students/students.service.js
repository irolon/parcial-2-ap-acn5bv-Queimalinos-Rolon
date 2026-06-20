import { hashPassword } from '../../shared/utils/password.js';
import { Errors } from '../../shared/utils/errors.js';
import { issueTokens } from '../auth/auth.service.js';
import * as invitationsRepo from '../../repositories/invitations/invitations.repository.js';
import * as studentsRepo from '../../repositories/students/students.repository.js';
import { isUsed, isExpired } from '../../models/invitations/invitation.model.js';

/** Lista los alumnos del trainer con paginación y filtros (GET /students). */
export async function list(trainerId, { active, search, page = 1, limit = 20 } = {}) {
  const { data, total } = await studentsRepo.findStudentsByTrainer({
    trainerId,
    active,
    search,
    page,
    limit,
  });
  return {
    data,
    meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
  };
}

/**
 * CU-02 — Crea la cuenta del alumno a partir del token de invitación, marca la
 * invitación como usada y devuelve al alumno autenticado (con tokens de sesión).
 */
export async function registerFromInvitation({ token, password }) {
  const invitation = await invitationsRepo.findInvitationByToken(token);
  if (!invitation) throw Errors.invitationNotFound();
  if (isUsed(invitation)) throw Errors.invitationUsed();
  if (isExpired(invitation)) throw Errors.invitationExpired();

  const passwordHash = await hashPassword(password);
  const student = await studentsRepo.createStudent({
    trainerId: invitation.trainer.id,
    name: invitation.student_name,
    email: invitation.student_email,
    goal: invitation.student_goal,
    passwordHash,
  });

  await invitationsRepo.markInvitationUsed(invitation.id);

  const tokens = await issueTokens(student, 'student');
  return { student, ...tokens };
}
