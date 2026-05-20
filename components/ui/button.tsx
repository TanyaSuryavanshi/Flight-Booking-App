import { type ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

const variants = {
  default:
    "cta-gradient text-white hover:scale-105 transform-gpu shadow-blue-soft focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
  secondary:
    "bg-white text-navy border border-slate-100 hover:shadow-lg transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-200",
  ghost: "bg-transparent text-navy hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-200"
} as const;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={clsx(
          "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition-all duration-300 ease-in-out focus-visible:outline-none",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
