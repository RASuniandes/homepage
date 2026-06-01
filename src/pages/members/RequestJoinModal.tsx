import axios from "axios";
import { useState } from "react";
import { API_URL } from "../../utils/config";
import { toast } from "react-toastify";

interface RequestJoinModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function RequestJoinModal({ onClose, onSuccess }: RequestJoinModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    major: "",
    doubleMajor: "",
    phoneNumber: "",
    role: "",
    uCode: "",
    project: "",
    photo: null as File | null,
    skills: [] as string[],
    contributions: [] as string[],
    goals: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [currentInput, setCurrentInput] = useState({ skills: "", contributions: "", goals: "" });

  const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleListInputChange = (field: "skills" | "contributions" | "goals", value: string) => {
    setCurrentInput(prev => ({ ...prev, [field]: value }));
  };

  const addToList = (field: "skills" | "contributions" | "goals") => {
    const value = currentInput[field].trim();
    if (value) {
      setFormData(prev => ({ ...prev, [field]: [...prev[field], value] }));
      setCurrentInput(prev => ({ ...prev, [field]: "" }));
    }
  };

  const removeFromList = (field: "skills" | "contributions" | "goals", index: number) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const handleListKeyPress = (field: "skills" | "contributions" | "goals", e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); addToList(field); }
  };

  const handleJoinRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error("Por favor ingresa tu nombre"); return; }
    if (!formData.email.trim()) { toast.error("Por favor ingresa tu correo electrónico"); return; }
    if (!validateEmail(formData.email)) { toast.error("Por favor ingresa un correo electrónico válido"); return; }
    if (!formData.major.trim()) { toast.error("Por favor ingresa tu carrera"); return; }
    if (formData.name.trim().length < 2) { toast.error("El nombre debe tener al menos 2 caracteres"); return; }

    try {
      setLoading(true);
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("major", formData.major);
      submitData.append("doubleMajor", formData.doubleMajor);
      submitData.append("phoneNumber", formData.phoneNumber);
      submitData.append("role", formData.role);
      submitData.append("uCode", formData.uCode);
      submitData.append("project", formData.project);
      submitData.append("skills", JSON.stringify(formData.skills));
      submitData.append("contributions", JSON.stringify(formData.contributions));
      submitData.append("goals", JSON.stringify(formData.goals));
      if (formData.photo) submitData.append("photo", formData.photo);
      await axios.post(`${API_URL}/members/request-join`, submitData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFormData({ name: "", email: "", major: "", doubleMajor: "", phoneNumber: "", role: "", uCode: "", project: "", photo: null, skills: [], contributions: [], goals: [] });
      setPhotoPreview("");
      onSuccess?.();
      onClose();
    } catch {
      toast.error("Error al enviar la solicitud. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const ListField = ({ field, label, placeholder }: { field: "skills" | "contributions" | "goals"; label: string; placeholder: string }) => (
    <div className="field">
      <label>{label} <span style={{ fontWeight: 400, opacity: .6 }}>(presiona Enter)</span></label>
      <div className="field-tags">
        {formData[field].map((item, idx) => (
          <span key={idx} className="field-tag">
            {item}
            <button type="button" onClick={() => removeFromList(field, idx)} aria-label={`Eliminar ${item}`}>×</button>
          </span>
        ))}
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={currentInput[field]}
        onChange={(e) => handleListInputChange(field, e.target.value)}
        onKeyDown={(e) => handleListKeyPress(field, e)}
        disabled={loading}
      />
    </div>
  );

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">✕</button>

        <span className="eyebrow">Únete al equipo</span>
        <h2 style={{ marginTop: 12 }}>Solicitar Membresía</h2>

        <form onSubmit={handleJoinRequest} noValidate>

          <p className="modal-section-label">Información personal</p>

          <div className="field">
            <label>Nombre completo *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={loading} />
          </div>
          <div className="field">
            <label>Correo electrónico *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={loading} />
          </div>
          <div className="field">
            <label>Carrera *</label>
            <input type="text" name="major" value={formData.major} onChange={handleChange} disabled={loading} />
          </div>
          <div className="field">
            <label>Doble carrera</label>
            <input type="text" name="doubleMajor" value={formData.doubleMajor} onChange={handleChange} disabled={loading} />
          </div>
          <div className="field">
            <label>Código universitario</label>
            <input type="text" name="uCode" value={formData.uCode} onChange={handleChange} disabled={loading} />
          </div>
          <div className="field">
            <label>Teléfono</label>
            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} disabled={loading} />
          </div>

          <p className="modal-section-label">Perfil técnico</p>

          <div className="field">
            <label>Rol o área de interés</label>
            <input type="text" name="role" placeholder="Ej: Software Lead, Mecánica" value={formData.role} onChange={handleChange} disabled={loading} />
          </div>
          <div className="field">
            <label>Proyecto de interés</label>
            <input type="text" name="project" value={formData.project} onChange={handleChange} disabled={loading} />
          </div>

          <ListField field="skills" label="Habilidades" placeholder="Ej: ROS, C++, KiCad" />
          <ListField field="contributions" label="Contribuciones" placeholder="Ej: Documentación, Testing" />
          <ListField field="goals" label="Objetivos" placeholder="Ej: Investigación, Networking" />

          <p className="modal-section-label">Foto de perfil</p>

          <div className="field">
            {photoPreview && (
              <div className="photo-preview" style={{ marginBottom: 10 }}>
                <img src={photoPreview} alt="Preview" />
              </div>
            )}
            <label>Foto (opcional)</label>
            <input type="file" accept="image/*" onChange={handlePhotoChange} disabled={loading} style={{ padding: '8px 12px' }} />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? "Enviando…" : <>Enviar solicitud <span className="arr">→</span></>}
          </button>

        </form>
      </div>
    </div>
  );
}
