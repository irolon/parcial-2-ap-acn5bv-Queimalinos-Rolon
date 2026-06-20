# FitTrainer — Backend

API REST (monolito modular) en **Node.js + Express**, datos en **Supabase/PostgreSQL**.

## Patrón por módulo: Controller → Service → Repository → Model

| Capa | Archivo | Responsabilidad |
|------|---------|-----------------|
| Controller | `*.controller.js` | Recibe el request, llama al service, responde. Nada más. |
| Service | `*.service.js` | Lógica de negocio, permisos, orquestación. |
| Repository | `*.repository.js` | Queries a Supabase. Única capa que toca la DB. |
| Model | `*.model.js` | Entidad de dominio: estructura + mapeo de filas. Sin lógica. |
| (Routes) | `*.routes.js` | Define rutas y enchufa middlewares (validación, auth, rol). |
| (Validation) | `*.validation.js` | Validadores de input del módulo. |

> **Regla:** cada capa solo conoce a la inmediatamente inferior. El Controller nunca toca la DB.

## Estructura

Organización **por capa**, y dentro de cada capa una **carpeta por módulo**.
La capa dice el "qué" (controller, service…) y el submódulo dice el "de quién" (auth, …).

Módulos implementados: `health`, `auth`, `invitations`, `students`, `exercises`, `routines`.

```
src/
├── config/env.js            # carga + validación de variables de entorno
├── shared/                  # transversal a todos los módulos
│   ├── supabase.js          # cliente Supabase (service role)
│   ├── middlewares/         # authenticate, requireRole, validate, errores
│   └── utils/               # errors, password (bcrypt), jwt, qr, asyncHandler
├── controllers/<modulo>/<modulo>.controller.js
├── services/<modulo>/<modulo>.service.js
├── repositories/<modulo>/<modulo>.repository.js
├── models/<modulo>/<entidad>.model.js
├── validations/<modulo>/<modulo>.validation.js
├── routes/<modulo>/<modulo>.routes.js
├── database/
│   ├── schema.sql           # DDL de todas las tablas (Fase 1 + 2)
│   └── seed.sql             # ejercicios globales iniciales
├── app.js                   # arma la app de Express y monta las rutas
└── server.js                # entrypoint (levanta el server)

tests/                       # TODOS los tests viven acá (fuera de src/)
├── unit/                    # unitarios — espejan la estructura de src/
│   ├── services/<modulo>/<modulo>.service.test.js
│   └── models/auth/trainer.model.test.js
└── integration/             # end-to-end de endpoints HTTP (Supertest) — pendiente
```

> Cada módulo nuevo agrega su carpeta `<modulo>/` dentro de cada capa que
> necesite: `controllers/<modulo>/`, `services/<modulo>/`, etc. El módulo `auth`
> sirve de referencia del patrón.

## Setup

```bash
cp .env.example .env     # completar con credenciales de Supabase + JWT_SECRET
npm install
```

Luego, en el **SQL Editor** de Supabase, ejecutar en orden:
1. `src/database/schema.sql` — crea todas las tablas.
2. `src/database/seed.sql` — carga los ejercicios globales iniciales.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Dev con nodemon (hot reload) |
| `npm start` | Producción |
| `npm test` | Tests (Jest) |
| `npm run test:coverage` | Tests con cobertura |
| `npm run lint` | ESLint |

## Endpoints

Rol: `—` público · `trainer` / `student` requieren `Authorization: Bearer <token>` con ese rol.

### Health
| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| GET | `/health` | — | Liveness |
| GET | `/health/db` | — | Conectividad con Supabase |

### Auth
| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| POST | `/api/auth/register` | — | Registra un trainer |
| POST | `/api/auth/login` | — | Login (trainer o alumno; resuelve el rol) |
| POST | `/api/auth/refresh` | — | Nuevo access token |
| POST | `/api/auth/logout` | trainer/student | Revoca el refresh token |

### Invitaciones (onboarding) — Fase 1
| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| POST | `/api/invitations` | trainer | Genera invitación (token, `join_url`, QR base64 y/o link de WhatsApp) |
| GET | `/api/invitations/:token` | — | Valida token y devuelve datos precargados |

### Alumnos — Fase 1/2
| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| POST | `/api/students` | — | Alta del alumno desde token de invitación |
| GET | `/api/students` | trainer | Lista alumnos del PT (`active`, `search`, `page`, `limit`) |

### Ejercicios — Fase 2
| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| GET | `/api/exercises` | trainer | Biblioteca: globales + propios (`muscle_group`, `equipment`, `search`, `include_global`) |
| POST | `/api/exercises` | trainer | Crea ejercicio propio |
| PATCH | `/api/exercises/:id` | trainer | Edita (solo el dueño) |
| DELETE | `/api/exercises/:id` | trainer | Elimina (solo el dueño) |

### Rutinas — Fase 2
| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| POST | `/api/routines` | trainer | Crea y asigna rutina a un alumno (con ejercicios) |
| GET | `/api/routines` | trainer | Lista rutinas (`student_id`, `active`) |
| GET | `/api/routines/:id` | trainer | Detalle de la rutina con sus ejercicios |
| PATCH | `/api/routines/:id` | trainer | Edita / desactiva una rutina |
| POST | `/api/routines/:id/exercises` | trainer | Agrega ejercicios a la rutina |
| GET | `/api/routines/today` | student | Rutina activa del alumno para hoy |

### Autenticación

- **Access token:** JWT firmado con `JWT_SECRET` (`{ sub, role, email }`), expira según `JWT_EXPIRES_IN`.
- **Refresh token:** token opaco; en la DB se guarda solo su hash SHA-256. El logout lo revoca.

### Ejemplo

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ignacio","email":"ignacio@fittrainer.app","password":"Password1"}'
```

## Notas de implementación (desvíos respecto del DER de Notion)

Estos ajustes fueron necesarios para que el backend funcione; conviene reflejarlos
en el DER. Todos están aplicados en `src/database/schema.sql`.

1. **`trainers.password_hash` y `students.password_hash`** — el DER no incluía
   credenciales; el login por email/password las requiere.
2. **Tabla `refresh_tokens`** — no estaba en el DER; permite revocar tokens en el logout.
3. **`invitations.student_email`** — lo exige el contrato de API (entra en POST y sale en GET).
4. **`routine_exercises.order_index`** — el DER lo llamaba `order`, palabra reservada en SQL.
5. **Enum de `exercises.muscle_group`** — el DER no listaba los valores; se definió el set
   (`chest, back, shoulders, legs, glutes, biceps, triceps, core, calves, full_body, cardio`).
6. **Expiración de invitaciones: 48 hs** (constante `INVITATION_EXPIRY_HOURS`) — CU-01 y el
   Plan dicen 48 hs; el DER/ejemplo de contrato mostraban 72 hs. A confirmar.
