import { supabase } from '../../shared/supabase.js';
import { Errors } from '../../shared/utils/errors.js';
import { STUDENTS_TABLE, STUDENT_PUBLIC_COLUMNS } from '../../models/students/student.model.js';

/** Lista (paginada) los alumnos de un trainer, con filtros opcionales. */
export async function findStudentsByTrainer({ trainerId, active, search, page, limit }) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  let query = supabase
    .from(STUDENTS_TABLE)
    .select(STUDENT_PUBLIC_COLUMNS, { count: 'exact' })
    .eq('trainer_id', trainerId);
  if (active !== undefined) query = query.eq('active', active);
  if (search) query = query.ilike('name', `%${search}%`);
  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, to);
  if (error) throw Errors.internal(error.message);
  return { data, total: count ?? 0 };
}

/** Busca un alumno por email, incluyendo el password_hash (para login). */
export async function findStudentByEmailWithHash(email) {
  const { data, error } = await supabase
    .from(STUDENTS_TABLE)
    .select(`${STUDENT_PUBLIC_COLUMNS}, password_hash`)
    .eq('email', email)
    .maybeSingle();
  if (error) throw Errors.internal(error.message);
  return data;
}

/** Crea un alumno y devuelve sus campos públicos (sin el hash). */
export async function createStudent({ trainerId, name, email, goal, passwordHash }) {
  const { data, error } = await supabase
    .from(STUDENTS_TABLE)
    .insert({
      trainer_id: trainerId,
      name,
      email,
      goal,
      password_hash: passwordHash,
    })
    .select(STUDENT_PUBLIC_COLUMNS)
    .single();
  // 23505 = unique_violation (email duplicado).
  if (error && error.code === '23505') throw Errors.studentEmailExists();
  if (error) throw Errors.internal(error.message);
  return data;
}
