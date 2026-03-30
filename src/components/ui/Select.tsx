import type { SelectHTMLAttributes } from "react";

type Option = {
  label: string;
  value: string | number;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: Option[];
};

export default function Select({
  label,
  error,
  options,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className="w-full space-y-1">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      <select
        className={`w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}