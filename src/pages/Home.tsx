import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { REPO_NAME } from '../utils/config';
import './home.css';

export default function Home() {
  // Scroll-reveal via IntersectionObserver
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      }),
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
    );
    document.querySelectorAll('#ras-home .reveal, #ras-home .stagger').forEach(el => io.observe(el));
    // Hero is above the fold — reveal immediately
    requestAnimationFrame(() => {
      document.querySelectorAll('#ras-home .hero .stagger, #ras-home .hero .reveal').forEach(el => el.classList.add('in'));
    });
    return () => io.disconnect();
  }, []);

  const handleThemeToggle = () => {
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('ras-theme', next);
  };

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="ras-home" className="ras-ds">

      {/* ══════════════ NAV ══════════════ */}
      <header className="nav">
        <div className="wrap nav-in">
          <a className="brand" href="#" onClick={scrollTo('top')}>
            <img src={`${REPO_NAME}/ras_logo_black.png`} alt="RAS Uniandes" />
            <span className="wm">
              RAS Uniandes
              <small>IEEE Robotics &amp; Automation</small>
            </span>
          </a>

          <nav className="links">
            <a href="#" onClick={scrollTo('nosotros')}>Nosotros</a>
            <Link to="/swarm-project">Proyecto</Link>
            <a href="#" onClick={scrollTo('charlas')}>Charlas</a>
            <a href="#" onClick={scrollTo('spark')}>Robot Spark</a>
            <a href="#" onClick={scrollTo('aliados')}>Aliados</a>
            <Link to="/members">Miembros</Link>
            <Link to="/tools">Herramientas</Link>
          </nav>

          <div className="nav-right">
            <button className="theme-btn" aria-label="Cambiar tema" onClick={handleThemeToggle}>
              <svg className="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
              </svg>
              <svg className="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
            </button>
            <a href="#" className="btn btn-primary" onClick={scrollTo('aliados')}>
              Trabajemos juntos <span className="arr">→</span>
            </a>
          </div>
        </div>
      </header>

      <main id="top">

        {/* ══════════════ HERO ══════════════ */}
        <section className="hero">
          <div className="wrap hero-grid">
            <div className="hero-copy stagger">
              <span className="eyebrow">Capítulo estudiantil IEEE · Universidad de los Andes</span>
              <h1>Robótica, innovación<br />y <span className="em">compromiso social</span></h1>
              <p className="lead">
                Somos uno de los capítulos técnicos más activos de la Universidad de los Andes:
                un espacio de convergencia para apasionados por el desarrollo tecnológico,
                la investigación aplicada y la divulgación científica.
              </p>
              <div className="cta-row">
                <a href="#" className="btn btn-primary btn-lg" onClick={scrollTo('aliados')}>
                  Trabajemos juntos <span className="arr">→</span>
                </a>
                <Link to="/swarm-project" className="btn btn-ghost btn-lg">
                  Conoce el proyecto
                </Link>
              </div>
              <div className="meta">
                <div className="m"><b>+30</b><span>Miembros activos</span></div>
                <div className="m"><b>1</b><span>Proyecto insignia</span></div>
                <div className="m"><b>3</b><span>Áreas técnicas</span></div>
              </div>
            </div>

            <div className="hero-media reveal">
              <div className="accentbar" />
              <div className="frame">
                <img
                  src={`${REPO_NAME}/team-banner.jpg`}
                  alt="Equipo RAS Uniandes con la bandera del capítulo"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════ LOGO STRIP ══════════════ */}
        <div className="strip">
          <div className="wrap strip-in">
            <div className="label">Respaldados y en alianza con</div>
            <div className="marks">
              <span className="wordmark">
                Universidad de los Andes
                <small>IEEE Student Branch</small>
              </span>
              <span className="wordmark">
                IEEE RAS
                <small>Robotics &amp; Automation Society</small>
              </span>
              <span className="wordmark">Fundación Ecopetrol</span>
              <span className="wordmark">
                Laboratorio Crea
                <small>Uniandes</small>
              </span>
            </div>
          </div>
        </div>

        {/* ══════════════ NOSOTROS ══════════════ */}
        <section className="block" id="nosotros">
          <div className="wrap split">
            <div className="media reveal">
              <div className="media-card">
                <img
                  src={`${REPO_NAME}/team-project.jpg`}
                  alt="Equipo presentando el robot del proyecto insignia"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="copy reveal">
              <span className="eyebrow">¿Qué es RAS Uniandes?</span>
              <div className="sec-head">
                <h2>Un punto de convergencia técnico</h2>
              </div>
              <div className="prose" style={{ marginTop: 20 }}>
                <p>
                  RAS Uniandes es el capítulo estudiantil de la{' '}
                  <strong>Robotics and Automation Society (RAS)</strong> de la IEEE en la
                  Universidad de los Andes — una de las organizaciones técnicas más sólidas
                  y activas de la institución.
                </p>
                <p>
                  Más allá de la investigación, fomentamos un entorno de aprendizaje práctico
                  donde el dominio de herramientas de vanguardia es prioridad, con capacitación
                  continua en distintas áreas técnicas y de desarrollo profesional.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════ STATS ══════════════ */}
        <section className="block" style={{ paddingTop: 0 }}>
          <div className="wrap reveal">
            <div className="statline">
              <div className="s">
                <span className="val">30+</span>
                <span className="lbl">Miembros activos</span>
              </div>
              <div className="s">
                <span className="val">3–7</span>
                <span className="lbl">Semestres de participación típica</span>
              </div>
              <div className="s">
                <span className="val">5+</span>
                <span className="lbl">Colaboraciones con aliados externos</span>
              </div>
              <div className="s">
                <span className="val">6+</span>
                <span className="lbl">Charlas técnicas abiertas por semestre</span>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════ PROYECTO ══════════════ */}
        <section className="block" id="proyecto" style={{ paddingTop: 0 }}>
          <div className="wrap split rev">
            <div className="media reveal">
              <div className="media-card" style={{ aspectRatio: '4/3' }}>
                <img
                  src={`${REPO_NAME}/robot-project.png`}
                  alt="Robot del proyecto insignia con visión por computadora"
                  style={{ objectPosition: 'center 40%' }}
                  loading="lazy"
                />
              </div>
            </div>
            <div className="copy reveal">
              <span className="eyebrow">Ecosistema técnico · Proyecto insignia</span>
              <div className="sec-head">
                <h2>Robótica industrial,<br />investigada durante un año</h2>
              </div>
              <div className="prose" style={{ marginTop: 18 }}>
                <p>
                  Nuestra piedra angular es un{' '}
                  <strong>proyecto de robótica industrial</strong> que hemos desarrollado e
                  investigado de forma continua durante el último año, integrando visión por
                  computadora, control y diseño mecánico.
                </p>
                <p>
                  Es la plataforma donde nuestros miembros aplican lo aprendido y donde
                  mostramos el estado actual de la robótica en Colombia.
                </p>
              </div>
              <Link to="/swarm-project" className="btn btn-ghost" style={{ marginTop: 8 }}>
                Ver el proyecto completo <span className="arr">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════ CHARLAS ══════════════ */}
        <section className="block" id="charlas" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">Promoción de la educación abierta</span>
              <h2>Charlas técnicas, abiertas cada semestre</h2>
              <p>
                Sesiones lideradas por miembros de nuestra iniciativa —speakers apasionados
                por su trabajo— que exploran tecnologías emergentes y herramientas de alta utilidad.
              </p>
            </div>
            <div className="cards stagger">
              <article className="card">
                <div className="glow" />
                <div className="num">01 / Software</div>
                <h3>Programación &amp; Software</h3>
                <p>De fundamentos sólidos a automatización moderna mediante agentes de IA.</p>
                <div className="tags">
                  <span className="tag">C++</span>
                  <span className="tag">Agent Tooling</span>
                  <span className="tag">N8N</span>
                </div>
              </article>
              <article className="card">
                <div className="glow" />
                <div className="num">02 / Hardware</div>
                <h3>Hardware &amp; Diseño</h3>
                <p>Diseño de circuitos impresos y programación de microcontroladores para sistemas reales.</p>
                <div className="tags">
                  <span className="tag">PCB</span>
                  <span className="tag">Microcontroladores</span>
                  <span className="tag">Embedded</span>
                </div>
              </article>
              <article className="card">
                <div className="glow" />
                <div className="num">03 / Mecánica</div>
                <h3>Diseño Mecánico</h3>
                <p>Modelado 3D para prototipado avanzado y validación de mecanismos.</p>
                <div className="tags">
                  <span className="tag">CAD</span>
                  <span className="tag">Modelado 3D</span>
                  <span className="tag">Prototipado</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ══════════════ ROBOT SPARK ══════════════ */}
        <section className="block spark" id="spark">
          <div className="wrap spark-grid">
            <div className="copy reveal">
              <span className="eyebrow">Impacto social &amp; extensión</span>
              <div className="sec-head">
                <h2>RAS Robot Spark</h2>
                <p>
                  Formamos a las nuevas generaciones en STEM. A través de un ciclo de sesiones,
                  llevamos la robótica a estudiantes de colegio de manera gradual y progresiva.
                </p>
              </div>
              <div className="partners">
                <span className="partner"><span className="pd" />Fundación Ecopetrol</span>
                <span className="partner"><span className="pd" />Laboratorio Crea · Uniandes</span>
              </div>
              <div className="cta-row" style={{ marginTop: 28 }}>
                <Link to="/robot-spark" className="btn btn-primary">
                  Conoce el programa <span className="arr">→</span>
                </Link>
              </div>
            </div>
            <div className="media reveal">
              <div className="media-card" style={{ aspectRatio: '5/4' }}>
                <img
                  src={`${REPO_NAME}/robot-spark-session.jpg`}
                  alt="Sesión formativa de RAS Robot Spark con estudiantes de colegio"
                  style={{ objectPosition: 'center 30%' }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════ CTA ══════════════ */}
        <section className="block cta" id="aliados">
          <div className="wrap reveal">
            <div className="cta-inner">
              <span className="eyebrow center">Identidad &amp; comunidad</span>
              <h2>
                Trabajemos juntos
                <span className="en">Let's work together</span>
              </h2>
              <div className="cta-cards">
                <div className="cta-card">
                  <div className="k">Para empresas &amp; aliados</div>
                  <h3>Sé un aliado o patrocinador</h3>
                  <p>
                    Colaboramos con la Universidad en ferias y eventos académicos, sirviendo
                    como referentes de la robótica en Colombia. Construyamos juntos el futuro
                    de la ingeniería.
                  </p>
                  <a href="mailto:rasuniandes@uniandes.edu.co" className="btn btn-primary">
                    Hablemos de alianza <span className="arr">→</span>
                  </a>
                </div>
                <div className="cta-card">
                  <div className="k">Para estudiantes</div>
                  <h3>Únete al equipo</h3>
                  <p>
                    Somos un equipo unido por la innovación y la excelencia técnica.
                    Si te apasiona la robótica, la investigación y la divulgación,
                    hay un lugar para ti.
                  </p>
                  <a href="mailto:rasuniandes@uniandes.edu.co" className="btn btn-ghost">
                    Quiero unirme <span className="arr">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ══════════════ HISTORIC LOG (low-key) ══════════════ */}
      <div className="histlink-band">
        <div className="wrap">
          <Link to="/bitacora" className="histlink">
            <span className="histlink-k">Registro histórico</span>
            <span className="histlink-text">
              Bitácora técnica — la memoria de avances del proyecto
            </span>
            <span className="histlink-arr">→</span>
          </Link>
        </div>
      </div>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-brand">
              <img
                src={`${REPO_NAME}/ras_logo.png`}
                alt="RAS Uniandes — IEEE Robotics &amp; Automation Society · Universidad de los Andes"
              />
              <p>
                Capítulo estudiantil de la IEEE Robotics &amp; Automation Society
                en la Universidad de los Andes.
              </p>
            </div>

            <div className="foot-col">
              <h4>Navegación</h4>
              <a href="#" onClick={scrollTo('nosotros')}>Nosotros</a>
              <a href="#" onClick={scrollTo('proyecto')}>Proyecto insignia</a>
              <a href="#" onClick={scrollTo('charlas')}>Charlas técnicas</a>
              <a href="#" onClick={scrollTo('spark')}>Robot Spark</a>
            </div>

            <div className="foot-col">
              <h4>Comunidad</h4>
              <a href="#" onClick={scrollTo('aliados')}>Sé aliado</a>
              <a href="#" onClick={scrollTo('aliados')}>Únete al equipo</a>
              <Link to="/members">Miembros</Link>
              <Link to="/tools">Herramientas</Link>
              <Link to="/bitacora">Bitácora</Link>
            </div>

            <div className="foot-col">
              <h4>Contacto</h4>
              <a href="mailto:rasuniandes@uniandes.edu.co">rasuniandes@uniandes.edu.co</a>
              <a href="https://www.instagram.com/ras_uniandes/" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a href="https://www.linkedin.com/company/rasuniandes" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <a href="https://www.youtube.com/@RasUniandes" target="_blank" rel="noopener noreferrer">
                YouTube
              </a>
            </div>
          </div>

          <div className="foot-bot">
            <span>© 2025 RAS Uniandes · IEEE Student Branch</span>
            <span>Bogotá · Colombia</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
