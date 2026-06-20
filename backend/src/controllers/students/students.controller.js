import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import * as studentsService from '../../services/students/students.service.js';

/** GET /students — lista los alumnos del trainer. 200 → { data, meta } */
export const list = asyncHandler(async (req, res) => {
  const result = await studentsService.list(req.user.id, req.query);
  res.json(result);
});

/**
 * POST /students — alta del alumno desde el token de invitación (público).
 * 201 → { student, token, refresh_token }
 */
export const registerFromInvitation = asyncHandler(async (req, res) => {
  const result = await studentsService.registerFromInvitation(req.body);
  res.status(201).json(result);
});
