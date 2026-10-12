import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { Icon } from "@iconify/react";
import arrowRightUp from "@iconify-icons/solar/arrow-right-up-linear";
import arrowDown from "@iconify-icons/solar/arrow-down-linear";
import close from "@iconify-icons/solar/close-circle-linear";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import StoryIntro from "./components/StoryIntro";
import SystemLab from "./components/SystemLab";
import ChapterDial from "./components/ChapterDial";
import Magnet from "./components/react-bits/Magnet";
import AnimatedContent from "./components/react-bits/AnimatedContent";
import { CircleButtons } from "./components/threeui/CircleButtons";

import MotionOverlayMenu from "./components/MotionOverlayMenu";
import {
  WorkCarousel,
  TechnologyLoop,
  Capabilities,
  MetallicIdentity,
  StudioProcess,
  Playground,
  FooterWordmark,
  capabilities,
} from "./components/PortfolioExperiences";

const Sculpture = lazy(() => import("./components/Sculpture"));
gsap.registerPlugin(ScrollTrigger);
const Arrow = ({ className = "" }: { className?: string }) => (
  <Icon icon={arrowRightUp} className={className} aria-hidden="true" />
);
const projects = [
  {
    id: "01",
    name: "Orbit",
    category: "Custom software · Product design",
    image: "orbit",
    title: "A little less noise. A lot more clarity.",
    text: "A concept for a calmer analytics workspace. An intentional hierarchy brings the important signals forward, while a flexible dashboard makes complex information feel approachable.",
    stack: ["Custom dashboards", "TypeScript", "Design systems"],
  },
  {
    id: "02",
    name: "Relay",
    category: "Bots · Community tools",
    image: "relay",
    title: "Your community. Connected.",
    text: "A concept for a helpful workspace bot. Commands, organized support, and daily summaries bring the useful information together without adding another dashboard to your day.",
    stack: ["Discord & Telegram", "Bot development", "API integrations"],
  },
  {
    id: "03",
    name: "Pulse",
    category: "Automations · Connected systems",
    image: "pulse",
    title: "Goodbye, repetitive busywork.",
    text: "An automation concept connecting an inquiry form, routing logic, a workspace, and team notifications. A clear visual flow makes the invisible work understandable.",
    stack: ["Workflow automation", "Webhooks", "Integrations"],
  },
  {
    id: "04",
    name: "Forma",
    category: "Websites · E-commerce",
    image: "forma",
    title: "Objects with a point of view.",
    text: "An editorial commerce concept for considered objects. Oversized typography, generous space, and a tactile palette let the product tell its own story.",
    stack: ["Creative direction", "E-commerce", "Motion"],
  },
  {
    id: "05",
    name: "Parallel",
    category: "Creative development · 3D",
    image: "parallel",
    title: "An experiment in another dimension.",
    text: "A digital playground exploring spatial interfaces and real-time interaction. A study in bringing the curiosity of physical spaces to the browser.",
    stack: ["Three.js", "WebGL", "Interaction design"],
  },
];
type Project = (typeof projects)[number];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactService, setContactService] = useState("Websites");
  const [selected, setSelected] = useState<Project | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [briefReady, setBriefReady] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const contactDialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({ duration: 1.05, anchors: { offset: -80 } });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      const intro = gsap.timeline();
      intro
        .from(".hero-line", {
          y: 50,
          duration: 1.1,
          stagger: 0.1,
          ease: "power3.out",
        })
        .from(
          ".hero-copy, .hero-actions",
          { y: 16, stagger: 0.1, duration: 0.65 },
          "-=0.7",
        );
      const reveals = gsap.utils.toArray<HTMLElement>(".reveal").map((el) =>
        gsap.from(el, {
          y: 40,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
            end: "top 50%",
            scrub: 1,
          },
        }),
      );
      const storyMotion = gsap.context(() => {
        gsap.to(".hero-art", {
          y: 60,
          rotate: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
        gsap.fromTo(
          ".metallic-identity",
          { rotate: -9, scale: 0.85 },
          {
            rotate: 9,
            scale: 1.05,
            ease: "none",
            scrollTrigger: {
              trigger: "#studio",
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );
        gsap.fromTo(
          ".ticket-area",
          { rotate: -8, y: 70 },
          {
            rotate: 3,
            y: -20,
            ease: "none",
            scrollTrigger: {
              trigger: ".invitation-chapter",
              start: "top bottom",
              end: "bottom 40%",
              scrub: 1,
            },
          },
        );
        gsap.fromTo(
          ".contact-main h2",
          { x: -50 },
          {
            x: 0,
            ease: "none",
            scrollTrigger: {
              trigger: "#contact",
              start: "top bottom",
              end: "top 30%",
              scrub: 1,
            },
          },
        );
      });
      document.fonts.ready.then(() => ScrollTrigger.refresh());
      return () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        storyMotion.revert();
        intro.revert();
        reveals.forEach((tween) => {
          tween.scrollTrigger?.kill();
          tween.revert();
        });
      };
    });
    return () => media.revert();
  }, []);
  useEffect(() => {
    if (selected) dialog.current?.showModal();
  }, [selected]);
  useEffect(() => {
    if (contactOpen) contactDialog.current?.showModal();
  }, [contactOpen]);
  useEffect(() => {
    if (!selected && !contactOpen) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, [selected, contactOpen]);
  const openContact = () => {
    setBriefReady(false);
    setSendError("");
    setMenuOpen(false);
    setContactOpen(true);
  };
  const startProject = (service: string) => {
    setContactService(
      capabilities.some((c) => c.name === service) ? service : "Software",
    );
    openContact();
  };
  const closeProject = () => {
    dialog.current?.close();
    setSelected(null);
  };
  const closeContact = () => {
    contactDialog.current?.close();
    setContactOpen(false);
  };
  const submitBrief = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    const data = Object.fromEntries(new FormData(event.currentTarget));
    setSending(true);
    setSendError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true)
        throw new Error(
          result.error ||
            "Your message could not be sent. Please try again or email us directly.",
        );
      setBriefReady(true);
    } catch (error) {
      setSendError(
        error instanceof Error && error.name !== "SyntaxError"
          ? error.message
          : "Sending is temporarily unavailable. Please email imzyrixx@gmail.com.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <StoryIntro />
      <ChapterDial />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <a href="#" className="wordmark" aria-label="zyrixdev home">
          <span className="brand-symbol">
            <Arrow />
          </span>
          zyrixdev<span className="wordmark-dot">*</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#work">
            Work <span>05</span>
          </a>
          <a href="#studio">Studio</a>
          <a href="#services">Capabilities</a>
        </nav>
        <button className="nav-contact" onClick={openContact}>
          Let’s talk <Arrow />
        </button>
        <button
          className="menu-toggle upgraded-menu-toggle"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={() => setMenuOpen(true)}
        >
          Menu{" "}
          <span className="menu-bars">
            <i />
            <i />
          </span>
        </button>
      </header>
      {menuOpen && (
        <MotionOverlayMenu
          onClose={() => setMenuOpen(false)}
          onContact={openContact}
        />
      )}
      <main id="main">
        <section className="hero page-width" aria-labelledby="hero-heading">
          <div className="hero-top">
            <span className="eyebrow">
              <i className="status-dot" /> INDEPENDENT SOFTWARE & DESIGN STUDIO
            </span>
            <span className="hero-coordinate">
              WEBSITES / BOTS / AUTOMATIONS / SOFTWARE
            </span>
          </div>
          <div className="hero-content">
            <div className="hero-text">
              <h1 id="hero-heading">
                <span className="hero-line">From a spark.</span>
                <span className="hero-line serif orange">To a system.</span>
              </h1>
              <p className="hero-copy">
                We turn the “what if” into the thing you can’t put down.
                <br className="desktop-break" /> We build the software behind
                your next big idea.
              </p>
              <div className="hero-actions">
                <Magnet padding={24} magnetStrength={7}>
                  <a className="button button-light" href="#work">
                    Enter the explorations <Arrow />
                  </a>
                </Magnet>
                <a className="text-link" href="#lab">
                  Try the experiment <Arrow />
                </a>
              </div>
            </div>
            <div className="hero-art instrument-art">
              <Suspense
                fallback={
                  <img
                    src="/engine-poster.svg"
                    alt=""
                    className="sculpture-loading"
                  />
                }
              >
                <Sculpture />
              </Suspense>
            </div>
          </div>
          <div className="hero-bottom">
            <span>THOUGHTFULLY DESIGNED. PRECISELY BUILT.</span>
            <a href="#work">
              SCROLL TO EXPLORE <Icon icon={arrowDown} />
            </a>
            <span className="hero-bottom-right">
              BASED ONLINE. BUILDING EVERYWHERE.
            </span>
          </div>
        </section>

        <TechnologyLoop />

        <section
          className="work-section section-space"
          id="work"
          tabIndex={-1}
          aria-labelledby="work-heading"
        >
          <AnimatedContent distance={35}>
            <div className="section-heading page-width">
              <div>
                <span className="eyebrow section-index">
                  01 / SELECTED EXPLORATIONS
                </span>
                <h2 id="work-heading">
                  Ideas made <em>tangible.</em>
                </h2>
              </div>
              <p>
                Five independent concepts. One curious studio.
                <br />
                Explore the things we love to build.
              </p>
            </div>
          </AnimatedContent>
          <WorkCarousel
            onSelect={(name) =>
              setSelected(projects.find((p) => p.name === name) || projects[0])
            }
          />
          <p className="work-note page-width">
            <span>↳</span> Studio experiments, not client commissions. Made to
            explore what’s possible.
          </p>
        </section>

        <Capabilities onContact={startProject} />
        <SystemLab onContact={startProject} />

        <section
          id="studio"
          tabIndex={-1}
          className="studio-section section-space"
          aria-labelledby="studio-heading"
        >
          <div className="page-width studio-layout">
            <div className="studio-side">
              <span className="eyebrow section-index">03 / THE STUDIO</span>
              <MetallicIdentity />
            </div>
            <AnimatedContent distance={35}>
              <h2 id="studio-heading">
                Good design gets
                <br />
                your attention.
                <br />
                <em>Great experiences</em>
                <br />
                make you stay.
              </h2>
              <div className="studio-description">
                <p>
                  We’re zyrixdev. Designers, developers, and problem-solvers who
                  like making complicated things feel simple. From a sharp
                  website to a bot that saves your team hours, we build around
                  what you need.
                </p>
                <p>
                  Websites, bots, automations, tools, and custom software. We
                  connect the dots between how a product looks, how it works,
                  and how it helps the people using it.
                </p>
              </div>
              <a
                className="text-link studio-link"
                href="https://github.com/zyrixdevs"
                target="_blank"
                rel="noreferrer"
              >
                Find us on GitHub <Arrow />
              </a>
            </AnimatedContent>
          </div>
        </section>

        <StudioProcess />
        <Playground onContact={openContact} />

        <section
          id="contact"
          className="contact-section"
          aria-labelledby="contact-heading"
        >
          <div className="page-width">
            <div className="contact-top">
              <span className="eyebrow">
                <i className="status-dot" /> HAVE SOMETHING IN MIND?
              </span>
              <span className="eyebrow">LET’S MAKE IT REAL.</span>
            </div>
            <div className="contact-main">
              <h2 id="contact-heading">
                Your next big thing.
                <br />
                <em>Starts with a hello.</em>
              </h2>
              <Magnet padding={30} magnetStrength={8}>
                <button
                  className="contact-circle"
                  aria-label="Start a project"
                  onClick={openContact}
                >
                  <Arrow />
                </button>
              </Magnet>
            </div>
            <div className="contact-bottom">
              <a href="mailto:imzyrixx@gmail.com">
                imzyrixx@gmail.com <Arrow />
              </a>
              <p>Great work starts with a good conversation.</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="page-width">
        <FooterWordmark />
        <div className="footer-top">
          <a className="wordmark" href="#" aria-label="zyrixdev home">
            <span className="brand-symbol">
              <Arrow />
            </span>
            zyrixdev<span className="wordmark-dot">*</span>
          </a>
          <p>Digital craft. Human connection.</p>
          <a
            href="https://github.com/zyrixdevs"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <Arrow />
          </a>
          <a href="#main">Back to top ↑</a>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} zyrixdev. All rights reserved.
          </span>
          <span>DESIGNED WITH INTENT. BUILT WITH CARE.</span>
          <span className="footer-status">
            <i /> ALWAYS EXPLORING
          </span>
        </div>
      </footer>

      <dialog
        ref={dialog}
        className="project-dialog"
        aria-labelledby="project-dialog-title"
        onCancel={closeProject}
        onClose={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeProject();
        }}
      >
        {selected && (
          <div className="dialog-content">
            <button
              className="dialog-close"
              aria-label="Close project"
              onClick={closeProject}
            >
              <Icon icon={close} />
            </button>
            <span className="eyebrow">
              INDEPENDENT CONCEPT STUDY / {selected.id}
            </span>
            <h2 id="project-dialog-title">{selected.name}</h2>
            <img
              className="dialog-project-image"
              src={`/work/${selected.image}.png`}
              alt={`${selected.name} concept interface`}
            />
            <h3>{selected.title}</h3>
            <p>{selected.text}</p>
            <div className="tags">
              {selected.stack.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <p className="concept-note">
              This is an original visual exploration, not a live product or a
              client commission.
            </p>
            <button
              className="button button-light"
              onClick={() => {
                closeProject();
                openContact();
              }}
            >
              Build something like this <Arrow />
            </button>
          </div>
        )}
      </dialog>

      <dialog
        ref={contactDialog}
        className="contact-dialog"
        aria-labelledby="contact-dialog-title"
        onCancel={closeContact}
        onClose={() => setContactOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeContact();
        }}
      >
        <div className="dialog-content">
          <button
            className="dialog-close"
            aria-label="Close contact form"
            onClick={closeContact}
          >
            <Icon icon={close} />
          </button>
          <span className="eyebrow orange">LET’S MAKE SOMETHING MATTER</span>
          <h2 id="contact-dialog-title">
            A good place
            <br />
            <em>to start.</em>
          </h2>
          {briefReady && (
            <div className="brief-ready" role="status">
              <h3>Your next chapter starts here.</h3>
              <p>
                Your message has been accepted for delivery to
                imzyrixx@gmail.com. We’ll reply to the email you provided.
              </p>
              <button
                className="text-link"
                onClick={() => setBriefReady(false)}
              >
                Write another message
              </button>
            </div>
          )}
          <form hidden={briefReady} onSubmit={submitBrief} aria-busy={sending}>
            <label className="contact-honeypot" aria-hidden="true">
              Company website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
            <div className="form-row">
              <label>
                Your name
                <input
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={100}
                  placeholder="Alex Morgan"
                />
              </label>
              <label>
                Email address
                <input
                  name="email"
                  autoComplete="email"
                  type="email"
                  required
                  maxLength={200}
                  placeholder="you@company.com"
                />
              </label>
            </div>
            <label>
              What are you thinking?
              <select
                name="service"
                value={contactService}
                onChange={(e) => setContactService(e.target.value)}
              >
                {capabilities.map((c) => (
                  <option key={c.name}>{c.name}</option>
                ))}
                <option>Something else entirely</option>
              </select>
            </label>
            <label>
              A little about your idea
              <textarea
                name="message"
                required
                rows={4}
                maxLength={1500}
                placeholder="The big idea, the little details, and anything in between…"
              />
            </label>
            <div className="form-submit">
              <p>
                {sending
                  ? "Sending your idea…"
                  : "Straight to our inbox. The start of something good."}
              </p>
              <CircleButtons
                variant="mail"
                ariaLabel="Send project message"
                disabled={sending}
                type="submit"
                className="contact-submit"
              />
            </div>
            {sendError && (
              <p role="alert" className="contact-error">
                {sendError}
              </p>
            )}
          </form>
          <a className="direct-email" href="mailto:imzyrixx@gmail.com">
            Or email us directly: imzyrixx@gmail.com ↗
          </a>
        </div>
      </dialog>
    </>
  );
}
