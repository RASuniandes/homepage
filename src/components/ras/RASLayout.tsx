import { useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { REPO_NAME } from '../../utils/config';
import '../../styles/ras-tokens.css';
import '../../styles/ras-pages.css';

export default function RASLayout() {
  const rootRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Theme toggle persistence (reads what was set in index.html script)
  const handleThemeToggle = () => {
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('ras-theme', next);
  };

  // IntersectionObserver reveals — re-run on route changes
  useEffect(() => {
    const container = rootRef.current;
    if (!container) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    container.querySelectorAll('.reveal, .stagger').forEach(el => {
      el.classList.remove('in');
      io.observe(el);
    });
    return () => io.disconnect();
  }, [location.pathname]);

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      className={location.pathname === to ? 'active' : undefined}
    >
      {label}
    </Link>
  );

  return (
    <div id="ras-page" className="ras-ds" ref={rootRef}>

      {/* ══════════════ NAV ══════════════ */}
      <header className="nav">
        <div className="wrap nav-in">
          <Link className="brand" to="/">
            <img src={`${REPO_NAME}/ras_logo_black.png`} alt="RAS Uniandes" />
            <span className="wm">
              RAS Uniandes
              <small>IEEE Robotics &amp; Automation</small>
            </span>
          </Link>

          <nav className="links">
            <Link to="/">Nosotros</Link>
            <Link to="/">Proyecto</Link>
            <Link to="/">Charlas</Link>
            <Link to="/">Robot Spark</Link>
            {navLink('/members', 'Miembros')}
            {navLink('/tools', 'Herramientas')}
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
            <a href="mailto:rasuniandes@uniandes.edu.co" className="btn btn-primary">
              Trabajemos juntos <span className="arr">→</span>
            </a>
          </div>
        </div>
      </header>

      {/* ══════════════ PAGE CONTENT ══════════════ */}
      <main>
        <Outlet />
      </main>

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
              <Link to="/">Inicio</Link>
              <Link to="/members">Miembros</Link>
              <Link to="/tools">Herramientas</Link>
            </div>

            <div className="foot-col">
              <h4>Comunidad</h4>
              <a href="mailto:rasuniandes@uniandes.edu.co">Sé aliado</a>
              <a href="mailto:rasuniandes@uniandes.edu.co">Únete al equipo</a>
            </div>

            <div className="foot-col">
              <h4>Contacto</h4>
              <a href="mailto:rasuniandes@uniandes.edu.co">rasuniandes@uniandes.edu.co</a>
              <a href="https://www.instagram.com/ras_uniandes/" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://www.linkedin.com/company/rasuniandes" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://www.youtube.com/@RasUniandes" target="_blank" rel="noopener noreferrer">YouTube</a>
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
