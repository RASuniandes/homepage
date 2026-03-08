/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Lock, X } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../utils/config';
import type { Member } from './memberType';
import MemberCard from './MemberCard';
import RequestJoinModal from './RequestJoinModal';
import { snakeToCamelObject } from '../../utils/snakeToCamel';
import { toast } from 'react-toastify';

const AUTH_TOKEN_KEY = 'admin_auth_token';
const AUTH_EXPIRY_KEY = 'admin_auth_expiry';

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [membersToAdd, setMembersToAdd] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'existing' | 'toAdd'>('existing');

  useEffect(() => {
    checkAuthStatus();
    fetchMembers();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const expiry = localStorage.getItem(AUTH_EXPIRY_KEY);

    if (token && expiry && new Date().getTime() < parseInt(expiry)) {
      setIsAuthenticated(true);
      if (activeTab === 'toAdd') {
        fetchMembersToAdd();
      }
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
      const data = response.data.map((member: Record<string, unknown>) => snakeToCamelObject(member));
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
      if (response.status !== 200) throw new Error('Error al cargar miembros');
      const data = response.data.map((member: Record<string, unknown>) => snakeToCamelObject(member));
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
      const response = await axios.post(`${API_URL}/members/authorize`, {
        password: adminPassword
      });

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
      {/* Header Section */}
      <section className="min-h-[40vh] flex items-center pt-12 sm:pt-16 md:pt-20 relative px-4 sm:px-6 md:px-0">
        <div className="max-w-7xl mx-auto w-full">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
            style={{
              fontFamily: "'Space Mono', monospace",
              background: 'linear-gradient(135deg, #862633, #FAAE1F)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '1px sm:2px',
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            EQUIPO SWARM
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Investigadores y desarrolladores dedicados a la robótica autónoma
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={() => setShowJoinModal(true)}
              className="w-full sm:w-auto px-6 py-3 bg-black border border-white text-white rounded-lg font-semibold hover:bg-yellow-400 transition flex items-center justify-center sm:justify-start gap-2"
            >
              <Plus className="w-5 h-5" />
              Solicitar Membresía
            </button>
            {!isAuthenticated ? (
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full sm:w-auto px-6 py-3 bg-red-900/50 border-2 border-red-900 text-white rounded-lg font-semibold hover:border-yellow-500 transition flex items-center justify-center sm:justify-start gap-2"
              >
                <Lock className="w-5 h-5" />
                Administrar
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-red-600 text-white rounded-lg font-semibold transition"
              >
                Autorizado
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-6 sm:py-8 border-b border-slate-800 px-4 sm:px-6 md:px-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 sm:gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('existing')}
              className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold text-sm sm:text-base transition whitespace-nowrap ${
                activeTab === 'existing'
                  ? 'text-yellow-500 border-b-2 border-yellow-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Miembros Actuales
            </button>
            {isAuthenticated && (
              <button
                onClick={() => {
                  setActiveTab('toAdd');
                  fetchMembersToAdd();
                }}
                className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold text-sm sm:text-base transition whitespace-nowrap ${
                  activeTab === 'toAdd'
                    ? 'text-yellow-500 border-b-2 border-yellow-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Solicitudes Pendientes
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Members Grid */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-0">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center text-gray-300 text-sm sm:text-base">Cargando miembros...</div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 items-stretch"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {activeTab === 'existing'
                ? members.length > 0
                  ? members.map((member) => (
                      <MemberCard key={member.id} member={member} />
                    ))
                  : <p className="text-gray-400 text-sm sm:text-base">No hay miembros disponibles</p>
                : membersToAdd.length > 0
                ? membersToAdd.map((member) => (
                    <MemberCard key={member.id} member={member} isAdmin={isAuthenticated} onApproved={() => approveRequest(member.id)} />
                  ))
                : <p className="text-gray-400 text-sm sm:text-base">No hay solicitudes pendientes</p>
              }
            </motion.div>
          )}
        </div>
      </section>

      {/* Password Modal */}
      {showPasswordModal && (
        <Modal onClose={() => setShowPasswordModal(false)}>
          <h2 className="text-xl sm:text-2xl font-bold text-yellow-500 mb-6">Autorización de Admin</h2>
          <form onSubmit={handleAuthorize} className="space-y-4">
            <input
              type="password"
              placeholder="Contraseña de administrador"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full bg-slate-800 border border-amber-500/30 rounded-lg px-4 py-2 text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-400"
              autoFocus
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition text-sm sm:text-base"
            >
              Autorizar
            </button>
          </form>
        </Modal>
      )}

      {/* Join Request Modal */}
      {showJoinModal && (
        <RequestJoinModal onClose={() => setShowJoinModal(false)} onSuccess={() => fetchMembers()} />
      )}
    </div>
  );
}

function Modal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-md w-full"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <button
          onClick={onClose}
          className="float-right text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="clear-both">{children}</div>
      </motion.div>
    </motion.div>
  );
}