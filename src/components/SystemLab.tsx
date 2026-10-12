import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const routes = {
  Websites: {
    nodes: ["An enquiry", "Validate the brief", "Create a project"],
    result: "Project brief",
    action: "Prepare a website discovery session",
  },
  Bots: {
    nodes: ["A command", "Read the intent", "Build a reply"],
    result: "Command response",
    action: "Prepare a community bot workflow",
  },
  Automations: {
    nodes: ["An event", "Apply the rules", "Route the work"],
    result: "Workflow event",
    action: "Prepare an automation blueprint",
  },
};
type Route = keyof typeof routes;
export default function SystemLab({
  onContact,
}: {
  onContact: (service: string) => void;
}) {
  const root = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const [route, setRoute] = useState<Route>("Automations");
  const [idea, setIdea] = useState("Route a new customer enquiry");
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [result, setResult] = useState<{
    name: string;
    route: Route;
    action: string;
  } | null>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        ".lab-wire path",
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 85%",
            end: "top 20%",
            scrub: 1,
          },
        },
      );
      gsap.from(".lab-node", {
        y: 50,
        stagger: 0.12,
        scrollTrigger: {
          trigger: root.current,
          start: "top 70%",
          end: "top 10%",
          scrub: 1,
        },
      });
    }, root);
    return () => {
      ctx.revert();
      timeline.current?.kill();
    };
  }, []);
  const run = () => {
    if (running || !idea.trim()) return;
    setRunning(true);
    setResult(null);
    setCopied(false);
    setCopyError(false);
    setStep(0);
    const finish = () => {
      setStep(3);
      setRunning(false);
      setResult({ name: idea.trim(), route, action: routes[route].action });
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    timeline.current = gsap
      .timeline({ onComplete: finish })
      .set(".lab-signal", { left: "17%", opacity: 1 });
    timeline.current
      .to(".lab-signal", {
        left: "49%",
        duration: 0.7,
        ease: "power2.inOut",
        onComplete: () => setStep(1),
      })
      .to(".lab-signal", {
        left: "83%",
        duration: 0.7,
        ease: "power2.inOut",
        onComplete: () => setStep(2),
      })
      .to(".lab-signal", { opacity: 0, duration: 0.35 });
  };
  const change = (next: Route) => {
    timeline.current?.kill();
    setRoute(next);
    setStep(-1);
    setRunning(false);
    setResult(null);
    setCopied(false);
    setCopyError(false);
    gsap.set(".lab-signal", { opacity: 0 });
  };
  return (
    <section
      id="lab"
      ref={root}
      tabIndex={-1}
      className="system-lab"
      aria-labelledby="lab-heading"
    >
      <div className="lab-top">
        <span className="eyebrow">INTERLUDE / THE INVISIBLE, MADE VISIBLE</span>
        <span className="lab-coordinate">[ INPUT → LOGIC → IMPACT ]</span>
      </div>
      <div className="lab-heading">
        <h2 id="lab-heading">
          Beautiful outside.
          <br />
          <em>Brilliant underneath.</em>
        </h2>
        <p>
          Every useful product is a set of thoughtful connections.
          <br />
          Here’s a small, working one. Give it an idea.
        </p>
      </div>
      <div className="lab-tabs" aria-label="Choose a system">
        {(Object.keys(routes) as Route[]).map((name, i) => (
          <button
            key={name}
            aria-pressed={route === name}
            onClick={() => change(name)}
          >
            <span>0{i + 1}</span>
            {name}
            <b>↗</b>
          </button>
        ))}
      </div>
      <div className="lab-machine" data-step={step}>
        <svg
          className="lab-wire"
          viewBox="0 0 1000 160"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M160 80H500H840" pathLength="1" />
        </svg>
        <i className="lab-signal" aria-hidden="true" />
        {routes[route].nodes.map((name, i) => (
          <div className={`lab-node ${step >= i ? "is-live" : ""}`} key={i}>
            <div className="node-symbol" aria-hidden="true">
              <svg
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
              >
                <path
                  d={
                    i === 0
                      ? "M7 5v12h18m-6-6 6 6-6 6"
                      : i === 1
                        ? "M10 7h12v18H10zM5 12h5m12 0h5M5 20h5m12 0h5"
                        : "M8 24 24 8M8 8h16v16"
                  }
                />
              </svg>
            </div>
            <span className="node-index">
              0{i + 1} / {["RECEIVE", "UNDERSTAND", "DELIVER"][i]}
            </span>
            <h3>{name}</h3>
            <div className="node-status">
              <i />
              {step > i
                ? "COMPLETE"
                : step === i
                  ? "PROCESSING"
                  : "AWAITING SIGNAL"}
            </div>
          </div>
        ))}
      </div>
      <div className="lab-console">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run();
          }}
        >
          <label htmlFor="lab-idea">YOUR INPUT</label>
          <div className="lab-input-line">
            <input
              id="lab-idea"
              disabled={running}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              maxLength={120}
              required
              placeholder="What should your system do?"
            />
            <button disabled={running || !idea.trim()} type="submit">
              {running ? "ROUTING…" : "RUN THE SIGNAL"} <span>↗</span>
            </button>
          </div>
          <p>A browser experiment. Try a route, then keep the blueprint.</p>
        </form>
        <div className="lab-output" aria-live="polite">
          <span className="eyebrow">
            {result ? "OUTPUT / READY" : "OUTPUT / WAITING"}
          </span>
          {result ? (
            <>
              <h3>{result.name}</h3>
              <p>{result.action}</p>
              <button
                className="text-link"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(
                      JSON.stringify(result, null, 2),
                    );
                    setCopied(true);
                    setCopyError(false);
                  } catch {
                    setCopied(false);
                    setCopyError(true);
                  }
                }}
              >
                {copied ? "Copied ✓" : "Copy blueprint ↗"}
              </button>
              {copyError && (
                <p className="copy-error" role="status">
                  Copy is unavailable here. Your blueprint is shown above.
                </p>
              )}
            </>
          ) : (
            <p>
              Small input.
              <br />
              <em>Entirely new possibilities.</em>
            </p>
          )}
        </div>
      </div>
      <button
        className="lab-contact text-link"
        onClick={() => onContact(route)}
      >
        Let’s build your {route.toLowerCase()} <span>↗</span>
      </button>
    </section>
  );
}
