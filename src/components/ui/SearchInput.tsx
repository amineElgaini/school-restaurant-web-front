import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function SearchInput({ label, ...props }: Props) {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        type="text"
        className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
      />
    </div>
  );
}