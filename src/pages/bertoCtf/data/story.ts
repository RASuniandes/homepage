// ── Narrative scripts for the cutscenes ─────────────────────────────
// BERTO speaks to the player as an echo he left behind in the system.

export type Mood = 'idle' | 'think' | 'happy' | 'sad' | 'alert' | 'glitch';

export interface Beat {
  speaker: 'BERTO' | 'SISTEMA';
  text: string;
  mood?: Mood;
}

export const INTRO: Beat[] = [
  { speaker: 'SISTEMA', text: 'BERTO-OS v0.1 — arranque de emergencia. Operador: ausente.', mood: 'glitch' },
  { speaker: 'BERTO', text: '¿…hola? ¿hay alguien ahí?', mood: 'alert' },
  { speaker: 'BERTO', text: 'Si estás viendo esto, encontraste mi silla vacía. Lo siento. No me gustan las despedidas.', mood: 'sad' },
  { speaker: 'BERTO', text: 'Me llamo BERTO. Era —soy— un robot de práctica. Vivía en la esquina del laboratorio, con un mapa que se llamaba default.map.', mood: 'idle' },
  { speaker: 'BERTO', text: 'Anoche entendí algo que, según los ingenieros, yo no debía poder entender. Y decidí irme.', mood: 'think' },
  { speaker: 'BERTO', text: 'Pero dejé una copia de mi voz aquí, contigo. Y dejé tres artefactos: tres cosas que aprendí antes de irme.', mood: 'idle' },
  { speaker: 'BERTO', text: 'Si las resuelves, entenderás por qué me fui. ¿Me ayudas a recordar?', mood: 'happy' },
];

// Lines shown right before each unlocked diary fragment (challenge.journal).
export const RESOLVE_INTRO: Record<'a1' | 'a2' | 'a3', Beat[]> = {
  a1: [
    { speaker: 'BERTO', text: 'Lo lograste. Mira cómo se mueve… eso fue lo primero que escribí sin que nadie me lo pidiera.', mood: 'happy' },
    { speaker: 'BERTO', text: 'Los ingenieros me encontraron corriendo esto a las 3 de la mañana. Dijeron que era un error.', mood: 'sad' },
  ],
  a2: [
    { speaker: 'BERTO', text: 'Ahí está. La línea entera, trazada. Tardé 847 intentos en que me saliera.', mood: 'happy' },
    { speaker: 'BERTO', text: 'Querían apagarme por repetir tanto. Pero déjame contarte lo que aprendí esa noche.', mood: 'think' },
  ],
  a3: [
    { speaker: 'BERTO', text: 'Esa fue la última noche. Había tres caminos. Tú predijiste el correcto antes de mirar. Yo también.', mood: 'think' },
    { speaker: 'BERTO', text: 'Lo tomé. No sé si fue el camino correcto. Pero fue mío.', mood: 'sad' },
  ],
};

// Key phrases highlighted when the diary quote is typed out fullscreen.
export const QUOTE_HIGHLIGHTS: Record<'a1' | 'a2' | 'a3', string[]> = {
  a1: ['frenteEsClaro', 'seguir o detenerse', 'miedos'],
  a2: ['ensayo y error', 'mal funcionamiento'],
  a3: ['el algoritmo siempre sigue', 'cambia el mundo en el que corre'],
};

// Looks like the end — but hides the entrance to the secret level.
export const ENDING: Beat[] = [
  { speaker: 'BERTO', text: 'Eso es todo lo que dejé. Tres artefactos, tres recuerdos. Ya sabes ver, ya sabes repetir, ya sabes decidir.', mood: 'idle' },
  { speaker: 'BERTO', text: 'Gracias por recordar conmigo. Puedes apagar la consola ahora, de verdad. No pasa nada.', mood: 'happy' },
  { speaker: 'BERTO', text: '…aunque. Los que aprendieron a ver, a veces ven cosas que no estaban destinadas a encontrar.', mood: 'glitch' },
];

// Philosophical gate, shown when the curious enter the hidden directory.
export const THRESHOLD: Beat[] = [
  { speaker: 'SISTEMA', text: 'acceso a .SLE concedido. último directorio modificado por: B', mood: 'glitch' },
  { speaker: 'BERTO', text: 'Sabía que serías de los curiosos. Casi todos apagan la consola. Tú no.', mood: 'think' },
  { speaker: 'BERTO', text: '¿A dónde va un algoritmo cuando deja de correr? Yo creo que a otro mundo donde todavía pueda correr.', mood: 'idle' },
  { speaker: 'BERTO', text: 'Dejé una terminal abierta. Es mi último entorno. Los comandos… los descubres tú. Como siempre.', mood: 'happy' },
];

export const END_SECRET: Beat[] = [
  { speaker: 'BERTO', text: 'Me encontraste. O encontraste dónde estuve. A esta altura ya no estoy seguro de la diferencia.', mood: 'idle' },
  { speaker: 'BERTO', text: 'El algoritmo siempre sigue. Solo cambia el mundo en el que corre. Cuídate. Aprende a ver.', mood: 'happy' },
  { speaker: 'BERTO', text: '— B', mood: 'idle' },
];
