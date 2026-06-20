import { jest } from '@jest/globals';

// ── Mock del repository (capa de datos) ──────────────────────────────────────
// La ruta debe resolver al MISMO archivo que importa el service, para que el
// mock aplique (ESM resuelve por path absoluto).
const mockRepo = {
  createTrainer: jest.fn(),
  findTrainerByEmailWithHash: jest.fn(),
  saveRefreshToken: jest.fn(),
  findRefreshToken: jest.fn(),
  revokeRefreshToken: jest.fn(),
};
jest.unstable_mockModule(
  '../../../../src/repositories/auth/auth.repository.js',
  () => mockRepo
);

// El login también consulta el repo de students (login role-agnóstico).
const mockStudentsRepo = {
  findStudentByEmailWithHash: jest.fn().mockResolvedValue(null),
};
jest.unstable_mockModule(
  '../../../../src/repositories/students/students.repository.js',
  () => mockStudentsRepo
);

// Imports dinámicos (obligatorio con ESM + unstable_mockModule).
const authService = await import('../../../../src/services/auth/auth.service.js');
const { hashPassword } = await import('../../../../src/shared/utils/password.js');
const { verifyAccessToken, hashToken } = await import('../../../../src/shared/utils/jwt.js');

const TRAINER = {
  id: 'trainer-uuid-1',
  name: 'Ignacio Rolon',
  email: 'ignacio@fittrainer.app',
  specialty: 'Fuerza',
  avatar_url: null,
  created_at: '2026-06-20T10:00:00Z',
};

describe('auth.service', () => {
  describe('register', () => {
    it('hashea la contraseña, crea el trainer y devuelve tokens', async () => {
      mockRepo.createTrainer.mockResolvedValue(TRAINER);

      const result = await authService.register({
        name: 'Ignacio Rolon',
        email: 'ignacio@fittrainer.app',
        password: 'Password1',
        specialty: 'Fuerza',
      });

      // La contraseña que llega al repo NO es texto plano.
      const passedHash = mockRepo.createTrainer.mock.calls[0][0].passwordHash;
      expect(passedHash).toBeDefined();
      expect(passedHash).not.toBe('Password1');

      expect(result.trainer).toEqual(TRAINER);
      expect(typeof result.token).toBe('string');
      expect(typeof result.refresh_token).toBe('string');

      // El access token es un JWT válido con el id y rol correctos.
      const decoded = verifyAccessToken(result.token);
      expect(decoded.sub).toBe(TRAINER.id);
      expect(decoded.role).toBe('trainer');

      // Se persistió el refresh token (su hash).
      expect(mockRepo.saveRefreshToken).toHaveBeenCalledTimes(1);
    });
  });

  describe('login', () => {
    it('devuelve user + tokens cuando las credenciales son correctas', async () => {
      const password_hash = await hashPassword('Password1');
      mockRepo.findTrainerByEmailWithHash.mockResolvedValue({ ...TRAINER, password_hash });

      const result = await authService.login({
        email: 'ignacio@fittrainer.app',
        password: 'Password1',
      });

      expect(result.user.role).toBe('trainer');
      expect(result.user.password_hash).toBeUndefined(); // nunca se filtra el hash
      expect(typeof result.token).toBe('string');
      expect(typeof result.refresh_token).toBe('string');
    });

    it('lanza INVALID_CREDENTIALS si el email no existe (ni trainer ni alumno)', async () => {
      mockRepo.findTrainerByEmailWithHash.mockResolvedValue(null);
      mockStudentsRepo.findStudentByEmailWithHash.mockResolvedValue(null);
      await expect(
        authService.login({ email: 'noexiste@x.com', password: 'Password1' })
      ).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS', statusCode: 401 });
    });

    it('autentica a un alumno cuando no es trainer pero sí student', async () => {
      const password_hash = await hashPassword('Password1');
      mockRepo.findTrainerByEmailWithHash.mockResolvedValue(null);
      mockStudentsRepo.findStudentByEmailWithHash.mockResolvedValue({
        id: 'student-1',
        name: 'Pedro',
        email: 'pedro@mail.com',
        goal: 'hypertrophy',
        password_hash,
      });

      const result = await authService.login({ email: 'pedro@mail.com', password: 'Password1' });

      expect(result.user.role).toBe('student');
      expect(result.user.password_hash).toBeUndefined();
      expect(typeof result.token).toBe('string');
    });

    it('lanza INVALID_CREDENTIALS si la contraseña es incorrecta', async () => {
      const password_hash = await hashPassword('Password1');
      mockRepo.findTrainerByEmailWithHash.mockResolvedValue({ ...TRAINER, password_hash });
      await expect(
        authService.login({ email: 'ignacio@fittrainer.app', password: 'MalaPass9' })
      ).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS' });
    });
  });

  describe('refresh', () => {
    it('emite un nuevo access token con un refresh válido', async () => {
      mockRepo.findRefreshToken.mockResolvedValue({
        id: 'rt-1',
        user_id: TRAINER.id,
        role: 'trainer',
        expires_at: new Date(Date.now() + 86_400_000).toISOString(),
        revoked_at: null,
      });

      const result = await authService.refresh({ refresh_token: 'algun-token' });
      expect(verifyAccessToken(result.token).sub).toBe(TRAINER.id);
      // Busca por el HASH del token, no por el token en claro.
      expect(mockRepo.findRefreshToken).toHaveBeenCalledWith(hashToken('algun-token'));
    });

    it('rechaza un refresh token inexistente', async () => {
      mockRepo.findRefreshToken.mockResolvedValue(null);
      await expect(authService.refresh({ refresh_token: 'x' })).rejects.toMatchObject({
        statusCode: 401,
      });
    });

    it('rechaza un refresh token expirado', async () => {
      mockRepo.findRefreshToken.mockResolvedValue({
        user_id: TRAINER.id,
        role: 'trainer',
        expires_at: new Date(Date.now() - 1000).toISOString(),
        revoked_at: null,
      });
      await expect(authService.refresh({ refresh_token: 'x' })).rejects.toMatchObject({
        statusCode: 401,
      });
    });
  });

  describe('logout', () => {
    it('revoca el refresh token por su hash', async () => {
      mockRepo.revokeRefreshToken.mockResolvedValue();
      await authService.logout({ refresh_token: 'algun-token' });
      expect(mockRepo.revokeRefreshToken).toHaveBeenCalledWith(hashToken('algun-token'));
    });
  });
});
