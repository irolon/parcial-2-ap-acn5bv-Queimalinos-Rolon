/**
 * Modelo de dominio: Student.
 * Estructura de datos pura + mapeo de filas. SIN lógica de negocio.
 */

/** Nombre de la tabla en la base de datos. */
export const STUDENTS_TABLE = 'students';

/** Columnas públicas del alumno (nunca incluye password_hash). */
export const STUDENT_PUBLIC_COLUMNS =
  'id, trainer_id, name, email, goal, birth_date, avatar_url, active, gym_equipment, injuries, level, created_at';

/** Mapea una fila cruda a la entidad pública Student, descartando el hash. */
export function toStudent(row) {
  if (!row) return null;
  const { password_hash: _passwordHash, ...student } = row;
  return student;
}
