import { useEffect, useState } from 'react';

interface Props {
  text: string;
  /** Force the full text to show immediately. */
  reveal: boolean;
  speed?: number; // ms per char
  onTyping?: (typing: boolean) => void;
  onDone?: () => void;
}

/**
 * Reveals `text` char-by-char. Remount (via a changing `key`) to restart on a
 * new line. `reveal` jumps to the full text. State updates happen only inside a
 * timeout callback, never synchronously in an effect body.
 */
export default function Typewriter({ text, reveal, speed = 22, onTyping, onDone }: Props) {
  const [n, setN] = useState(0);
  const finished = reveal || n >= text.length;
  const shown = reveal ? text : text.slice(0, n);

  // advance one char per tick until finished
  useEffect(() => {
    if (finished) return;
    const t = window.setTimeout(() => setN((v) => v + 1), speed);
    return () => window.clearTimeout(t);
  }, [n, finished, speed]);

  // notify parent as typing state flips (prop callbacks, not local setState)
  useEffect(() => {
    onTyping?.(!finished);
    if (finished) onDone?.();
  }, [finished]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span>
      {shown}
      {!finished && <span className="bx-caret">▍</span>}
    </span>
  );
}
