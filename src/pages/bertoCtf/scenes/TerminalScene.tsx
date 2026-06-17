import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import BertoTerminal from '../components/BertoTerminal';

interface Props {
  onCapture: () => void;
  onContinue: () => void;
}

export default function TerminalScene({ onCapture, onContinue }: Props) {
  const [got, setGot] = useState(false);

  return (
    <div className="bx-screen bx-terminal-scene">
      <div className="bx-ts-head">
        <span className="bx-eyebrow">NIVEL OCULTO · .SLE</span>
        <h2>La última terminal</h2>
        <p className="bx-dim">
          No hay instrucciones. Solo un prompt parpadeando. Escribe <code>help</code> si te pierdes —
          el resto lo descubres tú.
        </p>
      </div>

      <BertoTerminal onFlag={() => { setGot(true); onCapture(); }} />

      {got && (
        <div className="bx-flag-reveal" style={{ marginTop: 18 }}>
          <p className="bx-celebrate">Para anunciarlo: léelo en voz alta con acento británico.</p>
          <button className="bx-btn bx-btn-big" onClick={onContinue}>
            Continuar <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
