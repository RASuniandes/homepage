import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, ArrowRight, ChevronDown } from 'lucide-react';
import IEEETicker from './IEEETicker';

/**
 * Design tokens (derived from the "El equipo" page):
 *  ink      #171310   near-black, headings
 *  paper    #F5F3ED   warm cream background
 *  paper-2  #FFFFFF   header surface (slightly lighter than page bg)
 *  line     #E7E2D8   hairline borders
 *  brand    #7A1F2E   deep maroon — primary accent / CTA
 *  brand-2  #5C1622   maroon hover/active
 *  muted    #6B655D   secondary text
 *
 * Nav labels stay in the sans body face; the mono face (already used for
 * "Inicio / Equipo" and the eyebrow tags in the page) is reserved for the
 * wordmark's subtitle and the mobile drawer's section label — that's the
 * one place in the header it's worth borrowing.
 */

export default function RASLayout() {
  const rootRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);

  // Theme toggle persistence
  useEffect(() => {
    const stored = localStorage.getItem('ras-theme');
    const dark = stored === 'dark';
    setIsDarkMode(dark);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const handleThemeToggle = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('ras-theme', next ? 'dark' : 'light');
  };

  // Close mobile drawer and projects menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setProjectsOpen(false);
  }, [location.pathname]);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // IntersectionObserver reveals — re-run on route changes
  useEffect(() => {
    const container = rootRef.current;
    if (!container) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    container.querySelectorAll('.reveal, .stagger').forEach((el) => {
      el.classList.remove('in');
      io.observe(el);
    });
    return () => io.disconnect();
  }, [location.pathname]);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const PROJECTS: Array<{ to: string; label: string; desc: string }> = [
    { to: '/swarm-project', label: 'Swarm', desc: 'Proyecto insignia de enjambres robóticos' },
    { to: '/robot-spark', label: 'Robot Spark', desc: 'Programa de educación en robótica' },
    { to: '/ai-studio', label: 'AI-Studio', desc: 'Inteligencia artificial aplicada a robótica' },
  ];

  const NAV_ITEMS: Array<
    | { kind: 'scroll'; id: string; label: string }
    | { kind: 'route'; to: string; label: string }
    | { kind: 'projects'; label: string }
  > = [
    { kind: 'scroll', id: 'nosotros', label: 'Nosotros' },
    { kind: 'projects', label: 'Proyectos' },
    { kind: 'scroll', id: 'charlas', label: 'Charlas' },
    { kind: 'scroll', id: 'aliados', label: 'Aliados' },
    { kind: 'route', to: '/equipo', label: 'Equipo' },
    { kind: 'route', to: '/tools', label: 'Herramientas' },
    { kind: 'route', to: '/robot-spark/berto', label: 'Mini Juego' },
  ];
  const isProjectActive = PROJECTS.some((p) => location.pathname === p.to);

  const linkBase =
    'relative whitespace-nowrap text-[0.925rem] font-medium text-[#171310] transition-colors hover:text-[#7A1F2E] dark:text-[#F0EBE2] dark:hover:text-[#E3A6AD] ' +
    'after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-[#7A1F2E] after:transition-all after:duration-300 hover:after:w-full dark:after:bg-[#E3A6AD]';

  const activeLinkBase =
    'relative whitespace-nowrap text-[0.925rem] font-semibold text-[#7A1F2E] dark:text-[#E3A6AD] ' +
    'after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:bg-[#7A1F2E] dark:after:bg-[#E3A6AD]';
  return (
    <div id="ras-page" className="ras-ds min-h-screen bg-[#F5F3ED] dark:bg-[#14110F]" ref={rootRef}>
      {/* ══════════════ NAV ══════════════ */}
      <header className="sticky top-0 z-50 border-b border-[#E7E2D8] backdrop-blur-md dark:border-white/10 "
        style={{
          backgroundColor: isDarkMode ? '#14110F' : '#FFFFFF',
          // Theme-aware colours for nav pieces that can't rely on `dark:` (which follows the OS, not the site toggle)
          ['--nav-ink' as string]: isDarkMode ? '#F0EBE2' : '#171310',
          ['--nav-accent' as string]: isDarkMode ? '#E3A6AD' : '#7A1F2E',
          ['--nav-muted' as string]: isDarkMode ? '#9A948A' : '#6B655D',
          ['--nav-hover' as string]: isDarkMode ? 'rgba(255,255,255,.05)' : '#F5F3ED',
          ['--nav-line' as string]: isDarkMode ? 'rgba(255,255,255,.1)' : '#E7E2D8',
        }}
      >
        <div className="mx-auto flex h-[72px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link to="/" className="flex shrink-0 items-center gap-3 border-white rounded-[1rem] bg-white px-2 mx-2">
            <img
              src={`/RAS_oficial_logo.png`}
              alt="RAS Uniandes"
              className="h-12 my-1"
            />
            <img
              src={`/RAS_oficial_text.png`}
              alt="RAS Uniandes Texto"
              className="hidden h-8 md:block"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="ml-auto mr-6 hidden items-center gap-5 xl:flex 2xl:gap-5">
            {NAV_ITEMS.map((item) =>
              item.kind === 'projects' ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setProjectsOpen(true)}
                  onMouseLeave={() => setProjectsOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setProjectsOpen((v) => !v)}
                    aria-expanded={projectsOpen}
                    aria-haspopup="true"
                    className={
                      'relative inline-flex items-center gap-1 whitespace-nowrap text-[0.925rem] transition-colors ' +
                      'after:absolute after:-bottom-1 after:left-0 after:h-px after:bg-[var(--nav-accent)] after:transition-all after:duration-300 ' +
                      (isProjectActive
                        ? 'font-semibold text-[var(--nav-accent)] after:w-full'
                        : 'font-medium text-[var(--nav-ink)] hover:text-[var(--nav-accent)] after:w-0 hover:after:w-full')
                    }
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${projectsOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* pt-3 bridges the gap so the menu doesn't close while the cursor travels to it */}
                  <div
                    className={`absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3 transition-all duration-200 ${
                      projectsOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
                    }`}
                  >
                    <div
                      className="overflow-hidden rounded-2xl border border-[var(--nav-line)] p-2 shadow-[0_24px_60px_-24px_rgba(28,26,27,.32)]"
                      style={{ backgroundColor: isDarkMode ? '#1D1A1D' : '#FFFFFF' }}
                    >
                      {PROJECTS.map((p) => (
                        <Link
                          key={p.to}
                          to={p.to}
                          className="block rounded-xl px-4 py-3 transition-colors hover:bg-[var(--nav-hover)]"
                        >
                          <span
                            className={`block text-[0.925rem] font-semibold ${
                              location.pathname === p.to ? 'text-[var(--nav-accent)]' : 'text-[var(--nav-ink)]'
                            }`}
                          >
                            {p.label}
                          </span>
                          <span className="block text-[0.8rem] leading-snug text-[var(--nav-muted)]">
                            {p.desc}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : item.kind === 'scroll' ? (
                <a key={item.label} href="#" onClick={scrollTo(item.id)} className={linkBase}>
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.to}
                  className={location.pathname === item.to ? activeLinkBase : linkBase}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="rounded-full p-2 text-[#171310] transition-colors hover:bg-[#F0EDE4] dark:text-[#F5F3ED] dark:hover:bg-white/10"
              aria-label="Cambiar tema"
              onClick={handleThemeToggle}
            >
              {isDarkMode ? <Sun className="h-[18px] w-[18px] " 
              
              /> : <Moon className="h-[18px] w-[18px]" 
                style={{ color: 'black' }}
              />}
            </button>

            <a
              href="mailto:rasuniandes@uniandes.edu.co"
              className="group hidden items-center gap-2 whitespace-nowrap rounded-full bg-[#7A1F2E] px-5 py-2.5 text-[0.85rem] font-semibold transition-colors hover:bg-[#5C1622] md:inline-flex"
              style={{ color: 'white' }}
            >
              Trabajemos juntos
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="rounded-full p-2 text-[#171310] transition-colors hover:bg-[#F0EDE4] dark:text-[#F5F3ED] dark:hover:bg-white/10 xl:hidden"
              aria-label="Abrir menú"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" style={{ color: isDarkMode ? 'white' : 'black' }} /> : <Menu className="h-5 w-5" style={{ color: isDarkMode ? 'white' : 'black' }} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          className={`grid overflow-hidden border-t border-[#E7E2D8] bg-[#FFFFFF] transition-[grid-template-rows] duration-300 ease-out dark:border-white/10 dark:bg-[#14110F] xl:hidden ${
            mobileOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
          style={{ backgroundColor: isDarkMode ? '#14110F' : '#FFFFFF' }}
        >
          <div className="min-h-0">
            <div className="flex flex-col px-4 py-5 sm:px-6">
              <span className="mb-3 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[#6B655D] dark:text-[#9A948A]">
                Navegación
              </span>
              <nav className="flex flex-col divide-y divide-[#E7E2D8] dark:divide-white/10">
                {NAV_ITEMS.map((item) =>
                  item.kind === 'projects' ? (
                    <div key={item.label} className="py-3">
                      <span className="text-[0.975rem] font-medium text-[var(--nav-ink)]">
                        {item.label}
                      </span>
                      <div className="mt-1 flex flex-col border-l border-[var(--nav-line)] pl-4">
                        {PROJECTS.map((p) => (
                          <Link
                            key={p.to}
                            to={p.to}
                            className="py-1.5 text-[0.925rem]"
                          >
                            {/* span, not the <a>: `.ras-ds a { color: inherit }` would override the colour */}
                            <span
                              className={
                                location.pathname === p.to
                                  ? 'font-semibold text-[var(--nav-accent)]'
                                  : 'text-[var(--nav-muted)]'
                              }
                            >
                              {p.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : item.kind === 'scroll' ? (
                    <a
                      key={item.label}
                      href="#"
                      onClick={scrollTo(item.id)}
                      className="py-3 text-[0.975rem] font-medium text-[#171310] dark:text-[#F0EBE2]"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      to={item.to}
                      className={`py-3 text-[0.975rem] font-medium ${
                        location.pathname === item.to
                          ? 'text-[#7A1F2E] dark:text-[#E3A6AD]'
                          : 'text-[#171310] dark:text-[#F0EBE2]'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </nav>

              <a
                href="mailto:rasuniandes@uniandes.edu.co"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#7A1F2E] px-5 py-3 text-[0.9rem] font-semibold text-white transition-colors hover:bg-[#5C1622]"
              >
                Trabajemos juntos <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════ PAGE CONTENT ══════════════ */}
      <main>
        <Outlet />
      </main>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="border-t border-[#E7E2D8] bg-[#FFFFFF] dark:border-white/10 dark:bg-[#14110F]"
      style={{ backgroundColor: isDarkMode ? '#14110F' : '#FFFFFF' }}
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <img
                src={`/RAS_oficial_logo.png`}
                alt="RAS Uniandes — IEEE Robotics &amp; Automation Society · Universidad de los Andes"
                className="mb-4 h-10 " style={{ backgroundColor: isDarkMode ? '#14110F' : '#FFFFFF' }}
              />
              <p className="max-w-xs text-sm leading-relaxed text-[#6B655D] dark:text-[#9A948A]">
                Capítulo estudiantil de la IEEE Robotics &amp; Automation Society en la
                Universidad de los Andes.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[#6B655D] dark:text-[#9A948A]">
                Navegación
              </h4>
              <a href="#" onClick={scrollTo('nosotros')} className="text-sm text-[#171310] hover:text-[#7A1F2E] dark:text-[#F0EBE2] dark:hover:text-[#E3A6AD]">
                Nosotros
              </a>
              <a href="#" onClick={scrollTo('proyecto')} className="text-sm text-[#171310] hover:text-[#7A1F2E] dark:text-[#F0EBE2] dark:hover:text-[#E3A6AD]">
                Proyecto insignia
              </a>
              <a href="#" onClick={scrollTo('charlas')} className="text-sm text-[#171310] hover:text-[#7A1F2E] dark:text-[#F0EBE2] dark:hover:text-[#E3A6AD]">
                Charlas técnicas
              </a>
              <a href="#" onClick={scrollTo('spark')} className="text-sm text-[#171310] hover:text-[#7A1F2E] dark:text-[#F0EBE2] dark:hover:text-[#E3A6AD]">
                Robot Spark
              </a>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[#6B655D] dark:text-[#9A948A]">
                Comunidad
              </h4>
              <a href="#" onClick={scrollTo('aliados')} className="text-sm text-[#171310] hover:text-[#7A1F2E] dark:text-[#F0EBE2] dark:hover:text-[#E3A6AD]">
                Sé aliado
              </a>
              <a href="#" onClick={scrollTo('aliados')} className="text-sm text-[#171310] hover:text-[#7A1F2E] dark:text-[#F0EBE2] dark:hover:text-[#E3A6AD]">
                Únete al equipo
              </a>
              <Link to="/equipo" className="text-sm text-[#171310] hover:text-[#7A1F2E] dark:text-[#F0EBE2] dark:hover:text-[#E3A6AD]">
                Equipo
              </Link>
              <Link to="/tools" className="text-sm text-[#171310] hover:text-[#7A1F2E] dark:text-[#F0EBE2] dark:hover:text-[#E3A6AD]">
                Herramientas
              </Link>
              <Link to="/bitacora" className="text-sm text-[#171310] hover:text-[#7A1F2E] dark:text-[#F0EBE2] dark:hover:text-[#E3A6AD]">
                Bitácora
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[#6B655D] dark:text-[#9A948A]">
                Contacto
              </h4>
              <a href="mailto:rasuniandes@uniandes.edu.co" className="text-sm text-[#171310] hover:text-[#7A1F2E] dark:text-[#F0EBE2] dark:hover:text-[#E3A6AD]">
                rasuniandes@uniandes.edu.co
              </a>
              <a href="https://www.instagram.com/ras_uniandes/" target="_blank" rel="noopener noreferrer" className="text-sm text-[#171310] hover:text-[#7A1F2E] dark:text-[#F0EBE2] dark:hover:text-[#E3A6AD]">
                Instagram
              </a>
              <a href="https://www.linkedin.com/company/rasuniandes" target="_blank" rel="noopener noreferrer" className="text-sm text-[#171310] hover:text-[#7A1F2E] dark:text-[#F0EBE2] dark:hover:text-[#E3A6AD]">
                LinkedIn
              </a>
              <a href="https://www.youtube.com/@RasUniandes" target="_blank" rel="noopener noreferrer" className="text-sm text-[#171310] hover:text-[#7A1F2E] dark:text-[#F0EBE2] dark:hover:text-[#E3A6AD]">
                YouTube
              </a>
            </div>
          </div>

          <IEEETicker />

          <div className="mt-12 flex flex-col gap-2 border-t border-[#E7E2D8] pt-6 text-xs text-[#6B655D] dark:border-white/10 dark:text-[#9A948A] sm:flex-row sm:items-center sm:justify-between">
            <span>© 2025 RAS Uniandes · IEEE Student Branch</span>
            <span>Bogotá · Colombia</span>
          </div>
        </div>
      </footer>
    </div>
  );
}