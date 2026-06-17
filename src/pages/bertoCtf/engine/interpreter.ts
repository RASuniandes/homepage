import type {
  WorldMap,
  Dir,
  Frame,
  Paint,
  RunResult,
  RunOptions,
  RunStatus,
} from './types';

// ── Tokenizer ───────────────────────────────────────────────────────
type Tok =
  | { t: 'id'; v: string; line: number }
  | { t: 'num'; v: number; line: number }
  | { t: 'punc'; v: '(' | ')' | '{' | '}'; line: number };

function tokenize(src: string): Tok[] {
  const toks: Tok[] = [];
  let line = 1;
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === '\n') { line++; i++; continue; }
    if (c === '#') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === ' ' || c === '\t' || c === '\r' || c === ';' || c === ',') { i++; continue; }
    if (c === '(' || c === ')' || c === '{' || c === '}') {
      toks.push({ t: 'punc', v: c, line }); i++; continue;
    }
    if (/[0-9]/.test(c)) {
      let j = i; while (j < n && /[0-9]/.test(src[j])) j++;
      toks.push({ t: 'num', v: parseInt(src.slice(i, j), 10), line }); i = j; continue;
    }
    if (/[A-Za-zÀ-ÿ_]/.test(c)) {
      let j = i; while (j < n && /[A-Za-zÀ-ÿ0-9_]/.test(src[j])) j++;
      toks.push({ t: 'id', v: src.slice(i, j), line }); i = j; continue;
    }
    throw new ParseError(`Símbolo inesperado “${c}”`, line);
  }
  return toks;
}

export class ParseError extends Error {
  line: number;
  constructor(msg: string, line: number) { super(msg); this.line = line; this.name = 'ParseError'; }
}

// ── AST ─────────────────────────────────────────────────────────────
type Expr =
  | { t: 'sensor'; name: string; line: number }
  | { t: 'lit'; v: boolean }
  | { t: 'not'; e: Expr }
  | { t: 'and'; l: Expr; r: Expr }
  | { t: 'or'; l: Expr; r: Expr };

type Stmt =
  | { t: 'cmd'; name: string; args: number[]; line: number }
  | { t: 'if'; clauses: { cond: Expr; body: Stmt[] }[]; elseBody: Stmt[] | null; line: number }
  | { t: 'repeat'; count: number | null; body: Stmt[]; line: number }
  | { t: 'while'; cond: Expr; body: Stmt[]; line: number };

interface Program {
  main: Stmt[];
  procs: Record<string, Stmt[]>;
}

// ── Parser ──────────────────────────────────────────────────────────
class Parser {
  toks: Tok[];
  p = 0;
  procs: Record<string, Stmt[]> = {};
  constructor(toks: Tok[]) { this.toks = toks; }

  peek() { return this.toks[this.p]; }
  next() { return this.toks[this.p++]; }
  eof() { return this.p >= this.toks.length; }

  expectPunc(v: string): Tok {
    const t = this.next();
    if (!t || t.t !== 'punc' || t.v !== v) {
      throw new ParseError(`Se esperaba “${v}”`, t ? t.line : 0);
    }
    return t;
  }

  parseProgram(): Program {
    const main: Stmt[] = [];
    while (!this.eof()) {
      const t = this.peek();
      if (t.t === 'id' && t.v === 'procedimiento') { this.parseProc(); continue; }
      main.push(this.parseStmt());
    }
    return { main, procs: this.procs };
  }

  parseProc() {
    this.next(); // 'procedimiento'
    const nameTok = this.next();
    if (!nameTok || nameTok.t !== 'id') throw new ParseError('Nombre de procedimiento inválido', nameTok ? nameTok.line : 0);
    this.expectPunc('('); this.expectPunc(')');
    const body = this.parseBlock();
    this.procs[nameTok.v] = body;
  }

  parseBlock(): Stmt[] {
    this.expectPunc('{');
    const body: Stmt[] = [];
    while (!this.eof() && !(this.peek().t === 'punc' && (this.peek() as { v: string }).v === '}')) {
      body.push(this.parseStmt());
    }
    this.expectPunc('}');
    return body;
  }

  parseStmt(): Stmt {
    const t = this.peek();
    if (t.t !== 'id') throw new ParseError('Instrucción inválida', t.line);
    if (t.v === 'si') return this.parseIf();
    if (t.v === 'repetir') return this.parseRepeat();
    if (t.v === 'repetirMientras' || t.v === 'mientras') return this.parseWhile();
    // command or user-proc call: IDENT ( args )
    this.next();
    this.expectPunc('(');
    const args: number[] = [];
    while (!(this.peek() && this.peek().t === 'punc' && (this.peek() as { v: string }).v === ')')) {
      const a = this.next();
      if (!a) throw new ParseError('Paréntesis sin cerrar', t.line);
      if (a.t === 'num') args.push(a.v);
      else throw new ParseError(`Argumento inválido en ${t.v}()`, a.line);
    }
    this.expectPunc(')');
    return { t: 'cmd', name: t.v, args, line: t.line };
  }

  parseIf(): Stmt {
    const line = this.next().line; // 'si'
    this.expectPunc('(');
    const cond = this.parseExpr();
    this.expectPunc(')');
    const body = this.parseBlock();
    const clauses = [{ cond, body }];
    let elseBody: Stmt[] | null = null;
    while (this.peek() && this.peek().t === 'id' && (this.peek() as { v: string }).v === 'otro') {
      this.next(); // 'otro'
      const after = this.peek();
      if (after && after.t === 'id' && after.v === 'si') {
        this.next(); // 'si'
        this.expectPunc('(');
        const c = this.parseExpr();
        this.expectPunc(')');
        const b = this.parseBlock();
        clauses.push({ cond: c, body: b });
      } else {
        elseBody = this.parseBlock();
        break;
      }
    }
    return { t: 'if', clauses, elseBody, line };
  }

  parseRepeat(): Stmt {
    const line = this.next().line; // 'repetir'
    let count: number | null = null;
    if (this.peek() && this.peek().t === 'punc' && (this.peek() as { v: string }).v === '(') {
      this.next();
      const num = this.next();
      if (!num || num.t !== 'num') throw new ParseError('repetir() requiere un número', line);
      count = num.v;
      this.expectPunc(')');
    }
    const body = this.parseBlock();
    return { t: 'repeat', count, body, line };
  }

  parseWhile(): Stmt {
    const line = this.next().line;
    this.expectPunc('(');
    const cond = this.parseExpr();
    this.expectPunc(')');
    const body = this.parseBlock();
    return { t: 'while', cond, body, line };
  }

  // expr := and ('o' and)*
  parseExpr(): Expr {
    let l = this.parseAnd();
    while (this.peek() && this.peek().t === 'id' && (this.peek() as { v: string }).v === 'o') {
      this.next(); l = { t: 'or', l, r: this.parseAnd() };
    }
    return l;
  }
  parseAnd(): Expr {
    let l = this.parseNot();
    while (this.peek() && this.peek().t === 'id' && (this.peek() as { v: string }).v === 'y') {
      this.next(); l = { t: 'and', l, r: this.parseNot() };
    }
    return l;
  }
  parseNot(): Expr {
    if (this.peek() && this.peek().t === 'id' && (this.peek() as { v: string }).v === 'no') {
      this.next(); return { t: 'not', e: this.parseNot() };
    }
    return this.parsePrimary();
  }
  parsePrimary(): Expr {
    const t = this.peek();
    if (t && t.t === 'punc' && t.v === '(') {
      this.next(); const e = this.parseExpr(); this.expectPunc(')'); return e;
    }
    if (!t || t.t !== 'id') throw new ParseError('Condición inválida', t ? t.line : 0);
    this.next();
    if (t.v === 'verdadero') return { t: 'lit', v: true };
    if (t.v === 'falso') return { t: 'lit', v: false };
    // sensor call: name ( )
    if (this.peek() && this.peek().t === 'punc' && (this.peek() as { v: string }).v === '(') {
      this.expectPunc('('); this.expectPunc(')');
    }
    return { t: 'sensor', name: t.v, line: t.line };
  }
}

export function parse(src: string): Program {
  return new Parser(tokenize(src)).parseProgram();
}

// ── Runtime ─────────────────────────────────────────────────────────
const DELTA: Record<Dir, [number, number]> = { 0: [0, -1], 1: [1, 0], 2: [0, 1], 3: [-1, 0] };

const COMMANDS = new Set([
  'adelante', 'atras', 'avanzar', 'derecha', 'izquierda',
  'norte', 'sur', 'este', 'oeste',
  'tomar', 'poner', 'pintarBlanco', 'pintarNegro', 'detenerPintar', 'nada',
]);

const SENSORS = new Set([
  'frenteEsClaro', 'frenteEsObstaculo', 'frenteEsBaliza',
  'derechaEsClaro', 'derechaEsObstaculo',
  'izquierdaEsClaro', 'izquierdaEsObstaculo',
  'atrasEsClaro', 'atrasEsObstaculo',
]);

class Stop {
  status: RunStatus;
  msg: string;
  constructor(status: RunStatus, msg: string) { this.status = status; this.msg = msg; }
}

class Machine {
  map: WorldMap;
  x: number; y: number; dir: Dir;
  beacons: Set<string>;
  paint: Map<string, Paint> = new Map();
  paintMode: Paint = 'none';
  frames: Frame[] = [];
  steps = 0;
  loopIterations = 0;
  maxSteps: number;
  stopWhenNoBeacons: boolean;
  beaconsTotal: number;

  constructor(map: WorldMap, opts: RunOptions) {
    this.map = map;
    this.x = map.start.x; this.y = map.start.y; this.dir = map.start.dir;
    this.beacons = new Set(map.beacons);
    this.beaconsTotal = map.beacons.size;
    this.maxSteps = opts.maxSteps ?? 4000;
    this.stopWhenNoBeacons = opts.stopWhenNoBeacons ?? false;
    this.snapshot('inicio', map.start.dir, 0);
  }

  snapshot(action: string, _dir: Dir, line: number) {
    const paintObj: Record<string, Paint> = {};
    this.paint.forEach((v, k) => { paintObj[k] = v; });
    this.frames.push({
      x: this.x, y: this.y, dir: this.dir,
      beacons: Array.from(this.beacons),
      paint: paintObj, action, line,
    });
  }

  cellKind(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.map.width || y >= this.map.height) return 'wall';
    return this.map.cells[y * this.map.width + x];
  }
  isObstacle(x: number, y: number) { return this.cellKind(x, y) !== 'floor'; }
  hasBeacon(x: number, y: number) { return this.beacons.has(`${x},${y}`); }

  relCell(turn: 0 | 1 | 3) {
    const d = ((this.dir + turn) % 4) as Dir;
    const [dx, dy] = DELTA[d];
    return [this.x + dx, this.y + dy] as const;
  }

  evalExpr(e: Expr): boolean {
    switch (e.t) {
      case 'lit': return e.v;
      case 'not': return !this.evalExpr(e.e);
      case 'and': return this.evalExpr(e.l) && this.evalExpr(e.r);
      case 'or': return this.evalExpr(e.l) || this.evalExpr(e.r);
      case 'sensor': return this.evalSensor(e.name, e.line);
    }
  }

  evalSensor(name: string, line: number): boolean {
    if (!SENSORS.has(name)) throw new ParseError(`Sensor desconocido: ${name}()`, line);
    const turn = name.startsWith('derecha') ? 1 : name.startsWith('izquierda') ? 3 : name.startsWith('atras') ? 2 : 0;
    const d = ((this.dir + (turn as 0 | 1 | 2 | 3)) % 4) as Dir;
    const [dx, dy] = DELTA[d];
    const cx = this.x + dx, cy = this.y + dy;
    const obstacle = this.isObstacle(cx, cy);
    const beacon = this.hasBeacon(cx, cy);
    if (name.endsWith('Obstaculo')) return obstacle;
    if (name === 'frenteEsBaliza') return beacon;
    // *EsClaro: walkable AND no beacon (so head-on beacons are detected by EsBaliza)
    return !obstacle && !beacon;
  }

  tick() {
    this.steps++;
    if (this.steps > this.maxSteps) {
      throw new Stop('timeout', 'El programa no terminó: posible bucle infinito.');
    }
  }

  checkBeaconStop() {
    if (this.stopWhenNoBeacons && this.beacons.size === 0) {
      throw new Stop('success', '¡Todas las balizas recogidas!');
    }
  }

  stepForward(d: Dir, line: number) {
    const [dx, dy] = DELTA[d];
    const nx = this.x + dx, ny = this.y + dy;
    if (this.isObstacle(nx, ny)) {
      throw new Stop('crash', `BERTO chocó contra un obstáculo (línea ${line}).`);
    }
    this.x = nx; this.y = ny;
    if (this.paintMode !== 'none') this.paint.set(`${nx},${ny}`, this.paintMode);
    this.tick();
    this.snapshot('adelante', this.dir, line);
    this.checkBeaconStop();
  }

  runCmd(s: { name: string; args: number[]; line: number }) {
    const { name, args, line } = s;
    if (!COMMANDS.has(name)) {
      // user procedure?
      const proc = this.procs[name];
      if (!proc) throw new ParseError(`Comando o procedimiento desconocido: ${name}()`, line);
      this.callDepth++;
      if (this.callDepth > 64) throw new Stop('timeout', 'Demasiada recursión.');
      this.runBlock(proc);
      this.callDepth--;
      return;
    }
    switch (name) {
      case 'adelante':
      case 'avanzar': {
        const n = args[0] ?? 1;
        for (let k = 0; k < n; k++) this.stepForward(this.dir, line);
        break;
      }
      case 'atras': {
        const n = args[0] ?? 1;
        const back = ((this.dir + 2) % 4) as Dir;
        for (let k = 0; k < n; k++) this.stepForward(back, line);
        break;
      }
      case 'norte': case 'sur': case 'este': case 'oeste': {
        this.dir = (name === 'norte' ? 0 : name === 'este' ? 1 : name === 'sur' ? 2 : 3) as Dir;
        const n = args[0] ?? 1;
        for (let k = 0; k < n; k++) this.stepForward(this.dir, line);
        break;
      }
      case 'derecha': {
        this.dir = ((this.dir + 1) % 4) as Dir;
        this.tick(); this.snapshot('derecha', this.dir, line);
        break;
      }
      case 'izquierda': {
        this.dir = ((this.dir + 3) % 4) as Dir;
        this.tick(); this.snapshot('izquierda', this.dir, line);
        break;
      }
      case 'tomar': {
        const [fx, fy] = this.relCell(0);
        if (this.hasBeacon(fx, fy)) this.beacons.delete(`${fx},${fy}`);
        else if (this.hasBeacon(this.x, this.y)) this.beacons.delete(`${this.x},${this.y}`);
        this.tick(); this.snapshot('tomar', this.dir, line);
        this.checkBeaconStop();
        break;
      }
      case 'poner': {
        this.beacons.add(`${this.x},${this.y}`);
        this.tick(); this.snapshot('poner', this.dir, line);
        break;
      }
      case 'pintarBlanco': {
        this.paintMode = 'white'; this.paint.set(`${this.x},${this.y}`, 'white');
        this.tick(); this.snapshot('pintarBlanco', this.dir, line);
        break;
      }
      case 'pintarNegro': {
        this.paintMode = 'black'; this.paint.set(`${this.x},${this.y}`, 'black');
        this.tick(); this.snapshot('pintarNegro', this.dir, line);
        break;
      }
      case 'detenerPintar': {
        this.paintMode = 'none';
        this.tick(); this.snapshot('detenerPintar', this.dir, line);
        break;
      }
      case 'nada': { this.tick(); this.snapshot('nada', this.dir, line); break; }
    }
  }

  callDepth = 0;
  procs: Record<string, Stmt[]> = {};

  runBlock(body: Stmt[]) {
    for (const s of body) this.runStmt(s);
  }

  runStmt(s: Stmt) {
    switch (s.t) {
      case 'cmd': this.runCmd(s); break;
      case 'if': {
        for (const c of s.clauses) {
          if (this.evalExpr(c.cond)) { this.runBlock(c.body); return; }
        }
        if (s.elseBody) this.runBlock(s.elseBody);
        break;
      }
      case 'repeat': {
        if (s.count == null) {
          // unbounded; protected by maxSteps tick guard
          while (true) {
            const before = this.steps;
            this.runBlock(s.body);
            if (this.steps === before) {
              // a full pass did nothing -> would spin forever
              throw new Stop('timeout', 'El programa quedó atascado sin avanzar.');
            }
          }
        } else {
          for (let k = 0; k < s.count; k++) this.runBlock(s.body);
        }
        break;
      }
      case 'while': {
        while (this.evalExpr(s.cond)) {
          this.loopIterations++;
          const before = this.steps;
          this.runBlock(s.body);
          this.tick(); // guard against zero-progress conditions
          if (this.steps === before + 1) { /* body did nothing but tick: still bounded */ }
        }
        break;
      }
    }
  }
}

export function run(src: string, map: WorldMap, opts: RunOptions = {}): RunResult {
  let program: Program;
  try {
    program = parse(src);
  } catch (e) {
    const pe = e as ParseError;
    return {
      status: 'error',
      message: pe.line ? `Error de sintaxis (línea ${pe.line}): ${pe.message}` : `Error de sintaxis: ${pe.message}`,
      frames: [], steps: 0, loopIterations: 0,
      beaconsCollected: 0, beaconsTotal: map.beacons.size, paintedTiles: 0,
    };
  }

  const m = new Machine(map, opts);
  m.procs = program.procs;
  let status: RunStatus = 'success';
  let message = 'Ejecución completada.';
  try {
    m.runBlock(program.main);
  } catch (e) {
    if (e instanceof Stop) { status = e.status; message = e.msg; }
    else if (e instanceof ParseError) {
      status = 'error';
      message = e.line ? `Error (línea ${e.line}): ${e.message}` : `Error: ${e.message}`;
    } else throw e;
  }

  return {
    status,
    message,
    frames: m.frames,
    steps: m.steps,
    loopIterations: m.loopIterations,
    beaconsCollected: m.beaconsTotal - m.beacons.size,
    beaconsTotal: m.beaconsTotal,
    paintedTiles: m.paint.size,
  };
}
