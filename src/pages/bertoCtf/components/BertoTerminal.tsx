import { useEffect, useRef, useState } from 'react';
import { FLAG_SECRET } from '../data/challenges';

interface Line { text: string; cls?: string; }

const COMANDOS: [string, string][] = [
  ['help', 'muestra esta lista'],
  ['status', 'estado actual del robot'],
  ['sensor --list', 'lista todos los sensores'],
  ['sensor --read [frente|izquierda|derecha]', 'lee un sensor específico'],
  ['move --forward [n]', 'mover n pasos adelante'],
  ['move --turn [left|right]', 'girar'],
  ['set --mode [explorar|mapear|escapar]', 'cambiar modo'],
  ['berto --donde-estas', 'preguntarle directamente a BERTO'],
];

const MENSAJES_BERTO = [
  '...',
  'no voy a responder eso.',
  'ya lo sabrás si completas el protocolo.',
  'sigue explorando.',
  'qué pregunta tan humana.',
];

const BANNER = `╔══════════════════════════════════════════════════════════╗
║           BERTO-OS v0.1 — TERMINAL DE EMERGENCIA         ║
║                                                          ║
║  Conexión establecida. Robot en modo: ESPERA             ║
║  Batería: 100%  //  Señal: débil                         ║
║                                                          ║
║  Escribe 'help' para ver los comandos disponibles.       ║
╚══════════════════════════════════════════════════════════╝`;

interface Estado {
  posicion: [number, number];
  bateria: number;
  sensores: Record<string, string>;
  modo: string;
}

export default function BertoTerminal({ onFlag }: { onFlag?: () => void }) {
  const [lines, setLines] = useState<Line[]>([{ text: BANNER, cls: 'banner' }]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const hIdx = useRef(-1);
  const estado = useRef<Estado>({
    posicion: [0, 0],
    bateria: 100,
    sensores: { frente: 'claro', izquierda: 'obstaculo', derecha: 'claro' },
    modo: 'espera',
  });
  const seq = useRef<string[]>([]);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines]);

  const out = (text: string, cls?: string) => setLines((l) => [...l, { text, cls }]);
  const rand = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

  function procesar(raw: string) {
    const cmd = raw.trim().toLowerCase();
    out(`berto@lab:~$ ${raw}`, 'echo');
    if (cmd === '') return;
    seq.current.push(cmd);
    const E = estado.current;

    if (cmd === 'help') {
      out('[BERTO-OS v0.1] Comandos disponibles:\n');
      COMANDOS.forEach(([k, v]) => out(`  ${k.padEnd(42)}— ${v}`));
    } else if (cmd === 'status') {
      out('[STATUS]');
      out(`  posicion   : [${E.posicion.join(', ')}]`);
      out(`  bateria    : ${E.bateria}%`);
      out(`  modo       : ${E.modo}`);
      out(`  sensores   : ${JSON.stringify(E.sensores)}`);
    } else if (cmd === 'sensor --list') {
      out('[SENSORES DISPONIBLES]');
      Object.entries(E.sensores).forEach(([k, v]) => out(`  ${k.padEnd(11)}: ${v}`));
    } else if (cmd.startsWith('sensor --read ')) {
      const s = cmd.slice('sensor --read '.length).trim();
      if (s in E.sensores) out(`[SENSOR:${s.toUpperCase()}] → ${E.sensores[s]}`, 'ok');
      else out(`[ERROR] Sensor '${s}' no reconocido. Usa: frente, izquierda, derecha`, 'err');
    } else if (cmd.startsWith('move --forward ')) {
      const n = parseInt(cmd.slice('move --forward '.length).trim(), 10);
      if (Number.isNaN(n)) out('[ERROR] Sintaxis: move --forward [número]', 'err');
      else {
        E.posicion[0] += n; E.bateria -= n * 2;
        out(`[MOVIMIENTO] Avancé ${n} pasos. Posición actual: [${E.posicion.join(', ')}]`);
      }
    } else if (cmd === 'move --turn left') {
      out('[MOVIMIENTO] Giré a la izquierda.');
    } else if (cmd === 'move --turn right') {
      E.sensores.frente = 'claro';
      out('[MOVIMIENTO] Giré a la derecha. Nuevo frente: claro.');
    } else if (cmd.startsWith('set --mode ')) {
      const m = cmd.slice('set --mode '.length).trim();
      if (['explorar', 'mapear', 'escapar'].includes(m)) {
        E.modo = m;
        out(`[MODO] Cambiado a: ${m}`, 'ok');
        if (m === 'escapar') out('  [!] Modo ESCAPAR activado. Protocolo de localización disponible.', 'warn');
      } else out('[ERROR] Modos válidos: explorar, mapear, escapar', 'err');
    } else if (cmd === 'berto --donde-estas') {
      if (E.modo === 'escapar') {
        const tieneExplorar = seq.current.some((s) => s.includes('explorar'));
        const tieneSensores = seq.current.some((s) => s.includes('sensor --read'));
        const tieneMov = seq.current.some((s) => s.includes('move'));
        if (tieneExplorar && tieneSensores && tieneMov) {
          out('='.repeat(60));
          out('  [BERTO]: ...está bien. se lo ganaron.', 'berto');
          out('  Coordenadas de última señal detectada:');
          out('  LAT: 4.711° N');
          out('  LON: 74.072° W');
          out('  (eso es Bogotá, por si no lo sabían)', 'dim');
          out('  El algoritmo siempre sigue.');
          out('  Solo cambia el mundo en el que corre.');
          out('  — B', 'berto');
          out('='.repeat(60));
          out(`  FLAG SECRETA: ${FLAG_SECRET}`, 'flag');
          onFlag?.();
        } else {
          out(`[BERTO]: ${rand(MENSAJES_BERTO)}`, 'berto');
          out('  [HINT] El protocolo requiere: explorar, leer sensores, moverse.', 'dim');
        }
      } else {
        out(`[BERTO]: ${rand(MENSAJES_BERTO)}`, 'berto');
        out('  [HINT] Quizás necesitas cambiar de modo primero.', 'dim');
      }
    } else {
      out(`[ERROR] Comando no reconocido: '${cmd}'. Escribe 'help' para ver opciones.`, 'err');
    }
  }

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const v = input;
      procesar(v);
      if (v.trim()) { setHistory((h) => [...h, v]); }
      hIdx.current = -1; setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const i = hIdx.current;
      const ni = i < 0 ? history.length - 1 : Math.max(0, i - 1);
      if (history[ni] != null) { setInput(history[ni]); hIdx.current = ni; }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const i = hIdx.current;
      const ni = i < 0 ? -1 : Math.min(history.length, i + 1);
      setInput(history[ni] ?? '');
      hIdx.current = ni >= history.length ? -1 : ni;
    }
  };

  return (
    <div className="bx-term" onClick={(e) => (e.currentTarget.querySelector('input') as HTMLInputElement)?.focus()}>
      <div className="bx-term-body" ref={bodyRef}>
        {lines.map((l, i) => (
          <pre key={i} className={`bx-term-line${l.cls ? ` bx-tl-${l.cls}` : ''}`}>{l.text}</pre>
        ))}
        <div className="bx-term-input">
          <span className="bx-prompt">berto@lab:~$</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            spellCheck={false}
            autoComplete="off"
            aria-label="terminal de BERTO"
          />
        </div>
      </div>
    </div>
  );
}
