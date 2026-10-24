import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

/**
 * AI-Studio — landing page.
 *
 * El contenido vive en las constantes de abajo para poder editarlo
 * sin tocar el markup.
 */

const APPLY_FORM_URL =
  'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=fAS9-kj_KkmLu4-YufucyjBeIXoG6OpGlfkW9qJEva5UQUU3VThGRTVaTkNFM0REWFVYT0xHQTNGQS4u';

const STATS = [
  { val: 'I+D', lbl: 'Enfoque 100% investigativo' },
  { val: 'Physical AI', lbl: 'Primera línea de exploración' },
  { val: 'Vanguardia', lbl: 'En la punta de la IA y la robótica' },
  { val: 'Publicar', lbl: 'Nuestro entregable final' },
];

const LINES = [
  {
    num: '01 · Punto de partida',
    title: 'Inteligencia física',
    desc: 'Exploramos cómo agentes, LLMs y otros modelos fundacionales perciben, razonan y actúan en el mundo físico: el puente entre la IA generativa y los robots.',
    tags: ['Physical AI', 'Agentes', 'LLMs', 'Modelos fundacionales'],
  },
  {
    num: '02',
    title: 'Costo y eficiencia',
    desc: 'Teorizamos cómo hacer estos sistemas más baratos y eficientes, para que la inteligencia de punta deje de depender de recursos inalcanzables.',
    tags: ['Eficiencia', 'Costos', 'Optimización'],
  },
  {
    num: '03',
    title: 'Evaluación y nuevos sistemas',
    desc: 'Evaluamos los sistemas existentes y proponemos nuevos, con un objetivo claro: robots cada vez más inteligentes y autónomos.',
    tags: ['Evaluación', 'Nuevas arquitecturas', 'Autonomía'],
  },
];

const PHASES = [
  { k: '01', title: 'Investigar', desc: 'Estudiamos a fondo lo más reciente en IA y robótica para trabajar desde la punta, no detrás de ella.' },
  { k: '02', title: 'Crear', desc: 'Proponemos y probamos ideas, métodos y sistemas nuevos para el ámbito.' },
  { k: '03', title: 'Documentar', desc: 'Cada experimento, resultado y aprendizaje queda registrado de forma rigurosa.' },
  { k: '04', title: 'Publicar', desc: 'Compartimos lo que encontramos para contribuir de verdad a la comunidad.' },
];

// HashRouter owns the URL hash, so in-page jumps can't use href="#id"
const scrollToId = (id: string) => () =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

export default function AIStudio() {
  const [areasOpen, setAreasOpen] = useState(false);

  // Esc closes the areas modal; lock page scroll while it's open
  useEffect(() => {
    if (!areasOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setAreasOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [areasOpen]);

  return (
    <div className="ais-page">

      {/* ══════════════ HERO ══════════════ */}
      <div className="ais-hero">
        <div className="ais-hero-grid" aria-hidden="true" />
        <div className="ais-hero-glow" aria-hidden="true" />
        <div className="ais-hero-content wrap">
          <p className="ais-hero-eyebrow">IEEE RAS Uniandes · Investigación y desarrollo</p>
          <h1 className="ais-hero-title">AI<span className="ais-dash">-</span>Studio</h1>
          <p className="ais-hero-sub">
            Investigamos cómo llevar agentes, LLMs y otros modelos de IA al mundo físico,
            para hacer los robots cada vez más inteligentes y autónomos.
          </p>
          <div className="cta-row">
            <button type="button" onClick={() => setAreasOpen(true)} className="btn btn-primary btn-lg">
              Áreas de investigación <span className="arr">→</span>
            </button>
            <button type="button" onClick={scrollToId('ais-generacion')} className="btn ais-btn-light btn-lg">
              Quiero participar
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════ INTRO ══════════════ */}
      <section className="block">
        <div className="wrap">
          <nav className="breadcrumb" style={{ marginBottom: 40 }}>
            <Link to="/">Inicio</Link>
            <span className="sep">/</span>
            <span>AI-Studio</span>
          </nav>

          <div className="split reveal">
            <div>
              <span className="eyebrow">¿Qué es AI-Studio?</span>
              <div className="sec-head" style={{ maxWidth: 'none' }}>
                <h2>Inteligencia artificial<br />en el mundo físico</h2>
              </div>
            </div>
            <div className="prose" style={{ alignSelf: 'center' }}>
              <p>
                AI-Studio es el estudio de <strong>investigación y desarrollo</strong> de RAS
                Uniandes. Nuestro objetivo es investigar y contribuir al estado actual de la
                integración de agentes, LLMs y otros modelos en el mundo físico, empezando
                por la exploración de la <strong>inteligencia física</strong>.
              </p>
              <p>
                Nuestro foco está en la investigación más que en el desarrollo de hardware:
                teorizamos cómo reducir costos, mejorar la eficiencia y evaluar o crear nuevos sistemas.
                Queremos estar en la punta del conocimiento y generar impacto con nuestras investigaciones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ STATS ══════════════ */}
      <section className="block" style={{ paddingTop: 0 }}>
        <div className="wrap reveal">
          <div className="statline ais-stats">
            {STATS.map((s) => (
              <div className="s" key={s.lbl}>
                <span className="val">{s.val}</span>
                <span className="lbl">{s.lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ PRIMERA GENERACIÓN ══════════════ */}
      <section className="block ais-founding" id="ais-generacion">
        <div className="wrap">
          <div className="ais-founding-inner reveal">
            <div className="ais-gen" aria-hidden="true">
              <span className="ais-gen-k">Generación</span>
              <span className="ais-gen-num">01</span>
            </div>
            <div>
              <span className="eyebrow">Recién fundado</span>
              <div className="sec-head" style={{ maxWidth: 'none' }}>
                <h2>Sé parte de la<br />primera generación</h2>
              </div>
              <div className="prose" style={{ marginTop: 18 }}>
                <p>
                  AI-Studio es un estudio <strong>recién fundado</strong>. Quienes se unan ahora
                  serán la <strong>primera generación</strong>: los que definan las primeras
                  preguntas de investigación, la forma de trabajar del estudio y sus primeras
                  publicaciones.
                </p>
              </div>
              <div className="cta-row" style={{ marginTop: 26 }}>
                <a href={APPLY_FORM_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Quiero ser parte <span className="arr">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ LÍNEAS DE TRABAJO ══════════════ */}
      <section className="block ais-band" id="ais-lineas">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Áreas de investigación</span>
            <h2>En qué investigamos</h2>
            <p>Empezamos por la inteligencia física y desde ahí atacamos las preguntas que hoy frenan a los robots autónomos.</p>
          </div>

          <div className="cards stagger">
            {LINES.map((l) => (
              <article className="card" key={l.num}>
                <span className="num">{l.num}</span>
                <h3>{l.title}</h3>
                <p>{l.desc}</p>
                <div className="tags">
                  {l.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
                </div>
                <span className="glow" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ HOJA DE RUTA ══════════════ */}
      <section className="block">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Cómo trabajamos</span>
            <h2>Investigar, crear,<br />documentar y publicar</h2>
            <p>Somos un estudio con enfoque investigativo. Ese es nuestro ciclo y nuestro mayor propósito.</p>
          </div>

          <ol className="ais-phases stagger">
            {PHASES.map((p) => (
              <li className="ais-phase" key={p.k}>
                <span className="ais-phase-k">{p.k}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section className="block swarm-cta-band" id="ais-unete">
        <div className="wrap">
          <div className="swarm-cta-inner reveal">
            <span className="eyebrow center">Súmate</span>
            <h2>Investiga con nosotros</h2>

            <div className="swarm-cta-cards">
              <div className="swarm-cta-card">
                <div className="k">RAS Uniandes</div>
                <h3>Conoce al equipo</h3>
                <p>
                  AI-Studio nace dentro de RAS Uniandes. Conoce a las personas que hacen
                  parte del capítulo.
                </p>
                <Link to="/equipo" className="btn btn-ghost">
                  Ver el equipo <span className="arr">→</span>
                </Link>
              </div>

              <div className="swarm-cta-card">
                <div className="k">Convocatoria abierta · Generación 01</div>
                <h3>Únete a AI-Studio</h3>
                <p>
                  Buscamos personas con curiosidad por la IA y la robótica, con ganas de
                  leer, experimentar, escribir y publicar. Aplica para ser parte de la
                  primera generación.
                </p>
                <a href={APPLY_FORM_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Aplicar <span className="arr">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ MODAL: ÁREAS DE INVESTIGACIÓN ══════════════ */}
      {areasOpen && (
        <div className="modal-overlay ais-modal-overlay" onClick={() => setAreasOpen(false)}>
          <div
            className="modal ais-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ais-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="modal-close" aria-label="Cerrar" onClick={() => setAreasOpen(false)}>
              <X size={16} />
            </button>

            <span className="eyebrow">Áreas de investigación</span>
            <h2 id="ais-modal-title" className="ais-modal-title">En qué investigamos</h2>
            <p className="ais-modal-lead">
              Empezamos por la inteligencia física y desde ahí atacamos las preguntas que hoy
              frenan a los robots autónomos.
            </p>

            <div className="ais-modal-areas">
              {LINES.map((l) => (
                <article className="ais-modal-area" key={l.num}>
                  <span className="ais-phase-k">{l.num}</span>
                  <h3>{l.title}</h3>
                  <p>{l.desc}</p>
                  <div className="tags">
                    {l.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
