# Objetivo General del Proyecto — FitTrainer

> **Proyecto:** FitTrainer — Plataforma web + Android para personal trainers y sus alumnos
> **Materia:** Administración de Proyectos — Comisión ACN5BV
> **Profesor:** Sergio Medina
> **Integrantes:** Pablo Queimaliños · Ignacio Rolón
> **Versión:** v3.0 · **Fecha:** junio 2026

## Historial de versiones

| Versión | Cambio | Autor |
|---------|--------|-------|
| v1.0 | Objetivo general del proyecto (SMART) | Equipo |
| v2.0 | Se agrega el análisis de interesados y el perfil de 3 stakeholders | Equipo |
| v3.0 | Se define la metodología de trabajo (Kanban): características y justificación | Equipo |

---

## Objetivo general

Desarrollar el **MVP de FitTrainer**, una plataforma con dos clientes (aplicación web y aplicación móvil Android) que digitalice la relación entre el personal trainer y sus alumnos, permitiendo registrar alumnos, armar y asignar rutinas con asistencia de IA, registrar las sesiones de entrenamiento (incluso offline) y hacer seguimiento del progreso, sumando gamificación para mejorar la adherencia.

---

## Objetivo en formato SMART

| Criterio | Detalle |
|----------|---------|
| **S — Específico** | Desarrollar el MVP de FitTrainer (web + Android) que permita al personal trainer registrar alumnos, armar y asignar rutinas con un asistente IA, y que el alumno registre sus sesiones y visualice su progreso. |
| **M — Medible** | Completar las **4 milestones** del MVP: **24 historias de usuario** . Métrica de éxito: un PT puede dar de alta un alumno y asignarle su primera rutina en **menos de 5 minutos**, y el alumno registra una sesión completa **funcionando offline**. |
| **A — Alcanzable** | Equipo de **2 desarrolladores full-stack** con un stack conocido (React, Kotlin/JAVA, Node.js/Express, Supabase/PostgreSQL), trabajando en **sprints de 2 semanas** durante 14 semanas. |
| **R — Relevante** | Resuelve un dolor real del personal trainer independiente de LATAM (armado manual de rutinas en Excel/PDF y seguimiento improvisado por WhatsApp), con un producto **en español** y a **precio en pesos**. |
| **T — Temporal** | **MVP en 10 semanas** (fases 1–3) y versión completa con IA y gamificación en **14 semanas**. |

---

## Enunciado SMART integrado

> Desarrollar el MVP de FitTrainer (web + Android) — que permita registrar alumnos , armar rutinas asistidas por IA y registrar sesiones con seguimiento de progreso — completando 4 milestones (24 historias de usuario) con un equipo de 2 desarrolladores en sprints de 2 semanas, logrando que un PT dé de alta a un alumno y le asigne su primera rutina en menos de 5 minutos, con el MVP en 10 semanas y la versión completa en 14 semanas.

---

## Análisis de interesados (stakeholders)

Se identifican los interesados del proyecto y se construye el perfil de los principales, clasificándolos según su nivel de **poder** e **interés** para definir la estrategia de gestión de cada uno.

### Matriz poder / interés

| Interesado | Poder | Interés | Estrategia de gestión |
|------------|-------|---------|------------------------|
| Personal Trainer (cliente/usuario) | Alto | Alto | Gestionar de cerca — es el comprador y usuario clave |
| Alumno (usuario final) | Medio | Alto | Mantener informado y satisfecho — define la adherencia |
| Equipo de desarrollo | Alto | Alto | Gestionar de cerca — ejecuta el proyecto |


### Perfil de stakeholders

#### Stakeholder 1 — Marcos Villalba (Personal Trainer independiente) · *Buyer Persona principal*

| Campo | Detalle |
|-------|---------|
| Rol / relación | Cliente y usuario principal (entrenador) |
| Perfil | 28 años, PT independiente con ~20 alumnos activos (CABA). Nivel tecnológico medio. |
| Necesidad / expectativa | Centralizar la gestión, que la IA le acelere el armado de rutinas y poder seguir el progreso real de cada alumno. |
| Frustración actual | Pierde horas armando rutinas en Excel/PDF y haciendo seguimiento improvisado por WhatsApp. |
| Poder / interés | **Alto / Alto** — es quien paga y adopta el producto. |
| Cómo lo afecta el proyecto | Gana tiempo, profesionaliza su marca y puede atender más alumnos sin perder calidad. |

#### Stakeholder 2 — Tomás García (Alumno · objetivo: ganar masa muscular)

| Campo | Detalle |
|-------|---------|
| Rol / relación | Usuario final (alumno) |
| Perfil | 24 años, nativo digital, entrena 4 días/semana. No quiere perder tiempo en la app durante el gym. |
| Necesidad / expectativa | Registrar series rápido, ver su progreso visual y desbloquear logros/rachas que lo motiven. |
| Frustración actual | Anota los pesos en papel y se le pierden; el seguimiento es desordenado. |
| Poder / interés | **Medio / Alto** — su adherencia define el valor percibido por el PT. |
| Cómo lo afecta el proyecto | Tiene su rutina y su historial en el bolsillo, con asistente IA y gamificación. |

#### Stakeholder 3 — Equipo de Desarrollo ( Ignacio Rolon Marecos, Pablo Queimaliños)

| Campo | Detalle |
|-------|---------|
| Rol / relación | Desarrolladores del proyecto |
| Perfil | Estudiantes, ultimo año de la carrera de Analista de Sistemas. Realizan actividad física diariamente. |
| Necesidad / expectativa | Proyecto de tesis de la carrera. Ellos mismo interesados en una aplicación que los ayude para el registro de su progreso |
| Poder / interés | **Alto / Alto** — Ejecutan el proyecto. |
| Cómo lo afecta el proyecto | Quieren lograr un buen proyecto para dar cierre a la carrera. |

---

## Metodología de trabajo — Kanban

Como parte de los requerimientos del proyecto se adopta una **metodología ágil**. El equipo eligió trabajar con **Kanban**, un método ágil basado en la visualización del trabajo y la gestión continua del flujo, sin iteraciones de duración fija.

### Características de la metodología

Kanban se apoya en un conjunto de prácticas centrales que el equipo aplica sobre el tablero de Trello del proyecto:

| # | Práctica | Cómo la aplicamos en FitTrainer |
|---|----------|----------------------------------|
| 1 | **Visualizar el flujo de trabajo** | Tablero Kanban con columnas que representan el ciclo de vida de cada tarea: **Product Backlog → Por hacer (To Do) → En progreso → Code Review → Done**. Cada historia de usuario es una tarjeta. |
| 2 | **Limitar el trabajo en curso** | Se fija un límite de WIP en la columna *En progreso* (máx. **2 tarjetas**, una por desarrollador) para evitar la sobrecarga y forzar a terminar antes de empezar algo nuevo. |
| 3 | **Gestionar el flujo** | Se observa el movimiento de las tarjetas para detectar cuellos de botella (p. ej., tarjetas estancadas en *Code Review*) y se actúa para destrabarlos. |
| 4 | **Hacer explícitas las políticas** | Cada columna tiene una "definición de listo" clara (p. ej., una tarjeta pasa a *Done* solo con criterios de aceptación cumplidos y code review aprobado). |
| 5 | **Bucles de feedback** | Reuniones breves de sincronización y una revisión del tablero para mejorar el proceso de forma continua. |
| 6 | **Mejora colaborativa y evolutiva (Kaizen)** | El proceso se ajusta de manera incremental a partir de lo aprendido, sin reorganizaciones bruscas. |

**Etiquetas de milestone:** además del flujo, las tarjetas se agrupan con etiquetas de color por milestone (M1 Onboarding & Auth, M2 Rutinas, M3 Sesiones, M4 IA & Gamificación) para visualizar el alcance por incremento.

**Métricas de Kanban que se siguen:**

- **Lead time** — tiempo total desde que una tarjeta entra al backlog hasta que llega a *Done*.
- **Cycle time** — tiempo desde que el trabajo en una tarjeta empieza (*En progreso*) hasta que termina.
- **Throughput** — cantidad de tarjetas completadas por semana.

### Justificación de la elección

Se eligió Kanban (por sobre Scrum u otros marcos) por las siguientes razones, alineadas al contexto real del proyecto:

- **Equipo pequeño (2 personas):** la sobrecarga de ceremonias y roles de Scrum (Sprint Planning, Daily, Review, Retro, Scrum Master, Product Owner) es excesiva para dos desarrolladores. Kanban es más liviano y de menor overhead.
- **Flujo continuo en lugar de sprints fijos:** el trabajo del proyecto llega de forma irregular (avances entre cursadas, exámenes, trabajo). Kanban no obliga a comprometer un alcance fijo cada 2 semanas; el equipo toma la siguiente tarea cuando tiene capacidad.
- **Flexibilidad ante cambios de prioridad:** al ser un proyecto de tesis que evoluciona, las prioridades cambian. En Kanban se puede reordenar el backlog en cualquier momento sin "romper" un sprint en curso.
- **Visualización simple y directa:** el tablero muestra de un vistazo qué se está haciendo, qué está trabado y qué falta, lo que facilita la coordinación entre los dos integrantes y la trazabilidad para el seguimiento del proyecto.
- **Control de la carga con el WIP:** limitar el trabajo en curso evita que los dos integrantes abran muchas tarjetas a la vez y nada se termine, que es el principal riesgo en un equipo chico.
- **Integración natural con la herramienta:** el seguimiento se realiza en un tablero de Trello, que es nativamente un tablero Kanban, por lo que la metodología y la herramienta se complementan sin fricción.

> **Conclusión:** Kanban brinda al equipo el equilibrio justo entre disciplina (flujo visible, WIP limitado, políticas explícitas) y flexibilidad (sin sprints rígidos), que es lo que mejor se adapta a un equipo de 2 personas desarrollando un proyecto de tesis con disponibilidad variable.

---

*Documento bajo control de versiones (gestión de la configuración). Entregable **v3.0** del proyecto: objetivo general (SMART) + análisis de interesados + metodología de trabajo (Kanban).*
