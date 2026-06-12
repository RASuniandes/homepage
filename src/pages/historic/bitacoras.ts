/* =====================================================================
   bitacoras.ts — auto-discovered technical logbooks
   ---------------------------------------------------------------------
   Every JSON file in ./logs/ (produced by scripts/import-bitacora.mjs)
   is registered automatically — no edits here when you add a new log.
   ===================================================================== */

export interface BitacoraEvent {
  date: string | null;       // ISO YYYY-MM-DD for sorting, may be null
  dateLabel: string;         // original human label, e.g. "20 de abril de 2026"
  title: string;
  description: string[];     // one entry per paragraph
  images: string[];          // filenames, served from /historic/<slug>/
}

export interface Bitacora {
  slug: string;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  period?: string;
  start?: string | null;
  end?: string | null;
  events: BitacoraEvent[];
  contributors: string[];
}

const modules = import.meta.glob('./logs/*.json', { eager: true }) as Record<
  string,
  { default: Bitacora }
>;

export const bitacoras: Bitacora[] = Object.values(modules)
  .map((m) => m.default)
  // newest logbook first (by its latest event)
  .sort((a, b) => (b.end || '').localeCompare(a.end || ''));

export const getBitacora = (slug: string): Bitacora | undefined =>
  bitacoras.find((b) => b.slug === slug);

/** First available image of a logbook, for use as a cover thumbnail. */
export const coverImage = (b: Bitacora): string | null => {
  for (const ev of b.events) if (ev.images.length) return ev.images[0];
  return null;
};
