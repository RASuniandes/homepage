# Bitácora técnica — feature & content pipeline

The **Bitácora técnica** is the project's technical logbook: a chronological,
good-looking timeline of technical advances (electronics, navigation, software,
outreach). It exists as a historic frame of reference and for university
auditing — it is intentionally **low-key**, not a main site section.

## Where it lives on the site

| Route             | Page                                  | Purpose                                   |
| ----------------- | ------------------------------------- | ----------------------------------------- |
| `/bitacora`       | `src/pages/historic/HistoricIndex.tsx`| Index: list of all logbooks               |
| `/bitacora/:slug` | `src/pages/historic/BitacoraTimeline.tsx` | A single logbook rendered as a timeline |

Entry points (deliberately understated):
- A slim one-line band just above the **Home** footer (`#ras-home .histlink`).
- A "Bitácora" link in the footer of both Home and `RASLayout`.

Routes are registered in `src/App.tsx` under the `RASLayout` group (so they get
the shared nav + footer + scroll-reveal).

## Adding a new logbook (the pipeline)

Source material is a **Google Docs HTML export** of a 4-column table:

```
Fecha | Foto | Título y descripción | Nombre de quien lo agrega
```

…plus the `images/` folder that Google Docs exports alongside the `.html`.

Run the converter:

```bash
node scripts/import-bitacora.mjs <export.html> <slug> \
  --title    "Display title" \
  --subtitle "One-line subtitle" \
  --eyebrow  "Small mono label"   # default: "Registro técnico"
```

Example (the first logbook):

```bash
node scripts/import-bitacora.mjs tmp/NewsLetter.html avances-2026-1 \
  --title "Avances técnicos — SWARM MK1.5 → MK2" \
  --subtitle "Bitácora del equipo: electrónica, navegación y divulgación"
```

What the script (`scripts/import-bitacora.mjs`) does:

1. Parses every table row (skips the header row).
2. Decodes HTML entities (`&oacute;` → `ó`, `&nbsp;`, etc.).
3. Splits the title cell into a **title** (first bold run) + **description**
   paragraphs.
4. Parses the Spanish date (`"4 mayo 2026"`, `"20 de abril de 2026"`, …) into
   an ISO date and **sorts events chronologically**. Computes the `period`
   (e.g. "Marzo – Junio 2026").
5. Copies the referenced images into `public/historic/<slug>/`.
6. Collects unique authors as `contributors` (credited collectively — see below).
7. Writes `src/pages/historic/logs/<slug>.json`.

Then `npm run build` (or just refresh in dev). **No code changes are required**
to register the new log — see auto-discovery below.

## Auto-discovery

`src/pages/historic/bitacoras.ts` imports every `logs/*.json` via
`import.meta.glob(..., { eager: true })`. Dropping a new JSON in `logs/`
registers it automatically. Logs are sorted newest-first by their last event
date (`end`).

## Data shape (`logs/<slug>.json`)

```jsonc
{
  "slug": "avances-2026-1",
  "title": "…",
  "subtitle": "…",
  "eyebrow": "Registro técnico",
  "period": "Marzo – Junio 2026",
  "start": "2026-03-30",          // ISO, earliest event
  "end":   "2026-06-09",          // ISO, latest event (used for log ordering)
  "events": [
    {
      "date": "2026-03-30",        // ISO for sorting (may be null if unparseable)
      "dateLabel": "30 marzo 2026",// original human label, shown on the card
      "title": "…",
      "description": ["paragraph 1", "paragraph 2"],
      "images": ["image2.png"]     // served from /historic/<slug>/<file>
    }
  ],
  "contributors": ["Name A", "Name B"]
}
```

## Design decisions

- **Per-event authors are dropped on purpose.** Who uploaded each entry is not
  relevant for the audit view; contributors are credited collectively in a
  band at the bottom of each timeline ("Gracias por documentar estos avances").
  The script still reads the author column to build that `contributors` list.
- **Timeline layout:** single left-rail, top-to-bottom chronological. Chosen
  over an alternating two-column layout because entries have long descriptions
  and images of varying aspect ratios — a left rail reads cleaner for an audit
  log. Styles live in `src/styles/ras-pages.css` under the
  `BITÁCORA` section (`.timeline`, `.tl-item`, `.tl-card`, `.tl-thanks`, etc.).
- **Images use `object-fit: contain`** on a muted frame so nothing is cropped —
  honest for an audit record, even for portrait phone photos.

## Housekeeping

- The raw Google Docs dump (e.g. `tmp/`) can be deleted once imported — the
  images now live in `public/historic/<slug>/` and the data in `logs/`.
- Exported images are large (~1–2 MB each). Optimize before committing if page
  weight matters (the script does not currently compress them).
