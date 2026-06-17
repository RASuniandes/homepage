import { useEffect, useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import MatrixRain from '../components/MatrixRain';
import { CHALLENGES } from '../data/challenges';
import { QUOTE_HIGHLIGHTS } from '../data/story';

interface Props {
  cid: 'a1' | 'a2' | 'a3';
  onContinue: () => void;
}

interface Seg { text: string; hl: boolean; }

function buildSegments(text: string, phrases: string[]): Seg[] {
  const segs: Seg[] = [];
  let buf = '';
  let i = 0;
  const flush = () => { if (buf) { segs.push({ text: buf, hl: false }); buf = ''; } };
  while (i < text.length) {
    const p = phrases.find((ph) => text.startsWith(ph, i));
    if (p) { flush(); segs.push({ text: p, hl: true }); i += p.length; }
    else { buf += text[i]; i++; }
  }
  flush();
  return segs;
}

export default function QuoteScene({ cid, onContinue }: Props) {
  const c = CHALLENGES.find((x) => x.id === cid)!;
  const text = c.journal.replace(/^«|»$/g, '');
  const segs = useMemo(() => buildSegments(text, QUOTE_HIGHLIGHTS[cid]), [text, cid]);
  const offsets = useMemo(() => {
    const o: number[] = [];
    let acc = 0;
    for (const s of segs) { o.push(acc); acc += s.text.length; }
    return o;
  }, [segs]);

  const total = text.length;
  const [typed, setTyped] = useState(0);
  const finished = typed >= total;

  useEffect(() => {
    if (finished) return;
    const t = window.setTimeout(() => setTyped((v) => v + 1), 34);
    return () => window.clearTimeout(t);
  }, [typed, finished]);

  const act = () => { if (!finished) setTyped(total); else onContinue(); };

  // render typed portion across segments, keeping highlights
  const rendered = segs.map((s, k) => {
    const vis = Math.max(0, Math.min(typed - offsets[k], s.text.length));
    if (vis <= 0) return null;
    const slice = s.text.slice(0, vis);
    return s.hl
      ? <em key={k} className="bx-quote-hl">{slice}</em>
      : <span key={k}>{slice}</span>;
  });

  return (
    <div className="bx-quote-scene" onClick={act}>
      <MatrixRain opacity={0.12} speed={1.4} />
      <div className="bx-deco bx-deco-tl" /><div className="bx-deco bx-deco-tr" />
      <div className="bx-deco bx-deco-bl" /><div className="bx-deco bx-deco-br" />

      <div className="bx-quote-win" onClick={(e) => e.stopPropagation()}>
        <div className="bx-quote-bar">
          <span className="bx-dot" /><span className="bx-dot" /><span className="bx-dot" />
          <span className="bx-quote-file">berto_diario_{c.num}.log</span>
        </div>
        <div className="bx-quote-body">
          <div className="bx-quote-status">{'>'} desbloqueando fragmento de diario… <span className="bx-ok">OK</span></div>
          <blockquote className="bx-quote-text">
            {rendered}
            {!finished && <span className="bx-caret">▍</span>}
          </blockquote>

          <div className={`bx-quote-foot${finished ? ' show' : ''}`}>
            <span className="bx-quote-sign">— B</span>
            <div className={`bx-flag-box bx-badge-${c.badge}`}>
              <span className="bx-flag-label">FLAG CAPTURADA</span>
              <code>{c.flag}</code>
            </div>
            <button className="bx-btn bx-btn-big" onClick={(e) => { e.stopPropagation(); onContinue(); }}>
              Continuar <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {!finished && <div className="bx-quote-hint">clic para revelar todo</div>}
    </div>
  );
}
