#!/usr/bin/env node
/* =====================================================================
   import-bitacora.mjs — Google Docs HTML export → polished timeline data
   ---------------------------------------------------------------------
   Turns a "fast-and-dirty" Google Docs HTML export (a 4-column table:
   Fecha | Foto | Título + descripción | Autor) into a clean JSON log the
   website renders as a timeline, and relocates its images into /public.

   Usage:
     node scripts/import-bitacora.mjs <export.html> <slug> [options]

   Options:
     --title    "..."   Display title  (default: derived from slug)
     --subtitle "..."   One-line subtitle under the title
     --eyebrow  "..."   Small mono label (default: "Registro técnico")

   Example:
     node scripts/import-bitacora.mjs tmp/NewsLetter.html avances-2026-1 \
       --title "Avances técnicos — Electrónica & Navegación" \
       --subtitle "Bitácora del equipo SWARM"

   The HTML's <img src="images/..."> are read relative to the export file.
   Output:
     public/historic/<slug>/<image>.png   (copied images)
     src/pages/historic/logs/<slug>.json  (timeline data, auto-discovered)
   ===================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ─── CLI args ───
const argv = process.argv.slice(2);
const positional = [];
const flags = {};
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith('--')) { flags[argv[i].slice(2)] = argv[++i]; }
  else positional.push(argv[i]);
}
const [htmlArg, slugArg] = positional;
if (!htmlArg || !slugArg) {
  console.error('Usage: node scripts/import-bitacora.mjs <export.html> <slug> [--title "..."] [--subtitle "..."] [--eyebrow "..."]');
  process.exit(1);
}

const htmlPath = path.resolve(ROOT, htmlArg);
const slug = slugArg.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
const srcImagesBase = path.dirname(htmlPath); // <img src="images/..."> is relative to the export
const html = fs.readFileSync(htmlPath, 'utf8');

// ─── HTML helpers ───
const NAMED = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  aacute: 'á', eacute: 'é', iacute: 'í', oacute: 'ó', uacute: 'ú',
  Aacute: 'Á', Eacute: 'É', Iacute: 'Í', Oacute: 'Ó', Uacute: 'Ú',
  ntilde: 'ñ', Ntilde: 'Ñ', uuml: 'ü', Uuml: 'Ü',
  iexcl: '¡', iquest: '¿', ordf: 'ª', ordm: 'º', deg: '°',
  hellip: '…', mdash: '—', ndash: '–',
  rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”',
};
const decode = (s) => s
  .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
  .replace(/&([a-zA-Z]+);/g, (m, n) => (n in NAMED ? NAMED[n] : m));
const stripTags = (s) => decode(s.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();

// class-token bold test (c2 and c4 are font-weight:700 in the export stylesheet)
const isBold = (attrs) => {
  const cls = (attrs.match(/class="([^"]*)"/) || [, ''])[1];
  return cls.split(/\s+/).some((c) => c === 'c2' || c === 'c4');
};

// ─── Spanish date parsing (for chronological sort) ───
const MONTHS = {
  enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6,
  julio: 7, agosto: 8, septiembre: 9, setiembre: 9, octubre: 10,
  noviembre: 11, diciembre: 12,
};
const MONTH_NAMES = ['', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function parseDate(label) {
  const low = label.toLowerCase();
  const day = (low.match(/\b(\d{1,2})\b/) || [])[1];
  const monName = Object.keys(MONTHS).find((m) => low.includes(m));
  const year = (low.match(/\b(20\d{2})\b/) || [])[1];
  if (day && monName && year) {
    const mm = String(MONTHS[monName]).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  }
  return null;
}

// ─── Parse the table ───
const rows = html.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi) || [];
const events = [];

for (const row of rows) {
  const cells = row.match(/<td\b[^>]*>[\s\S]*?<\/td>/gi) || [];
  if (cells.length < 4) continue;

  const dateLabel = stripTags(cells[0]);
  // Skip header row ("Fecha de dónde cuándo ocurrió")
  if (/fecha/i.test(dateLabel) && /ocurri/i.test(stripTags(cells[0]))) continue;
  if (/^fecha\b/i.test(dateLabel) && !parseDate(dateLabel)) continue;

  const images = [...new Set(
    [...cells[1].matchAll(/src="images\/([^"]+)"/gi)].map((m) => decode(m[1]))
  )];

  // Title + description from cell 2: first bold run = title, the rest = paragraphs
  const paraChunks = cells[2].split(/<\/p>/i);
  let title = '';
  let titleTaken = false;
  const description = [];
  for (const chunk of paraChunks) {
    const runs = [...chunk.matchAll(/<span\b([^>]*)>([\s\S]*?)<\/span>/gi)]
      .map((m) => ({ bold: isBold(m[1]), text: stripTags(m[2]) }))
      .filter((r) => r.text !== '');
    const buf = [];
    for (const r of runs) {
      if (!titleTaken && r.bold) { title = r.text.replace(/\s*[:：]\s*$/, '').trim(); titleTaken = true; continue; }
      buf.push(r.text);
    }
    const t = buf.join(' ').replace(/\s+/g, ' ').trim();
    if (t) description.push(t);
  }
  if (!titleTaken && description.length) title = description.shift();

  // Author: first non-empty span in cell 3
  const author = ([...cells[3].matchAll(/<span\b[^>]*>([\s\S]*?)<\/span>/gi)]
    .map((m) => stripTags(m[1])).find(Boolean)) || '';

  if (!title && !description.length && !images.length) continue;

  events.push({ date: parseDate(dateLabel), dateLabel, title, description, images, author });
}

if (!events.length) {
  console.error('No events parsed — is this a Google Docs table export?');
  process.exit(1);
}

// ─── Sort chronologically; undated entries kept in original order at the end ───
events.sort((a, b) => {
  if (a.date && b.date) return a.date.localeCompare(b.date);
  if (a.date) return -1;
  if (b.date) return 1;
  return 0;
});

const dated = events.filter((e) => e.date).map((e) => e.date).sort();
const start = dated[0] || null;
const end = dated[dated.length - 1] || null;
const periodOf = (iso) => { const [y, m] = iso.split('-'); return { y, m: Number(m) }; };
let period = '';
if (start && end) {
  const s = periodOf(start); const e = periodOf(end);
  period = s.y === e.y && s.m === e.m
    ? `${cap(MONTH_NAMES[s.m])} ${s.y}`
    : s.y === e.y
      ? `${cap(MONTH_NAMES[s.m])} – ${cap(MONTH_NAMES[e.m])} ${e.y}`
      : `${cap(MONTH_NAMES[s.m])} ${s.y} – ${cap(MONTH_NAMES[e.m])} ${e.y}`;
}

const contributors = [...new Set(events.map((e) => e.author).filter(Boolean))];

// ─── Copy images into public/historic/<slug>/ ───
const publicDir = path.join(ROOT, 'public', 'historic', slug);
fs.mkdirSync(publicDir, { recursive: true });
const allImages = [...new Set(events.flatMap((e) => e.images))];
let copied = 0;
for (const img of allImages) {
  const from = path.join(srcImagesBase, 'images', img);
  if (!fs.existsSync(from)) { console.warn(`  ! missing image: ${img}`); continue; }
  fs.copyFileSync(from, path.join(publicDir, img));
  copied++;
}

// drop authors from per-event payload (timeline credits collectively, not per row)
const cleanEvents = events.map(({ author, ...e }) => e);

const titleDefault = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const data = {
  slug,
  title: flags.title || titleDefault,
  subtitle: flags.subtitle || '',
  eyebrow: flags.eyebrow || 'Registro técnico',
  period,
  start,
  end,
  events: cleanEvents,
  contributors,
};

const logsDir = path.join(ROOT, 'src', 'pages', 'historic', 'logs');
fs.mkdirSync(logsDir, { recursive: true });
const outPath = path.join(logsDir, `${slug}.json`);
fs.writeFileSync(outPath, JSON.stringify(data, null, 2) + '\n', 'utf8');

console.log(`✓ Bitácora "${data.title}"`);
console.log(`  ${events.length} events · ${copied}/${allImages.length} images · ${contributors.length} contributors`);
console.log(`  period: ${period || '—'}`);
console.log(`  → ${path.relative(ROOT, outPath)}`);
console.log(`  → ${path.relative(ROOT, publicDir)}/  (images)`);
console.log(`\n  View at: #/bitacora/${slug}`);
