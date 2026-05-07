import { cn } from "@/lib/cn";

interface MetricRowProps {
  label: string;
  value: string;
  highlight?: boolean;
  warn?: boolean;
}

export function MetricRow({ label, value, highlight, warn }: MetricRowProps) {
  return (
    <div className="flex justify-between items-baseline gap-4">
      <span className="text-body-sm text-muted">{label}</span>
      <span className={cn(
        "font-mono text-meta font-medium tabular-nums",
        warn ? "text-emergency" : highlight ? "text-routine" : "text-ink-secondary",
      )}>
        {value}
      </span>
    </div>
  );
}
