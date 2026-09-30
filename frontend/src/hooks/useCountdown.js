import { useEffect, useRef, useState } from "react";

/**
 * Counts down from `initialSeconds`. Used for the Smart Halt automatic
 * timer + reminder described in the deck's Technical Approach slide.
 */
export function useCountdown(initialSeconds, { autoStart = true } = {}) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [running, setRunning] = useState(autoStart);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!running) return undefined;
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(intervalRef.current);
  }, [running]);

  useEffect(() => {
    if (secondsLeft === 0) setRunning(false);
  }, [secondsLeft]);

  const reset = (next = initialSeconds) => {
    setSecondsLeft(next);
    setRunning(true);
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const label = `${mins}:${String(secs).padStart(2, "0")}`;

  return { secondsLeft, running, setRunning, reset, label };
}
