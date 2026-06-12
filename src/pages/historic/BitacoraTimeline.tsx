import { Link, useParams } from 'react-router-dom';
import { REPO_NAME } from '../../utils/config';
import { getBitacora } from './bitacoras';

export default function BitacoraTimeline() {
  const { slug } = useParams<{ slug: string }>();
  const b = slug ? getBitacora(slug) : undefined;

  if (!b) {
    return (
      <section className="block">
        <div className="wrap">
          <nav className="breadcrumb">
            <Link to="/">Inicio</Link>
            <span className="sep">/</span>
            <Link to="/bitacora">Bitácora</Link>
          </nav>
          <div className="sec-head" style={{ marginTop: 24 }}>
            <h2>Bitácora no encontrada</h2>
            <p>Es posible que el registro se haya movido o aún no esté publicado.</p>
          </div>
          <Link to="/bitacora" className="btn btn-ghost" style={{ marginTop: 24 }}>
            Ver todas las bitácoras <span className="arr">→</span>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="block">
      <div className="wrap">

        <div className="page-header">
          <nav className="breadcrumb">
            <Link to="/">Inicio</Link>
            <span className="sep">/</span>
            <Link to="/bitacora">Bitácora</Link>
            <span className="sep">/</span>
            <span>{b.title}</span>
          </nav>
          <span className="eyebrow">{b.eyebrow || 'Registro técnico'}{b.period ? ` · ${b.period}` : ''}</span>
          <div className="sec-head">
            <h2>{b.title}</h2>
            {b.subtitle && <p>{b.subtitle}</p>}
          </div>
        </div>

        <ol className="timeline">
          {b.events.map((ev, i) => (
            <li className="tl-item reveal" key={`${ev.dateLabel}-${i}`}>
              <div className="tl-rail">
                <span className="tl-node" />
              </div>
              <div className="tl-card">
                <span className="tl-date">{ev.dateLabel}</span>
                {ev.title && <h3>{ev.title}</h3>}
                {ev.images.length > 0 && (
                  <div className={`tl-media${ev.images.length > 1 ? ' multi' : ''}`}>
                    {ev.images.map((img) => (
                      <figure key={img}>
                        <img
                          src={`${REPO_NAME}/historic/${b.slug}/${img}`}
                          alt={ev.title || ev.dateLabel}
                          loading="lazy"
                        />
                      </figure>
                    ))}
                  </div>
                )}
                {ev.description.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </li>
          ))}
        </ol>

        {b.contributors.length > 0 && (
          <div className="tl-thanks reveal">
            <span className="eyebrow center">Gracias por documentar estos avances</span>
            <p>{b.contributors.join(' · ')}</p>
          </div>
        )}
      </div>
    </section>
  );
}
