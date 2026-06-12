import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Youtube } from 'lucide-react';
import { REPO_NAME } from '../../utils/config';
import TeamGraph from './TeamGraph';

export default function SwarmProject() {

  return (
    <div className="swarm-page">

      {/* ══════════════ HERO ══════════════ */}
      <div className="swarm-hero">
        <img
          className="swarm-hero-bg"
          src={`${REPO_NAME}/swarm/swarm-hero.png`}
          alt="Robot SWARM MK1.5 con LEDs verdes activos"
        />
        <div className="swarm-hero-overlay" />

        <div className="swarm-hero-content wrap">
          <img
            className="swarm-hero-logo"
            src={`${REPO_NAME}/swarm/LogoSwarmSolo.png`}
            alt="SWARM logotipo"
          />
          <p className="swarm-hero-eyebrow">IEEE RAS Uniandes · Proyecto insignia</p>
          <h1 className="swarm-hero-title">S.W.A.R.M.</h1>
          <p className="swarm-hero-sub">Synchronized Warehouse Autonomous Robotics Management</p>
        </div>

        <div className="swarm-hero-scroll">Scroll</div>
      </div>

      {/* ══════════════ INTRO ══════════════ */}
      <section className="block">
        <div className="wrap">
          <nav className="breadcrumb" style={{ marginBottom: 40 }}>
            <Link to="/">Inicio</Link>
            <span className="sep">/</span>
            <span>Proyecto SWARM</span>
          </nav>

          {/* Editorial split: heading left, body copy right */}
          <div className="split reveal">
            <div>
              <span className="eyebrow">¿Qué es SWARM?</span>
              <div className="sec-head" style={{ maxWidth: 'none' }}>
                <h2>Robótica de almacén,<br />investigada desde cero</h2>
              </div>
            </div>
            <div className="prose" style={{ alignSelf: 'center' }}>
              <p>
                SWARM es un proyecto de investigación y desarrollo del capítulo estudiantil
                IEEE RAS de la Universidad de los Andes, orientado a construir una plataforma
                robótica autónoma con aplicabilidad industrial real.
              </p>
              <p>
                Integra mecánica estructural, electrónica embebida y algoritmos de
                navegación avanzados para abordar los tres grandes retos de la robótica
                de almacén: <strong>navegación individual</strong>,{' '}
                <strong>mapeo del entorno</strong> y{' '}
                <strong>cooperación multi-robot</strong>.
              </p>
              <p>
                En Latinoamérica la investigación aplicada en este campo sigue siendo escasa.
                SWARM nace como respuesta a esa brecha — un esfuerzo académico riguroso,
                documentado públicamente, que busca sentar bases sólidas para la robótica
                avanzada en la región.
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
              <span className="val">3</span>
              <span className="lbl">Fases de desarrollo</span>
            </div>
            <div className="s">
              <span className="val">MK2</span>
              <span className="lbl">En manufactura · 2026</span>
            </div>
            <div className="s">
              <span className="val">60 kg</span>
              <span className="lbl">Capacidad de carga real</span>
            </div>
            <div className="s">
              <span className="val">ROS2</span>
              <span className="lbl">Arquitectura de software</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ METODOLOGÍA ══════════════ */}
      <section className="block" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Estructura del proyecto</span>
            <h2>Metodología — Tres fases</h2>
            <p>
              Cada etapa consolida las capacidades de la anterior, construyendo progresivamente
              hacia autonomía plena y colaboración multi-robot.
            </p>
          </div>
          <div className="cards stagger">
            <article className="card">
              <div className="glow" />
              <div className="num">01 / Fase I</div>
              <h3>Plataforma base</h3>
              <p>
                Arquitectura mecánica, electrónica y de software que sustenta todo el sistema.
                Plataforma funcional para validar decisiones de diseño antes de avanzar.
              </p>
              <div className="tags">
                <span className="tag">Mecánica</span>
                <span className="tag">Electrónica</span>
                <span className="tag">Control</span>
              </div>
            </article>
            <article className="card">
              <div className="glow" />
              <div className="num">02 / Fase II</div>
              <h3>Autonomía individual</h3>
              <p>
                Algoritmos SLAM, navegación visual con seguimiento de trayectorias, evasión
                de obstáculos e identificación de marcadores ArUco.
              </p>
              <div className="tags">
                <span className="tag">SLAM</span>
                <span className="tag">ArUco</span>
                <span className="tag">Navegación</span>
              </div>
            </article>
            <article className="card">
              <div className="glow" />
              <div className="num">03 / Fase III</div>
              <h3>Colaboración multi-robot</h3>
              <p>
                Múltiples unidades con control independiente, evasión conjunta de obstáculos
                y asignación de objetivos optimizada en tiempo real.
              </p>
              <div className="tags">
                <span className="tag">Multi-robot</span>
                <span className="tag">Consenso</span>
                <span className="tag">Coordinación</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ══════════════ MK TIMELINE ══════════════ */}
      <section className="block swarm-mk-band">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Estado del proyecto</span>
            <h2>Tres iteraciones</h2>
            <p>Cada versión construye sobre la anterior. El progreso es deliberado.</p>
          </div>
          <div className="swarm-timeline stagger">

            <div className="mk-card mk-done">
              <div className="mk-status"><span className="mk-dot" />Completado</div>
              <div className="mk-label">MK1</div>
              <h3>Primera iteración</h3>
              <p>
                Prueba de concepto integral que validó la arquitectura electrónica, el esquema
                de control y los principios de navegación básica. Priorizó velocidad de
                iteración sobre robustez estructural.
              </p>
              <div className="mk-caps">
                <span>LiDAR</span>
                <span>Control remoto</span>
                <span>Anti-colisión</span>
              </div>
            </div>

            <div className="mk-card mk-active">
              <div className="mk-status"><span className="mk-dot" />Activo · Pruebas SLAM</div>
              <div className="mk-label">MK1.5</div>
              <h3>Plataforma iterativa</h3>
              <p>
                Banco de pruebas estratégico donde se refinaron todos los subsistemas antes
                del MK2, incluyendo la migración a locomoción diferencial. Actualmente
                ejecuta pruebas de navegación SLAM.
              </p>
              <div className="mk-caps">
                <span>SLAM activo</span>
                <span>Diferencial</span>
                <span>Simulación</span>
              </div>
            </div>

            <div className="mk-card mk-upcoming">
              <div className="mk-status"><span className="mk-dot" />En manufactura · 2026</div>
              <div className="mk-label">MK2</div>
              <h3>Orientación industrial</h3>
              <p>
                Diseño completo entre enero y mayo de 2026, manufactura iniciada en junio.
                Lanzamiento oficial con repositorio público previsto antes de octubre de 2026.
              </p>
              <div className="mk-caps">
                <span>60 kg carga</span>
                <span>Elevador tijera</span>
                <span>PCBs propias</span>
                <span>ROS2</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════ ELECTRÓNICA ══════════════ */}
      <section className="block" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Electrónica diseñada en casa</span>
            <h2>Tres PCBs, sin concesiones</h2>
            <p>
              El sistema electrónico del MK2 está compuesto por tres tarjetas diseñadas
              íntegramente por el equipo SWARM — resultado directo de las iteraciones
              anteriores. Especificaciones completas por revelar en el lanzamiento oficial.
            </p>
          </div>
          <div className="swarm-pcb-grid stagger">

            <div className="pcb-card">
              <div className="pcb-img">
                <img
                  src={`${REPO_NAME}/swarm/PCB_Power_Img1.png`}
                  alt="Placa de potencia I — render 3D"
                  loading="lazy"
                />
              </div>
              <div className="pcb-info">
                <div className="pcb-label">Placa de potencia I</div>
                <span className="tag">Especificaciones por revelar</span>
              </div>
            </div>

            <div className="pcb-card">
              <div className="pcb-img">
                <img
                  src={`${REPO_NAME}/swarm/PCB_Power_Img2.png`}
                  alt="Placa de potencia II — render 3D"
                  loading="lazy"
                />
              </div>
              <div className="pcb-info">
                <div className="pcb-label">Placa de potencia II</div>
                <span className="tag">Especificaciones por revelar</span>
              </div>
            </div>

            <div className="pcb-card">
              <div className="pcb-img">
                <img
                  src={`${REPO_NAME}/swarm/PCB_Ctrl_Img3.png`}
                  alt="Placa de control — render 3D"
                  loading="lazy"
                />
              </div>
              <div className="pcb-info">
                <div className="pcb-label">Placa de control</div>
                <span className="tag">Especificaciones por revelar</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════ MK2 COMING SOON ══════════════ */}
      <section className="block swarm-coming-soon">
        <div className="wrap">
          <div className="swarm-cs-inner reveal">
            <span className="eyebrow center">MK2 · Octubre 2026</span>
            <h2>Próximamente</h2>
            <p>
              Renders, especificaciones completas y repositorio público del MK2.
              El diseño está listo; la manufactura, en curso.
            </p>
            <div className="swarm-cs-tags">
              <span className="tag">Diseño completado</span>
              <span className="tag">Manufactura activa</span>
              <span className="tag">Repo público · Oct 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ TRABAJO FUTURO ══════════════ */}
      <section className="block" style={{ paddingTop: 0 }}>
        <div className="wrap split rev">
          <div className="media reveal">
            <div className="swarm-future-feats">
              <div className="swarm-feat">
                <div className="feat-icon">①</div>
                <div>
                  <strong>Navegación autónoma</strong>
                  <p>SLAM completamente autónomo en entornos universitarios e industriales piloto.</p>
                </div>
              </div>
              <div className="swarm-feat">
                <div className="feat-icon">②</div>
                <div>
                  <strong>Seguimiento visual</strong>
                  <p>Identificación y seguimiento de objetivos logísticos mediante navegación visual.</p>
                </div>
              </div>
              <div className="swarm-feat">
                <div className="feat-icon">③</div>
                <div>
                  <strong>Flota multi-robot</strong>
                  <p>Fabricación de unidades adicionales para validar algoritmos de consenso.</p>
                </div>
              </div>
              <div className="swarm-feat">
                <div className="feat-icon">④</div>
                <div>
                  <strong>Transferencia industrial</strong>
                  <p>Base para aplicaciones en entornos logísticos reales — Fase III del proyecto.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="copy reveal">
            <span className="eyebrow">Siguiente etapa</span>
            <div className="sec-head">
              <h2>Trabajo futuro</h2>
            </div>
            <div className="prose" style={{ marginTop: 18 }}>
              <p>
                Una vez completado el MK2, el proyecto iniciará pruebas de navegación autónoma
                en entornos universitarios y escenarios piloto de tipo industrial — mapeo SLAM
                completamente autónomo y navegación visual para identificación de objetivos.
              </p>
              <p>
                En paralelo, se prevé la fabricación de unidades adicionales del MK2 para
                desarrollar y validar algoritmos de consenso y cooperación multi-robot,
                consolidando las bases para la Fase III y su eventual transferencia hacia
                aplicaciones industriales reales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ EQUIPO — PHYSICS GRAPH ══════════════ */}
      <section className="block swarm-team-band">
        <div className="wrap">
          <div className="sec-head reveal" style={{ textAlign: 'center', maxWidth: '100%' }}>
            <span className="eyebrow center">Las personas detrás del proyecto</span>
            <h2>Equipo SWARM</h2>
            <p style={{ maxWidth: 480, margin: '16px auto 0' }}>
              Mueve el cursor sobre la red para explorar conexiones entre el equipo.
            </p>
          </div>
        </div>
        <TeamGraph />
        <div className="wrap">
          <div className="names-cloud-legend">
            <span><span className="ncl-dot ncl-director" />Dirección</span>
            <span><span className="ncl-dot ncl-lead" />Líderes de área</span>
            <span><span className="ncl-dot ncl-member" />Miembros</span>
          </div>
        </div>
      </section>

      {/* ══════════════ CONTACTO ══════════════ */}
      <section className="block swarm-cta-band">
        <div className="wrap">
          <div className="swarm-cta-inner reveal">
            <span className="eyebrow center">Trabajemos juntos</span>
            <h2>Conectémonos</h2>

            <div className="swarm-cta-cards">
              <div className="swarm-cta-card">
                <div className="k">Para empresas &amp; aliados</div>
                <h3>Sé un aliado o patrocinador</h3>
                <p>
                  Colaboramos con la Universidad en ferias y eventos académicos, sirviendo
                  como referentes de la robótica en Colombia. Construyamos juntos el futuro
                  de la ingeniería.
                </p>
                <a
                  href="https://www.linkedin.com/company/rasuniandes/"
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contactar en LinkedIn <span className="arr">→</span>
                </a>
              </div>

              <div className="swarm-cta-card">
                <div className="k">Para estudiantes</div>
                <h3>Únete al equipo</h3>
                <p>
                  Somos un equipo unido por la innovación y la excelencia técnica. Si te
                  apasiona la robótica, la investigación y la divulgación, hay un lugar
                  para ti.
                </p>
                <a
                  href="https://www.instagram.com/ras_uniandes/"
                  className="btn btn-ghost"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Seguirnos en Instagram <span className="arr">→</span>
                </a>
              </div>
            </div>

            <div className="swarm-socials">
              <a href="https://www.instagram.com/ras_uniandes/" className="swarm-social" target="_blank" rel="noopener noreferrer">
                <Instagram size={15} />
                Instagram
              </a>
              <a href="https://www.linkedin.com/company/rasuniandes/" className="swarm-social" target="_blank" rel="noopener noreferrer">
                <Linkedin size={15} />
                LinkedIn
              </a>
              <a href="https://www.youtube.com/@RasUniandes" className="swarm-social" target="_blank" rel="noopener noreferrer">
                <Youtube size={15} />
                YouTube
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
