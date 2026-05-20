import { type ReactNode } from "react";

type CardProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export default function Card({ title, description, children, className = "" }: CardProps) {
  return (
    <section className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-soft ${className}`}>
      {title ? <div className="mb-4 space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        {description ? <p className="text-sm leading-6 text-slate-600">{description}</p> : null}
      </div> : null}
      {children}
    </section>
  );
}
