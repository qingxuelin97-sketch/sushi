import { useEffect, useState } from "react";

interface TimerProps {
  seconds: number;
  onComplete?: () => void;
  isRunning?: boolean;
}

export default function Timer({ seconds, onComplete, isRunning = true }: TimerProps) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!isRunning) return;
    if (remaining <= 0) {
      onComplete?.();
      return;
    }
    const timer = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(timer);
          onComplete?.();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, remaining, onComplete]);

  const mins = Math.floor(remaining / 60)
    .toString()
    .padStart(2, "0");
  const secs = (remaining % 60).toString().padStart(2, "0");

  return (
    <div className="font-mono text-3xl font-semibold tracking-wider text-commons-green tabular-nums">
      {mins}:{secs}
    </div>
  );
}
