/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../utils/config';
import type { Member } from './memberType';
import MemberCard from './MemberCard';
import RequestJoinModal from './RequestJoinModal';
import { snakeToCamelObject } from '../../utils/snakeToCamel';
import { toast } from 'react-toastify';

const AUTH_TOKEN_KEY = 'admin_auth_token';
const AUTH_EXPIRY_KEY = 'admin_auth_expiry';

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
  const [adminPassword, setAdminPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'existing' | 'toAdd'>('existing');
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');

  useEffect(() => {
    checkAuthStatus();
    fetchMembers();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const expiry = localStorage.getItem(AUTH_EXPIRY_KEY);
    if (token && expiry && new Date().getTime() < parseInt(expiry)) {
      setIsAuthenticated(true);
      if (activeTab === 'toAdd') fetchMembersToAdd();
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_EXPIRY_KEY);
      setIsAuthenticated(false);
    }
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/members`);
      if (response.status !== 200) throw new Error('Error al cargar miembros');
      const data = response.data.map((m: Record<string, unknown>) => snakeToCamelObject(m));
      setMembers(data);
    } catch {
      toast.error('No se pudieron cargar los miembros');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembersToAdd = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/members/to_add`);
      if (response.status !== 200) throw new Error('Error al cargar solicitudes');
      const data = response.data.map((m: Record<string, unknown>) => snakeToCamelObject(m));
      setMembersToAdd(data);
    } catch {
      toast.error('No se pudieron cargar los miembros');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorize = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/members/authorize`, { password: adminPassword });
      if (response.status !== 200) throw new Error('Contraseña incorrecta');
      const expiryTime = new Date().getTime() + (2 * 60 * 60 * 1000);
      localStorage.setItem(AUTH_TOKEN_KEY, 'authenticated');
      localStorage.setItem(AUTH_EXPIRY_KEY, expiryTime.toString());
      setIsAuthenticated(true);
      toast.success('Acceso autorizado por 2 horas.');
      setAdminPassword('');
      setShowPasswordModal(false);
      setActiveTab('toAdd');
      fetchMembersToAdd();
    } catch {
      toast.error('Error al autorizar: Contraseña incorrecta');
      setShowPasswordModal(false);
    }
  };

  const approveRequest = async (memberId: string) => {
    try {
      const response = await axios.post(`${API_URL}/members/${memberId}/approve`);
      if (response.status !== 200) throw new Error('Error al aprobar solicitud');
      toast.success('Solicitud aprobada');
      fetchMembers();
      fetchMembersToAdd();
    } catch {
      toast.error('Error al aprobar solicitud');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_EXPIRY_KEY);
    setIsAuthenticated(false);
    setActiveTab('existing');
    toast.info('Sesión cerrada');
  };

  // Derived: apply area filter to the active tab's member list
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
          {loading ? (
            <div className="empty-state"><p>Cargando miembros…</p></div>
          ) : displayedMembers.length === 0 ? (
            <div className="empty-state">
              <p>{activeTab === 'toAdd' ? 'No hay solicitudes pendientes.' : 'No hay miembros en esta categoría.'}</p>
            </div>
          ) : (
            <div className="members-grid stagger">
              {displayedMembers.map(member => (
                <MemberCard
                  key={member.id}
                  member={member}
                  isAdmin={isAuthenticated && activeTab === 'toAdd'}
                  onApproved={() => approveRequest(member.id)}
                />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Admin password modal */}
      {showPasswordModal && (
        <AdminPasswordModal
          password={adminPassword}
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

function AdminPasswordModal({
  password,
  onPasswordChange,
  onSubmit,
  onClose,
}: {
  password: string;
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
            <label>Contraseña de administrador</label>
            <input
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              autoFocus
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
