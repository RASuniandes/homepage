import { Link } from 'react-router-dom';
import { REPO_NAME } from '../../utils/config';
import { bitacoras, coverImage } from './bitacoras';

export default function HistoricIndex() {
  return (
    <section className="block">
      <div className="wrap">

        <div className="page-header">
          <nav className="breadcrumb">
            <Link to="/">Inicio</Link>
            <span className="sep">/</span>
            <span>Bitácora</span>
          </nav>
          <span className="eyebrow">Registro histórico · Avances del proyecto</span>
          <div className="sec-head">
            <h2>Bitácora técnica</h2>
            <p>
              Registro cronológico de los avances técnicos del equipo — electrónica,
              navegación, software y divulgación. Sirve como marco de referencia y
              memoria del trabajo realizado.
            </p>
          </div>
        </div>

        {bitacoras.length === 0 ? (
          <p className="bitacora-empty">Aún no hay bitácoras publicadas.</p>
        ) : (
          <div className="bitacora-list stagger">
            {bitacoras.map((b) => {
              const cover = coverImage(b);
              return (
                <Link key={b.slug} to={`/bitacora/${b.slug}`} className="bitacora-card">
                  <div className="bc-media">
                    {cover ? (
                      <img
                        src={`${REPO_NAME}/historic/${b.slug}/${cover}`}
                        alt=""
                        loading="lazy"
                      />
                    ) : (
                      <div className="bc-media-empty" />
                    )}
                  </div>
                  <div className="bc-body">
                    {b.period && <span className="bc-period">{b.period}</span>}
                    <h3>{b.title}</h3>
                    {b.subtitle && <p>{b.subtitle}</p>}
                    <div className="bc-meta">
                      <span>{b.events.length} {b.events.length === 1 ? 'registro' : 'registros'}</span>
                      <span className="bc-go">Ver bitácora <span className="arr">→</span></span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
