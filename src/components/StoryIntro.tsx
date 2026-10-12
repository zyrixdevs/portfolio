import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function StoryIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const number = useRef<HTMLSpanElement>(null);
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("zyrixdev-intro") === "cinematic-v2";
    } catch {
      /* Storage is optional. */
    }
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || seen) {
      setFinished(true);
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const state = { value: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => setFinished(true) });
      tl.to(
        state,
        {
          value: 100,
          duration: 5,
          ease: "none",
          onUpdate: () => {
            if (number.current)
              number.current.textContent = String(
                Math.floor(state.value),
              ).padStart(3, "0");
          },
        },
        0,
      )
        .fromTo(
          ".intro-reticle",
          { scale: 0.5, rotation: -90, opacity: 0 },
          {
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
          },
          0,
        )
        .fromTo(
          ".intro-rib",
          { scaleY: 0 },
          { scaleY: 1, stagger: 0.035, duration: 0.65, ease: "power3.out" },
          0.25,
        )
        .fromTo(
          ".intro-act-one",
          { yPercent: 110 },
          { yPercent: 0, duration: 0.7, ease: "power4.out" },
          0.35,
        )
        .to(
          ".intro-act-one",
          { yPercent: -115, opacity: 0, duration: 0.5, ease: "power3.in" },
          1.6,
        )
        .fromTo(
          ".intro-act-two",
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.6, ease: "power4.out" },
          1.95,
        )
        .to(
          ".intro-reticle",
          { rotation: 90, scale: 0.85, duration: 1.2, ease: "power3.inOut" },
          1.8,
        )
        .to(
          ".intro-act-two",
          { yPercent: -115, opacity: 0, duration: 0.4 },
          3.1,
        )
        .fromTo(
          ".intro-act-three",
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.6, ease: "power4.out" },
          3.4,
        )
        .to(
          ".intro-reticle",
          { scale: 1.8, opacity: 0, duration: 1, ease: "power3.in" },
          3.8,
        )
        .to(
          ".intro-curtain",
          { scaleY: 0, stagger: 0.04, duration: 0.7, ease: "power4.inOut" },
          4.1,
        )
        .to(".intro-interface", { opacity: 0, y: -25, duration: 0.4 }, 4.4);
    }, ref);
    const timeout = setTimeout(() => setFinished(true), 5100);
    return () => {
      clearTimeout(timeout);
      ctx.revert();
      document.body.style.overflow = previous;
    };
  }, []);
  useEffect(() => {
    if (finished) {
      try {
        sessionStorage.setItem("zyrixdev-intro", "cinematic-v2");
      } catch {
        /* Optional. */
      }
      document.body.style.overflow = "";
      ScrollTrigger.refresh();
    }
  }, [finished]);
  if (finished) return null;
  return (
    <div
      ref={ref}
      className="story-intro cinematic-intro"
      role="status"
      aria-label="Five-second opening: from a signal to something real"
      data-lenis-prevent
    >
      <div className="intro-curtains" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <div className="intro-curtain" key={i} />
        ))}
      </div>
      <div className="intro-interface">
        <div className="intro-top">
          <span>ZYRIXDEV / INDEPENDENT MINDS</span>
          <span>AN EXERCISE IN POSSIBILITY</span>
        </div>
        <div className="intro-reticle" aria-hidden="true">
          <i />
          <i />
          <div className="intro-ribs">
            {Array.from({ length: 24 }, (_, i) => (
              <b
                className="intro-rib"
                key={i}
                style={{ height: `${25 + Math.sin((i / 23) * Math.PI) * 65}%` }}
              />
            ))}
          </div>
          <span>+&nbsp;&nbsp; Z / 001 &nbsp;&nbsp;+</span>
        </div>
        <div className="intro-acts" aria-hidden="true">
          <div className="intro-act-one">
            First, <em>a signal.</em>
          </div>
          <div className="intro-act-two">
            Then, <em>a system.</em>
          </div>
          <div className="intro-act-three">
            Finally, <em>something real.</em>
          </div>
        </div>
        <div className="intro-bottom">
          <span>IDEA → FORM → FUNCTION</span>
          <div className="intro-counter">
            <span ref={number}>000</span>
            <small>/ 100</small>
          </div>
          <button onClick={() => setFinished(true)}>SKIP INTRO ↗</button>
        </div>
      </div>
    </div>
  );
}
