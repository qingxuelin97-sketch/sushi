import { useEffect, useState } from "react";

interface CountUpProps {
  target: number;
  duration?: number;
  className?: string;
}

export default function CountUp({ target, duration = 1000, className = "" }: CountUpProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const current = Math.floor(progress * target);
      setValue(current);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return <span className={className}>{value}</span>;
}
