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
git push origin main  →  GitHub Actions  →  npm ci  →  npm run build  →  out/ → gh-pages branch
```

**No necesitas hacer nada manualmente.** Cada push a `main` despliega en minutos.

### Configurar GitHub Pages (primera vez)

1. Ve a tu repositorio en GitHub → **Settings → Pages**
2. En **"Build and deployment"**, selecciona **"Deploy from a branch"**
3. Branch: **`gh-pages`** / Folder: **`/ (root)`**
4. Guarda. La primera URL tardará ~2 minutos en activarse.

### Agregar Secrets (para AI Critic real)

1. GitHub → **Settings → Secrets and variables → Actions**
2. Clic en **"New repository secret"**
3. Name: `NEXT_PUBLIC_AI_ENDPOINT` · Value: tu URL de LLM
4. El workflow ya lo inyecta en el paso de build automáticamente.

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
