import { useEffect, useRef } from 'react';

interface Props {
  opacity?: number;
  /** Faster falls feel more frantic. Default 1. */
  speed?: number;
}

const GLYPHS = 'アカサタナハマヤラワ0123456789ABCDEF{}[]<>=+*/BERTO'.split('');

/**
 * Canvas "digital rain". Sits behind cutscene content for hacker ambience.
 * Honours prefers-reduced-motion (renders a single static frame instead).
 */
export default function MatrixRain({ opacity = 0.18, speed = 1 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const font = 16;
    let cols = 0;
    let drops: number[] = [];
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(canvas.clientWidth / font);
      drops = Array.from({ length: cols }, () => Math.floor((Math.random() * canvas.clientHeight) / font));
    };
    resize();
    window.addEventListener('resize', resize);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const step = () => {
      ctx.fillStyle = 'rgba(8, 12, 10, 0.10)';
      ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      ctx.font = `${font}px 'IBM Plex Mono', monospace`;
      for (let i = 0; i < cols; i++) {
        const ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const x = i * font;
        const y = drops[i] * font;
        ctx.fillStyle = 'rgba(220, 255, 235, 0.9)';   // bright head
        ctx.fillText(ch, x, y);
        ctx.fillStyle = 'rgba(56, 224, 138, 0.55)';    // green trail
        ctx.fillText(GLYPHS[Math.floor(Math.random() * GLYPHS.length)], x, y - font);
        if (y > canvas.clientHeight && Math.random() > 0.975) drops[i] = 0;
        drops[i] += speed;
      }
    };

    if (reduce) {
      step(); // single static frame
    } else {
      const loop = () => { step(); raf = window.setTimeout(loop, 55 / speed); };
      loop();
    }

    return () => {
      window.removeEventListener('resize', resize);
      window.clearTimeout(raf);
    };
  }, [speed]);

  return <canvas ref={ref} className="bx-matrix" style={{ opacity }} aria-hidden />;
}
