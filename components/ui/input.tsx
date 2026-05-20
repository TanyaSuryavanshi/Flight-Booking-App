import { type InputHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, error, ...props }, ref) => {
  return (
    <label className="space-y-2 text-sm text-navy">
      {label ? <span className="font-medium">{label}</span> : null}
      <input
        ref={ref}
        className={clsx(
          "w-full rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm text-navy outline-none transition-all duration-300 focus:scale-[1.01] focus:shadow-lg focus:border-primary",
          error && "border-danger/70 focus:border-danger focus:shadow-[0_6px_24px_rgba(239,68,68,0.08)]",
          className
        )}
        {...props}
      />
      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </label>
  );
});

Input.displayName = "Input";

export default Input;
