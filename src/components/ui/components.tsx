import { type ButtonHTMLAttributes, type ChangeEvent, type HTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = ({ children, className = "", variant = "default", size = "md", onClick, disabled = false, ...props }: ButtonProps) => {
  const baseStyles = "font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2";
  const variantStyles = {
    default: "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-blue-500/50",
    outline: "border-2 border-gray-600 text-gray-300 hover:border-blue-500 hover:text-white",
    ghost: "text-gray-300 hover:text-white hover:bg-gray-800",
  };
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = "", ...props }: CardProps) => (
  <div className={`bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-4 md:p-6 ${className}`} {...props}>
    {children}
  </div>
);

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "outline" | "secondary";
  className?: string;
}

export const Badge = ({ children, variant = "default", className = "" }: BadgeProps) => {
  const variantStyles = {
    default: "bg-blue-600/20 text-blue-300 border border-blue-500/30",
    outline: "border border-gray-600 text-gray-300",
    secondary: "bg-purple-600/20 text-purple-300 border border-purple-500/30",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const Input = ({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors ${className}`}
    {...props}
  />
);

interface OptionType {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: OptionType[];
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

export const Select = ({ options, value, onChange, className = "", ...props }: SelectProps) => (
  <select
    value={value}
    onChange={onChange}
    className={`px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors ${className}`}
    {...props}
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);