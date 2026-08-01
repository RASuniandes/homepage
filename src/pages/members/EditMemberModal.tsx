import { useState } from "react";
import { toast } from "react-toastify";
import { updateMember, type MemberEditableFields } from "../../utils/APIs/membersApi";
import { useRasTheme } from "./useRasTheme";
import { ListField, type ListFieldKey } from "./ListField";
import type { Member } from "./memberType";

interface EditMemberModalProps {
  member: Member;
  onClose: () => void;
  onSaved?: () => void;
}

export default function EditMemberModal({ member, onClose, onSaved }: EditMemberModalProps) {
  const isDark = useRasTheme();

  const [formData, setFormData] = useState({
    name: member.name,
    role: member.role ?? "",
    major: member.major,
    doubleMajor: member.doubleMajor ?? "",
    phoneNumber: member.phoneNumber ?? "",
    uCode: member.uCode ?? "",
    project: member.project ?? "",
    isInCouncil: member.isInCouncil,
    skills: member.skills ?? [],
    contributions: member.contributions ?? [],
    goals: member.goals ?? [],
  });
  const [loading, setLoading] = useState(false);
  const [currentInput, setCurrentInput] = useState<Record<ListFieldKey, string>>({
    skills: "",
    contributions: "",
    goals: "",
  });

  const dynamicStyles = {
    overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" } as React.CSSProperties,
    modalCard: {
      backgroundColor: isDark ? "#1C1815" : "#FFFFFF",
      borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "#E7E2D8",
      color: isDark ? "#F5F3ED" : "#171310",
    } as React.CSSProperties,
    heading: { color: isDark ? "#F5F3ED" : "#171310" } as React.CSSProperties,
    label: { color: isDark ? "#9A948A" : "#6B655D" } as React.CSSProperties,
    input: {
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "#FFFFFF",
      borderColor: isDark ? "rgba(255, 255, 255, 0.15)" : "#E7E2D8",
      color: isDark ? "#F5F3ED" : "#171310",
    } as React.CSSProperties,
    closeBtn: { color: isDark ? "#9A948A" : "#6B655D" } as React.CSSProperties,
    btnPrimary: { backgroundColor: "#7A1F2E", color: "#FFFFFF" } as React.CSSProperties,
    brandLabel: { color: "#7A1F2E" } as React.CSSProperties,
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error("El nombre no puede estar vacío"); return; }
    if (!formData.major.trim()) { toast.error("La carrera no puede estar vacía"); return; }

    const fields: MemberEditableFields = {
      name: formData.name,
      role: formData.role || undefined,
      major: formData.major,
      doubleMajor: formData.doubleMajor || undefined,
      phoneNumber: formData.phoneNumber || undefined,
      uCode: formData.uCode || undefined,
      project: formData.project || undefined,
      isInCouncil: formData.isInCouncil,
      skills: formData.skills,
      contributions: formData.contributions,
      goals: formData.goals,
    };

    try {
      setLoading(true);
      await updateMember(member.id, fields);
      toast.success("Integrante actualizado");
      onSaved?.();
      onClose();
    } catch {
      toast.error("Error al actualizar el integrante");
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
          Admin
        </span>
        <h2 className="mt-3 text-2xl font-bold tracking-tight" style={dynamicStyles.heading}>
          Editar {member.name}
        </h2>

        <form onSubmit={handleSave} noValidate>
          <div className="mb-4 mt-8 flex flex-col gap-1.5">
            <label className="font-mono text-xs uppercase tracking-[0.1em]" style={dynamicStyles.label}>
              Nombre completo *
            </label>
            <input
              type="text" name="name" value={formData.name} onChange={handleChange} disabled={loading}
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              style={dynamicStyles.input}
            />
          </div>

          <div className="mb-4 flex flex-col gap-1.5">
            <label className="font-mono text-xs uppercase tracking-[0.1em]" style={dynamicStyles.label}>
              Carrera *
            </label>
            <input
              type="text" name="major" value={formData.major} onChange={handleChange} disabled={loading}
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              style={dynamicStyles.input}
            />
          </div>

          <div className="mb-4 flex flex-col gap-1.5">
            <label className="font-mono text-xs uppercase tracking-[0.1em]" style={dynamicStyles.label}>
              Doble carrera
            </label>
            <input
              type="text" name="doubleMajor" value={formData.doubleMajor} onChange={handleChange} disabled={loading}
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              style={dynamicStyles.input}
            />
          </div>

          <div className="mb-4 flex flex-col gap-1.5">
            <label className="font-mono text-xs uppercase tracking-[0.1em]" style={dynamicStyles.label}>
              Código universitario
            </label>
            <input
              type="text" name="uCode" value={formData.uCode} onChange={handleChange} disabled={loading}
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              style={dynamicStyles.input}
            />
          </div>

          <div className="mb-4 flex flex-col gap-1.5">
            <label className="font-mono text-xs uppercase tracking-[0.1em]" style={dynamicStyles.label}>
              Teléfono
            </label>
            <input
              type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} disabled={loading}
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              style={dynamicStyles.input}
            />
          </div>

          <div className="mb-4 flex flex-col gap-1.5">
            <label className="font-mono text-xs uppercase tracking-[0.1em]" style={dynamicStyles.label}>
              Rol o área
            </label>
            <input
              type="text" name="role" value={formData.role} onChange={handleChange} disabled={loading}
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              style={dynamicStyles.input}
            />
          </div>

          <div className="mb-4 flex flex-col gap-1.5">
            <label className="font-mono text-xs uppercase tracking-[0.1em]" style={dynamicStyles.label}>
              Proyecto
            </label>
            <input
              type="text" name="project" value={formData.project} onChange={handleChange} disabled={loading}
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              style={dynamicStyles.input}
            />
          </div>

          <label className="mb-4 flex items-center gap-2 text-sm" style={dynamicStyles.label}>
            <input
              type="checkbox"
              checked={formData.isInCouncil}
              onChange={(e) => setFormData(prev => ({ ...prev, isInCouncil: e.target.checked }))}
              disabled={loading}
            />
            Miembro de la directiva
          </label>

          <ListField
            field="skills" label="Habilidades" placeholder="Ej: ROS, C++, KiCad"
            items={formData.skills} inputValue={currentInput.skills} disabled={loading} isDark={isDark}
            styles={dynamicStyles} onInputChange={handleListInputChange} onAdd={addToList} onRemove={removeFromList}
          />
          <ListField
            field="contributions" label="Contribuciones" placeholder="Ej: Documentación, Testing"
            items={formData.contributions} inputValue={currentInput.contributions} disabled={loading} isDark={isDark}
            styles={dynamicStyles} onInputChange={handleListInputChange} onAdd={addToList} onRemove={removeFromList}
          />
          <ListField
            field="goals" label="Objetivos" placeholder="Ej: Investigación, Networking"
            items={formData.goals} inputValue={currentInput.goals} disabled={loading} isDark={isDark}
            styles={dynamicStyles} onInputChange={handleListInputChange} onAdd={addToList} onRemove={removeFromList}
          />

          <button
            type="submit"
            style={dynamicStyles.btnPrimary}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Guardando…" : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}
