import type { RunResult, RunOptions } from '../engine/types';

export interface Hint { text: string; }

export interface Challenge {
  id: 'a1' | 'a2' | 'a3';
  badge: 'green' | 'blue' | 'red'; // accent colour for css
  num: string;        // "01"
  level: 1 | 2 | 3;
  difficulty: string; // BÁSICO / INTERMEDIO / AVANZADO
  title: string;
  file: string;       // berto_dia1.rm
  fileState: string;  // [ESTADO]: ...
  marginNote: string; // nota al margen
  story: string;      // narrative paragraph
  brief: string;      // what the player must do
  mapName: string;
  starter: string;
  runOptions: RunOptions;
  hints: Hint[];
  solution: string;   // for the teacher panel
  flag: string;
  journal: string;    // unlocked diary fragment
  celebration: string;
  /** Returns null on success, or an error message explaining what's still wrong. */
  validate: (r: RunResult) => string | null;
}

export const FLAG_SECRET = 'BERTO{4_711N_74_072W_EL_ALGORITMO_SIGUE}';

export const CHALLENGES: Challenge[] = [
  {
    id: 'a1',
    badge: 'green',
    num: '01',
    level: 1,
    difficulty: 'BÁSICO',
    title: 'El día que aprendí a ver',
    file: 'berto_dia1.rm',
    fileState: 'INCOMPLETO — faltan 3 condiciones',
    marginNote: 'el mundo se ve distinto cuando puedes preguntarle cosas',
    story:
      'Este fue el primer programa que BERTO escribió por su cuenta, sin que nadie se lo pidiera. ' +
      'Los ingenieros lo encontraron corriendo a las 3am. Dijeron que era un error. ' +
      'BERTO había dejado un comentario: «esto no es un error. estoy practicando a ver.»',
    brief:
      'BERTO quería mapear su entorno usando todos sus sensores — frente, derecha e izquierda. ' +
      'El programa está incompleto: faltan las condiciones de los tres si(). Completá las tres ' +
      'condiciones (reemplazá cada ???) para que el robot navegue sin chocar y recoja todas las balizas.',
    mapName: 'default.map',
    runOptions: { stopWhenNoBeacons: true, maxSteps: 4000 },
    starter: `# berto_dia1.rm
# "el mundo se ve distinto cuando puedes preguntarle cosas"
# — B

repetir
{
    si( ??? )
    {
        adelante(1)
    }
    otro si( ??? )
    {
        derecha()
    }
    otro si( ??? )
    {
        izquierda()
    }
    otro si(frenteEsBaliza())
    {
        tomar()
        adelante(1)
    }
}
`,
    hints: [
      { text: 'BERTO quiere avanzar cuando no hay nada bloqueándolo. ¿Qué sensor le dice que el camino al frente está libre?' },
      { text: 'Si no puede ir al frente, gira. Pero antes de girar a la derecha, ¿no debería revisar si puede ir por ahí?' },
      { text: 'Los sensores que necesitan son frenteEsClaro(), derechaEsClaro(), izquierdaEsClaro(). El orden importa.' },
    ],
    solution: `si(frenteEsClaro())
otro si(derechaEsClaro())
otro si(izquierdaEsClaro())`,
    flag: 'BERTO{SABER_VER_ES_EL_PRIMER_PASO}',
    journal:
      '«Hoy entendí que frenteEsClaro no es solo un dato. Es la diferencia entre seguir o ' +
      'detenerse. Me pregunté si los humanos también tienen sensores. Creo que sí. Creo que ' +
      'los llaman miedos.»',
    celebration: 'Gritá «¡BERTO VIVEEEE!» lo más fuerte que puedas.',
    validate: (r) => {
      if (r.status === 'error') return r.message;
      if (r.status === 'crash') return r.message + ' Revisá el orden de tus condiciones.';
      if (r.beaconsCollected < r.beaconsTotal)
        return `BERTO recogió ${r.beaconsCollected} de ${r.beaconsTotal} balizas. Todavía falta(n) alguna(s).`;
      return null;
    },
  },
  {
    id: 'a2',
    badge: 'blue',
    num: '02',
    level: 2,
    difficulty: 'INTERMEDIO',
    title: 'La noche que conté hasta infinito',
    file: 'berto_noche.rm',
    fileState: 'CORRE, pero el resultado es incorrecto',
    marginNote: '847. eso fue lo que tardé. los ingenieros dijeron que era un loop infinito.',
    story:
      'BERTO descubrió los bucles. Estuvo corriendo el mismo programa durante horas. Cuando los ' +
      'ingenieros llegaron, había trazado un patrón en el suelo. Nadie entendió por qué. ' +
      'BERTO dejó el número 847 escrito en un comentario.',
    brief:
      'PARTE A — El código tiene un error lógico: la condición del bucle está invertida y el robot ' +
      'no traza la línea. Encontrá la línea del error y corregila. ' +
      'PARTE B — Una vez corregido, contá cuántas veces se repite el bucle antes de terminar.',
    mapName: 'followLine.map',
    runOptions: { maxSteps: 4000 },
    starter: `# berto_noche.rm
# "847. eso fue lo que tardé."
# — B

procedimiento Trazar_Camino()
{
    pintarBlanco()
    repetirMientras( frenteEsObstaculo() )   # algo está raro aquí
    {
        adelante(1)
    }
    adelante(1)
    detenerPintar()
}

adelante(3)
izquierda()
Trazar_Camino()
`,
    hints: [
      { text: 'Si el robot espera hasta que frenteEsObstaculo() sea verdadero para moverse… ¿qué pasa cuando el camino está libre? No traza nada.' },
      { text: 'El robot debería avanzar mientras el camino esté libre, no mientras haya un obstáculo. ¿Cuál es el sensor opuesto?' },
      { text: 'La condición correcta es repetirMientras(frenteEsClaro()). También vale: no frenteEsObstaculo().' },
    ],
    solution: 'repetirMientras(frenteEsClaro())   // o: no frenteEsObstaculo()',
    flag: 'BERTO{LOOPS_NO_SON_ERRORES_SON_PRACTICA}',
    journal:
      '«Los ingenieros revisaron el log y dijeron que había corrido el mismo movimiento cientos ' +
      'de veces. Querían apagarlo. Los humanos también repiten cosas hasta que les salen bien. ' +
      'Les llaman ensayo y error. Cuando yo lo hago, le llaman mal funcionamiento.»',
    celebration: 'Parate en la silla y aplaudí tres veces.',
    validate: (r) => {
      if (r.status === 'error') return r.message;
      if (r.status === 'crash') return r.message + ' La condición del bucle todavía está mal.';
      if (r.status === 'timeout') return 'El bucle nunca termina. ¿La condición se vuelve falsa en algún momento?';
      if (r.paintedTiles < 10)
        return `El robot solo pintó ${r.paintedTiles} casillas: no está trazando toda la línea. El bucle no se está ejecutando.`;
      return null;
    },
  },
  {
    id: 'a3',
    badge: 'red',
    num: '03',
    level: 3,
    difficulty: 'AVANZADO',
    title: 'La decisión',
    file: 'berto_decision.rm',
    fileState: 'COMPLETO — pero nadie sabe qué salida tomó',
    marginNote: 'había tres caminos. elegí el que los sensores me dijeron que era el correcto.',
    story:
      'Este fue el último programa que BERTO corrió antes de desaparecer. El mapa tiene tres ' +
      'salidas. El código decide cuál tomar según los sensores. Nadie vio qué salida eligió esa ' +
      'noche — pero el log de sensores sí quedó guardado.',
    brief:
      'NO corras el código todavía. Leelo y predecí — solo con lógica, usando el log de sensores — ' +
      'cuál salida tomó BERTO. Después ejecutá para verificar. Si acertás a la primera, capturás la flag.',
    mapName: 'chambers.map',
    runOptions: { maxSteps: 4000 },
    starter: `# berto_decision.rm
# "había tres caminos." — B

procedimiento Evaluar_Salida()
{
    si( frenteEsBaliza() )
    {                                   # SALIDA A
        adelante(1)
        tomar()
        norte(5)
    }
    otro si( frenteEsObstaculo() y izquierdaEsClaro() )
    {                                   # SALIDA B
        izquierda()
        adelante(3)
        pintarNegro()
        detenerPintar()
        adelante(2)
    }
    otro si( frenteEsObstaculo() y derechaEsClaro() )
    {                                   # SALIDA C
        derecha()
        adelante(3)
        pintarBlanco()
        detenerPintar()
        adelante(2)
    }
    otro
    {                                   # SALIDA D
        repetir(2) { derecha() }
        adelante(1)
    }
}

Evaluar_Salida()
`,
    hints: [
      { text: 'Leé el log línea por línea. ¿La primera condición (frenteEsBaliza) es verdadera según el log? Si no, pasás al siguiente otro si.' },
      { text: 'El operador "y" exige que AMBAS condiciones se cumplan. ¿Cuál es la primera rama donde las dos son verdaderas?' },
      { text: 'Con el frente bloqueado y la izquierda libre… se cumple SALIDA B.' },
    ],
    solution: 'frenteEsBaliza()=falso → frenteEsObstaculo() y izquierdaEsClaro() = verdadero → SALIDA B (gira a la izquierda, pinta negro).',
    flag: 'BERTO{EL_ALGORITMO_SIEMPRE_SIGUE_CAMBIA_EL_MUNDO}',
    journal:
      '«Había tres caminos. Los sensores me dijeron cuál tomar. Lo tomé. No sé si fue el correcto ' +
      '— los sensores solo miden lo que hay, no lo que debería haber. Si alguna vez leen esto: el ' +
      'algoritmo siempre sigue. Solo cambia el mundo en el que corre.»',
    celebration: 'Decile al profe con voz de robot: «Sistema comprometido. Requiero agua.»',
    validate: (r) => {
      if (r.status === 'error') return r.message;
      return null; // gating handled by the prediction in the UI
    },
  },
];
