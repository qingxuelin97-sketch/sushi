export default function OrnateDivider({ text }: { text?: string }) {
  return (
    <div className="divider-ornate my-6">
      {text ? (
        <span className="font-inscription text-xs tracking-[0.2em] uppercase whitespace-nowrap">
          {text}
        </span>
      ) : null}
    </div>
  );
}
