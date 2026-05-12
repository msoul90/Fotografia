# PHOTO_OS PRO 📷

> Academia de fotografía de bolsillo para **Sony a6000** y **Samsung S24 Ultra** en Guadalajara.
> Construida con Next.js · TypeScript · Tailwind CSS · Zustand · IndexedDB (Dexie.js) · Framer Motion.

**Demo en vivo → [`msoul90.github.io/Fotografia`](https://msoul90.github.io/Fotografia)**

---

## 🚀 Desarrollo Local

```bash
# 1. Instala dependencias
npm install

# 2. Crea tu archivo de variables de entorno local (opcional)
cp .env.local.example .env.local
# Edita .env.local si quieres conectar un endpoint de AI real

# 3. Servidor de desarrollo en http://localhost:3000
npm run dev
```

El servidor de desarrollo **no usa `basePath`** — la app corre directo en la raíz, sin prefijo `/Fotografia/`.

---

## 🏗️ Preview del Build de Producción

Antes de hacer push, puedes simular exactamente lo que se desplegará en GitHub Pages:

```bash
# 1. Genera el export estático (crea la carpeta out/)
npm run build

# 2. Sirve la carpeta out/ localmente con cualquier servidor HTTP
npx serve out/
# → http://localhost:3000   (la app corre bajo /Fotografia en producción,
#                            pero serve la sirve en raíz — solo verifica que el build no explota)
```

> **Tip:** Si ves errores de assets 404 al previsualizar con `serve`, es normal porque en
> producción el `basePath` agrega `/Fotografia/` automáticamente. El build es correcto si no
> hay errores de TypeScript ni de compilación.

---

## ⚙️ CI/CD — Deploy Automático

El archivo `.github/workflows/deploy.yml` automatiza todo el pipeline:

```
push → main
  ├─ npm ci
  ├─ npm run build          →  out/index.html  (Next.js static export)
  ├─ Pre-flight check       →  valida que out/index.html exista
  ├─ Escribe out/404.html   →  SPA redirect script
  ├─ touch out/.nojekyll    →  protege _next/ de Jekyll
  └─ peaceiris → gh-pages   →  publica SOLO out/, no el código fuente
```

---

### 🔴 Síntoma: Veo el README.md en lugar de la app

**Causa raíz:** GitHub Pages está leyendo la rama `main` (que contiene el código fuente) en lugar de la rama `gh-pages` (que contiene el build compilado).

**Solución en 3 pasos — en este orden exacto:**

#### Paso 1 — Permisos del workflow (una sola vez)

1. Repositorio → **Settings → Actions → General**
2. Sección **"Workflow permissions"** → selecciona **"Read and write permissions"**
3. Marca ✅ **"Allow GitHub Actions to create and approve pull requests"**
4. **Save**

#### Paso 2 — Ejecutar el workflow para crear la rama `gh-pages`

La rama `gh-pages` no existe hasta que el workflow corre por primera vez.

```bash
# Opción A: haz cualquier push a main
git commit --allow-empty -m "trigger: create gh-pages branch"
git push origin main

# Opción B: ejecútalo manualmente desde la UI
# GitHub → Actions → "Deploy PHOTO_OS to GitHub Pages" → Run workflow
```

Espera a que el workflow termine (ícono ✅ verde en la pestaña Actions).

#### Paso 3 — Apuntar GitHub Pages a la rama correcta

> ⚠️ **Este es el paso que causa el síntoma.** Si Pages apunta a `main`, verás el README.

1. Repositorio → **Settings → Pages**
2. En **"Build and deployment"**:
   - Source: **Deploy from a branch**
   - Branch: **`gh-pages`** ← *no `main`*
   - Folder: **`/ (root)`**
3. **Save**
4. Espera 1-2 minutos → recarga la URL

---

### 🔍 Verificación rápida

Para confirmar que `gh-pages` contiene el build y no el código fuente:

```bash
# Inspecciona la rama gh-pages localmente
git fetch origin gh-pages
git show origin/gh-pages:index.html | head -5
# Debes ver: <!DOCTYPE html>... NO un README
```

O en GitHub: ve a la pestaña **Code** → cambia la rama a `gh-pages` → verifica que hay `index.html`, `_next/`, `.nojekyll` y **no** hay `src/`, `package.json` ni `README.md`.

---

### 🟡 Síntoma: Error 403 en el workflow

> El `GITHUB_TOKEN` por defecto es solo-lectura.

El workflow ya incluye `permissions: contents: write` en el YAML.
Además, sigue el **Paso 1** de arriba (Settings → Actions → General → Read and write).
**Ambas configuraciones deben estar activas.**

---

### Agregar Secrets (para AI Critic real)

1. **Settings → Secrets and variables → Actions → New repository secret**
2. Name: `NEXT_PUBLIC_AI_ENDPOINT` · Value: tu URL de LLM


---

## 🗂️ Estructura del Proyecto

```
src/
├── app/           # Next.js App Router (layout, page, globals.css)
├── components/    # UI — Header, BottomNav, tabs, modales, overlays
├── store/         # Zustand (estado global + selectores)
├── lib/           # Servicios — db.ts · exifService.ts · aiCriticService.ts
├── data/          # Contenido — lessons.ts · challenges.ts · spots.ts
└── types/         # TypeScript — curriculum.ts
public/
├── 404.html       # SPA routing fix para GitHub Pages
└── manifest.json  # PWA manifest (instalable en S24 Ultra)
```

---

## 🔧 Variables de Entorno

| Variable | Dónde va | Descripción |
|---|---|---|
| `NEXT_PUBLIC_AI_ENDPOINT` | `.env.local` o GitHub Secret | URL del LLM para AI Critic |
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local` o GitHub Secret | (futuro) Backend de datos |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `.env.local` o GitHub Secret | (futuro) Auth Supabase |

Copia `.env.local.example` → `.env.local` para desarrollo local. **Nunca commitas `.env.local`.**

---

## 📱 Instalar como PWA (S24 Ultra)

1. Abre la URL de producción en Chrome/Samsung Internet
2. Menú → **"Añadir a pantalla de inicio"**
3. La app se instala sin conexión con icono nativo

---

## 🧩 Extender el Contenido

**Nueva lección:** edita `src/data/lessons.ts`, añade un objeto `Lesson`.  
**Nuevo reto:** edita `src/data/challenges.ts`, añade un objeto `Challenge`.  
**Nuevo spot:** edita `src/data/spots.ts`, añade un objeto `PhotoSpot` con coordenadas GPS reales.

No se requiere tocar ningún componente de UI — el contenido está 100% separado de la presentación.
