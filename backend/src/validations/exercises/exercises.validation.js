import { Errors } from '../../shared/utils/errors.js';
import { MUSCLE_GROUPS } from '../../models/exercises/exercise.model.js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isString = (v) => typeof v === 'string';
const trimmed = (v) => (isString(v) ? v.trim() : v);

/** Filtros de GET /exercises (query string). */
export function validateListQuery(query) {
  const details = [];
  const out = {};

  if (query.muscle_group !== undefined) {
    if (!MUSCLE_GROUPS.includes(query.muscle_group)) {
      details.push({ field: 'muscle_group', message: `Debe ser uno de: ${MUSCLE_GROUPS.join(', ')}` });
    } else {
      out.muscleGroup = query.muscle_group;
    }
  }
  if (isString(query.equipment) && query.equipment.trim() !== '') out.equipment = query.equipment.trim();
  if (isString(query.search) && query.search.trim() !== '') out.search = query.search.trim();

  // include_global: por defecto true; 'false' lo desactiva.
  out.includeGlobal = query.include_global !== 'false';

  if (details.length > 0) throw Errors.validation('Error de validación', details);
  return out;
}

/** Body de POST /exercises. */
export function validateCreateExercise(body) {
  const details = [];
  const name = trimmed(body.name);

  if (!isString(name) || name.length < 2 || name.length > 120) {
    details.push({ field: 'name', message: 'El nombre debe tener entre 2 y 120 caracteres' });
  }
  if (!MUSCLE_GROUPS.includes(body.muscle_group)) {
    details.push({ field: 'muscle_group', message: `Debe ser uno de: ${MUSCLE_GROUPS.join(', ')}` });
  }
  ['equipment', 'description', 'video_url'].forEach((f) => {
    if (body[f] !== undefined && !isString(body[f])) {
      details.push({ field: f, message: `${f} debe ser texto` });
    }
  });

  if (details.length > 0) throw Errors.validation('Error de validación', details);
  return {
    name,
    muscle_group: body.muscle_group,
    equipment: trimmed(body.equipment) || null,
    description: trimmed(body.description) || null,
    video_url: trimmed(body.video_url) || null,
  };
}

/** Body de PATCH /exercises/:id — al menos un campo, solo los permitidos. */
export function validateUpdateExercise(body) {
  const details = [];
  const out = {};

  if (body.name !== undefined) {
    const name = trimmed(body.name);
    if (!isString(name) || name.length < 2 || name.length > 120) {
      details.push({ field: 'name', message: 'El nombre debe tener entre 2 y 120 caracteres' });
    } else out.name = name;
  }
  if (body.muscle_group !== undefined) {
    if (!MUSCLE_GROUPS.includes(body.muscle_group)) {
      details.push({ field: 'muscle_group', message: `Debe ser uno de: ${MUSCLE_GROUPS.join(', ')}` });
    } else out.muscle_group = body.muscle_group;
  }
  ['equipment', 'description', 'video_url'].forEach((f) => {
    if (body[f] !== undefined) {
      if (body[f] !== null && !isString(body[f])) {
        details.push({ field: f, message: `${f} debe ser texto` });
      } else out[f] = body[f] === null ? null : trimmed(body[f]);
    }
  });

  if (Object.keys(out).length === 0) {
    details.push({ field: 'body', message: 'Enviá al menos un campo para actualizar' });
  }
  if (details.length > 0) throw Errors.validation('Error de validación', details);
  return out;
}

/** Valida el :id de la ruta (UUID). */
export function validateIdParam(params) {
  if (!isString(params.id) || !UUID_RE.test(params.id)) {
    throw Errors.validation('Error de validación', [{ field: 'id', message: 'id inválido' }]);
  }
  return { id: params.id };
}
