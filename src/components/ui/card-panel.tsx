import { cn } from "@/lib/cn";

interface CardPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function CardPanel({ children, className }: CardPanelProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-rule-light/80 bg-warm-white p-6 shadow-card",
        className
      )}
    >
      {children}
    </div>
  );
}
