import { run } from '../src/pages/bertoCtf/engine/interpreter';
import { MAP_DEFAULT, MAP_FOLLOWLINE, MAP_CHAMBERS } from '../src/pages/bertoCtf/engine/maps';

const sol1 = `
repetir
{
    si(frenteEsClaro())        { adelante(1) }
    otro si(derechaEsClaro())  { derecha() }
    otro si(izquierdaEsClaro()){ izquierda() }
    otro si(frenteEsBaliza())  { tomar() adelante(1) }
}
`;

const sol2 = `
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

const sol3 = `
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

function show(label: string, r: ReturnType<typeof run>) {
  console.log(`\n=== ${label} ===`);
  console.log('status        :', r.status, '-', r.message);
  console.log('steps         :', r.steps);
  console.log('loopIterations:', r.loopIterations);
  console.log('beacons       :', r.beaconsCollected, '/', r.beaconsTotal);
  console.log('paintedTiles  :', r.paintedTiles);
  const last = r.frames[r.frames.length - 1];
  if (last) console.log('final pos     :', last.x, last.y, 'dir', last.dir);
}

show('Artifact 1 (default.map)', run(sol1, MAP_DEFAULT, { stopWhenNoBeacons: true }));
show('Artifact 2 (followLine.map)', run(sol2, MAP_FOLLOWLINE));
show('Artifact 3 (chambers.map)', run(sol3, MAP_CHAMBERS));

// buggy artifact 2 to confirm it does NOT trace the full line
const buggy2 = sol2.replace('frenteEsClaro()', 'frenteEsObstaculo()');
show('Artifact 2 BUGGY', run(buggy2, MAP_FOLLOWLINE));
