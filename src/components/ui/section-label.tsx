interface SectionLabelProps {
  children: React.ReactNode;
}

export function SectionLabel({ children }: SectionLabelProps) {
  return (
    <div className="font-mono text-eyebrow font-medium uppercase tracking-eyebrow text-muted">
      {children}
    </div>
  );
}
