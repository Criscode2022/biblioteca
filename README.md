# Biblioteca Cloud

**La plataforma inteligente para bibliotecas.** Cataloga, busca y analiza
colecciones de libros con inteligencia artificial. Construida con
**React + TypeScript + Vite + Tailwind CSS**, con backend serverless en
**Netlify Functions**, datos en **Neon** (Postgres + pgvector) y modelos de
**OpenAI**.

## Funcionalidades

| | Gratis (offline) | Pro (nube) |
| --- | --- | --- |
| Catálogo de libros (CRUD) | ✅ localStorage | ✅ Neon Data API |
| Búsqueda por filtros | ✅ | ✅ |
| Exportar Excel / JSON e importar | ✅ | ✅ |
| Login / registro (Neon Auth) | — | ✅ |
| Libros por usuario (RLS) | — | ✅ |
| 🤖 Análisis IA de cada libro | — | ✅ |
| 🔎 Búsqueda semántica (pgvector) | — | ✅ |
| 💬 Asistente RAG ("pregunta a tu biblioteca") | — | ✅ |
| Interfaz en español e inglés | ✅ | ✅ |

El **modo offline es siempre gratuito y no requiere configuración**: sin las
variables de entorno de la nube, la app funciona 100 % en el navegador.

## Arquitectura

```
┌─────────────────────────── Netlify ────────────────────────────┐
│                                                                 │
│  SPA (React + TS + Tailwind)          Functions (/api/*)        │
│  ├─ modo offline → localStorage       ├─ analyze-book           │
│  ├─ modo nube → Neon Data API ────┐   ├─ semantic-search        │
│  └─ IA → fetch /api/* ────────────┼──▶└─ ask-library            │
│        (token de Neon Auth)       │        │        │           │
└───────────────────────────────────┼────────┼────────┼───────────┘
                                    │        │        ▼
                       RLS por usuario       │     OpenAI API
                                    ▼        ▼   (chat + embeddings)
                              Neon Postgres (books, book_analyses·pgvector)
```

- **La clave de OpenAI nunca llega al navegador**: las funciones serverless
  hacen todas las llamadas.
- Cada petición a `/api/*` se autentica verificando el **JWT de Neon Auth**
  contra el JWKS del proyecto (firma + expiración) y toda consulta SQL filtra
  por `owner_id`.
- El **RAG** funciona así: al analizar un libro se genera un análisis
  estructurado (GPT) y su *embedding* (`text-embedding-3-small`, 1536 dim) que
  se guarda en `book_analyses` con **pgvector**. Las preguntas del asistente se
  embeben, se recuperan los libros más cercanos por distancia coseno (índice
  HNSW) y se responden con ese contexto, citando fuentes.

## Desarrollo

```bash
npm install
npm run dev        # solo SPA (sin funciones IA)
netlify dev        # SPA + funciones IA en local (requiere Netlify CLI)
npm run build      # typecheck (app + functions) + build de producción
npm run lint       # ESLint
npm run typecheck  # tsc de la app y de las funciones
```

## Puesta en producción

### 1. Base de datos (Neon)

Ejecuta [`db/schema.sql`](db/schema.sql) en el editor SQL de Neon. Crea las
tablas `books` y `book_analyses`, activa **pgvector**, los índices HNSW y las
políticas RLS. Es idempotente.

Requisitos del proyecto Neon: **Neon Auth** y **Data API** habilitados.

### 2. Variables de entorno

Copia `.env.example` a `.env.local` (local) o configúralas en Netlify
(*Site configuration → Environment variables*):

| Variable | Ámbito | Descripción |
| --- | --- | --- |
| `VITE_STACK_PROJECT_ID` | cliente | Neon Console → Auth |
| `VITE_STACK_PUBLISHABLE_CLIENT_KEY` | cliente | Neon Console → Auth |
| `VITE_NEON_DATA_API_URL` | cliente | Neon Console → Data API |
| `DATABASE_URL` | servidor | Cadena de conexión directa de Neon |
| `OPENAI_API_KEY` | servidor | platform.openai.com |
| `OPENAI_CHAT_MODEL` | servidor (opcional) | por defecto `gpt-4o-mini` |
| `OPENAI_EMBEDDING_MODEL` | servidor (opcional) | por defecto `text-embedding-3-small` |
| `STACK_PROJECT_ID` | servidor (opcional) | si no, usa `VITE_STACK_PROJECT_ID` |

### 3. Despliegue

`netlify.toml` ya define el build, el directorio de funciones y las rutas
`/api/*`. Con hacer push a la rama desplegada es suficiente.

## Estructura del código

```
netlify/functions/       # Backend serverless (TypeScript)
  lib/{auth,db,openai,http}.ts
  analyze-book.ts        # análisis GPT + embedding → book_analyses
  semantic-search.ts     # búsqueda por similitud coseno (pgvector)
  ask-library.ts         # RAG: retrieve → prompt → respuesta con fuentes
db/schema.sql            # esquema completo (pgvector, RLS, índices)
src/
  i18n/                  # diccionarios ES/EN tipados + provider
  lib/{config,stack,ai}.ts
  auth/                  # Neon Auth: contexto, provider, panel de acceso
  books/                 # repositorio local/nube + hook de estado
  ai/                    # modales de análisis y asistente IA
  App.tsx                # UI, selector de modo/idioma, planes
```

## Hoja de ruta

- Facturación real (Stripe) para el plan Pro
- Organizaciones multi-usuario y catálogos compartidos (plan Bibliotecas)
- Límites de uso y colas para las llamadas de IA
- Importación masiva (MARC/CSV) para bibliotecas institucionales
