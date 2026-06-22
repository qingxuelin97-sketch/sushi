import OrnateDivider from "./OrnateDivider";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  ornament?: string;
}

export default function PageHeader({ title, subtitle, ornament }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-3xl lg:text-4xl font-bold text-ink">
        {title}
      </h1>
      {subtitle && (
        <p className="font-body text-lg text-ink-muted mt-1">{subtitle}</p>
      )}
      <OrnateDivider text={ornament} />
    </div>
  );
}
