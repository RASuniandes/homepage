import { Link } from 'react-router-dom';

export default function ToolsHub() {
  return (
    <section className="block">
      <div className="wrap">

        <div className="page-header">
          <nav className="breadcrumb">
            <Link to="/">Inicio</Link>
            <span className="sep">/</span>
            <span>Herramientas</span>
          </nav>
          <span className="eyebrow">Utilidades técnicas · Open source</span>
          <div className="sec-head">
            <h2>Herramientas de ingeniería</h2>
            <p>
              Calculadoras y utilidades para diseño de hardware y sistemas embebidos,
              hechas por la comunidad RAS Uniandes.
            </p>
          </div>
        </div>

        <div className="cards stagger">

          <article className="card">
            <div className="glow" />
            <div className="num">01 / Hardware</div>
            <h3>PCB Trace Calculator</h3>
            <p>
              Calcula el ancho de traza necesario para una corriente dada,
              basado en el estándar IPC-2221.
            </p>
            <div className="tags">
              <span className="tag">IPC-2221</span>
              <span className="tag">PCB</span>
              <span className="tag">Hardware</span>
            </div>
            <div className="card-cta">
              <Link to="/tools/pcb-calculator" className="btn btn-ghost">
                Abrir calculadora <span className="arr">→</span>
              </Link>
            </div>
          </article>

          <article className="card">
            <div className="glow" />
            <div className="num">02 / Energía</div>
            <h3>LiPo Battery Estimator</h3>
            <p>
              Estima el tiempo de ejecución, corriente máxima y consumo
              energético de una batería LiPo.
            </p>
            <div className="tags">
              <span className="tag">LiPo</span>
              <span className="tag">Energía</span>
              <span className="tag">UAV</span>
            </div>
            <div className="card-cta">
              <Link to="/tools/lipo-estimator" className="btn btn-ghost">
                Abrir estimador <span className="arr">→</span>
              </Link>
            </div>
          </article>

          <article className="card">
            <div className="glow" />
            <div className="num">03 / Software</div>
            <h3>ROS 2 Installer</h3>
            <p>
              Guía de instalación interactiva para ROS 2 en distintas
              plataformas y distribuciones de Linux.
            </p>
            <div className="tags">
              <span className="tag">ROS 2</span>
              <span className="tag">Linux</span>
              <span className="tag">Robots</span>
            </div>
            <div className="card-cta">
              <span
                className="btn btn-ghost"
                style={{ opacity: .45, cursor: 'default', userSelect: 'none' }}
                aria-disabled="true"
              >
                Próximamente
              </span>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
}
