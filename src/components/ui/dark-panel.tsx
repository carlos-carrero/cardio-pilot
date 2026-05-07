import { cn } from "@/lib/cn";

interface DarkPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function DarkPanel({ children, className }: DarkPanelProps) {
  return (
    <div
      className={cn(
        "rounded-card bg-authority p-6 text-authority-text shadow-authority ring-1 ring-white/[0.04]",
        className
      )}
    >
      {children}
    </div>
  );
}
