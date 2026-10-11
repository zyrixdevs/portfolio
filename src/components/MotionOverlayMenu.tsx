import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Icon } from "@iconify/react";
import arrow from "@iconify-icons/solar/arrow-right-up-linear";

/** Original GSAP overlay, replacing the Framer module at the user's request. */
export default function MotionOverlayMenu({
  onClose,
  onContact,
}: {
  onClose: () => void;
  onContact: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const closing = useRef(false);
  useEffect(() => {
    const node = ref.current!;
    node.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const context = gsap.context(() => {
      if (!reduced)
        gsap
          .timeline()
          .from(node, {
            clipPath: "inset(0 0 100% 0)",
            duration: 0.65,
            ease: "power4.inOut",
          })
          .from(
            ".overlay-row",
            {
              yPercent: 85,
              opacity: 0,
              stagger: 0.07,
              duration: 0.65,
              ease: "power3.out",
            },
            "-=0.35",
          );
    }, node);
    return () => {
      context.revert();
      document.body.style.overflow = previous;
      node.close();
    };
  }, []);
  const dismiss = (after?: () => void) => {
    if (closing.current) return;
    closing.current = true;
    const finish = () => {
      ref.current?.close();
      onClose();
      requestAnimationFrame(() => after?.());
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) finish();
    else
      gsap.to(ref.current, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.4,
        ease: "power3.inOut",
        onComplete: finish,
      });
  };
  const navigate = (id: string) =>
    dismiss(() => {
      history.replaceState(null, "", `#${id}`);
      document
        .getElementById(id)
        ?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        });
      document.getElementById(id)?.focus({ preventScroll: true });
    });
  return (
    <dialog
      ref={ref}
      id="site-menu"
      className="motion-overlay"
      aria-label="Explore Zyrix"
      onCancel={(e) => {
        e.preventDefault();
        dismiss();
      }}
      data-lenis-prevent
    >
      <div className="overlay-top">
        <span className="overlay-brand">
          zyrix<span>.dev</span>
        </span>
        <button onClick={() => dismiss()} aria-label="Close menu">
          CLOSE <span>×</span>
        </button>
      </div>
      <div className="overlay-layout">
        <div className="overlay-intro">
          <span className="eyebrow">
            INDEPENDENT MINDS.
            <br />
            CONNECTED POSSIBILITIES.
          </span>
          <p>
            From the first
            <br />
            “what if” to
            <br />
            <em>what’s next.</em>
          </p>
          <a href="mailto:imzyrixx@gmail.com">imzyrixx@gmail.com</a>
        </div>
        <nav aria-label="Overlay navigation">
          {[
            ["work", "Selected work"],
            ["services", "Our capabilities"],
            ["studio", "The studio"],
            ["playground", "The playground"],
          ].map(([id, text], i) => (
            <div className="overlay-row-wrap" key={id}>
              <a
                className="overlay-row"
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(id);
                }}
              >
                <small>0{i + 1}</small>
                <span>{text}</span>
                <Icon
                  className="overlay-arrow"
                  icon={arrow}
                  aria-hidden="true"
                />
              </a>
            </div>
          ))}
          <div className="overlay-row-wrap">
            <button className="overlay-row" onClick={() => dismiss(onContact)}>
              <small>05</small>
              <span>Start something</span>
              <Icon className="overlay-arrow" icon={arrow} aria-hidden="true" />
            </button>
          </div>
        </nav>
      </div>
      <div className="overlay-bottom">
        <span>WEBSITES / BOTS / AUTOMATIONS / SOFTWARE</span>
        <a href="https://github.com/zyrixdevs" target="_blank" rel="noreferrer">
          EXPLORE OUR GITHUB
        </a>
      </div>
    </dialog>
  );
}
