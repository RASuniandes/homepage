// ── BERTO engine types ──────────────────────────────────────────────
// A tiny RoboMind-flavoured world. Coordinates are (x = column, y = row),
// y grows downward. Direction: 0=N, 1=E, 2=S, 3=W.

export type Dir = 0 | 1 | 2 | 3;

/** A parsed map. `tiles` is row-major; legend below. */
export interface WorldMap {
  name: string;
  width: number;
  height: number;
  /** 'wall' | 'floor' | 'void' per cell (row-major, height*width). */
  cells: CellKind[];
  /** Beacon positions as "x,y" keys. */
  beacons: Set<string>;
  /** Initial robot state. */
  start: { x: number; y: number; dir: Dir };
}

export type CellKind = 'wall' | 'floor' | 'void';

/** Paint state of a tile, used for trail visualisation. */
export type Paint = 'none' | 'white' | 'black';

/** A single immutable snapshot of the world, one per executed action. */
export interface Frame {
  x: number;
  y: number;
  dir: Dir;
  /** Beacons still on the floor, "x,y" keys. */
  beacons: string[];
  /** Painted tiles, "x,y" -> 'white'|'black'. */
  paint: Record<string, Paint>;
  /** Human-readable label of the action that produced this frame. */
  action: string;
  /** Source line (1-based) that produced this frame, if known. */
  line: number;
}

export type RunStatus = 'success' | 'crash' | 'timeout' | 'error';

export interface RunResult {
  status: RunStatus;
  message: string;
  /** Animation frames, including the initial frame at index 0. */
  frames: Frame[];
  /** Count of movement/turn/action steps executed. */
  steps: number;
  /** Count of `repetirMientras` iterations of the *outermost* loop hit. */
  loopIterations: number;
  beaconsCollected: number;
  beaconsTotal: number;
  paintedTiles: number;
}

export interface RunOptions {
  /** Hard cap on executed actions before declaring a timeout. */
  maxSteps?: number;
  /** Stop (as success) the instant the last beacon is collected. */
  stopWhenNoBeacons?: boolean;
}
