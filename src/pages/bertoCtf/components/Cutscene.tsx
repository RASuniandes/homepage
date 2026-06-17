import { useState } from 'react';
import { ChevronRight, FastForward } from 'lucide-react';
import Berto from './Berto';
import Typewriter from './Typewriter';
import MatrixRain from './MatrixRain';
import type { Beat } from '../data/story';

interface Props {
  beats: Beat[];
  onComplete: () => void;
  /** Optional node rendered between the dialogue and the controls (e.g. a flag box). */
  extra?: React.ReactNode;
  /** Label for the final advance button. */
  finishLabel?: string;
}

export default function Cutscene({ beats, onComplete, extra, finishLabel = 'Continuar' }: Props) {
  const [idx, setIdx] = useState(0);
  const [typing, setTyping] = useState(true);
  const [reveal, setReveal] = useState(false);

  const beat = beats[idx];
  const isLast = idx === beats.length - 1;

  const advance = () => {
    if (typing) { setReveal(true); return; }   // first click finishes the line
    if (isLast) { onComplete(); return; }
    setReveal(false);
    setIdx((i) => i + 1);
  };

  return (
    <div className="bx-cutscene" onClick={advance}>
      <MatrixRain opacity={0.16} />

      {/* hacker-frame decorations */}
      <div className="bx-deco bx-deco-tl" /><div className="bx-deco bx-deco-tr" />
      <div className="bx-deco bx-deco-bl" /><div className="bx-deco bx-deco-br" />
      <div className="bx-deco-readout" aria-hidden>
        <span>LINK · ECO_B</span>
        <span>SIGNAL: <i>UNSTABLE</i></span>
        <span>BUF {String(idx + 1).padStart(2, '0')}/{String(beats.length).padStart(2, '0')}</span>
        <span className="bx-deco-bars">{'▁▂▃▅▂▇▃▁▆▂▃'}</span>
      </div>

      <button className="bx-skip" onClick={(e) => { e.stopPropagation(); onComplete(); }}>
        <FastForward size={14} /> Saltar
      </button>

      <div className="bx-cut-stage">
        <div className="bx-cut-char">
          <div className="bx-cut-char-ring" />
          <Berto mood={beat.mood} speaking={typing} size={210} />
          <span className="bx-cut-tag">// BERTO_v0.1 · eco</span>
        </div>

        <div className="bx-dialogue">
          <span className={`bx-speaker bx-speaker-${beat.speaker.toLowerCase()}`}>{beat.speaker}</span>
          <p className="bx-dialogue-text">
            <Typewriter key={idx} text={beat.text} reveal={reveal} onTyping={setTyping} />
          </p>

          {!typing && extra && isLast && <div className="bx-cut-extra">{extra}</div>}

          <div className="bx-cut-controls">
            <div className="bx-cut-dots">
              {beats.map((_, i) => (
                <span key={i} className={`bx-cut-dot${i === idx ? ' on' : ''}${i < idx ? ' past' : ''}`} />
              ))}
            </div>
            <button className="bx-btn" onClick={(e) => { e.stopPropagation(); advance(); }}>
              {typing ? 'Saltar línea' : isLast ? finishLabel : 'Continuar'}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
