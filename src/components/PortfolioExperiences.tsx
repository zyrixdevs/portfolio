import { lazy, Suspense, useState, useEffect, useRef } from "react";
import {
  SiReact,
  SiTypescript,
  SiPython,
  SiNodedotjs,
  SiTailwindcss,
  SiCloudflare,
  SiPostgresql,
  SiDocker,
} from "react-icons/si";
import { Icon } from "@iconify/react";
import arrow from "@iconify-icons/solar/arrow-right-up-linear";
import LogoLoop from "./react-bits/LogoLoop";
import OptionWheel from "./react-bits/OptionWheel";
import LineSidebar from "./react-bits/LineSidebar";
import { useStoryProgress } from "./useStoryProgress";
import FlipCard from "./react-bits/FlipCard";
import TearTicket from "./react-bits/TearTicket";
import LiveScene from "./LiveScene";

const FlexCarousel = lazy(() => import("./react-bits/FlexCarousel"));
const InfiniteSpiral = lazy(() => import("./react-bits/InfiniteSpiral"));
const MetallicPaint = lazy(() => import("./react-bits/MetallicPaint"));
const TechText = lazy(() => import("./react-bits/TechText"));

export const capabilities = [
  {
    name: "Websites",
    label: "BUILT TO MAKE AN IMPRESSION",
    title: "Your presence. With a pulse.",
    text: "Distinctive websites, immersive experiences, and storefronts that feel as good as they work. Fast to load. Hard to forget.",
    tags: ["Brand websites", "E-commerce", "3D & WebGL"],
    image: "forma",
  },
  {
    name: "Bots",
    label: "A LITTLE HELP. A LOT OF POSSIBILITY.",
    title: "Put a new teammate to work.",
    text: "Discord and Telegram bots, AI assistants, and community tools that turn repetitive conversations into useful action.",
    tags: ["Community bots", "AI assistants", "Command systems"],
    image: "relay",
  },
  {
    name: "Automations",
    label: "LESS REPETITION. MORE MOMENTUM.",
    title: "Let your workflow flow.",
    text: "Connect your tools, move information, and take the manual steps out of everyday work. Clear rules, useful integrations, and room to grow.",
    tags: ["Workflow design", "API integrations", "Scheduled jobs"],
    image: "pulse",
  },
  {
    name: "Tools",
    label: "BUILT AROUND THE WAY YOU WORK",
    title: "The right tool changes everything.",
    text: "Purpose-built dashboards, browser extensions, developer utilities, and internal platforms. Software that solves your actual problem.",
    tags: ["Internal dashboards", "Browser extensions", "Developer tools"],
    image: "orbit",
  },
  {
    name: "Software",
    label: "FROM THE FIRST IDEA TO THE FINAL DETAIL",
    title: "Your ambitious idea, engineered.",
    text: "Custom web applications, SaaS products, APIs, and connected systems. We bring design and engineering together, from prototype to production.",
    tags: ["Custom applications", "SaaS platforms", "Backend systems"],
    image: "parallel",
  },
];
export const conceptItems = [
  {
    src: "/work/orbit.png",
    alt: "Orbit analytics interface concept",
    title: "Orbit",
    subtitle: "PRODUCT DESIGN / CUSTOM SOFTWARE",
  },
  {
    src: "/work/relay.png",
    alt: "Relay community bot concept",
    title: "Relay",
    subtitle: "BOTS / COMMUNITY TOOLS",
  },
  {
    src: "/work/pulse.png",
    alt: "Pulse workflow automation concept",
    title: "Pulse",
    subtitle: "AUTOMATIONS / API INTEGRATIONS",
  },
  {
    src: "/work/forma.png",
    alt: "Forma editorial website concept",
    title: "Forma",
    subtitle: "WEBSITES / E-COMMERCE",
  },
  {
    src: "/work/parallel.png",
    alt: "Parallel spatial interaction concept",
    title: "Parallel",
    subtitle: "CREATIVE DEVELOPMENT / 3D",
  },
];

export function WorkCarousel({
  onSelect,
}: {
  onSelect: (name: string) => void;
}) {
  const [active, setActive] = useState(0);
  const { ref, progress } = useStoryProgress();
  const fallback = (
    <div className="carousel-fallback">
      {conceptItems.map((item) => (
        <button
          key={item.title}
          onClick={() => onSelect(item.title)}
          aria-label={`View ${item.title} details`}
        >
          <img src={item.src} alt={item.alt} loading="lazy" />
        </button>
      ))}
    </div>
  );
  return (
    <div ref={ref} className="story-scroll work-scroll">
      <div className="story-stage work-experience">
        <div className="chapter-top">
          <span>01 / IDEAS BECOME INTERFACES</span>
          <span>SCROLL ↓ TO EXPLORE →</span>
        </div>
        <div className="gallery-instructions">
          <span>FIVE IDEAS. FIVE DIFFERENT POSSIBILITIES.</span>
          <span>SCROLL OR DRAG / ← → KEYS</span>
        </div>
        <LiveScene className="flex-gallery" fallback={fallback}>
          <Suspense fallback={fallback}>
            <FlexCarousel
              items={conceptItems}
              scrollPosition={progress * 4}
              preset="ribbon"
              intro="none"
              cardHeight={0.78}
              gap={32}
              radius={8}
              squeeze={0.05}
              bend={0.11}
              tilt={0.03}
              liquid={0}
              captureWheel={false}
              captions={false}
              onChange={(i) => setActive(i)}
              onSelect={(i) => onSelect(conceptItems[i].title)}
            />
          </Suspense>
        </LiveScene>
        <div className="work-directory">
          {conceptItems.map((item, i) => (
            <button
              key={item.title}
              className={active === i ? "is-active" : ""}
              onClick={() => onSelect(item.title)}
              aria-label={`Explore ${item.title} concept study`}
            >
              <span className="work-directory-number">0{i + 1}</span>
              <span>
                <b>{item.title}</b>
                <small>{item.subtitle}</small>
              </span>
              <Icon icon={arrow} />
            </button>
          ))}
        </div>
        <div className="chapter-progress" style={{ scale: `${progress} 1` }} />
      </div>
    </div>
  );
}

export function TechnologyLoop() {
  const [paused, setPaused] = useState(false);
  const logos = [
    [SiReact, "React"],
    [SiTypescript, "TypeScript"],
    [SiPython, "Python"],
    [SiNodedotjs, "Node.js"],
    [SiTailwindcss, "Tailwind"],
    [SiCloudflare, "Cloudflare"],
    [SiPostgresql, "PostgreSQL"],
    [SiDocker, "Docker"],
  ] as const;
  return (
    <section
      className="technology-section"
      aria-label="Technologies we work with"
    >
      <span className="eyebrow">GOOD IDEAS. THE RIGHT TOOLS.</span>
      <button
        className="loop-pause"
        aria-pressed={paused}
        onClick={() => setPaused(!paused)}
        aria-label={
          paused ? "Resume technology animation" : "Pause technology animation"
        }
      >
        {paused ? "RESUME / +" : "PAUSE / II"}
      </button>
      <LiveScene className="technology-loop">
        <LogoLoop
          logos={logos.map(([Logo, name]) => ({
            node: (
              <span className="technology-logo">
                <Logo aria-hidden="true" />
                <span>{name}</span>
              </span>
            ),
            title: name,
          }))}
          speed={paused ? 0 : 28}
          logoHeight={24}
          gap={64}
          fadeOut
          fadeOutColor="#111110"
          hoverSpeed={0}
          ariaLabel="Technologies we work with, not sponsorships"
        />
      </LiveScene>
    </section>
  );
}

export function Capabilities({
  onContact,
}: {
  onContact: (service: string) => void;
}) {
  const [selected, setSelected] = useState(0);
  const [compact, setCompact] = useState(() => window.innerWidth <= 800);
  useEffect(() => {
    const media = matchMedia("(max-width:800px)");
    const update = () => setCompact(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const { ref, progress } = useStoryProgress();
  const item = capabilities[selected];
  return (
    <section
      id="services"
      tabIndex={-1}
      aria-labelledby="capabilities-heading"
      className="capabilities-section"
    >
      <div ref={ref} className="story-scroll services-scroll">
        <div className="story-stage service-stage">
          <div className="chapter-top">
            <span>02 / A WORLD OF POSSIBILITIES</span>
            <span>SCROLL ↓ / DRAG ↕ / ARROW KEYS</span>
          </div>
          <h2 id="capabilities-heading" className="service-headline">
            You imagine.
            <br />
            <em>We make.</em>
          </h2>
          <div className="capability-stage">
            <div className="wheel-panel">
              <div className="wheel-shell">
                <OptionWheel
                  items={capabilities.map((c) => c.name)}
                  defaultSelected={0}
                  loop
                  captureWheel={false}
                  scrollPosition={progress * 9}
                  onChange={setSelected}
                  activeColor="#ff653b"
                  textColor="#a9a99f"
                  fontSize={compact ? 2.6 : 4.8}
                  inset={20}
                  spacing={1.5}
                  curve={0.5}
                  blur={0}
                  fade={0.2}
                  minOpacity={0.45}
                  tilt={5}
                />
              </div>
              <span className="wheel-footnote">
                FIVE DISCIPLINES. ENDLESS CONNECTIONS.
              </span>
            </div>
            <div
              className="capability-detail"
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="service-counter" aria-hidden="true">
                0{selected + 1}
                <small>/ 05</small>
              </span>
              <span className="eyebrow orange">{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <div className="tags">
                {item.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <button
                className="text-link"
                onClick={() => onContact(item.name)}
              >
                Let’s build {item.name.toLowerCase()} <Icon icon={arrow} />
              </button>
            </div>
          </div>
          <div
            className="chapter-progress"
            style={{ scale: `${progress} 1` }}
          />
        </div>
      </div>
    </section>
  );
}

export function MetallicIdentity() {
  return (
    <div
      className="metallic-identity"
      aria-label="zyrixdev Z symbol"
      role="img"
    >
      <span className="metallic-static" aria-hidden="true">
        Z
      </span>
      <LiveScene className="metallic-canvas">
        <Suspense fallback={null}>
          <MetallicPaint
            imageSrc="/zyrix-mark.svg"
            color="#f89560"
            backgroundColor="#eeece4"
            lightMode
            density={2.5}
            speed={0.16}
            distortion={0.22}
            edgeBend={0.65}
            scale={0.8}
            dpr={1.5}
            intro={false}
          />
        </Suspense>
      </LiveScene>
      <span className="eyebrow metallic-caption">
        ONE STUDIO. MANY DIMENSIONS.
      </span>
    </div>
  );
}

const steps = [
  {
    title: "First, the right questions.",
    text: "What should this do? Who is it for? What gets in the way today? We start by understanding the problem, the people, and the possibilities.",
    deliverable: "A clear brief and a shared direction.",
  },
  {
    title: "Give the idea a shape.",
    text: "We map the experience, sketch the interface, and plan the architecture. Small prototypes answer the big questions before we commit to the build.",
    deliverable: "An intentional design and a realistic plan.",
  },
  {
    title: "Make it real. Make it right.",
    text: "Design meets engineering. We build in clear iterations, share progress, and refine the details with you — from the first interaction to the last edge case.",
    deliverable: "Working software you can see and try.",
  },
  {
    title: "A beginning, not an ending.",
    text: "We test across devices, prepare the deployment, and make the handover clear. Your team gets the code, the context, and a product ready for its next chapter.",
    deliverable: "A tested release and a thoughtful handover.",
  },
];
export function StudioProcess() {
  const [active, setActive] = useState(0);
  const { ref, progress } = useStoryProgress();
  const scrollStep = Math.min(3, Math.floor(progress * 4));
  useEffect(() => setActive(scrollStep), [scrollStep]);
  return (
    <section
      ref={ref}
      className="story-scroll process-scroll"
      aria-label="Our process"
    >
      <div
        className="story-stage process-section page-width"
        aria-labelledby="process-heading"
      >
        <span className="eyebrow section-index">04 / HOW WE GET THERE</span>
        <div className="process-interactive">
          <div className="process-navigation">
            <h2 id="process-heading">
              Clear steps.
              <br />
              <em>Great things.</em>
            </h2>
            <LineSidebar
              items={["Discover", "Define", "Create", "Launch"]}
              defaultActive={0}
              active={active}
              onItemClick={setActive}
              accentColor="#ff653b"
              textColor="#b8b8ad"
              markerColor="#6f6f63"
              fontSize={1.15}
              markerLength={45}
              maxShift={12}
              itemGap={23}
              className="process-sidebar"
            />
          </div>
          <div className="process-detail" aria-live="polite">
            <span className="process-big-number">0{active + 1}</span>
            <h3>{steps[active].title}</h3>
            <p>{steps[active].text}</p>
            <span className="process-deliverable">
              <i />
              {steps[active].deliverable}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

const photographs = [
  {
    src: "/images/coast.jpg",
    alt: "Sunrise over the rocky South African coastline",
    label: "Find a new perspective",
  },
  {
    src: "/images/venice.jpg",
    alt: "Warm sunset over the architecture of Venice",
    label: "See the possibilities",
  },
  {
    src: "/images/garden.jpg",
    alt: "Soft morning light in a green garden",
    label: "Leave room to grow",
  },
  {
    src: "/images/city.jpg",
    alt: "Historic architecture around San Giuseppe Bridge in Venice",
    label: "Build with intention",
  },
  {
    src: "/images/bridge.jpg",
    alt: "A pedestrian bridge connecting the city",
    label: "Connect the dots",
  },
  {
    src: "/images/quarry.jpg",
    alt: "Rock formations in an open quarry",
    label: "Shape something new",
  },
];

const spiralItems = photographs.map((p, id) => ({ ...p, id }));

export function Playground({ onContact }: { onContact: () => void }) {
  const { ref, progress } = useStoryProgress();
  const [torn, setTorn] = useState(false);
  return (
    <>
      <section
        id="playground"
        tabIndex={-1}
        className="spiral-chapter"
        aria-labelledby="spiral-heading"
      >
        <div ref={ref} className="story-scroll spiral-scroll">
          <div className="story-stage spiral-scene">
            <div className="chapter-top">
              <span>05 / CHANGE YOUR PERSPECTIVE</span>
              <span>SCROLL ↓ / DRAG ↔</span>
            </div>
            <div className="spiral-copy">
              <h2 id="spiral-heading">
                Ideas don’t move
                <br />
                <em>in straight lines.</em>
              </h2>
              <p>
                A wider world. A different angle.
                <br />
                That’s where the next idea begins.
              </p>
            </div>
            <LiveScene
              className="spiral-stage"
              fallback={
                <img
                  src="/images/coast.jpg"
                  alt="Coastal sunrise"
                  loading="lazy"
                />
              }
            >
              <Suspense fallback={null}>
                <InfiniteSpiral
                  items={spiralItems}
                  scrollPosition={progress * 18}
                  animationMode="scroll"
                  speed={0.16}
                  radius={280}
                  cardWidth={280}
                  cardHeight={205}
                  verticalSpacing={145}
                  cardsPerTurn={6}
                  edgeBlur={0}
                  cardRadius={4}
                  centerScale={1.05}
                  pauseOnHover={false}
                />
              </Suspense>
            </LiveScene>
            <div className="spiral-caption">
              <span>INSPIRATION IS EVERYWHERE.</span>
              <span>
                {String(Math.floor(progress * 99)).padStart(2, "0")} / ∞
              </span>
            </div>
          </div>
        </div>
      </section>
      <PerspectiveCards />
      <section className="invitation invitation-chapter page-width">
        <div>
          <span className="eyebrow orange">07 / YOUR NEXT CHAPTER</span>
          <h3>
            Consider this
            <br />
            <em>your invitation.</em>
          </h3>
          <p>
            One conversation can change the direction.
            <br />
            Pull the ticket. Let’s find out where it goes.
          </p>
        </div>
        <div className="ticket-area">
          <TearTicket
            torn={torn}
            onTear={() => {
              setTorn(true);
              onContact();
            }}
            width={520}
            height={250}
            stubSize={145}
            radius={12}
            background="#ff653b"
            stubBackground="#f28160"
            color="#241c15"
            rotate={-3}
            tiltMax={4}
            holes={11}
            holeSize={3}
            recenter={false}
            ariaLabel="Tear ticket to start a project"
            stub={
              <div className="ticket-stub">
                <span>
                  START
                  <br />
                  SOMETHING.
                </span>
                <Icon icon={arrow} />
                <small>PULL HERE</small>
              </div>
            }
          >
            <div className="ticket-body">
              <span>ZYRIXDEV / AN OPEN INVITATION</span>
              <strong>
                One bold idea.
                <br />
                <em>Endless potential.</em>
              </strong>
              <small>ADMIT ONE GREAT CONVERSATION</small>
            </div>
          </TearTicket>
          {torn && (
            <button className="ticket-reset" onClick={() => setTorn(false)}>
              Restore invitation ↺
            </button>
          )}
        </div>
      </section>
    </>
  );
}

const principles = [
  [
    "01",
    "Make it clear.",
    "Good software feels obvious.",
    "We simplify the complex, so people can focus on what they came to do.",
    "Clarity",
  ],
  [
    "02",
    "Make it move.",
    "Every detail has a purpose.",
    "Motion guides attention, explains a change, and makes a product feel alive.",
    "Feeling",
  ],
  [
    "03",
    "Make it matter.",
    "Build for the real world.",
    "Reliable foundations. Thoughtful performance. Software your team can grow with.",
    "Purpose",
  ],
];
function PerspectiveCards() {
  const { ref, progress } = useStoryProgress();
  const rail = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState([false, false, false]);
  const step = Math.floor(progress * 6);
  useEffect(() => {
    setFlipped(principles.map((_, i) => step >= i * 2 + 1));
  }, [step]);
  useEffect(() => {
    if (rail.current && !matchMedia("(prefers-reduced-motion: reduce)").matches)
      rail.current.scrollLeft =
        progress * (rail.current.scrollWidth - rail.current.clientWidth);
  }, [progress]);
  return (
    <section
      ref={ref}
      className="story-scroll principles-scroll"
      aria-labelledby="principles-heading"
    >
      <div className="story-stage principles-stage">
        <div className="chapter-top">
          <span>06 / THE OTHER SIDE OF GOOD SOFTWARE</span>
          <span>SCROLL ↓ / SWIPE ↔ / CLICK TO FLIP</span>
        </div>
        <h2 id="principles-heading">
          A little depth.
          <br />
          <em>A lot of intention.</em>
        </h2>
        <div
          className="principles-rail"
          ref={rail}
          tabIndex={0}
          aria-label="Studio philosophy cards, scroll horizontally"
        >
          {principles.map(([n, title, back, text, label], i) => (
            <div className="principle-item" key={n}>
              <FlipCard
                flipped={flipped[i]}
                onFlipChange={(v) =>
                  setFlipped((prev) => prev.map((f, j) => (j === i ? v : f)))
                }
                width={430}
                height={430}
                radius={4}
                background={["#ece8dc", "#bfcca8", "#f58159"][i]}
                color="#20221c"
                ariaLabel={`Flip the ${label.toLowerCase()} card`}
                tiltMax={5}
                hoverScale={1.01}
                front={
                  <div className="philosophy-face">
                    <span>ZYRIXDEV / {n}</span>
                    <b>
                      {title}
                      <br />
                      <em>{label}.</em>
                    </b>
                    <span className="philosophy-bottom">
                      TURN AN IDEA INTO SOMETHING <Icon icon={arrow} />
                    </span>
                  </div>
                }
                back={
                  <div className="philosophy-face philosophy-back">
                    <span>THE THINKING BEHIND THE MAKING / {n}</span>
                    <h3>{back}</h3>
                    <p>{text}</p>
                    <span className="philosophy-bottom">
                      THAT’S OUR KIND OF SOFTWARE. <Icon icon={arrow} />
                    </span>
                  </div>
                }
              />
            </div>
          ))}
        </div>
        <div className="chapter-progress" style={{ scale: `${progress} 1` }} />
      </div>
    </section>
  );
}

export function FooterWordmark() {
  return (
    <LiveScene
      className="footer-techtext"
      fallback={<span className="techtext-fallback">ZYRIXDEV</span>}
    >
      <Suspense fallback={<span className="techtext-fallback">ZYRIXDEV</span>}>
        <TechText
          text="ZYRIXDEV"
          fontFamily="Manrope Variable"
          fontWeight={650}
          fontSize={210}
          letterSpacing={-0.055}
          color="#e3e1d8"
          accentColor="#ff653b"
          reveal="letter"
          specks={5}
          sweep={false}
          labels={false}
          draggable={false}
        />
      </Suspense>
    </LiveScene>
  );
}
