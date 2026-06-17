import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import Cutscene from './components/Cutscene';
import CaseFileScene from './scenes/CaseFileScene';
import ArtifactScene from './scenes/ArtifactScene';
import QuoteScene from './scenes/QuoteScene';
import EndingScene from './scenes/EndingScene';
import TerminalScene from './scenes/TerminalScene';
import { CHALLENGES } from './data/challenges';
import { INTRO, ENDING, THRESHOLD, END_SECRET, RESOLVE_INTRO, type Beat } from './data/story';
import './berto.css';

type FlagId = 'a1' | 'a2' | 'a3' | 'secret';

type Scene =
  | { k: 'cut'; beats: Beat[]; finish?: string; onDone?: 'exit' }
  | { k: 'resolve'; cid: 'a1' | 'a2' | 'a3' }
  | { k: 'quote'; cid: 'a1' | 'a2' | 'a3' }
  | { k: 'casefile' }
  | { k: 'artifact'; cid: 'a1' | 'a2' | 'a3' }
  | { k: 'ending' }
  | { k: 'terminal' };

const SCENES: Scene[] = [
  { k: 'cut', beats: INTRO },
  { k: 'casefile' },
  { k: 'artifact', cid: 'a1' },
  { k: 'resolve', cid: 'a1' },
  { k: 'quote', cid: 'a1' },
  { k: 'artifact', cid: 'a2' },
  { k: 'resolve', cid: 'a2' },
  { k: 'quote', cid: 'a2' },
  { k: 'artifact', cid: 'a3' },
  { k: 'resolve', cid: 'a3' },
  { k: 'quote', cid: 'a3' },
  { k: 'cut', beats: ENDING },
  { k: 'ending' },
  { k: 'cut', beats: THRESHOLD },
  { k: 'terminal' },
  { k: 'cut', beats: END_SECRET, finish: 'Volver al inicio', onDone: 'exit' },
];

const STORE = 'berto-progress-v3';

function loadProgress(): { idx: number; captured: FlagId[] } {
  try {
    const raw = localStorage.getItem(STORE);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        idx: typeof p.idx === 'number' ? Math.min(p.idx, SCENES.length - 1) : 0,
        captured: Array.isArray(p.captured) ? p.captured : [],
      };
    }
  } catch { /* ignore */ }
  return { idx: 0, captured: [] };
}

export default function BertoCtf() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(() => loadProgress().idx);
  const [captured, setCaptured] = useState<Set<FlagId>>(() => new Set(loadProgress().captured));

  // save progress
  useEffect(() => {
    localStorage.setItem(STORE, JSON.stringify({ idx, captured: Array.from(captured) }));
  }, [idx, captured]);

  const capture = (id: FlagId) => setCaptured((s) => (s.has(id) ? s : new Set(s).add(id)));
  const go = (n: number) => setIdx(Math.max(0, Math.min(n, SCENES.length - 1)));
  const next = () => go(idx + 1);

  const restart = () => {
    if (!confirm('¿Reiniciar la aventura desde el principio? Se borrará tu progreso.')) return;
    setCaptured(new Set());
    setIdx(0);
  };

  const scene = SCENES[idx];
  const showHud = scene.k !== 'cut' && scene.k !== 'quote';

  return (
    <div className="bx-root">
      {showHud && (
        <header className="bx-hud">
          <span className="bx-hud-title">SEÑAL PERDIDA<i>// una aventura de BERTO</i></span>
          <div className="bx-hud-right">
            <div className="bx-hud-flags">
              {(['a1', 'a2', 'a3', 'secret'] as FlagId[]).map((f) => (
                <span key={f} className={`bx-hud-dot${captured.has(f) ? ' on' : ''}${f === 'secret' ? ' secret' : ''}`} />
              ))}
            </div>
            <button className="bx-hud-restart" onClick={restart} title="Reiniciar progreso">
              <RotateCcw size={14} />
            </button>
          </div>
        </header>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          className="bx-scene-wrap"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <SceneView
            scene={scene}
            captured={captured}
            onCapture={capture}
            onNext={next}
            onExit={() => navigate('/robot-spark')}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SceneView({
  scene, captured, onCapture, onNext, onExit,
}: {
  scene: Scene;
  captured: Set<FlagId>;
  onCapture: (id: FlagId) => void;
  onNext: () => void;
  onExit: () => void;
}) {
  switch (scene.k) {
    case 'cut':
      return (
        <Cutscene
          beats={scene.beats}
          finishLabel={scene.finish}
          onComplete={scene.onDone === 'exit' ? onExit : onNext}
        />
      );

    case 'resolve':
      return (
        <Cutscene
          beats={RESOLVE_INTRO[scene.cid]}
          onComplete={onNext}
          finishLabel="Leer el diario"
        />
      );

    case 'quote':
      return <QuoteScene cid={scene.cid} onContinue={onNext} />;

    case 'casefile':
      return <CaseFileScene solved={captured as Set<string>} onStart={onNext} />;

    case 'artifact': {
      const c = CHALLENGES.find((x) => x.id === scene.cid)!;
      return (
        <ArtifactScene
          challenge={c}
          alreadySolved={captured.has(scene.cid)}
          onCapture={() => onCapture(scene.cid)}
          onContinue={onNext}
        />
      );
    }

    case 'ending':
      return <EndingScene onEnterSecret={onNext} />;

    case 'terminal':
      return <TerminalScene onCapture={() => onCapture('secret')} onContinue={onNext} />;
  }
}
