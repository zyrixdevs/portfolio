import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** CSS does the pinning; ScrollTrigger drives the scene without scroll traps. */
export function useStoryProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!ref.current || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => setProgress(self.progress),
      invalidateOnRefresh: true,
    });
    return () => trigger.kill();
  }, []);
  return { ref, progress };
}
