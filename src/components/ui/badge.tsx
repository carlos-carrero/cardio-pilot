import { cn } from "@/lib/cn";

type BadgeVariant =
  | "neutral"
  | "accent"
  | "emergency"
  | "urgent"
  | "routine"
  | "muted"
  | "session";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  neutral: "border-rule bg-surface text-ink-secondary",
  accent: "border-accent/20 bg-accent-soft text-accent",
  emergency: "border-emergency/20 bg-emergency-soft text-emergency",
  urgent: "border-urgent/20 bg-urgent-soft text-urgent",
  routine: "border-routine/20 bg-accent-soft text-routine",
  muted: "border-rule-light bg-surface text-muted",
  session: "border-accent/15 bg-accent-soft/60 text-accent",
};

const DOT_COLORS: Record<BadgeVariant, string> = {
  neutral: "bg-muted/40",
  accent: "bg-accent",
  emergency: "bg-emergency",
  urgent: "bg-urgent",
  routine: "bg-routine",
  muted: "bg-muted/40",
  session: "bg-accent",
};

export function Badge({ children, variant = "neutral", className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-badge border px-2.5 py-0.5 font-mono text-meta font-medium leading-tight",
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {dot && <span className={cn("block h-1.5 w-1.5 rounded-full shrink-0", DOT_COLORS[variant])} />}
      {children}
    </span>
  );
}
