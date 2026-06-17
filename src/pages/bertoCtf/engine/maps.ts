import type { WorldMap, CellKind, Dir } from './types';

// ── ASCII map legend ────────────────────────────────────────────────
//   #  wall              .  floor (walkable)
//   *  beacon on floor   (space) void / outside (not walkable)
//   ^ > v <  robot start on floor, facing N E S W respectively
//
// Maps are authored so the *intended* BERTO solutions terminate cleanly.

const DIR_OF: Record<string, Dir> = { '^': 0, '>': 1, 'v': 2, '<': 3 };

function parseMap(name: string, art: string): WorldMap {
  const rows = art.replace(/\n+$/, '').replace(/^\n+/, '').split('\n');
  const width = Math.max(...rows.map((r) => r.length));
  const height = rows.length;
  const cells: CellKind[] = [];
  const beacons = new Set<string>();
  let start: WorldMap['start'] | null = null;

  for (let y = 0; y < height; y++) {
    const row = rows[y] ?? '';
    for (let x = 0; x < width; x++) {
      const ch = row[x] ?? ' ';
      if (ch === '#') cells.push('wall');
      else if (ch === ' ') cells.push('void');
      else {
        cells.push('floor');
        if (ch === '*') beacons.add(`${x},${y}`);
        else if (ch in DIR_OF) start = { x, y, dir: DIR_OF[ch] };
      }
    }
  }

  if (!start) throw new Error(`map "${name}" has no robot start marker`);
  return { name, width, height, cells, beacons, start };
}

// ── Artifact 1 — "default.map" — snake corridor, collect every beacon ──
// Right-hand wall follower: forward, else right, else left, else take beacon.
// Beacons sit head-on in 1-wide corridors; turns happen on empty floor so the
// solution exercises derecha() (going down) and izquierda() (turning east).
export const MAP_DEFAULT = parseMap(
  'default.map',
  `
#########
#>.*..###
#####.###
#####*###
#####.###
#####..*#
#########
`,
);

// ── Artifact 2 — "followLine.map" — trace a straight line, count steps ──
// adelante(3); izquierda(); then trace north while the path is clear. The
// corridor ends in a beacon so frenteEsClaro() turns false and the trailing
// adelante(1) steps onto it instead of crashing. The while runs 12 times.
export const MAP_FOLLOWLINE = parseMap(
  'followLine.map',
  `
#########
####*####
####.####
####.####
####.####
####.####
####.####
####.####
####.####
####.####
####.####
####.####
####.####
####.####
#>...####
#########
`,
);

// ── Artifact 3 — "chambers.map" — three exits, BERTO took the left one ──
// Robot faces a wall, both sides open, no beacon ahead -> SALIDA B (left).
export const MAP_CHAMBERS = parseMap(
  'chambers.map',
  `
###############
#......#......#
#......#......#
#.....###.....#
#......^......#
#.....###.....#
#......#......#
#......#......#
###############
`,
);

export const MAPS: Record<string, WorldMap> = {
  'default.map': MAP_DEFAULT,
  'followLine.map': MAP_FOLLOWLINE,
  'chambers.map': MAP_CHAMBERS,
};
