import type { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}

export function Card({ children, className, padded = true }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-border-hairline bg-surface-1",
        "shadow-[0_1px_2px_rgba(0,0,0,0.03),0_4px_16px_-4px_rgba(0,0,0,0.06)]",
        "dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),0_4px_20px_-4px_rgba(0,0,0,0.5)]",
        padded && "p-4 sm:p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div>
        <h3 className="text-sm font-semibold text-ink-primary">{title}</h3>
        {subtitle && <p className="text-xs text-ink-muted mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
