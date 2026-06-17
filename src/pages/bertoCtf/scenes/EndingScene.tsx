import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Power, FolderLock, ChevronRight } from 'lucide-react';
import { CHALLENGES } from '../data/challenges';

interface Props {
  onEnterSecret: () => void;
}

/**
 * Looks like the end of the game. The entrance to the secret level is a `.SLE`
 * directory — lightly hidden: dim at first, then it surfaces with a hint so the
 * curious can't miss it, but it never shouts.
 */
export default function EndingScene({ onEnterSecret }: Props) {
  const [surfaced, setSurfaced] = useState(false);

  // after a beat, let the hidden directory quietly make itself known
  useEffect(() => {
    const t = window.setTimeout(() => setSurfaced(true), 3500);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="bx-screen bx-ending">
      <pre className="bx-end-banner">{`╔════════════════════════════════════════════════╗
║   FIN DE TRANSMISIÓN — BERTO DESCONECTADO      ║
╚════════════════════════════════════════════════╝`}</pre>

      <div className="bx-end-flags">
        {CHALLENGES.map((c) => (
          <div key={c.id} className="bx-end-flag">
            <span className="bx-end-letter">{c.flag.replace('BERTO{', '').charAt(0)}</span>
            <code>{c.flag}</code>
          </div>
        ))}
      </div>
      <p className="bx-dim">Tres recuerdos recuperados. El algoritmo descansa.</p>

      {/* the hidden directory */}
      <div className={`bx-end-shell${surfaced ? ' surfaced' : ''}`}>
        <pre className="bx-end-ls">
{`berto@lab:~/entorno$ ls -a
.  ..  berto_dia1.rm  berto_noche.rm  berto_decision.rm  `}
          <button className="bx-hidden-dir" onClick={onEnterSecret} title="abrir .SLE">.SLE</button>
        </pre>
        {surfaced && (
          <button className="bx-end-enter" onClick={onEnterSecret}>
            <FolderLock size={14} /> Hay un directorio que no estaba antes… <b>.SLE</b>
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      <Link to="/robot-spark" className="bx-btn bx-btn-ghost bx-btn-big">
        <Power size={15} /> Apagar la consola
      </Link>
    </div>
  );
}
