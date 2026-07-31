/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { submitJoinRequest } from "../../utils/APIs/membersApi";
import { toast } from "react-toastify";

type ListFieldKey = "skills" | "contributions" | "goals";

// Helper hook to read ras-theme dynamically from localStorage
function useRasTheme() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem("ras-theme") === "dark");

  useEffect(() => {
    const handleStorageChange = () => {
      setIsDark(localStorage.getItem("ras-theme") === "dark");
    };

    // Watch for theme changes dispatched locally or across tabs
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return isDark;
}

interface ListFieldProps {
  field: ListFieldKey;
  label: string;
  placeholder: string;
  items: string[];
  inputValue: string;
  disabled: boolean;
  isDark: boolean;
  styles: Record<string, React.CSSProperties>;
  onInputChange: (field: ListFieldKey, value: string) => void;
  onAdd: (field: ListFieldKey, values: string[]) => void;
  onRemove: (field: ListFieldKey, index: number) => void;
}

function ListField({
  field,
  label,
  placeholder,
  items,
  inputValue,
  disabled,
  isDark,
  styles,
  onInputChange,
  onAdd,
  onRemove,
}: ListFieldProps) {
  const commit = (raw: string) => {
    const values = raw.split(',').map(v => v.trim()).filter(Boolean);
    if (values.length) onAdd(field, values);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commit(inputValue);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text');
    if (pasted.includes(',')) {
      e.preventDefault();
      commit(inputValue + pasted);
      onInputChange(field, '');
    }
  };

  const tagStyle: React.CSSProperties = isDark
    ? {
        borderColor: "rgba(227, 166, 173, 0.25)",
        backgroundColor: "rgba(227, 166, 173, 0.1)",
        color: "#E3A6AD",
      }
    : {
        borderColor: "rgba(122, 31, 46, 0.2)",
        backgroundColor: "rgba(122, 31, 46, 0.1)",
        color: "#7A1F2E",
      };

  return (
    <div className="mb-4 flex flex-col gap-1.5">
      <label className="font-mono text-xs uppercase tracking-[0.1em]" style={styles.label}>
        {label}{" "}
        <span
          className="font-sans normal-case tracking-normal"
          style={{ color: isDark ? "#9A948A" : "#9A948A" }}
        >
          (Enter o comas)
        </span>
      </label>

      {items.length > 0 && (
        <div className="mb-1 flex flex-wrap gap-1.5">
          {items.map((item, idx) => (
            <span
              key={idx}
              style={tagStyle}
              className="inline-flex items-center gap-1.5 rounded-full border py-1 pl-3 pr-1.5 text-xs font-medium"
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(field, idx)}
                aria-label={`Eliminar ${item}`}
                style={{ color: tagStyle.color }}
                className="flex h-4 w-4 items-center justify-center rounded-full opacity-70 transition-opacity hover:opacity-100"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => onInputChange(field, e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        disabled={disabled}
        className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        style={styles.input}
      />
    </div>
  );
}

interface RequestJoinModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function RequestJoinModal({ onClose, onSuccess }: RequestJoinModalProps) {
  const isDark = useRasTheme();

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
  const [currentInput, setCurrentInput] = useState<Record<ListFieldKey, string>>({
    skills: "",
    contributions: "",
    goals: "",
  });

  // ---- Injected Theme Styles base on `ras-theme === 'dark'` ------------------
  const dynamicStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    } as React.CSSProperties,

    modalCard: {
      backgroundColor: isDark ? "#1C1815" : "#FFFFFF",
      borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "#E7E2D8",
      color: isDark ? "#F5F3ED" : "#171310",
    } as React.CSSProperties,

    heading: {
      color: isDark ? "#F5F3ED" : "#171310",
    } as React.CSSProperties,

    label: {
      color: isDark ? "#9A948A" : "#6B655D",
    } as React.CSSProperties,

    input: {
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "#FFFFFF",
      borderColor: isDark ? "rgba(255, 255, 255, 0.15)" : "#E7E2D8",
      color: isDark ? "#F5F3ED" : "#171310",
    } as React.CSSProperties,

    sectionLabel: {
      borderTopColor: isDark ? "rgba(255, 255, 255, 0.1)" : "#E7E2D8",
      color: isDark ? "#E3A6AD" : "#7A1F2E",
    } as React.CSSProperties,

    closeBtn: {
      color: isDark ? "#9A948A" : "#6B655D",
    } as React.CSSProperties,

    btnPrimary: {
      backgroundColor: "#7A1F2E",
      color: "#FFFFFF",
    } as React.CSSProperties,

    brandLabel: {
      color: "#7A1F2E",
    } as React.CSSProperties,
  };

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

  const handleListInputChange = (field: ListFieldKey, value: string) => {
    setCurrentInput(prev => ({ ...prev, [field]: value }));
  };

  const addToList = (field: ListFieldKey, values: string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ...values.filter(v => !prev[field].includes(v))],
    }));
    setCurrentInput(prev => ({ ...prev, [field]: "" }));
  };

  const removeFromList = (field: ListFieldKey, index: number) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
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
      await submitJoinRequest(
        {
          name: formData.name,
          email: formData.email,
          major: formData.major,
          doubleMajor: formData.doubleMajor,
          phoneNumber: formData.phoneNumber,
          role: formData.role,
          uCode: formData.uCode,
          project: formData.project,
          skills: formData.skills,
          contributions: formData.contributions,
          goals: formData.goals,
        },
        formData.photo
      );
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

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-sm"
      style={dynamicStyles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border p-8 shadow-2xl"
        style={dynamicStyles.modalCard}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          style={dynamicStyles.closeBtn}
          className="absolute right-4 top-4 rounded-full p-1.5 transition-colors hover:opacity-80"
        >
          ✕
        </button>

        <span className="font-mono text-xs uppercase tracking-[0.14em]" style={dynamicStyles.brandLabel}>
          Únete al equipo
        </span>
        <h2 className="mt-3 text-2xl font-bold tracking-tight" style={dynamicStyles.heading}>
          Solicitar membresía
        </h2>

        <form onSubmit={handleJoinRequest} noValidate>

          <p
            className="mb-4 mt-8 border-t pt-6 font-mono text-xs uppercase tracking-[0.12em] first:mt-0 first:border-t-0 first:pt-0"
            style={dynamicStyles.sectionLabel}
          >
            Información personal
          </p>

          <div className="mb-4 flex flex-col gap-1.5">
            <label className="font-mono text-xs uppercase tracking-[0.1em]" style={dynamicStyles.label}>
              Nombre completo *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              style={dynamicStyles.input}
            />
          </div>

          <div className="mb-4 flex flex-col gap-1.5">
            <label className="font-mono text-xs uppercase tracking-[0.1em]" style={dynamicStyles.label}>
              Correo electrónico *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              style={dynamicStyles.input}
            />
          </div>

          <div className="mb-4 flex flex-col gap-1.5">
            <label className="font-mono text-xs uppercase tracking-[0.1em]" style={dynamicStyles.label}>
              Carrera *
            </label>
            <input
              type="text"
              name="major"
              value={formData.major}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              style={dynamicStyles.input}
            />
          </div>

          <div className="mb-4 flex flex-col gap-1.5">
            <label className="font-mono text-xs uppercase tracking-[0.1em]" style={dynamicStyles.label}>
              Doble carrera
            </label>
            <input
              type="text"
              name="doubleMajor"
              value={formData.doubleMajor}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              style={dynamicStyles.input}
            />
          </div>

          <div className="mb-4 flex flex-col gap-1.5">
            <label className="font-mono text-xs uppercase tracking-[0.1em]" style={dynamicStyles.label}>
              Código universitario
            </label>
            <input
              type="text"
              name="uCode"
              value={formData.uCode}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              style={dynamicStyles.input}
            />
          </div>

          <div className="mb-4 flex flex-col gap-1.5">
            <label className="font-mono text-xs uppercase tracking-[0.1em]" style={dynamicStyles.label}>
              Teléfono
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              style={dynamicStyles.input}
            />
          </div>

          <p
            className="mb-4 mt-8 border-t pt-6 font-mono text-xs uppercase tracking-[0.12em] first:mt-0 first:border-t-0 first:pt-0"
            style={dynamicStyles.sectionLabel}
          >
            Perfil técnico
          </p>

          <div className="mb-4 flex flex-col gap-1.5">
            <label className="font-mono text-xs uppercase tracking-[0.1em]" style={dynamicStyles.label}>
              Rol o área de interés
            </label>
            <input
              type="text"
              name="role"
              placeholder="Ej: Software Lead, Mecánica"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              style={dynamicStyles.input}
            />
          </div>

          <div className="mb-4 flex flex-col gap-1.5">
            <label className="font-mono text-xs uppercase tracking-[0.1em]" style={dynamicStyles.label}>
              Proyecto de interés
            </label>
            <input
              type="text"
              name="project"
              value={formData.project}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              style={dynamicStyles.input}
            />
          </div>

          <ListField
            field="skills"
            label="Habilidades"
            placeholder="Ej: ROS, C++, KiCad"
            items={formData.skills}
            inputValue={currentInput.skills}
            disabled={loading}
            isDark={isDark}
            styles={dynamicStyles}
            onInputChange={handleListInputChange}
            onAdd={addToList}
            onRemove={removeFromList}
          />
          <ListField
            field="contributions"
            label="Contribuciones"
            placeholder="Ej: Documentación, Testing"
            items={formData.contributions}
            inputValue={currentInput.contributions}
            disabled={loading}
            isDark={isDark}
            styles={dynamicStyles}
            onInputChange={handleListInputChange}
            onAdd={addToList}
            onRemove={removeFromList}
          />
          <ListField
            field="goals"
            label="Objetivos"
            placeholder="Ej: Investigación, Networking"
            items={formData.goals}
            inputValue={currentInput.goals}
            disabled={loading}
            isDark={isDark}
            styles={dynamicStyles}
            onInputChange={handleListInputChange}
            onAdd={addToList}
            onRemove={removeFromList}
          />

          <p
            className="mb-4 mt-8 border-t pt-6 font-mono text-xs uppercase tracking-[0.12em] first:mt-0 first:border-t-0 first:pt-0"
            style={dynamicStyles.sectionLabel}
          >
            Foto de perfil
          </p>

          <div className="mb-4 flex flex-col gap-1.5">
            {photoPreview && (
              <img
                src={photoPreview}
                alt="Preview"
                style={{ borderColor: dynamicStyles.modalCard.borderColor }}
                className="mb-2 h-20 w-20 rounded-full border object-cover"
              />
            )}
            <label className="font-mono text-xs uppercase tracking-[0.1em]" style={dynamicStyles.label}>
              Foto (opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              disabled={loading}
              style={{ color: dynamicStyles.label.color }}
              className="cursor-pointer text-sm file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-[#7A1F2E] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#5C1622] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            style={dynamicStyles.btnPrimary}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Enviando…" : <>Enviar solicitud <span aria-hidden>→</span></>}
          </button>

        </form>
      </div>
    </div>
  );
}