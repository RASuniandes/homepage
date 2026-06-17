import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { run } from '../engine/interpreter';
import { MAPS } from '../engine/maps';
import type { Frame, RunOptions, RunResult } from '../engine/types';

interface Props {
  code: string;
  onCodeChange?: (v: string) => void;
  editable?: boolean;
  mapName: string;
  runOptions?: RunOptions;
  onResult?: (r: RunResult) => void;
  /** Disable the Run button (e.g. Artifact 3 before a prediction is made). */
  runDisabled?: boolean;
  runLabel?: string;
}

const CELL = 30;

export default function RobotSimulator({
  code, onCodeChange, editable = true, mapName, runOptions, onResult, runDisabled, runLabel,
}: Props) {
  const map = MAPS[mapName];
  const [result, setResult] = useState<RunResult | null>(null);
  const [frameIdx, setFrameIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<number | null>(null);

  const initialFrame: Frame = {
    x: map.start.x, y: map.start.y, dir: map.start.dir,
    beacons: Array.from(map.beacons), paint: {}, action: 'inicio', line: 0,
  };
  // A parse error returns an empty frame list — fall back so we never index
  // past the end (which would crash the whole scene tree).
  const frames: Frame[] = result && result.frames.length > 0 ? result.frames : [initialFrame];
  const frame = frames[Math.max(0, Math.min(frameIdx, frames.length - 1))] ?? initialFrame;

  // playback loop — advance one frame per tick while playing
  useEffect(() => {
    if (!playing || frameIdx >= frames.length - 1) return;
    timer.current = window.setTimeout(() => setFrameIdx((i) => i + 1), 140);
    return () => { if (timer.current) window.clearTimeout(timer.current); };
  }, [playing, frameIdx, frames.length]);

  const doRun = () => {
    const r = run(code, map, runOptions);
    setResult(r);
    setFrameIdx(0);
    setPlaying(true);
    onResult?.(r);
  };
  const doReset = () => {
    setResult(null); setFrameIdx(0); setPlaying(false);
  };

  const atEnd = frameIdx >= frames.length - 1;

  return (
    <div className="bx-sim">
      {/* ── Code editor ── */}
      <div className="bx-editor">
        <div className="bx-editor-bar">
          <span className="bx-dot" /><span className="bx-dot" /><span className="bx-dot" />
          <span className="bx-editor-name">{mapName.replace('.map', '.rm')}</span>
        </div>
        <textarea
          className="bx-code"
          value={code}
          spellCheck={false}
          readOnly={!editable}
          onChange={(e) => onCodeChange?.(e.target.value)}
          rows={code.split('\n').length + 1}
        />
      </div>

      {/* ── Stage ── */}
      <div className="bx-stage">
        <div
          className="bx-grid"
          style={{ width: map.width * CELL, height: map.height * CELL }}
        >
          {map.cells.map((kind, i) => {
            const x = i % map.width, y = Math.floor(i / map.width);
            const p = frame.paint[`${x},${y}`];
            return (
              <div
                key={i}
                className={`bx-cell bx-${kind}${p ? ` bx-paint-${p}` : ''}`}
                style={{ left: x * CELL, top: y * CELL, width: CELL, height: CELL }}
              />
            );
          })}
          {frame.beacons.map((b) => {
            const [x, y] = b.split(',').map(Number);
            return (
              <div key={b} className="bx-beacon"
                style={{ left: x * CELL + CELL / 2, top: y * CELL + CELL / 2 }} />
            );
          })}
          <div
            className="bx-robot"
            style={{
              left: frame.x * CELL, top: frame.y * CELL, width: CELL, height: CELL,
              transform: `rotate(${frame.dir * 90}deg)`,
            }}
          >
            <svg viewBox="0 0 24 24" width={CELL * 0.66} height={CELL * 0.66}>
              <path d="M12 3 L20 20 L12 16 L4 20 Z" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* ── Controls ── */}
        <div className="bx-controls">
          {!result || atEnd ? (
            <button className="bx-btn bx-btn-run" onClick={doRun} disabled={runDisabled}>
              <Play size={15} /> {runLabel ?? 'Ejecutar'}
            </button>
          ) : (
            <button className="bx-btn" onClick={() => setPlaying((p) => !p)}>
              {playing ? <><Pause size={15} /> Pausa</> : <><Play size={15} /> Seguir</>}
            </button>
          )}
          <button className="bx-btn bx-btn-ghost" onClick={doReset}>
            <RotateCcw size={15} /> Reiniciar
          </button>
          <input
            type="range" min={0} max={frames.length - 1} value={Math.min(frameIdx, frames.length - 1)}
            onChange={(e) => { setPlaying(false); setFrameIdx(Number(e.target.value)); }}
            className="bx-scrub"
          />
          <span className="bx-step">{frameIdx}/{frames.length - 1}</span>
        </div>

        {/* ── Console ── */}
        {result && (
          <div className={`bx-console bx-console-${result.status}`}>
            <div className="bx-console-line">
              <span className="bx-prompt">berto@lab:~$</span> run {mapName.replace('.map', '.rm')}
            </div>
            <div className="bx-console-msg">{result.message}</div>
            <div className="bx-console-stats">
              pasos: {result.steps} · bucle: {result.loopIterations} ·
              balizas: {result.beaconsCollected}/{result.beaconsTotal} ·
              pintadas: {result.paintedTiles}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
