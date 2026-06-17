// src/pages/bertoCtf/engine/interpreter.ts
function tokenize(src) {
  const toks = [];
  let line = 1;
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === "\n") {
      line++;
      i++;
      continue;
    }
    if (c === "#") {
      while (i < n && src[i] !== "\n") i++;
      continue;
    }
    if (c === " " || c === "	" || c === "\r" || c === ";" || c === ",") {
      i++;
      continue;
    }
    if (c === "(" || c === ")" || c === "{" || c === "}") {
      toks.push({ t: "punc", v: c, line });
      i++;
      continue;
    }
    if (/[0-9]/.test(c)) {
      let j = i;
      while (j < n && /[0-9]/.test(src[j])) j++;
      toks.push({ t: "num", v: parseInt(src.slice(i, j), 10), line });
      i = j;
      continue;
    }
    if (/[A-Za-zÀ-ÿ_]/.test(c)) {
      let j = i;
      while (j < n && /[A-Za-zÀ-ÿ0-9_]/.test(src[j])) j++;
      toks.push({ t: "id", v: src.slice(i, j), line });
      i = j;
      continue;
    }
    throw new ParseError(`S\xEDmbolo inesperado \u201C${c}\u201D`, line);
  }
  return toks;
}
var ParseError = class extends Error {
  line;
  constructor(msg, line) {
    super(msg);
    this.line = line;
    this.name = "ParseError";
  }
};
var Parser = class {
  toks;
  p = 0;
  procs = {};
  constructor(toks) {
    this.toks = toks;
  }
  peek() {
    return this.toks[this.p];
  }
  next() {
    return this.toks[this.p++];
  }
  eof() {
    return this.p >= this.toks.length;
  }
  expectPunc(v) {
    const t = this.next();
    if (!t || t.t !== "punc" || t.v !== v) {
      throw new ParseError(`Se esperaba \u201C${v}\u201D`, t ? t.line : 0);
    }
    return t;
  }
  parseProgram() {
    const main = [];
    while (!this.eof()) {
      const t = this.peek();
      if (t.t === "id" && t.v === "procedimiento") {
        this.parseProc();
        continue;
      }
      main.push(this.parseStmt());
    }
    return { main, procs: this.procs };
  }
  parseProc() {
    this.next();
    const nameTok = this.next();
    if (!nameTok || nameTok.t !== "id") throw new ParseError("Nombre de procedimiento inv\xE1lido", nameTok ? nameTok.line : 0);
    this.expectPunc("(");
    this.expectPunc(")");
    const body = this.parseBlock();
    this.procs[nameTok.v] = body;
  }
  parseBlock() {
    this.expectPunc("{");
    const body = [];
    while (!this.eof() && !(this.peek().t === "punc" && this.peek().v === "}")) {
      body.push(this.parseStmt());
    }
    this.expectPunc("}");
    return body;
  }
  parseStmt() {
    const t = this.peek();
    if (t.t !== "id") throw new ParseError("Instrucci\xF3n inv\xE1lida", t.line);
    if (t.v === "si") return this.parseIf();
    if (t.v === "repetir") return this.parseRepeat();
    if (t.v === "repetirMientras" || t.v === "mientras") return this.parseWhile();
    this.next();
    this.expectPunc("(");
    const args = [];
    while (!(this.peek() && this.peek().t === "punc" && this.peek().v === ")")) {
      const a = this.next();
      if (!a) throw new ParseError("Par\xE9ntesis sin cerrar", t.line);
      if (a.t === "num") args.push(a.v);
      else throw new ParseError(`Argumento inv\xE1lido en ${t.v}()`, a.line);
    }
    this.expectPunc(")");
    return { t: "cmd", name: t.v, args, line: t.line };
  }
  parseIf() {
    const line = this.next().line;
    this.expectPunc("(");
    const cond = this.parseExpr();
    this.expectPunc(")");
    const body = this.parseBlock();
    const clauses = [{ cond, body }];
    let elseBody = null;
    while (this.peek() && this.peek().t === "id" && this.peek().v === "otro") {
      this.next();
      const after = this.peek();
      if (after && after.t === "id" && after.v === "si") {
        this.next();
        this.expectPunc("(");
        const c = this.parseExpr();
        this.expectPunc(")");
        const b = this.parseBlock();
        clauses.push({ cond: c, body: b });
      } else {
        elseBody = this.parseBlock();
        break;
      }
    }
    return { t: "if", clauses, elseBody, line };
  }
  parseRepeat() {
    const line = this.next().line;
    let count = null;
    if (this.peek() && this.peek().t === "punc" && this.peek().v === "(") {
      this.next();
      const num = this.next();
      if (!num || num.t !== "num") throw new ParseError("repetir() requiere un n\xFAmero", line);
      count = num.v;
      this.expectPunc(")");
    }
    const body = this.parseBlock();
    return { t: "repeat", count, body, line };
  }
  parseWhile() {
    const line = this.next().line;
    this.expectPunc("(");
    const cond = this.parseExpr();
    this.expectPunc(")");
    const body = this.parseBlock();
    return { t: "while", cond, body, line };
  }
  // expr := and ('o' and)*
  parseExpr() {
    let l = this.parseAnd();
    while (this.peek() && this.peek().t === "id" && this.peek().v === "o") {
      this.next();
      l = { t: "or", l, r: this.parseAnd() };
    }
    return l;
  }
  parseAnd() {
    let l = this.parseNot();
    while (this.peek() && this.peek().t === "id" && this.peek().v === "y") {
      this.next();
      l = { t: "and", l, r: this.parseNot() };
    }
    return l;
  }
  parseNot() {
    if (this.peek() && this.peek().t === "id" && this.peek().v === "no") {
      this.next();
      return { t: "not", e: this.parseNot() };
    }
    return this.parsePrimary();
  }
  parsePrimary() {
    const t = this.peek();
    if (t && t.t === "punc" && t.v === "(") {
      this.next();
      const e = this.parseExpr();
      this.expectPunc(")");
      return e;
    }
    if (!t || t.t !== "id") throw new ParseError("Condici\xF3n inv\xE1lida", t ? t.line : 0);
    this.next();
    if (t.v === "verdadero") return { t: "lit", v: true };
    if (t.v === "falso") return { t: "lit", v: false };
    if (this.peek() && this.peek().t === "punc" && this.peek().v === "(") {
      this.expectPunc("(");
      this.expectPunc(")");
    }
    return { t: "sensor", name: t.v, line: t.line };
  }
};
function parse(src) {
  return new Parser(tokenize(src)).parseProgram();
}
var DELTA = { 0: [0, -1], 1: [1, 0], 2: [0, 1], 3: [-1, 0] };
var COMMANDS = /* @__PURE__ */ new Set([
  "adelante",
  "atras",
  "avanzar",
  "derecha",
  "izquierda",
  "norte",
  "sur",
  "este",
  "oeste",
  "tomar",
  "poner",
  "pintarBlanco",
  "pintarNegro",
  "detenerPintar",
  "nada"
]);
var SENSORS = /* @__PURE__ */ new Set([
  "frenteEsClaro",
  "frenteEsObstaculo",
  "frenteEsBaliza",
  "derechaEsClaro",
  "derechaEsObstaculo",
  "izquierdaEsClaro",
  "izquierdaEsObstaculo",
  "atrasEsClaro",
  "atrasEsObstaculo"
]);
var Stop = class {
  constructor(status, msg) {
    this.status = status;
    this.msg = msg;
  }
};
var Machine = class {
  map;
  x;
  y;
  dir;
  beacons;
  paint = /* @__PURE__ */ new Map();
  paintMode = "none";
  frames = [];
  steps = 0;
  loopIterations = 0;
  maxSteps;
  stopWhenNoBeacons;
  beaconsTotal;
  constructor(map, opts) {
    this.map = map;
    this.x = map.start.x;
    this.y = map.start.y;
    this.dir = map.start.dir;
    this.beacons = new Set(map.beacons);
    this.beaconsTotal = map.beacons.size;
    this.maxSteps = opts.maxSteps ?? 4e3;
    this.stopWhenNoBeacons = opts.stopWhenNoBeacons ?? false;
    this.snapshot("inicio", map.start.dir, 0);
  }
  snapshot(action, _dir, line) {
    const paintObj = {};
    this.paint.forEach((v, k) => {
      paintObj[k] = v;
    });
    this.frames.push({
      x: this.x,
      y: this.y,
      dir: this.dir,
      beacons: Array.from(this.beacons),
      paint: paintObj,
      action,
      line
    });
  }
  cellKind(x, y) {
    if (x < 0 || y < 0 || x >= this.map.width || y >= this.map.height) return "wall";
    return this.map.cells[y * this.map.width + x];
  }
  isObstacle(x, y) {
    return this.cellKind(x, y) !== "floor";
  }
  hasBeacon(x, y) {
    return this.beacons.has(`${x},${y}`);
  }
  relCell(turn) {
    const d = (this.dir + turn) % 4;
    const [dx, dy] = DELTA[d];
    return [this.x + dx, this.y + dy];
  }
  evalExpr(e) {
    switch (e.t) {
      case "lit":
        return e.v;
      case "not":
        return !this.evalExpr(e.e);
      case "and":
        return this.evalExpr(e.l) && this.evalExpr(e.r);
      case "or":
        return this.evalExpr(e.l) || this.evalExpr(e.r);
      case "sensor":
        return this.evalSensor(e.name, e.line);
    }
  }
  evalSensor(name, line) {
    if (!SENSORS.has(name)) throw new ParseError(`Sensor desconocido: ${name}()`, line);
    const turn = name.startsWith("derecha") ? 1 : name.startsWith("izquierda") ? 3 : name.startsWith("atras") ? 2 : 0;
    const d = (this.dir + turn) % 4;
    const [dx, dy] = DELTA[d];
    const cx = this.x + dx, cy = this.y + dy;
    const obstacle = this.isObstacle(cx, cy);
    const beacon = this.hasBeacon(cx, cy);
    if (name.endsWith("Obstaculo")) return obstacle;
    if (name === "frenteEsBaliza") return beacon;
    return !obstacle && !beacon;
  }
  tick() {
    this.steps++;
    if (this.steps > this.maxSteps) {
      throw new Stop("timeout", "El programa no termin\xF3: posible bucle infinito.");
    }
  }
  checkBeaconStop() {
    if (this.stopWhenNoBeacons && this.beacons.size === 0) {
      throw new Stop("success", "\xA1Todas las balizas recogidas!");
    }
  }
  stepForward(d, line) {
    const [dx, dy] = DELTA[d];
    const nx = this.x + dx, ny = this.y + dy;
    if (this.isObstacle(nx, ny)) {
      throw new Stop("crash", `BERTO choc\xF3 contra un obst\xE1culo (l\xEDnea ${line}).`);
    }
    this.x = nx;
    this.y = ny;
    if (this.paintMode !== "none") this.paint.set(`${nx},${ny}`, this.paintMode);
    this.tick();
    this.snapshot("adelante", this.dir, line);
    this.checkBeaconStop();
  }
  runCmd(s) {
    const { name, args, line } = s;
    if (!COMMANDS.has(name)) {
      const proc = this.procs[name];
      if (!proc) throw new ParseError(`Comando o procedimiento desconocido: ${name}()`, line);
      this.callDepth++;
      if (this.callDepth > 64) throw new Stop("timeout", "Demasiada recursi\xF3n.");
      this.runBlock(proc);
      this.callDepth--;
      return;
    }
    switch (name) {
      case "adelante":
      case "avanzar": {
        const n = args[0] ?? 1;
        for (let k = 0; k < n; k++) this.stepForward(this.dir, line);
        break;
      }
      case "atras": {
        const n = args[0] ?? 1;
        const back = (this.dir + 2) % 4;
        for (let k = 0; k < n; k++) this.stepForward(back, line);
        break;
      }
      case "norte":
      case "sur":
      case "este":
      case "oeste": {
        this.dir = name === "norte" ? 0 : name === "este" ? 1 : name === "sur" ? 2 : 3;
        const n = args[0] ?? 1;
        for (let k = 0; k < n; k++) this.stepForward(this.dir, line);
        break;
      }
      case "derecha": {
        this.dir = (this.dir + 1) % 4;
        this.tick();
        this.snapshot("derecha", this.dir, line);
        break;
      }
      case "izquierda": {
        this.dir = (this.dir + 3) % 4;
        this.tick();
        this.snapshot("izquierda", this.dir, line);
        break;
      }
      case "tomar": {
        const [fx, fy] = this.relCell(0);
        if (this.hasBeacon(fx, fy)) this.beacons.delete(`${fx},${fy}`);
        else if (this.hasBeacon(this.x, this.y)) this.beacons.delete(`${this.x},${this.y}`);
        this.tick();
        this.snapshot("tomar", this.dir, line);
        this.checkBeaconStop();
        break;
      }
      case "poner": {
        this.beacons.add(`${this.x},${this.y}`);
        this.tick();
        this.snapshot("poner", this.dir, line);
        break;
      }
      case "pintarBlanco": {
        this.paintMode = "white";
        this.paint.set(`${this.x},${this.y}`, "white");
        this.tick();
        this.snapshot("pintarBlanco", this.dir, line);
        break;
      }
      case "pintarNegro": {
        this.paintMode = "black";
        this.paint.set(`${this.x},${this.y}`, "black");
        this.tick();
        this.snapshot("pintarNegro", this.dir, line);
        break;
      }
      case "detenerPintar": {
        this.paintMode = "none";
        this.tick();
        this.snapshot("detenerPintar", this.dir, line);
        break;
      }
      case "nada": {
        this.tick();
        this.snapshot("nada", this.dir, line);
        break;
      }
    }
  }
  callDepth = 0;
  procs = {};
  runBlock(body) {
    for (const s of body) this.runStmt(s);
  }
  runStmt(s) {
    switch (s.t) {
      case "cmd":
        this.runCmd(s);
        break;
      case "if": {
        for (const c of s.clauses) {
          if (this.evalExpr(c.cond)) {
            this.runBlock(c.body);
            return;
          }
        }
        if (s.elseBody) this.runBlock(s.elseBody);
        break;
      }
      case "repeat": {
        if (s.count == null) {
          while (true) {
            const before = this.steps;
            this.runBlock(s.body);
            if (this.steps === before) {
              throw new Stop("timeout", "El programa qued\xF3 atascado sin avanzar.");
            }
          }
        } else {
          for (let k = 0; k < s.count; k++) this.runBlock(s.body);
        }
        break;
      }
      case "while": {
        while (this.evalExpr(s.cond)) {
          this.loopIterations++;
          const before = this.steps;
          this.runBlock(s.body);
          this.tick();
          if (this.steps === before + 1) {
          }
        }
        break;
      }
    }
  }
};
function run(src, map, opts = {}) {
  let program;
  try {
    program = parse(src);
  } catch (e) {
    const pe = e;
    return {
      status: "error",
      message: pe.line ? `Error de sintaxis (l\xEDnea ${pe.line}): ${pe.message}` : `Error de sintaxis: ${pe.message}`,
      frames: [],
      steps: 0,
      loopIterations: 0,
      beaconsCollected: 0,
      beaconsTotal: map.beacons.size,
      paintedTiles: 0
    };
  }
  const m = new Machine(map, opts);
  m.procs = program.procs;
  let status = "success";
  let message = "Ejecuci\xF3n completada.";
  try {
    m.runBlock(program.main);
  } catch (e) {
    if (e instanceof Stop) {
      status = e.status;
      message = e.msg;
    } else if (e instanceof ParseError) {
      status = "error";
      message = e.line ? `Error (l\xEDnea ${e.line}): ${e.message}` : `Error: ${e.message}`;
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
    paintedTiles: m.paint.size
  };
}

// src/pages/bertoCtf/engine/maps.ts
var DIR_OF = { "^": 0, ">": 1, "v": 2, "<": 3 };
function parseMap(name, art) {
  const rows = art.replace(/\n+$/, "").replace(/^\n+/, "").split("\n");
  const width = Math.max(...rows.map((r) => r.length));
  const height = rows.length;
  const cells = [];
  const beacons = /* @__PURE__ */ new Set();
  let start = null;
  for (let y = 0; y < height; y++) {
    const row = rows[y] ?? "";
    for (let x = 0; x < width; x++) {
      const ch = row[x] ?? " ";
      if (ch === "#") cells.push("wall");
      else if (ch === " ") cells.push("void");
      else {
        cells.push("floor");
        if (ch === "*") beacons.add(`${x},${y}`);
        else if (ch in DIR_OF) start = { x, y, dir: DIR_OF[ch] };
      }
    }
  }
  if (!start) throw new Error(`map "${name}" has no robot start marker`);
  return { name, width, height, cells, beacons, start };
}
var MAP_DEFAULT = parseMap(
  "default.map",
  `
#########
#>.*..###
#####.###
#####*###
#####.###
#####..*#
#########
`
);
var MAP_FOLLOWLINE = parseMap(
  "followLine.map",
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
`
);
var MAP_CHAMBERS = parseMap(
  "chambers.map",
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
`
);

// scripts/berto-selftest.ts
var sol1 = `
repetir
{
    si(frenteEsClaro())        { adelante(1) }
    otro si(derechaEsClaro())  { derecha() }
    otro si(izquierdaEsClaro()){ izquierda() }
    otro si(frenteEsBaliza())  { tomar() adelante(1) }
}
`;
var sol2 = `
procedimiento Trazar_Camino()
{
    pintarBlanco()
    repetirMientras(frenteEsClaro())
    {
        adelante(1)
    }
    adelante(1)
    detenerPintar()
}
adelante(3)
izquierda()
Trazar_Camino()
`;
var sol3 = `
procedimiento Evaluar_Salida()
{
    si(frenteEsBaliza()) { adelante(1) tomar() norte(5) }
    otro si(frenteEsObstaculo() y izquierdaEsClaro())
    { izquierda() adelante(3) pintarNegro() detenerPintar() adelante(2) }
    otro si(frenteEsObstaculo() y derechaEsClaro())
    { derecha() adelante(3) pintarBlanco() detenerPintar() adelante(2) }
    otro { repetir(2) { derecha() } adelante(1) }
}
Evaluar_Salida()
`;
function show(label, r) {
  console.log(`
=== ${label} ===`);
  console.log("status        :", r.status, "-", r.message);
  console.log("steps         :", r.steps);
  console.log("loopIterations:", r.loopIterations);
  console.log("beacons       :", r.beaconsCollected, "/", r.beaconsTotal);
  console.log("paintedTiles  :", r.paintedTiles);
  const last = r.frames[r.frames.length - 1];
  if (last) console.log("final pos     :", last.x, last.y, "dir", last.dir);
}
show("Artifact 1 (default.map)", run(sol1, MAP_DEFAULT, { stopWhenNoBeacons: true }));
show("Artifact 2 (followLine.map)", run(sol2, MAP_FOLLOWLINE));
show("Artifact 3 (chambers.map)", run(sol3, MAP_CHAMBERS));
var buggy2 = sol2.replace("frenteEsClaro()", "frenteEsObstaculo()");
show("Artifact 2 BUGGY", run(buggy2, MAP_FOLLOWLINE));
