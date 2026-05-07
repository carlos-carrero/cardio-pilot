interface EyebrowProps {
  children: React.ReactNode;
}

export function Eyebrow({ children }: EyebrowProps) {
  return (
    <div className="flex items-center gap-3 font-mono text-eyebrow uppercase tracking-eyebrow text-muted">
      <span className="block h-px w-6 bg-accent/40" />
      {children}
    </div>
  );
}
