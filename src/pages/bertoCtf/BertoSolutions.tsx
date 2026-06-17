import { CHALLENGES, FLAG_SECRET } from './data/challenges';
import './berto.css';

/**
 * Teacher-only solutions. Reachable ONLY via its obscure URL
 * (/robot-spark/berto/protocolo-7c3f9a2e) — not linked anywhere in the UI.
 */
export default function BertoSolutions() {
  return (
    <div className="bx-root">
      <div className="bx-sol-page">
        <span className="bx-eyebrow">DOCUMENTO RESERVADO · SOLO PERSONAL DOCENTE</span>
        <h1>Solucionario — Señal Perdida</h1>
        <p className="bx-dim">
          No compartas esta URL con los estudiantes. Aquí están las soluciones, los criterios de
          éxito y la secuencia del nivel oculto.
        </p>

        {CHALLENGES.map((c) => (
          <section key={c.id} className={`bx-sol-block bx-badge-${c.badge}`}>
            <h2>Artefacto {c.num} — {c.title} <span className="bx-level-pill">{c.difficulty}</span></h2>
            <p className="bx-dim">Mapa: <code>{c.mapName}</code> · Archivo: <code>{c.file}</code></p>

            <h4>Solución</h4>
            <pre className="bx-sol-code">{c.solution}</pre>

            <h4>Cómo se valida</h4>
            <p className="bx-dim">{validationNote(c.id)}</p>

            <h4>Flag</h4>
            <code className="bx-sol-flag">{c.flag}</code>

            <h4>Pistas (en orden)</h4>
            <ol className="bx-sol-hints">
              {c.hints.map((h, i) => <li key={i}>{h.text}</li>)}
            </ol>
          </section>
        ))}

        <section className="bx-sol-block">
          <h2>Nivel oculto — Terminal de BERTO</h2>
          <p className="bx-dim">
            Se accede haciendo clic en el directorio <code>.SLE</code> de la pantalla final
            (las iniciales de las tres flags: <b>S</b>aber, <b>L</b>oops, <b>E</b>l algoritmo).
          </p>
          <h4>Secuencia esperada</h4>
          <pre className="bx-sol-code">{`set --mode explorar
sensor --read frente
move --forward 3
move --turn right
sensor --read derecha
set --mode escapar
berto --donde-estas`}</pre>
          <p className="bx-dim">
            Requisito real para revelar la flag: estar en <code>modo escapar</code> y haber usado
            antes <code>explorar</code>, algún <code>sensor --read</code> y algún <code>move</code>.
          </p>
          <h4>Flag secreta</h4>
          <code className="bx-sol-flag">{FLAG_SECRET}</code>
        </section>
      </div>
    </div>
  );
}

function validationNote(id: string) {
  switch (id) {
    case 'a1': return 'Se captura cuando la ejecución termina sin choque y BERTO recoge las 3 balizas.';
    case 'a2': return 'Se captura cuando el bucle se corrige (frenteEsClaro) y el robot pinta la línea completa (≥10 casillas). El conteo del bucle es 12.';
    case 'a3': return 'Se captura solo si el estudiante predice SALIDA B antes de ejecutar; luego verifica corriendo el código.';
    default: return '';
  }
}
