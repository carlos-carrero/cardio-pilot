import { cn } from "@/lib/cn";

interface SidePanelProps {
  children: React.ReactNode;
  className?: string;
  eyebrow?: string;
  accentEyebrow?: boolean;
}

export function SidePanel({ children, className, eyebrow, accentEyebrow }: SidePanelProps) {
  return (
    <div className={cn("rounded-card border border-rule-light/80 bg-warm-white p-5 shadow-card", className)}>
      {eyebrow && (
        <p className={cn(
          "mb-3 font-mono text-eyebrow font-medium uppercase",
          accentEyebrow ? "text-accent" : "text-muted",
        )}>
          {eyebrow}
        </p>
      )}
      {children}
    </div>
  );
}
