import { useEffect, useRef, useState } from 'react';
import { Lightbulb, Lock, ChevronRight, Check } from 'lucide-react';
import RobotSimulator from '../components/RobotSimulator';
import type { Challenge } from '../data/challenges';
import type { RunResult } from '../engine/types';

const HINT_COOLDOWN = 25; // seconds between hints

interface Props {
  challenge: Challenge;
  alreadySolved: boolean;
  onCapture: () => void;   // record the flag
  onContinue: () => void;  // advance to the resolve cutscene
}

export default function ArtifactScene({ challenge: c, alreadySolved, onCapture, onContinue }: Props) {
  const [code, setCode] = useState(c.starter);
  const [solved, setSolved] = useState(alreadySolved);
  const [feedback, setFeedback] = useState<string | null>(null);

  // hint gating
  const [hintsShown, setHintsShown] = useState(0);
  const [runsSinceHint, setRunsSinceHint] = useState(0);
  const [cooldown, setCooldown] = useState(0); // seconds remaining

  // prediction (artifact 3)
  const isPredict = c.id === 'a3';
  const [prediction, setPrediction] = useState<string | null>(null);

  // tick the countdown down to zero
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = window.setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [cooldown]);

  const moreHints = hintsShown < c.hints.length;
  const canHint = moreHints && runsSinceHint >= 1 && cooldown === 0 && !solved;

  let hintPrompt = '';
  if (!solved && moreHints) {
    if (runsSinceHint < 1) hintPrompt = 'Ejecuta tu código al menos una vez para desbloquear la siguiente pista.';
    else if (cooldown > 0) hintPrompt = `Siguiente pista en ${cooldown}s…`;
  }

  const revealHint = () => {
    if (!canHint) return;
    setHintsShown((n) => n + 1);
    setRunsSinceHint(0);
    setCooldown(HINT_COOLDOWN);
  };

  const justSolved = useRef(false);
  const handleResult = (r: RunResult) => {
    setRunsSinceHint((n) => n + 1);
    if (solved) return;
    if (isPredict) {
      if (r.status === 'error') { setFeedback(r.message); return; }
      if (prediction === 'B') { win(); }
      else setFeedback(`Predijiste SALIDA ${prediction ?? '—'}. Observa lo que hizo el robot y revisa tu lógica con el log.`);
      return;
    }
    const err = c.validate(r);
    if (err) setFeedback(err);
    else win();
  };

  const win = () => {
    setSolved(true);
    setFeedback(null);
    if (!justSolved.current) { justSolved.current = true; onCapture(); }
  };

  return (
    <div className={`bx-screen bx-artifact bx-badge-${c.badge}`}>
      <div className="bx-art-grid">
        {/* ── briefing ── */}
        <div className="bx-art-text">
          <div className="bx-art-eyebrow">
            <span className="bx-level-pill">NIVEL {c.level} · {c.difficulty}</span>
          </div>
          <h2>{c.title}</h2>

          <div className="bx-filecard">
            <div>[ARCHIVO]: <b>{c.file}</b></div>
            <div>[ESTADO]: {c.fileState}</div>
            <div className="bx-margin">“{c.marginNote}” <span>— B</span></div>
          </div>

          <p className="bx-story-p">{c.story}</p>
          <h3>El reto</h3>
          <p>{c.brief}</p>

          {isPredict && (
            <div className="bx-log">
              <div className="bx-log-title">[LOG — última ejecución de BERTO]</div>
              <pre>{`> frenteEsObstaculo()  = verdadero
> izquierdaEsClaro()   = verdadero
> derechaEsClaro()     = verdadero
> frenteEsBaliza()     = falso
> lanzarMoneda()       = [REDACTADO]`}</pre>
              <div className="bx-predict">
                <span>Tu predicción:</span>
                {['A', 'B', 'C', 'D'].map((o) => (
                  <button
                    key={o}
                    className={`bx-pred-btn${prediction === o ? ' sel' : ''}`}
                    onClick={() => setPrediction(o)}
                    disabled={solved}
                  >SALIDA {o}</button>
                ))}
              </div>
            </div>
          )}

          {/* hints */}
          <div className="bx-hints">
            {c.hints.slice(0, hintsShown).map((h, i) => (
              <div key={i} className="bx-hint"><Lightbulb size={14} /> <b>Pista {i + 1}:</b> {h.text}</div>
            ))}
            {!solved && moreHints && (
              <div className="bx-hint-control">
                <button className="bx-link" onClick={revealHint} disabled={!canHint}>
                  {canHint ? <><Lightbulb size={13} /> Revelar pista {hintsShown + 1}</> : <><Lock size={13} /> Pista {hintsShown + 1} bloqueada</>}
                </button>
                {hintPrompt && <span className="bx-hint-prompt">{hintPrompt}</span>}
              </div>
            )}
          </div>

          {feedback && <div className="bx-feedback">{feedback}</div>}

          {solved && (
            <div className="bx-flag-reveal">
              <div className="bx-flag-box">
                <span className="bx-flag-label"><Check size={13} /> FLAG CAPTURADA</span>
                <code>{c.flag}</code>
              </div>
              <p className="bx-celebrate">Para anunciarlo: {c.celebration}</p>
              <button className="bx-btn bx-btn-big" onClick={onContinue}>
                Continuar <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* ── simulator ── */}
        <div className="bx-art-sim">
          <RobotSimulator
            code={code}
            onCodeChange={setCode}
            editable={!isPredict}
            mapName={c.mapName}
            runOptions={c.runOptions}
            onResult={handleResult}
            runDisabled={isPredict && !prediction && !solved}
            runLabel={isPredict ? 'Verificar predicción' : 'Ejecutar'}
          />
        </div>
      </div>
    </div>
  );
}
