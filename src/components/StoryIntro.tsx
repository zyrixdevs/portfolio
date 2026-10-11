import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function StoryIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    if (
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      sessionStorage.getItem("zyrixdev-intro")
    ) {
      setFinished(true);
      return;
    }
    let cancelled = false;
    let animation: gsap.core.Timeline | undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const image = new Image();
    image.src = "/sculpture.png";
    const ready = Promise.allSettled([document.fonts.ready, image.decode()]);
    const timeout = setTimeout(() => setFinished(true), 4500);
    Promise.race([
      ready,
      new Promise((resolve) => setTimeout(resolve, 2500)),
    ]).then(() => {
      if (cancelled) return;
      animation = gsap
        .timeline({ onComplete: () => setFinished(true) })
        .fromTo(
          ".intro-line",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.16, duration: 0.6 },
        )
        .to(".intro-rule", { scaleX: 1, duration: 0.65 }, "-=.2")
        .to(
          ref.current,
          { yPercent: -100, duration: 0.8, ease: "power4.inOut" },
          "+=.15",
        );
    });
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      animation?.kill();
      document.body.style.overflow = previous;
    };
  }, []);
  useEffect(() => {
    if (finished) {
      sessionStorage.setItem("zyrixdev-intro", "1");
      document.body.style.overflow = "";
      ScrollTrigger.refresh();
    }
  }, [finished]);
  if (finished) return null;
  return (
    <div
      ref={ref}
      className="story-intro"
      role="status"
      aria-label="Preparing the zyrixdev story"
    >
      <span className="eyebrow intro-line">
        EVERY GREAT THING STARTS SOMEWHERE.
      </span>
      <div className="intro-title">
        <span className="intro-line">An idea.</span>
        <em className="intro-line">A possibility.</em>
        <span className="intro-line">zyrixdev.</span>
      </div>
      <div className="intro-rule" />
      <button onClick={() => setFinished(true)}>ENTER THE STORY ↗</button>
    </div>
  );
}
