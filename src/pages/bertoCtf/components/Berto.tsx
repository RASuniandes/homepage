import type { Mood } from '../data/story';

interface Props {
  mood?: Mood;
  speaking?: boolean;
  size?: number;
}

/**
 * BERTO — a small, friendly-but-mysterious monitor-headed robot.
 * Expression is driven entirely by the eyes + mouth so it reads at any size.
 */
export default function Berto({ mood = 'idle', speaking = false, size = 150 }: Props) {
  return (
    <div
      className={`berto berto-${mood}${speaking ? ' berto-speaking' : ''}`}
      style={{ width: size, height: size * 1.08 }}
      aria-hidden
    >
      <svg viewBox="0 0 120 130" width="100%" height="100%">
        <defs>
          <clipPath id="berto-screen">
            <rect x="18" y="26" width="84" height="68" rx="14" />
          </clipPath>
        </defs>

        {/* antenna */}
        <line x1="60" y1="26" x2="60" y2="10" className="berto-stroke" strokeWidth="3" />
        <circle cx="60" cy="7" r="4" className="berto-led" />

        {/* head shell */}
        <rect x="14" y="22" width="92" height="76" rx="18" className="berto-shell" />
        <rect x="18" y="26" width="84" height="68" rx="14" className="berto-face" />

        {/* internal scanlines */}
        <g clipPath="url(#berto-screen)" className="berto-scan">
          {Array.from({ length: 14 }).map((_, i) => (
            <line key={i} x1="18" y1={28 + i * 5} x2="102" y2={28 + i * 5} strokeWidth="1" />
          ))}
        </g>

        {/* face */}
        <g className="berto-feature">{eyes(mood)}</g>
        <g className="berto-feature">{mouth(mood)}</g>

        {/* little base / shoulders */}
        <path d="M40 98 L80 98 L86 116 Q86 122 80 122 L40 122 Q34 122 34 116 Z" className="berto-body" />
        <line x1="48" y1="110" x2="72" y2="110" className="berto-stroke" strokeWidth="2" opacity="0.5" />
      </svg>
    </div>
  );
}

function eyes(mood: Mood) {
  const L = 44, R = 76, y = 56;
  switch (mood) {
    case 'happy':
      return (
        <>
          <path d={`M${L - 8} ${y + 2} Q${L} ${y - 10} ${L + 8} ${y + 2}`} className="berto-eye-stroke" />
          <path d={`M${R - 8} ${y + 2} Q${R} ${y - 10} ${R + 8} ${y + 2}`} className="berto-eye-stroke" />
        </>
      );
    case 'sad':
      return (
        <>
          <path d={`M${L - 8} ${y - 4} Q${L} ${y + 6} ${L + 8} ${y - 4}`} className="berto-eye-stroke" />
          <path d={`M${R - 8} ${y - 4} Q${R} ${y + 6} ${R + 8} ${y - 4}`} className="berto-eye-stroke" />
          <circle cx={R + 9} cy={y + 8} r="2.4" className="berto-tear" />
        </>
      );
    case 'alert':
      return (
        <>
          <circle cx={L} cy={y} r="9" className="berto-eye-fill" />
          <circle cx={R} cy={y} r="9" className="berto-eye-fill" />
          <circle cx={L} cy={y} r="3" className="berto-pupil" />
          <circle cx={R} cy={y} r="3" className="berto-pupil" />
        </>
      );
    case 'think':
      return (
        <>
          <circle cx={L} cy={y - 4} r="5" className="berto-eye-fill" />
          <circle cx={R} cy={y - 4} r="5" className="berto-eye-fill" />
          <g className="berto-dots">
            <circle cx="92" cy="40" r="2" /><circle cx="99" cy="36" r="2.4" /><circle cx="106" cy="31" r="2.8" />
          </g>
        </>
      );
    case 'glitch':
      return (
        <>
          <rect x={L - 9} y={y - 4} width="18" height="7" className="berto-eye-fill" />
          <rect x={R - 9} y={y - 1} width="18" height="7" className="berto-eye-fill" />
        </>
      );
    default: // idle
      return (
        <>
          <circle cx={L} cy={y} r="6" className="berto-eye-fill berto-blink" />
          <circle cx={R} cy={y} r="6" className="berto-eye-fill berto-blink" />
        </>
      );
  }
}

function mouth(mood: Mood) {
  const y = 78;
  switch (mood) {
    case 'happy':
      return <path d={`M48 ${y} Q60 ${y + 9} 72 ${y}`} className="berto-eye-stroke" />;
    case 'sad':
      return <path d={`M48 ${y + 4} Q60 ${y - 5} 72 ${y + 4}`} className="berto-eye-stroke" />;
    case 'alert':
      return <circle cx="60" cy={y + 1} r="4" className="berto-eye-fill" />;
    case 'glitch':
      return <rect x="48" y={y - 2} width="24" height="4" className="berto-eye-fill" />;
    default:
      return <line x1="51" y1={y} x2="69" y2={y} className="berto-eye-stroke berto-mouth" />;
  }
}
