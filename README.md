# Biblioteca

Una app para organizar, buscar y exportar tu colección de libros. Construida con
**React + TypeScript + Vite + Tailwind CSS**.

Funciona de dos maneras:

- **Modo offline (por defecto):** todos los libros se guardan en el navegador
  (`localStorage`). No necesita cuenta ni conexión.
- **Modo nube (opcional):** inicia sesión / regístrate con **Neon Auth** y tus
  libros se guardan por usuario en Neon a través de la **Neon Data API**.

Si las variables de entorno de la nube no están configuradas, la app se comporta
exactamente igual que antes: 100 % offline y sin pantalla de login.

## Desarrollo

```bash
npm install
npm run dev        # servidor de desarrollo
npm run build      # typecheck + build de producción
npm run lint       # ESLint
npm run typecheck  # solo comprobación de tipos
```

## Activar el modo nube (Neon)

El modo nube es opcional. Para habilitarlo necesitas un proyecto de
[Neon](https://neon.tech) con **Neon Auth** y la **Data API** activadas.

### 1. Variables de entorno

Copia `.env.example` a `.env.local` y rellena los tres valores:

| Variable | Dónde encontrarlo |
| --- | --- |
| `VITE_STACK_PROJECT_ID` | Neon Console → tu proyecto → **Auth** |
| `VITE_STACK_PUBLISHABLE_CLIENT_KEY` | Neon Console → tu proyecto → **Auth** |
| `VITE_NEON_DATA_API_URL` | Neon Console → tu proyecto → **Data API** (URL del endpoint) |

En Netlify, añade estas mismas variables en *Site configuration → Environment
variables* y vuelve a desplegar.

### 2. Esquema de la base de datos (con Row-Level Security)

Ejecuta este SQL en el editor SQL de Neon. Crea la tabla `books`, la liga al
usuario autenticado y activa RLS para que cada persona solo vea sus libros.

```sql
create table if not exists public.books (
  id         uuid primary key default gen_random_uuid(),
  owner_id   text not null default (auth.user_id()),
  titulo     text not null,
  autor      text not null,
  year       integer not null,
  editorial  text not null,
  imagen     text not null default '',
  created_at timestamptz not null default now()
);

-- Cada usuario solo puede ver y modificar sus propios libros.
alter table public.books enable row level security;

create policy "Books are private to their owner"
  on public.books
  for all
  to authenticated
  using (owner_id = (auth.user_id()))
  with check (owner_id = (auth.user_id()));

-- Exponer la tabla a usuarios autenticados a través de la Data API.
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.books to authenticated;
```

> `auth.user_id()` lo proporciona Neon Auth y devuelve el id del usuario del JWT.
> Si tu proyecto usa nombres distintos, sigue la guía vigente de
> [Neon Data API + Neon Auth](https://neon.tech/docs/guides/neon-auth).

### 3. Cómo funciona en la app

- El selector **Offline / Nube** aparece en la cabecera solo cuando las tres
  variables están presentes.
- En **Nube**, si no hay sesión se muestra el panel de inicio de sesión /
  registro. Tras autenticarte, la app carga tus libros desde la Data API.
- Cada petición a la Data API se firma con el access token de Neon Auth, así que
  las políticas RLS garantizan que solo accedes a tus propios datos.

## Arquitectura

```
src/
  lib/config.ts            # lee las env vars y deduce si la nube está configurada
  lib/stack.ts             # cliente de Neon Auth (solo si está configurado)
  auth/AuthContext.ts      # estado de auth para toda la app (offline por defecto)
  auth/CloudAuthProvider   # puente con los hooks de Neon Auth
  auth/AuthPanel.tsx       # formulario de login / registro
  books/repository.ts      # interfaz común: implementación local y de nube
  books/useBooks.ts        # hook de estado (cargar/añadir/borrar/importar)
  App.tsx                  # UI + selector de modo
```

El resto de la app (formulario en diálogo, FAB móvil, filtros, exportar/importar)
es idéntico en ambos modos: solo cambia de dónde se leen y escriben los libros.
