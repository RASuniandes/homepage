export type ListFieldKey = "skills" | "contributions" | "goals";

export interface ListFieldProps {
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

export function ListField({
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
