/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import { getActiveMembers, getPendingMembers, approveMember } from '../../utils/APIs/membersApi';
import type { Member } from './memberType';
import MemberCard from './MemberCard';
import RequestJoinModal from './RequestJoinModal';
import { toast } from 'react-toastify';

const AREA_FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'software', label: 'Software' },
  { id: 'hardware', label: 'Hardware' },
  { id: 'mecanica', label: 'Mecánica' },
  { id: 'directiva', label: 'Directiva' },
  { id: 'spark', label: 'Robot Spark' },
] as const;

type FilterId = typeof AREA_FILTERS[number]['id'];

// ---- Static Style Dictionary (Injected Styles) ---------------------------
const styles = {
  primaryBtn: {
    backgroundColor: '#7A1F2E',
    color: '#FFFFFF',
  } as React.CSSProperties,

  ghostBtn: {
    borderColor: '#E7E2D8',
    color: '#171310',
  } as React.CSSProperties,

  authorizedBtn: {
    borderColor: 'rgba(5, 150, 105, 0.4)',
    color: '#047857',
  } as React.CSSProperties,

  subtext: {
    color: '#6B655D',
  } as React.CSSProperties,

  heading: {
    color: '#171310',
  } as React.CSSProperties,

  brandLabel: {
    color: '#7A1F2E',
  } as React.CSSProperties,

  sectionBorder: {
    borderTopColor: '#E7E2D8',
  } as React.CSSProperties,

  modalOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  } as React.CSSProperties,

  modalCard: {
    borderColor: '#E7E2D8',
    backgroundColor: '#FFFFFF',
  } as React.CSSProperties,

  inputField: {
    borderColor: '#E7E2D8',
    backgroundColor: '#FFFFFF',
    color: '#171310',
  } as React.CSSProperties,
};

// Dark mode helpers
const isDarkMode = () => typeof window !== 'undefined' && (
  document.documentElement.classList.contains('dark') ||
  (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
);

// Dynamic helper for interactive chips using injected CSS
const getChipStyle = (active: boolean, customActiveBg?: string): React.CSSProperties => {
  const dark = isDarkMode();
  if (active) {
    return {
      backgroundColor: customActiveBg || (dark ? '#9f2937' : '#7A1F2E'),
      borderColor: customActiveBg || (dark ? '#9f2937' : '#7A1F2E'),
      color: '#FFFFFF',
    };
  }
  return {
    borderColor: dark ? '#374151' : '#E7E2D8',
    color: dark ? '#E5E7EB' : '#171310',
    backgroundColor: 'transparent',
  };
};

const getModalOverlayStyle = (): React.CSSProperties => ({
  backgroundColor: isDarkMode() ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.5)',
});

const getModalCardStyle = (): React.CSSProperties => ({
  borderColor: isDarkMode() ? '#374151' : '#E7E2D8',
  backgroundColor: isDarkMode() ? '#0b1220' : '#FFFFFF',
  color: isDarkMode() ? '#E5E7EB' : undefined,
});

const getInputFieldStyle = (): React.CSSProperties => ({
  borderColor: isDarkMode() ? '#374151' : '#E7E2D8',
  backgroundColor: isDarkMode() ? '#071029' : '#FFFFFF',
  color: isDarkMode() ? '#E5E7EB' : '#171310',
});

const getBrandLabelStyle = (): React.CSSProperties => ({
  color: isDarkMode() ? '#f97316' : styles.brandLabel.color,
});

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [membersToAdd, setMembersToAdd] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'existing' | 'toAdd'>('existing');
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    fetchMembers();
    return () => subscription.unsubscribe();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setMembers(await getActiveMembers());
    } catch {
      toast.error('No se pudo cargar el equipo');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembersToAdd = async () => {
    try {
      setLoading(true);
      setMembersToAdd(await getPendingMembers());
    } catch {
      toast.error('No se pudo cargar el equipo');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorize = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword,
      });
      if (error) throw error;
      toast.success('Acceso autorizado.');
      setAdminEmail('');
      setAdminPassword('');
      setShowPasswordModal(false);
      setActiveTab('toAdd');
      fetchMembersToAdd();
    } catch {
      toast.error('Error al autorizar: Credenciales incorrectas');
    }
  };

  const handleApprove = async (memberId: string) => {
    try {
      await approveMember(memberId);
      toast.success('Solicitud aprobada');
      fetchMembers();
      fetchMembersToAdd();
    } catch {
      toast.error('Error al aprobar solicitud');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setActiveTab('existing');
    toast.info('Sesión cerrada');
  };

  const displayedMembers = useMemo(() => {
    const base = activeTab === 'existing' ? members : membersToAdd;
    if (activeFilter === 'all') return base;
    if (activeFilter === 'directiva') return base.filter(m => m.isInCouncil);
    if (activeFilter === 'spark') return base.filter(m => m.project?.toLowerCase().includes('spark'));
    return base.filter(m =>
      m.role?.toLowerCase().includes(activeFilter) ||
      m.skills?.some(s => s.toLowerCase().includes(activeFilter))
    );
  }, [members, membersToAdd, activeTab, activeFilter]);

  const gridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    if (displayedMembers.length > 0) {
      requestAnimationFrame(() => el.classList.add('in'));
    } else {
      el.classList.remove('in');
    }
  }, [displayedMembers]);

  return (
    <>
      {/* Page header */}
      <section className="pb-8 pt-32 sm:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-8 font-mono text-sm" style={styles.subtext}>
            <Link to="/" className="hover:opacity-80">Inicio</Link>
            <span className="mx-2 opacity-40">/</span>
            <span style={styles.heading}>Equipo</span>
          </nav>

          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-8" style={{ backgroundColor: styles.brandLabel.color }} />
            <span className="font-mono text-xs uppercase tracking-[0.14em]" style={styles.brandLabel}>
              Identidad &amp; comunidad
            </span>
          </div>

          <div className="max-w-2xl">
            <h2 className="text-5xl font-extrabold tracking-tight sm:text-6xl" style={styles.heading}>
              El equipo
            </h2>
            <p className="mt-5 text-lg leading-relaxed" style={styles.subtext}>
              Investigadores y desarrolladores dedicados a la robótica autónoma en Uniandes.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              style={styles.primaryBtn}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors hover:opacity-90"
              onClick={() => setShowJoinModal(true)}
            >
              Ser parte de RAS Uniandes <span aria-hidden>→</span>
            </button>

            {!isAuthenticated ? (
              <button
                style={styles.ghostBtn}
                className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-colors hover:opacity-80"
                onClick={() => setShowPasswordModal(true)}
              >
                Administrar
              </button>
            ) : (
              <button
                style={styles.authorizedBtn}
                className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-colors hover:opacity-80"
                onClick={handleLogout}
              >
                Autorizado ✓
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Filter chips + grid */}
      <section className="border-t pt-8" style={styles.sectionBorder}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Area filter */}
          <div className="flex flex-wrap gap-2">
            {AREA_FILTERS.map(f => (
              <button
                key={f.id}

                className="whitespace-nowrap rounded-full border px-4 py-2 font-mono text-sm transition-colors hover:opacity-90"
                style={{ color: isDarkMode() ? '#E5E7EB' : '#171310', ...getChipStyle(activeFilter === f.id) }}
                onClick={() => setActiveFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Admin tabs */}
          {isAuthenticated && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                style={getChipStyle(activeTab === 'existing', '#171310')}
                className="whitespace-nowrap rounded-full border px-4 py-2 font-mono text-sm transition-colors"
                onClick={() => setActiveTab('existing')}
              >
                Equipo actual
              </button>
              <button
                style={getChipStyle(activeTab === 'toAdd', '#171310')}
                className="whitespace-nowrap rounded-full border px-4 py-2 font-mono text-sm transition-colors"
                onClick={() => { setActiveTab('toAdd'); fetchMembersToAdd(); }}
              >
                Solicitudes pendientes
              </button>
            </div>
          )}

          {/* Grid */}
          {loading && (
            <div className="flex items-center justify-center py-24">
              <p style={styles.subtext}>Cargando equipo…</p>
            </div>
          )}
          {!loading && displayedMembers.length === 0 && (
            <div className="flex items-center justify-center py-24">
              <p style={styles.subtext}>
                {activeTab === 'toAdd' ? 'No hay solicitudes pendientes.' : 'No hay integrantes en esta categoría.'}
              </p>
            </div>
          )}

          <div
            ref={gridRef}
            className="stagger mt-8 grid grid-cols-1 gap-6 pb-24 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            style={loading || displayedMembers.length === 0 ? { display: 'none' } : undefined}
          >
            {displayedMembers.map(member => (
              <MemberCard
                key={member.id}
                member={member}
                isAdmin={isAuthenticated && activeTab === 'toAdd'}
                onApproved={() => handleApprove(member.id)}
              />
            ))}
          </div>

        </div>
      </section>

      {/* Admin login modal */}
      {showPasswordModal && (
        <AdminLoginModal
          email={adminEmail}
          password={adminPassword}
          onEmailChange={setAdminEmail}
          onPasswordChange={setAdminPassword}
          onSubmit={handleAuthorize}
          onClose={() => setShowPasswordModal(false)}
        />
      )}

      {/* Join request modal */}
      {showJoinModal && (
        <RequestJoinModal onClose={() => setShowJoinModal(false)} onSuccess={fetchMembers} />
      )}
    </>
  );
}

function AdminLoginModal({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onClose,
}: {
  email: string;
  password: string;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-sm"
      style={styles.modalOverlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-[400px] rounded-2xl border p-8 shadow-2xl"
        style={styles.modalCard}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 rounded-full p-1.5 transition-colors hover:bg-black/5"
          style={styles.subtext}
        >
          ✕
        </button>

        <span className="font-mono text-xs uppercase tracking-[0.14em]" style={styles.brandLabel}>
          Admin
        </span>
        <h2 className="mt-3 text-2xl font-bold tracking-tight" style={styles.heading}>
          Autorización
        </h2>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs uppercase tracking-[0.1em]" style={styles.subtext}>
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              autoFocus
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors"
              style={styles.inputField}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs uppercase tracking-[0.1em]" style={styles.subtext}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors"
              style={styles.inputField}
            />
          </div>
          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors hover:opacity-90"
            style={styles.primaryBtn}
          >
            Autorizar <span aria-hidden>→</span>
          </button>
        </form>
      </div>
    </div>
  );
}