import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Youtube } from 'lucide-react';
import { REPO_NAME } from '../../utils/config';

const img = (name: string) => `${REPO_NAME}/robot_spark/${name}`;

export default function RobotSpark() {
  return (
    <div className="rs-page">

      {/* ══════════════ HERO ══════════════ */}
      <div className="rs-hero">
        <img
          className="rs-hero-bg"
          src={img('RASRobot_Main.jpeg')}
          alt="Estudiantes de RAS Robot Spark trabajando con robots"
        />
        <div className="rs-hero-overlay" />
        <div className="rs-hero-content wrap">
          <p className="rs-hero-eyebrow">IEEE RAS Uniandes · Eco-RAS · Fundación Ecopetrol</p>
          <h1 className="rs-hero-title">Robot<br />Spark</h1>
          <p className="rs-hero-sub">Encendemos vocaciones tecnológicas en la próxima generación</p>
        </div>
        <div className="rs-hero-scroll">Scroll</div>
      </div>

      {/* ══════════════ INTRO ══════════════ */}
      <section className="block">
        <div className="wrap">
          <nav className="breadcrumb" style={{ marginBottom: 40 }}>
            <Link to="/">Inicio</Link>
            <span className="sep">/</span>
            <span>RAS Robot Spark</span>
          </nav>

          <div className="split reveal">
            <div>
              <span className="eyebrow">¿Qué es RAS Robot Spark?</span>
              <div className="sec-head" style={{ maxWidth: 'none' }}>
                <h2>Robótica para quienes<br />más lo necesitan</h2>
              </div>
              <div className="partners" style={{ marginTop: 28 }}>
                <span className="partner"><span className="pd" />IEEE RAS Uniandes</span>
                <span className="partner"><span className="pd" />Fundación Ecopetrol</span>
                <span className="partner"><span className="pd" />Laboratorio CREA</span>
              </div>
            </div>
            <div className="prose" style={{ alignSelf: 'center' }}>
              <p>
                RAS Robot Spark es un programa educativo conjunto entre IEEE RAS Uniandes,
                la Fundación Ecopetrol y el laboratorio CREA, diseñado para promover el
                interés en la robótica y potenciar las habilidades STEM en estudiantes de
                colegios de interés social.
              </p>
              <p>
                Anualmente recibimos niños de diferentes instituciones educativas —idealmente
                uno o dos por semestre— que participan en <strong>cuatro sesiones intensivas</strong> de
                robótica, proporcionando experiencias prácticas que despiertan vocaciones
                tecnológicas y democratizan el acceso a la educación en ingeniería.
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
              <span className="val">4</span>
              <span className="lbl">Sesiones intensivas</span>
            </div>
            <div className="s">
              <span className="val">2×</span>
              <span className="lbl">Colegios por año</span>
            </div>
            <div className="s">
              <span className="val">100%</span>
              <span className="lbl">Herramientas gratuitas</span>
            </div>
            <div className="s">
              <span className="val">STEM</span>
              <span className="lbl">Impacto en ingeniería</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ METODOLOGÍA ══════════════ */}
      <section className="block" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">La metodología</span>
            <h2>Cuatro pilares fundamentales</h2>
            <p>
              Cada sesión construye sobre la anterior: de la inspiración inicial hasta
              la programación de robots reales.
            </p>
          </div>

          <div className="rs-session-grid stagger">

            {/* Session 1 */}
            <article className="rs-session-card">
              <div className="rs-session-img">
                <img
                  src={img('RAS_RobotSpark_S1.jpeg')}
                  alt="Sesión 1 — Hype de Bienvenida"
                  loading="lazy"
                  style={{ objectPosition: 'top' }}
                />
              </div>
              <div className="rs-session-body">
                <div className="rs-session-num">01</div>
                <h3>Hype de Bienvenida y Contextualización</h3>
                <p>
                  Los participantes exploran los laboratorios de ingeniería, ven proyectos
                  robóticos en funcionamiento, y se introducen en conceptos fundamentales
                  como la diferencia entre una protoboard y una PCB.
                </p>
                <div className="tags">
                  <span className="tag">Laboratorios</span>
                  <span className="tag">Protoboard</span>
                  <span className="tag">PCB</span>
                </div>
              </div>
            </article>

            {/* Session 2 */}
            <article className="rs-session-card">
              <div className="rs-session-img">
                <img
                  src={img('RAS_RobotSpark_S2.jpeg')}
                  alt="Sesión 2 — Diseño de Circuitos"
                  loading="lazy"
                />
              </div>
              <div className="rs-session-body">
                <div className="rs-session-num">02</div>
                <h3>Diseño de Circuitos y tu Primera PCB</h3>
                <p>
                  Usando KiCad, cada participante diseña y valida su primer circuito
                  personalizado, experimentando el ciclo completo: concepción → diseño
                  digital → validación → preparación para manufactura.
                </p>
                <div className="tags">
                  <span className="tag">KiCad</span>
                  <span className="tag">Circuitos</span>
                  <span className="tag">Manufactura</span>
                </div>
              </div>
            </article>

            {/* Session 3 */}
            <article className="rs-session-card">
              <div className="rs-session-img">
                <img
                  src={img('robot-Spark-3DModelling.jpeg')}
                  alt="Sesión 3 — Diseño e Impresión 3D"
                  loading="lazy"
                />
              </div>
              <div className="rs-session-body">
                <div className="rs-session-num">03</div>
                <h3>Diseño e Impresión 3D</h3>
                <p>
                  Con Fusion 360 o Blender, los estudiantes diseñan soluciones mecánicas
                  propias. El momento en que sostienen su prototipo impreso es transformador:
                  la idea abstracta se convierte en objeto tangible.
                </p>
                <div className="tags">
                  <span className="tag">Fusion 360</span>
                  <span className="tag">Blender</span>
                  <span className="tag">Impresión 3D</span>
                </div>
              </div>
            </article>

            {/* Session 4 */}
            <article className="rs-session-card rs-session-card--last">
              <div className="rs-session-img rs-session-img--code">
                <div className="rs-code-bg">
                  <span>while robot.running():</span>
                  <span className="indent">sensor = robot.read()</span>
                  <span className="indent">if sensor.line:</span>
                  <span className="indent2">robot.forward()</span>
                  <span className="indent">else:</span>
                  <span className="indent2">robot.turn()</span>
                </div>
              </div>
              <div className="rs-session-body">
                <div className="rs-session-num">04</div>
                <h3>Algoritmos y Programación en Robótica</h3>
                <p>
                  Los estudiantes aprenden control de sensores, toma de decisiones y
                  retroalimentación en tiempo real. Robots que siguen líneas, resuelven
                  laberintos o compiten en contrarreloj.
                </p>
                <div className="tags">
                  <span className="tag">Algoritmos</span>
                  <span className="tag">Sensores</span>
                  <span className="tag">Competencia</span>
                </div>
                <div className="card-cta" style={{ marginTop: 18 }}>
                  <Link to="/robot-spark/berto" className="btn btn-ghost">
                    Jugar “Señal Perdida” <span className="arr">→</span>
                  </Link>
                </div>
              </div>
            </article>

          </div>
        </div>
      </section>

      {/* ══════════════ FEATURED MOMENT ══════════════ */}
      <section className="block rs-gallery-band">
        <div className="wrap">
          <div className="split reveal">
            <div className="media">
              <div className="media-card" style={{ aspectRatio: '4/3' }}>
                <img
                  src={img('robot-Spark-3DModelling.jpeg')}
                  alt="Estudiante sosteniendo su pieza impresa en 3D"
                  loading="lazy"
                  style={{ objectPosition: 'top' }}
                />
              </div>
            </div>
            <div className="copy" style={{ alignSelf: 'center' }}>
              <span className="eyebrow">Sesión 3 · Impresión 3D</span>
              <div className="sec-head">
                <h2>De la pantalla<br />al objeto real</h2>
              </div>
              <div className="prose" style={{ marginTop: 18 }}>
                <p>
                  Este es el momento más transformador del programa. El estudiante diseña
                  una pieza en software profesional, la envía a imprimir, y horas después
                  la tiene en sus manos.
                </p>
                <p>
                  La abstracción se vuelve tangible. Esa conexión genera una motivación
                  duradera que ningún video de YouTube puede replicar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ IMPACTO ══════════════ */}
      <section className="block rs-impact-band">
        <div className="wrap">
          <div className="rs-impact-inner reveal">
            <span className="eyebrow center">Impacto y propósito</span>
            <h2>La ingeniería no es<br />para unos pocos</h2>
            <p>
              RAS Robot Spark busca que cada estudiante descubra que la robótica no es
              un terreno exclusivo de privilegiados. A través de mentoría directa, acceso
              a herramientas profesionales gratuitas y la oportunidad de ver sus ideas cobrar
              vida, el programa genera conexiones emocionales duraderas con la tecnología.
            </p>
            <div className="rs-impact-tags">
              <span className="tag">Democratización STEM</span>
              <span className="tag">Mentoría directa</span>
              <span className="tag">Herramientas gratuitas</span>
              <span className="tag">Vocaciones tecnológicas</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section className="block swarm-cta-band">
        <div className="wrap">
          <div className="swarm-cta-inner reveal">
            <span className="eyebrow center">Sé parte del cambio</span>
            <h2>Únete a Robot Spark</h2>

            <div className="swarm-cta-cards">
              <div className="swarm-cta-card">
                <div className="k">Para colegios e instituciones</div>
                <h3>Lleva el programa a tu colegio</h3>
                <p>
                  Si eres docente o directivo y quieres que tus estudiantes participen
                  en RAS Robot Spark, contáctanos. Trabajamos con instituciones de
                  interés social en Bogotá.
                </p>
                <a
                  href="mailto:rasuniandes@uniandes.edu.co"
                  className="btn btn-primary"
                >
                  Escríbenos <span className="arr">→</span>
                </a>
              </div>

              <div className="swarm-cta-card">
                <div className="k">Para estudiantes de Uniandes</div>
                <h3>Diseña y enseña los talleres</h3>
                <p>
                  Buscamos mentes apasionadas dispuestas a liderar el cambio, participando
                  activamente en el diseño y la enseñanza de talleres que despertarán
                  vocaciones en la próxima generación.
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
