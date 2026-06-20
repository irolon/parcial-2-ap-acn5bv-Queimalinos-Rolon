import { Errors } from '../../shared/utils/errors.js';
import { ROUTINE_GOALS, DAYS } from '../../models/routines/routine.model.js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isString = (v) => typeof v === 'string';
const isUuid = (v) => isString(v) && UUID_RE.test(v);
const isPosInt = (v) => Number.isInteger(v) && v > 0;
const trimmed = (v) => (isString(v) ? v.trim() : v);

/** Valida un item de exercises[] y devuelve la versión saneada. */
function validateExerciseItem(item, idx, details) {
  const prefix = `exercises[${idx}]`;
  if (!item || typeof item !== 'object') {
    details.push({ field: prefix, message: 'Debe ser un objeto' });
    return null;
  }
  if (!isUuid(item.exercise_id)) {
    details.push({ field: `${prefix}.exercise_id`, message: 'exercise_id inválido' });
  }
  if (!isPosInt(item.sets)) {
    details.push({ field: `${prefix}.sets`, message: 'sets debe ser un entero positivo' });
  }
  if (!isPosInt(item.reps)) {
    details.push({ field: `${prefix}.reps`, message: 'reps debe ser un entero positivo' });
  }
  return {
    exercise_id: item.exercise_id,
    sets: item.sets,
    reps: item.reps,
    rest_seconds: Number.isInteger(item.rest_seconds) ? item.rest_seconds : null,
    suggested_kg: typeof item.suggested_kg === 'number' ? item.suggested_kg : null,
    tempo: trimmed(item.tempo) || null,
    notes: trimmed(item.notes) || null,
    order: Number.isInteger(item.order) ? item.order : undefined,
  };
}

function validateExercisesArray(exercises, details) {
  if (!Array.isArray(exercises) || exercises.length === 0) {
    details.push({ field: 'exercises', message: 'Debe incluir al menos un ejercicio' });
    return [];
  }
  return exercises.map((e, i) => validateExerciseItem(e, i, details));
}

/** Body de POST /routines. */
export function validateCreateRoutine(body) {
  const details = [];
  const name = trimmed(body.name);

  if (!isUuid(body.student_id)) {
    details.push({ field: 'student_id', message: 'student_id inválido' });
  }
  if (body.template_id !== undefined && body.template_id !== null && !isUuid(body.template_id)) {
    details.push({ field: 'template_id', message: 'template_id inválido' });
  }
  if (!isString(name) || name.length < 2 || name.length > 120) {
    details.push({ field: 'name', message: 'El nombre debe tener entre 2 y 120 caracteres' });
  }
  if (!ROUTINE_GOALS.includes(body.goal)) {
    details.push({ field: 'goal', message: `goal debe ser uno de: ${ROUTINE_GOALS.join(', ')}` });
  }
  if (!Array.isArray(body.days) || body.days.length === 0 || !body.days.every((d) => DAYS.includes(d))) {
    details.push({ field: 'days', message: `days debe ser un arreglo no vacío de: ${DAYS.join(', ')}` });
  }
  const exercises = validateExercisesArray(body.exercises, details);

  if (details.length > 0) throw Errors.validation('Error de validación', details);
  return {
    student_id: body.student_id,
    template_id: body.template_id ?? null,
    name,
    goal: body.goal,
    days: body.days,
    exercises,
  };
}

/** Body de POST /routines/:id/exercises. */
export function validateAddExercises(body) {
  const details = [];
  const exercises = validateExercisesArray(body.exercises, details);
  if (details.length > 0) throw Errors.validation('Error de validación', details);
  return { exercises };
}

/** Body de PATCH /routines/:id — al menos un campo, solo los permitidos. */
export function validateUpdateRoutine(body) {
  const details = [];
  const out = {};

  if (body.name !== undefined) {
    const name = trimmed(body.name);
    if (!isString(name) || name.length < 2 || name.length > 120) {
      details.push({ field: 'name', message: 'El nombre debe tener entre 2 y 120 caracteres' });
    } else out.name = name;
  }
  if (body.goal !== undefined) {
    if (!ROUTINE_GOALS.includes(body.goal)) {
      details.push({ field: 'goal', message: `goal debe ser uno de: ${ROUTINE_GOALS.join(', ')}` });
    } else out.goal = body.goal;
  }
  if (body.days !== undefined) {
    if (!Array.isArray(body.days) || body.days.length === 0 || !body.days.every((d) => DAYS.includes(d))) {
      details.push({ field: 'days', message: `days debe ser un arreglo no vacío de: ${DAYS.join(', ')}` });
    } else out.days = body.days;
  }
  if (body.active !== undefined) {
    if (typeof body.active !== 'boolean') {
      details.push({ field: 'active', message: 'active debe ser booleano' });
    } else out.active = body.active;
  }

  if (Object.keys(out).length === 0) {
    details.push({ field: 'body', message: 'Enviá al menos un campo para actualizar' });
  }
  if (details.length > 0) throw Errors.validation('Error de validación', details);
  return out;
}

/** Filtros de GET /routines. */
export function validateListQuery(query) {
  const details = [];
  const out = {};
  if (query.student_id !== undefined) {
    if (!isUuid(query.student_id)) details.push({ field: 'student_id', message: 'student_id inválido' });
    else out.studentId = query.student_id;
  }
  if (query.active !== undefined) out.active = query.active !== 'false';
  if (details.length > 0) throw Errors.validation('Error de validación', details);
  return out;
}

/** Valida el :id de la ruta (UUID). */
export function validateIdParam(params) {
  if (!isUuid(params.id)) {
    throw Errors.validation('Error de validación', [{ field: 'id', message: 'id inválido' }]);
  }
  return { id: params.id };
}
