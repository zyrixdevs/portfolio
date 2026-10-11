import { useEffect, useRef, useState, type ReactNode } from "react";

/** Keep visual experiments off the rendering budget when outside the viewport. */
export default function LiveScene({
  children,
  fallback,
  className = "",
}: {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let intersecting = false;
    const sync = () => setVisible(intersecting && !document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        intersecting = entry.isIntersecting;
        sync();
      },
      { rootMargin: "120px" },
    );
    observer.observe(ref.current!);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  return (
    <div ref={ref} className={className}>
      {visible ? children : fallback}
    </div>
  );
}
