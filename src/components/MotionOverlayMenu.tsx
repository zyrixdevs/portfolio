import { useEffect, useRef } from "react";
import gsap from "gsap";
import FlowingMenu from "./react-bits/FlowingMenu";

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
      document.getElementById(id)?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
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
      aria-label="Explore zyrixdev"
      onCancel={(e) => {
        e.preventDefault();
        dismiss();
      }}
      data-lenis-prevent
    >
      <div className="overlay-top">
        <span className="overlay-brand">zyrixdev</span>
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
        <div
          className="overlay-flow"
          onClick={(e) => {
            const link = (e.target as HTMLElement).closest("a");
            if (!link) return;
            e.preventDefault();
            const id = link.getAttribute("href")?.slice(1);
            if (id === "contact") dismiss(onContact);
            else if (id) navigate(id);
          }}
        >
          <FlowingMenu
            items={[
              {
                link: "#work",
                text: "Selected work",
                image: "/images/city.jpg",
              },
              {
                link: "#services",
                text: "Our capabilities",
                image: "/images/bridge.jpg",
              },
              {
                link: "#studio",
                text: "The studio",
                image: "/images/garden.jpg",
              },
              {
                link: "#playground",
                text: "New perspectives",
                image: "/images/coast.jpg",
              },
              {
                link: "#contact",
                text: "Start something",
                image: "/images/venice.jpg",
              },
            ]}
            bgColor="#eeece4"
            textColor="#24261f"
            marqueeBgColor="#ff653b"
            marqueeTextColor="#24261f"
            borderColor="#24261f30"
            speed={18}
          />
        </div>
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
