import { motion } from "framer-motion";
import OrnateDivider from "./OrnateDivider";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  ornament?: string;
}

export default function PageHeader({ title, subtitle, ornament }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <h1 className="font-display text-3xl lg:text-5xl font-bold text-ink leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="font-inscription text-gold-dark tracking-[0.25em] uppercase text-sm mt-2">
              {subtitle}
            </p>
          )}
        </div>
        {ornament && (
          <div className="hidden sm:block text-right">
            <span className="font-inscription text-[10px] text-ink-muted tracking-[0.2em] uppercase">
              {ornament}
            </span>
          </div>
        )}
      </div>
      <OrnateDivider text={ornament} />
    </motion.div>
  );
}
