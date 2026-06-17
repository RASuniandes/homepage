import { ChevronRight, Lock, FileCode, Check } from 'lucide-react';
import { CHALLENGES } from '../data/challenges';

interface Props {
  solved: Set<string>;
  onStart: () => void;
}

export default function CaseFileScene({ solved, onStart }: Props) {
  return (
    <div className="bx-screen bx-casefile">
      <div className="bx-cf-head">
        <span className="bx-eyebrow">EXPEDIENTE · ENTORNO DE BERTO</span>
        <h2>Tres artefactos. Tres cosas que aprendió.</h2>
        <p className="bx-dim">
          BERTO dejó tres programas en su entorno, ordenados de menor a mayor dificultad.
          Cada uno esconde una <b>FLAG</b>. Tendrás que resolver uno para que se abra el siguiente.
        </p>
      </div>

      <div className="bx-cf-grid">
        {CHALLENGES.map((c, i) => {
          const done = solved.has(c.id);
          const open = i === 0 || solved.has(CHALLENGES[i - 1].id);
          return (
            <article key={c.id} className={`bx-cf-card bx-badge-${c.badge}${open ? ' open' : ' sealed'}${done ? ' done' : ''}`}>
              <div className="bx-cf-card-top">
                <span className="bx-cf-num">{c.num}</span>
                {done ? <Check size={16} /> : open ? <FileCode size={16} /> : <Lock size={16} />}
              </div>
              <h3>{open ? c.title : 'ARCHIVO SELLADO'}</h3>
              <div className="bx-cf-diff">
                <span>{c.difficulty}</span>
                <span className="bx-diff-meter">
                  {[1, 2, 3].map((d) => (
                    <i key={d} className={d <= c.level ? 'on' : ''} />
                  ))}
                </span>
              </div>
              <p className="bx-mono-file">{open ? c.file : '████████.rm'}</p>
            </article>
          );
        })}
      </div>

      <button className="bx-btn bx-btn-big" onClick={onStart}>
        Abrir el primer artefacto <ChevronRight size={16} />
      </button>
    </div>
  );
}
