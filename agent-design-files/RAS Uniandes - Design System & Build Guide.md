# RAS Uniandes — Sistema de Diseño & Guía de Implementación

> **Revamp 2025 · Dirección "Editorial".** Este documento es la fuente de verdad para
> programadores. Describe las decisiones de diseño tomadas en `RAS Uniandes — Homepage.html`,
> qué es **fundamental** (no negociable), y cómo extender el sitio a las áreas nuevas
> (**Miembros**, **Herramientas/Utilities** y **Makers/Foro**) sin romper la coherencia visual.

---

## 0. Cómo usar este documento

- Los **tokens** de la sección 2 son la base de todo. No introduzcas colores, tamaños o
  fuentes fuera de este sistema sin actualizar primero los tokens.
- Cada componente trae su **marcado de referencia** y sus **clases**. Reusa estas clases;
  no reinventes botones, tarjetas o headers por página.
- Las secciones nuevas (7) están descritas como **composición de componentes existentes**.
  Si necesitas un patrón que no existe (p. ej. controles de formulario para las herramientas),
  está especificado en la sección 8.
- Recomendación de arquitectura en la sección 11: **extraer los tokens a un `tokens.css`
  compartido** para que la home, `/#/tools`, `/#/members` y el subdominio `makers.` se vean
  como un solo producto.

---

## 1. Principios — qué es fundamental (no negociable)

1. **Editorial, no "landing genérica".** Jerarquía tipográfica fuerte, mucho aire, una sola
   columna de lectura por bloque, fotos reales grandes. Cero "AI slop": nada de gradientes
   morados sobre blanco, nada de tarjetas con borde-acento a la izquierda, cero emojis.
2. **Acento vinotinto + neutros cálidos.** El color es protagonista solo en acentos
   (CTA, eyebrows, hovers). El 90% de la superficie es neutro. Un solo acento dominante.
3. **Claro y oscuro son ciudadanos de primera clase.** Todo componente debe verse correcto
   en ambos temas. Nunca hardcodear un color: usar siempre variables CSS.
4. **Tipografía "seria y técnica".** Archivo (titulares) + IBM Plex Sans (cuerpo) +
   IBM Plex Mono (etiquetas técnicas). No sustituir por Inter/Roboto/Arial.
5. **Bilingüe con intención.** Español como idioma base; inglés solo donde aporta
   (ej. el CTA "Trabajemos juntos / Let's work together").
6. **Movimiento sutil.** Reveal al hacer scroll + micro-lift en hover. Nada estridente.
   Respetar `prefers-reduced-motion`.
7. **Accesibilidad real.** Contraste AA, foco visible, objetivos táctiles ≥ 40px, `alt` en
   todas las imágenes, navegación por teclado.

> Si una decisión nueva entra en conflicto con uno de estos 7 puntos, gana el principio.

---

## 2. Tokens de diseño

Todos los tokens viven en `:root` (tema claro) y se sobreescriben en `html[data-theme="dark"]`.

### 2.1 Color

**Tema claro (`:root`)**

| Token            | Valor                     | Uso |
|------------------|---------------------------|-----|
| `--bg`           | `#f6f4f1`                 | Fondo de página (blanco cálido) |
| `--surface`      | `#ffffff`                 | Tarjetas, nav, paneles |
| `--surface-2`    | `#efece7`                 | Chips, tags, fondos sutiles |
| `--ink`          | `#1c1a1b`                 | Texto principal |
| `--ink-soft`     | `#6c6660`                 | Texto secundario / párrafos |
| `--ink-faint`    | `#9a948e`                 | Metadatos, captions |
| `--line`         | `rgba(28,26,27,.12)`      | Bordes y divisores |
| `--line-strong`  | `rgba(28,26,27,.22)`      | Bordes de botón ghost / hover |
| `--accent`       | `#9d142c`                 | **Acento vinotinto** (CTA, eyebrow, hover) |
| `--accent-2`     | `#7c0f22`                 | Acento más profundo (degradados) |
| `--on-accent`    | `#ffffff`                 | Texto sobre acento |
| `--accent-tint`  | `rgba(157,20,44,.08)`     | Glows y fondos teñidos |

**Tema oscuro (`html[data-theme="dark"]`)**

| Token            | Valor                     |
|------------------|---------------------------|
| `--bg`           | `#141214`                 |
| `--surface`      | `#1d1a1d`                 |
| `--surface-2`    | `#252127`                 |
| `--ink`          | `#f1ece6`                 |
| `--ink-soft`     | `#a8a29b`                 |
| `--ink-faint`    | `#736d68`                 |
| `--line`         | `rgba(241,236,230,.12)`   |
| `--line-strong`  | `rgba(241,236,230,.2)`    |
| `--accent`       | `#df4a64` (vinotinto aclarado para contraste) |
| `--accent-2`     | `#c33a52`                 |
| `--on-accent`    | `#1a0d10`                 |
| `--accent-tint`  | `rgba(223,74,100,.12)`    |

**Acentos secundarios de marca** (del manual RAS Uniandes — usar con MUCHA moderación,
solo para diferenciar categorías, nunca como color principal):
`--brand-blue:#252c84` · `--brand-purple:#631968` · `--brand-gold:#de9d00`.
El logo IEEE RAS combina vinotinto + morado; respetarlo intacto.

> **Regla de oro:** el verde `#22b06b` solo existe como "señal viva" puntual (ej. estado online,
> luz del robot). No es un color de UI.

### 2.2 Tipografía

```
Archivo        → titulares / display / wordmark   (500–900)
IBM Plex Sans  → cuerpo, botones, navegación        (400–700)
IBM Plex Mono  → eyebrows, etiquetas, números, code (400–600)
```

Import:
```html
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

**Escala** (usar `clamp()` para fluidez):

| Rol            | Familia        | Peso | Tamaño                         | Tracking |
|----------------|----------------|------|--------------------------------|----------|
| H1 (hero)      | Archivo        | 900  | `clamp(40px, 5.2vw, 70px)`     | `-.025em` |
| H2 (sección)   | Archivo        | 800  | `clamp(28px, 3.4vw, 42px)`     | `-.02em` |
| H3 (tarjeta)   | Archivo        | 700  | `21–24px`                      | `-.01em` |
| Lead           | IBM Plex Sans  | 400  | `17–18px`                      | normal |
| Body           | IBM Plex Sans  | 400  | `14.5–16.5px`, `line-height:1.6` | normal |
| Eyebrow/label  | IBM Plex Mono  | 500  | `11–12px` UPPERCASE            | `.16–.22em` |

Clases utilitarias: `.display` (Archivo 800/-.02em), `.mono` (IBM Plex Mono), `.eyebrow`.

### 2.3 Espaciado y layout

- **Contenedor:** `.wrap { width: min(1240px, 92vw); margin-inline: auto; }`
- **Sección:** `section.block { padding: 96px 0; }` (en móvil baja, ver responsive).
- **Grid de dos columnas:** `gap: 56–60px`, `align-items: center`.
- Ritmo vertical entre elementos: múltiplos de 4 (`8, 12, 16, 20, 24, 34, 44…`).

### 2.4 Radios, sombras, bordes

| Token / patrón     | Valor |
|--------------------|-------|
| Radio botón        | `9–11px` |
| Radio tarjeta      | `16px` |
| Radio media        | `16–18px` |
| Radio bloque CTA   | `24px` |
| Radio chip/tag     | `7–10px` |
| Borde base         | `1px solid var(--line)` |
| `--shadow`         | `0 1px 2px rgba(28,26,27,.04), 0 12px 32px -12px rgba(28,26,27,.18)` |
| `--shadow-lg`      | `0 24px 60px -24px rgba(28,26,27,.32)` |

(En oscuro las sombras se intensifican; ya están definidas en el token.)

### 2.5 Movimiento

```css
/* Reveal al entrar en viewport */
.reveal{ opacity:0; transform:translateY(22px);
  transition:opacity .7s cubic-bezier(.2,.7,.2,1), transform .7s cubic-bezier(.2,.7,.2,1); }
.reveal.in{ opacity:1; transform:none; }

/* Stagger: hijos en cascada con delays .08s */
.stagger.in > *:nth-child(2){ transition-delay:.08s; } /* …3:.16s, 4:.24s */

@media (prefers-reduced-motion:reduce){ .reveal,.stagger>*{ opacity:1!important; transform:none!important; } }
```
- Hover: lifts de `translateY(-2px a -5px)` + sombra. Botón con flecha `.arr` que se desplaza 4px.
- Activación vía `IntersectionObserver` (threshold `0.16`, `rootMargin:'0px 0px -8% 0px'`).
- El hero se revela inmediatamente en `requestAnimationFrame` (está sobre el fold).

---

## 3. Theming claro/oscuro

- El tema se controla con el atributo `data-theme` en `<html>` (`"light"` | `"dark"`).
- **Persistencia:** `localStorage['ras-theme']`. Si no hay valor, respetar
  `window.matchMedia('(prefers-color-scheme:dark)')`.
- Botón circular en el nav (`#theme`, 38px) que alterna iconos sol/luna (SVG inline,
  `stroke:currentColor`). Esto NO debe romper en ninguna ruta nueva: el botón vive en el
  header compartido.

```js
const root = document.documentElement;
const saved = localStorage.getItem('ras-theme');
if (saved) root.setAttribute('data-theme', saved);
else if (matchMedia('(prefers-color-scheme:dark)').matches) root.setAttribute('data-theme','dark');
// toggle → set attribute + localStorage
```

> El logo del footer (`assets/ras-logo.png`, lockup a color) se invierte en oscuro con
> `filter: brightness(0) invert(1) opacity(.92)`. Si en el futuro hay un SVG con versión
> "reversed" oficial, preferirlo al filtro.

---

## 4. Componentes base

Reusa estas clases en TODAS las páginas. Marcado de referencia abreviado.

### 4.1 Header / Nav (compartido en todo el sitio)
```html
<header class="nav">
  <div class="wrap nav-in">
    <a class="brand" href="#/"><img src="/assets/ra-mark.png" alt="RAS Uniandes"/>
      <span class="wm">RAS Uniandes<small>IEEE Robotics &amp; Automation</small></span></a>
    <nav class="links"><!-- enlaces de ruta --></nav>
    <div class="nav-right">
      <button class="theme-btn" id="theme" aria-label="Cambiar tema">…sol/luna…</button>
      <a href="#/aliados" class="btn btn-primary">Trabajemos juntos <span class="arr">→</span></a>
    </div>
  </div>
</header>
```
- `position:sticky; top:0`, fondo translúcido (`--nav-bg`) con `backdrop-filter: blur(14px)`.
- Subrayado animado en hover de los links (pseudo `::after` que crece de 0→100%).
- En ≤980px, `.links` se oculta → implementar menú móvil (drawer) reutilizando el patrón.

### 4.2 Botones
```html
<a class="btn btn-primary">Texto <span class="arr">→</span></a>  <!-- relleno acento -->
<a class="btn btn-ghost">Texto</a>                              <!-- contorno -->
<!-- modificador de tamaño: .btn-lg -->
```

### 4.3 Eyebrow + Section header
```html
<div class="sec-head">
  <span class="eyebrow">Categoría de la sección</span>
  <h2>Título de la sección</h2>
  <p>Descripción de apoyo opcional.</p>
</div>
```
`.eyebrow` lleva una línea-guion de 22px antes del texto (omitir con `.eyebrow.center`).

### 4.4 Tarjeta (`.card`) — base reutilizable
```html
<article class="card">
  <div class="glow"></div>
  <div class="num">01 / Categoría</div>
  <h3>Título</h3>
  <p>Descripción corta.</p>
  <div class="tags"><span class="tag">Tag</span></div>
</article>
```
Hover: `translateY(-5px)` + `--shadow-lg` + glow radial con `--accent-tint`.
**Esta tarjeta es la base de Miembros, Herramientas y cualquier grid nuevo.**

### 4.5 Otros
- **`.statline`** — fila de 4 métricas con divisores; números en Archivo 800, unidad en `--accent`.
- **`.media-card`** — contenedor de imagen `aspect-ratio` fija, `object-fit:cover`, borde + sombra.
- **`.partner`** — chip de aliado con punto `--accent`.
- **`.tag`** — etiqueta mono sobre `--surface-2`.
- **Bloque CTA** (`.cta-inner`) — superficie redondeada 24px con glow radial; contiene 2 `.cta-card`.
- **Footer** — grid `1.6fr 1fr 1fr 1fr`: marca + 3 columnas de enlaces + barra inferior mono.

---

## 5. Anatomía de la home (orden actual)

1. **Nav** (sticky, compartido)
2. **Hero** — eyebrow + H1 + lead + 2 CTA + 3 métricas | foto equipo (frame **4:3**, sin recortar gente)
3. **Strip de aliados** — "Respaldados y en alianza con" + wordmarks
4. **Nosotros** (split imagen/texto)
5. **Statline** (4 métricas)
6. **Proyecto insignia** (split invertido)
7. **Charlas técnicas** (3 `.card`)
8. **RAS Robot Spark** (banda `.spark` + partners)
9. **CTA "Trabajemos juntos / Let's work together"** (2 caminos: aliado / unirse)
10. **Footer**

> Al integrar lo nuevo, **no infles la home**. Añade como máximo 2 teasers (ver 7.4) y deja el
> detalle en sus rutas dedicadas.

---

## 6. Arquitectura de información & routing

El sitio real usa **hash routing** (`/#/...`). Mapa propuesto:

```
/                         Home (este revamp)
/#/members                Miembros (lista completa)
/#/tools                  Hub de Herramientas (índice)
/#/tools/pcb-calculator   Herramienta
/#/tools/ros-installer    Herramienta
/#/tools/lipo-estimator   Herramienta
https://makers.rasuniandes.org   Makers / Foro (subdominio, app aparte)
```

**Nav (orden recomendado):**
`Nosotros · Proyecto · Charlas · Robot Spark · Herramientas · Miembros · Makers ↗`
+ botón `Trabajemos juntos`.

- `Herramientas` y `Miembros` son rutas internas (hash).
- `Makers` es **externo** (otro subdominio): añadir icono `↗` y `target="_blank" rel="noopener"`.
  Mientras el foro no exista, puede mostrar un estado "Próximamente".
- Si el nav se satura en desktop, agrupar `Herramientas/Miembros/Makers` bajo un único
  ítem **"Comunidad"** con menú desplegable, manteniendo el CTA siempre visible.

**Footer:** añadir una columna **"Recursos"** con `Herramientas`, `Miembros`, `Makers ↗`.

---

## 7. Nuevas secciones — especificaciones

### 7.1 Miembros — `/#/members`

**Objetivo:** listar a todos los miembros actuales; reforzar el principio "Identidad y comunidad".

**Layout:**
1. **Page header** (patrón 8.1): eyebrow `Identidad & comunidad`, H2 "El equipo",
   párrafo "+30 mentes…", y una **statline** opcional (total miembros, áreas, generación).
2. **Filtros por área** (opcional pero recomendado): fila de chips tipo `.tag` seleccionables
   → `Todos · Software · Hardware · Mecánica · Directiva · Robot Spark`.
   El chip activo usa `background:var(--accent); color:var(--on-accent)`.
3. **Grid de miembros**: reutiliza `.card` en variante retrato.

```html
<section class="block"><div class="wrap">
  <!-- page header -->
  <div class="members-grid stagger">
    <article class="card member">
      <div class="member-photo"><img src="/members/jdoe.jpg" alt="Nombre Apellido"/></div>
      <h3>Nombre Apellido</h3>
      <div class="member-role">Líder de Software</div>
      <div class="tags"><span class="tag">C++</span><span class="tag">ROS</span></div>
      <div class="member-social">
        <a href="https://github.com/…" aria-label="GitHub">GH</a>
        <a href="https://linkedin.com/…" aria-label="LinkedIn">in</a>
      </div>
    </article>
    <!-- … -->
  </div>
</div></section>
```
```css
.members-grid{ display:grid; gap:22px; grid-template-columns:repeat(4,1fr); }
@media (max-width:980px){ .members-grid{ grid-template-columns:repeat(2,1fr);} }
@media (max-width:560px){ .members-grid{ grid-template-columns:1fr;} }
.member-photo{ aspect-ratio:1/1; border-radius:12px; overflow:hidden; margin-bottom:16px;
  border:1px solid var(--line); }
.member-photo img{ width:100%; height:100%; object-fit:cover; object-position:center 30%; }
.member-role{ font-family:'IBM Plex Mono',monospace; font-size:12px; color:var(--accent);
  letter-spacing:.04em; margin:4px 0 12px; }
.member-social{ display:flex; gap:10px; margin-top:14px; }
.member-social a{ width:34px; height:34px; display:grid; place-items:center; border-radius:8px;
  border:1px solid var(--line); font-family:'IBM Plex Mono',monospace; font-size:12px;
  color:var(--ink-soft); transition:.2s; }
.member-social a:hover{ border-color:var(--accent); color:var(--accent); }
```
- **Datos:** servir desde un `members.json` (`name, role, area, photo, github, linkedin`).
  Render dinámico + filtro client-side. Foto cuadrada 1:1, encuadre en cara (`object-position`).
- **Fallback sin foto:** placeholder con iniciales sobre `--surface-2` (Archivo 700).
- **Agrupar por área** (alternativa al grid plano): repetir bloque con un `.eyebrow` divisor por
  cada área (Directiva primero).

### 7.2 Herramientas / Utilities — `/#/tools` + páginas

Hay dos niveles: el **hub** (índice) y la **página de herramienta** (shell con inputs/outputs).

#### 7.2.1 Hub `/#/tools`
- **Page header**: eyebrow `Open source · Utilities`, H2 "Herramientas para construir",
  intro corta. Mensaje: utilidades hechas por y para la comunidad.
- **Grid de `.card`**, una por herramienta, con CTA "Abrir herramienta →":

```html
<div class="cards stagger">
  <a class="card tool" href="#/tools/pcb-calculator">
    <div class="glow"></div>
    <div class="num">01 / Cálculo</div>
    <h3>PCB Trace Calculator</h3>
    <p>Ancho de pista, corriente y temperatura para diseño de PCB.</p>
    <div class="tags"><span class="tag">PCB</span><span class="tag">Hardware</span></div>
    <span class="tool-cta">Abrir herramienta <span class="arr">→</span></span>
  </a>
  <a class="card tool" href="#/tools/ros-installer"> … ROS Installer … </a>
  <a class="card tool" href="#/tools/lipo-estimator"> … LiPo Estimator … </a>
</div>
```
- El grid es **extensible**: nuevas herramientas = una `.card` más. Mantener verbos de acción
  consistentes ("Abrir herramienta →").
- `categoría` (Cálculo / Instalación / Estimación) va en `.num` para escaneo rápido.

#### 7.2.2 Página de herramienta — "Tool Shell" (patrón 8.2)
Layout consistente para las tres y las futuras:

```
┌ breadcrumb: Herramientas / PCB Calculator ───────────────┐
│ H2 + descripción de 1 línea                              │
├───────────────── tool-layout (grid 380px | 1fr) ─────────┤
│  Panel de INPUTS (.card)     │  Panel de RESULTADOS (.card)│
│  - labels + inputs           │  - cifras grandes (Archivo) │
│  - selects / sliders         │  - unidades en --accent     │
│  - números mono              │  - notas / fórmula (mono)   │
└──────────────────────────────┴─────────────────────────────┘
```
```css
.tool-layout{ display:grid; grid-template-columns:380px 1fr; gap:24px; align-items:start; }
@media (max-width:860px){ .tool-layout{ grid-template-columns:1fr; } }
.tool-out .big{ font-family:'Archivo',sans-serif; font-weight:800; font-size:clamp(34px,6vw,56px); line-height:1; }
.tool-out .big .u{ color:var(--accent); font-size:.5em; }
```
- Cada herramienta es un módulo JS independiente que pinta solo dentro de `.tool-out`.
- Resultados: número grande en Archivo, unidad en `--accent`, fórmula/nota en IBM Plex Mono.
- Estado de error/validación: borde `--accent` en el input + mensaje mono debajo.
- Las tres herramientas comparten el **mismo header, breadcrumb y controles** (sección 8.3).

> Define los controles de formulario UNA vez (8.3) y reúsalos. No inventes estilos de input
> por herramienta.

### 7.3 Makers / Foro — `https://makers.rasuniandes.org`

- Es una **app separada** en subdominio; eventualmente un foro. No intentes embeberla en la home.
- **Coherencia visual:** debe importar el **mismo `tokens.css`** (sección 11) y el header/footer
  compartidos. Objetivo: que el usuario sienta un solo producto al cruzar de `rasuniandes.org`
  a `makers.rasuniandes.org`.
- En el nav principal, `Makers` es enlace externo con `↗` (`target="_blank" rel="noopener"`).
- **Estado intermedio (foro aún no listo):** página/etiqueta "Próximamente" usando el patrón de
  page header + un `.card` central con CTA a lista de espera o al canal actual (Discord/correo).
- Cuando exista, aplicar los mismos componentes: `.card` para hilos, `.tag` para categorías,
  `.btn` para acciones, `.eyebrow` para secciones.

### 7.4 Integración en la home (teasers, opcional y moderado)

Máximo **dos** módulos nuevos en la home, ubicados **antes del CTA final**:

- **Teaser "Herramientas open source"**: `sec-head` + grid de las 3 `.card` de tools +
  botón ghost "Ver todas las herramientas →" hacia `/#/tools`.
- **Teaser "Comunidad"** (opcional): statline (`+30 miembros · N áreas`) + botón
  "Conoce al equipo →" hacia `/#/members`, y mención a Makers.

No dupliques contenido extenso en la home: los teasers solo enganchan y enlazan.

---

## 8. Patrones nuevos requeridos

### 8.1 Page header (cabecera de subpágina)
Para `/#/members`, `/#/tools` y tool pages. Mismo tono que las `sec-head` de la home:
```html
<section class="block page-header"><div class="wrap reveal">
  <nav class="crumbs"><a href="#/">Inicio</a> / <span>Herramientas</span></nav>
  <span class="eyebrow">Open source · Utilities</span>
  <h2>Herramientas para construir</h2>
  <p>Utilidades hechas por la comunidad RAS Uniandes.</p>
</div></section>
```
```css
.page-header{ padding-top:56px; padding-bottom:40px; }
.crumbs{ font-family:'IBM Plex Mono',monospace; font-size:12px; color:var(--ink-faint);
  letter-spacing:.04em; margin-bottom:18px; }
.crumbs a{ color:var(--ink-soft); } .crumbs a:hover{ color:var(--accent); }
```

### 8.2 Tool Shell — ver 7.2.2.

### 8.3 Controles de formulario (para herramientas)
Estilos base coherentes con la marca (úsalos en TODA herramienta):
```css
.field{ margin-bottom:18px; }
.field label{ display:block; font-family:'IBM Plex Mono',monospace; font-size:11.5px;
  letter-spacing:.12em; text-transform:uppercase; color:var(--ink-soft); margin-bottom:8px; }
.field input, .field select{
  width:100%; padding:11px 13px; border-radius:9px; background:var(--bg);
  border:1px solid var(--line-strong); color:var(--ink);
  font-family:'IBM Plex Mono',monospace; font-size:14px; transition:border-color .2s; }
.field input:focus, .field select:focus{ outline:none; border-color:var(--accent);
  box-shadow:0 0 0 3px var(--accent-tint); }
.field .hint{ font-size:12px; color:var(--ink-faint); margin-top:6px; }
.field.invalid input{ border-color:var(--accent); }
```
- Sliders/range: pista en `--line-strong`, thumb en `--accent`.
- Botón de cálculo: `.btn .btn-primary`.

### 8.4 Menú móvil
A ≤980px el `.links` se oculta. Implementar un drawer (botón hamburguesa en `.nav-right`)
que despliega los mismos enlaces a pantalla completa con `--surface` y el toggle de tema dentro.

---

## 9. Accesibilidad

- Contraste AA en ambos temas (texto sobre fondo y sobre acento).
- `:focus-visible` con anillo `box-shadow:0 0 0 3px var(--accent-tint)` (no quitar outline sin reemplazo).
- Todas las imágenes con `alt` descriptivo; logos con el nombre de la entidad.
- Objetivos táctiles ≥ 40px (theme btn = 38px ✓, social = 34px → subir a 40 en touch).
- Navegación por teclado en nav, filtros de miembros y controles de herramientas.
- `prefers-reduced-motion`: desactiva reveals/stagger (ya contemplado).
- Estructura semántica: un solo `<h1>` por documento (la home); subpáginas empiezan en `<h2>`
  o usan `<h1>` propio si son página independiente.

---

## 10. Performance & assets

- **Fuentes:** `display=swap`, `preconnect` a Google Fonts (ya en el `<head>`). Considera
  self-host de Archivo/IBM Plex para evitar terceros.
- **Imágenes:** servir en tamaños adecuados; `loading="lazy"` en todo lo que no sea el hero.
  Fotos de equipo/robot ya están a 4:3 y ~1280px. Para miembros, 1:1 ~600px.
- **Logo nav:** `assets/ra-mark.png` (marca RA recortada). **Footer:** `assets/ras-logo.png`
  (lockup completo). Si consigues SVG oficiales, reemplaza los PNG.
- **Export offline:** el bundler inline solo capta recursos referenciados en atributos HTML/CSS.
  Si una herramienta carga assets por string en JS, declarar
  `<meta name="ext-resource-dependency" …>` y usar `window.__resources[id]`.

---

## 11. Estructura de archivos & tokens compartidos (recomendado)

Para que home + tools + members + makers se vean idénticos:

```
/shared/
  tokens.css        ← TODOS los :root y [data-theme="dark"] (sección 2)
  base.css          ← reset, .wrap, tipografía, .btn, .card, .eyebrow, .sec-head, reveals
  header.html(.js)  ← nav compartido + toggle de tema
  footer.html(.js)  ← footer compartido
/assets/            ← ra-mark.png, ras-logo.png, fotos…
/members/           ← members.json + fotos 1:1
/tools/
  pcb-calculator.js
  ros-installer.js
  lipo-estimator.js
```
- Si el stack es **React/Vue**: convierte cada componente de la sección 4 en componente real
  (`<Button variant>`, `<Card>`, `<SectionHeader>`, `<MemberCard>`, `<ToolShell>`). Los tokens
  van en `:root` global; el theming por `data-theme` en `<html>`.
- Si es **HTML estático multipágina**: extrae `tokens.css` + `base.css` e inclúyelos en cada
  página; inyecta header/footer con un include/partial.
- **Una sola fuente de tokens.** Cambiar el acento debe hacerse en `tokens.css` y propagarse a
  todo (incluido el subdominio Makers).

---

## 12. Checklist de implementación

- [ ] Extraer `tokens.css` + `base.css` desde `RAS Uniandes — Homepage.html`.
- [ ] Header/footer compartidos con toggle de tema y persistencia (`localStorage['ras-theme']`).
- [ ] Router hash con rutas: `/`, `/#/members`, `/#/tools`, `/#/tools/:slug`.
- [ ] Nav: añadir `Herramientas`, `Miembros`, `Makers ↗`; agrupar bajo "Comunidad" si satura.
- [ ] `/#/members`: page header + filtros + grid (`members.json`).
- [ ] `/#/tools`: hub con grid de `.card` extensible.
- [ ] Tool Shell + controles de formulario (8.3) reutilizados por las 3 herramientas.
- [ ] Footer: columna "Recursos" (Herramientas, Miembros, Makers).
- [ ] Teasers en home (máx. 2) enlazando a tools y members.
- [ ] Makers: importar `tokens.css`, estado "Próximamente" si el foro no está listo.
- [ ] QA en claro y oscuro, desktop y móvil; `prefers-reduced-motion`; contraste AA.

---

*Fuente de verdad visual: `RAS Uniandes — Homepage.html`. Ante cualquier duda, los 7 principios
de la sección 1 mandan.*
