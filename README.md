# Portfolio Daniel Soledad

Portfolio personal desarrollado con **Astro 5**, **Tailwind CSS 4** y desplegado en **Netlify**.

## Stack

| Tecnología                | Uso                                       |
| ------------------------- | ----------------------------------------- |
| Astro 5 + TypeScript      | Framework principal, islands architecture |
| Tailwind CSS 4            | Estilos utilitarios                       |
| @astrojs/netlify          | SSR adapter                               |
| Astro Content Collections | Gestión de proyectos (MD + schema)        |
| Lucide Astro              | Iconos SVG                                |
| Sharp                     | Optimización de imágenes                  |

## Estructura del proyecto

```
src/
├── assets/
│   ├── fonts/              # Tipografías originales (ahora en public/)
│   ├── images/             # Imágenes optimizadas con <Image /> de Astro
│   └── svg/                # Iconos SVG para filtros de proyectos
├── components/
│   ├── layout/             # Header, Footer, BackToTop, Breadcrumbs, HeaderPage
│   ├── sections/           # Hero, AboutMe, Experience, Projects, ContactMe, etc.
│   ├── cards/              # ProjectCard, CardAboutMe, ExperienceCard, MyFavorites
│   ├── widgets/            # MusicPlayer
│   ├── ui/                 # Button, Carousel, ProjectFilter
│   ├── icons/              # GithubIcon, LinkedinIcon
│   └── media/              # Logo, MyPhoto
├── config/                 # site.json, meta.json, content.json
├── content/                # Content Collections (proyectos en MD + schema Zod)
├── layouts/                # Layout.astro, Meta.astro
├── pages/                  # index, sobre-mi/, proyectos/[id], api/playlist
├── scripts/                # header.js (menú, dark mode, carrusel)
├── styles/                 # global.css (font-face, animaciones)
└── types/                  # music.ts (interfaces de la API de playlists)
```

## Repositorios de Inspiración

- [Web_Rico](https://portfolio.ricoui.com/)
- [Nexus](https://stvn-portfolio-template.vercel.app/)
- [Lautaro_Collins](https://lautaro-rodriguez-collins.vercel.app/)
- [Flowbite_Docs](https://flowbite.com/docs/components/alerts/)

## Dificultades y Soluciones

### Performance & Lighthouse

#### Improve Image Delivery

Las imágenes originales pesaban mucho y no renderizaban bien. Solución:

1. Guardar las imágenes en `src/assets/images/`
2. Crear un componente Astro con la etiqueta `<Image />`
3. Usar props para personalizar cada instancia
4. Configurar: `layout="constrained"`, `fetchpriority="high"`, `loading="eager"`
    - **Constrained** genera tamaños responsivos según el viewport
    - **fetchpriority** prioriza el render de imágenes clave
    - **loading eager** fuerza la carga inmediata

#### Render Blocking Request

Los `@import` en `global.css` y el script de Flowbite bloqueaban el renderizado. Solución:

1. Reemplazar `@import` por `@font-face` con fuentes descargadas localmente
2. Mover el script de Flowbite al `<body>` de `Layout.astro` con atributo `defer`

#### Third-Party Cookies (Railway API)

El MusicPlayer consumía directamente una API en Railway, generando cookies de terceros que penalizaban Lighthouse. Solución:

1. Crear un proxy server-side en `src/pages/api/playlist.ts` usando el SSR de Netlify
2. El cliente ahora llama a `/api/playlist` (mismo dominio), eliminando las cookies third-party
3. La URL real de Railway vive solo en `.env` como `PUBLIC_PLAYLIST_API_URL`

#### Fuentes 404 en SSR

Al desplegar con Netlify SSR, las rutas relativas `url("../assets/fonts/...")` no se resolvían correctamente. Solución:

1. Mover los `.woff2` de `src/assets/fonts/` a `public/fonts/`
2. Actualizar `global.css` con rutas absolutas `url("/fonts/...")`

### Accesibilidad y Landmarks

#### Skip Link y roles ARIA

El documento carecía de un punto de referencia principal claro y los enlaces externos no advertían al usuario. Soluciones aplicadas:

- Añadir skip link "Saltar al contenido principal" con estilos `sr-only focus:not-sr-only` en `Layout.astro`
- Reemplazar `role="main"` redundante por `id="main-content"` con `tabindex="-1"`
- Añadir `aria-label="Ir al inicio"` al enlace home en `Breadcrumbs.astro`
- Añadir `role="button"` y `tabindex="0"` a toggles de menú y modo oscuro, con manejadores `keydown` (Enter/Space)
- Añadir `aria-label` con aviso de nueva pestaña a enlaces `target="_blank"`
- Añadir `aria-label` a botones del carrusel y nombre de skill a botones de `SoftSkillsRating`
- Eliminar `role="navigation"` redundante del `Header`

#### Radio input sin indicación visual

El input radio del filtro de proyectos no mostraba estado seleccionado. Solución:

- Añadir `checked:bg-bright-blue checked:border-bright-blue` con Tailwind
- Forzar círculo perfecto con `<style>` scoped

### UI y Animaciones

#### Animación Typing no funcionaba

La animación `writing` usaba `steps(var(--typing-steps))` con una variable CSS, pero el parser descartaba la regla por no poder resolverla en tiempo de compilación. Solución:

- Reemplazar `steps(var(--typing-steps))` por `steps(10)` hardcodeado
- Eliminar la animación `blink` y la propiedad `border-right` (cursor) que entraban en conflicto

#### Theme Toggle — Texto incorrecto en primera carga

Al abrir la web con modo oscuro por defecto, el span mostraba **Light** en vez de **Dark** por un flash de contenido incorrecto antes de que JS leyera `localStorage`. Solución:

```js
(function initTheme() {
    const saved = localStorage.getItem("theme");
    const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (saved === "dark" || (!saved && prefersDark)) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
})();
```

La función se ejecuta inmediatamente (IIFE) al cargar la página, antes del render, para sincronizar `syncDarkModeIcons()` con el estado actual del tema.
