"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates a number counting up from 0 to `value` whenever `value` changes.
 */
export function useCountUp(value: number, durationMs = 900) {
  const [display, setDisplay] = useState(0);
  const frame = useRef<number>();
  const start = useRef<number>();
  const from = useRef(0);

  useEffect(() => {
    from.current = display;
    start.current = undefined;

    function step(timestamp: number) {
      if (start.current === undefined) start.current = timestamp;
      const progress = Math.min((timestamp - start.current) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(from.current + (value - from.current) * eased);
      setDisplay(current);
      if (progress < 1) {
        frame.current = requestAnimationFrame(step);
      }
    }

    frame.current = requestAnimationFrame(step);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, durationMs]);

  return display;
}
