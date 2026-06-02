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
      toast.error('No se pudieron cargar los miembros');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembersToAdd = async () => {
    try {
      setLoading(true);
      setMembersToAdd(await getPendingMembers());
    } catch {
      toast.error('No se pudieron cargar los miembros');
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
      // One frame delay so children are painted before the transition starts
      requestAnimationFrame(() => el.classList.add('in'));
    } else {
      el.classList.remove('in');
    }
  }, [displayedMembers]);

  return (
    <>
      {/* Page header */}
      <section className="block page-header">
        <div className="wrap">
          <nav className="breadcrumb">
            <Link to="/">Inicio</Link>
            <span className="sep">/</span>
            <span>Miembros</span>
          </nav>
          <span className="eyebrow">Identidad &amp; comunidad</span>
          <div className="sec-head">
            <h2>El equipo</h2>
            <p>Investigadores y desarrolladores dedicados a la robótica autónoma en Uniandes.</p>
          </div>
          <div className="cta-row">
            <button className="btn btn-primary" onClick={() => setShowJoinModal(true)}>
              Solicitar membresía <span className="arr">→</span>
            </button>
            {!isAuthenticated
              ? (
                <button className="btn btn-ghost" onClick={() => setShowPasswordModal(true)}>
                  Administrar
                </button>
              ) : (
                <button className="btn btn-ghost" onClick={handleLogout}>
                  Autorizado ✓
                </button>
              )
            }
          </div>
        </div>
      </section>

      {/* Filter chips + grid */}
      <section className="block" style={{ paddingTop: 32 }}>
        <div className="wrap">

          {/* Area filter */}
          <div className="filter-chips">
            {AREA_FILTERS.map(f => (
              <button
                key={f.id}
                className={`chip${activeFilter === f.id ? ' active' : ''}`}
                onClick={() => setActiveFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Admin tabs (only visible when authenticated) */}
          {isAuthenticated && (
            <div className="filter-chips" style={{ marginTop: 10 }}>
              <button
                className={`chip${activeTab === 'existing' ? ' active' : ''}`}
                onClick={() => setActiveTab('existing')}
              >
                Miembros actuales
              </button>
              <button
                className={`chip${activeTab === 'toAdd' ? ' active' : ''}`}
                onClick={() => { setActiveTab('toAdd'); fetchMembersToAdd(); }}
              >
                Solicitudes pendientes
              </button>
            </div>
          )}

          {/* Grid */}
          {loading && <div className="empty-state"><p>Cargando miembros…</p></div>}
          {!loading && displayedMembers.length === 0 && (
            <div className="empty-state">
              <p>{activeTab === 'toAdd' ? 'No hay solicitudes pendientes.' : 'No hay miembros en esta categoría.'}</p>
            </div>
          )}
          {/* Always mounted so the ref is stable; hidden via style when not in use */}
          <div
            ref={gridRef}
            className="members-grid stagger"
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
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 400 }}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">✕</button>
        <span className="eyebrow">Admin</span>
        <h2 style={{ marginTop: 12 }}>Autorización</h2>
        <form onSubmit={onSubmit}>
          <div className="field" style={{ marginTop: 24 }}>
            <label>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              autoFocus
            />
          </div>
          <div className="field">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}
          >
            Autorizar <span className="arr">→</span>
          </button>
        </form>
      </div>
    </div>
  );
}
