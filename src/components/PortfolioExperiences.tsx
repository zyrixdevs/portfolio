import { lazy, Suspense, useState } from "react";
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
import FlowingMenu from "./react-bits/FlowingMenu";
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
    <div className="work-experience">
      <div className="gallery-instructions">
        <span>FIVE IDEAS. FIVE DIFFERENT POSSIBILITIES.</span>
        <span>DRAG TO EXPLORE / ← → KEYS</span>
      </div>
      <LiveScene className="flex-gallery" fallback={fallback}>
        <Suspense fallback={fallback}>
          <FlexCarousel
            items={conceptItems}
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
  const item = capabilities[selected];
  return (
    <section
      id="services"
      tabIndex={-1}
      className="capabilities-section page-width section-space"
      aria-labelledby="capabilities-heading"
    >
      <div className="section-heading reveal">
        <div>
          <span className="eyebrow section-index">02 / WHAT WE CAN MAKE</span>
          <h2 id="capabilities-heading">
            If you can imagine it.
            <br />
            <em>We can build it.</em>
          </h2>
        </div>
        <p>
          Websites. Bots. Automations. Tools.
          <br />
          One studio. Every piece of the puzzle.
        </p>
      </div>
      <div className="capability-stage">
        <div className="wheel-panel">
          <span className="wheel-instruction">
            CHOOSE A DIRECTION <span>↕</span>
          </span>
          <div className="wheel-shell" data-lenis-prevent>
            <OptionWheel
              items={capabilities.map((c) => c.name)}
              defaultSelected={0}
              onChange={setSelected}
              activeColor="#ff653b"
              textColor="#b4b4a9"
              fontSize={3.3}
              inset={25}
              spacing={1.4}
              curve={0.7}
              blur={0}
              fade={0.06}
              minOpacity={0.85}
              tilt={3}
            />
          </div>
          <span className="wheel-footnote">
            SCROLL, DRAG, OR USE THE ARROW KEYS
          </span>
        </div>
        <div
          className="capability-detail"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="eyebrow orange">{item.label}</span>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
          <div className="tags">
            {item.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <button className="text-link" onClick={() => onContact(item.name)}>
            Let’s build {item.name.toLowerCase()} <Icon icon={arrow} />
          </button>
          <img
            src={`/work/${item.image}.png`}
            alt={`${item.name} concept study`}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

export function MetallicIdentity() {
  return (
    <div className="metallic-identity" aria-label="Zyrix Z symbol" role="img">
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
  return (
    <section
      className="process-section page-width"
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
    </section>
  );
}

export function Playground({ onContact }: { onContact: () => void }) {
  const [torn, setTorn] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const spiralItems = [...conceptItems, ...conceptItems].map((item, i) => ({
    ...item,
    id: i,
    label: `${item.title} concept`,
  }));
  return (
    <section
      id="playground"
      tabIndex={-1}
      className="playground-section section-space"
    >
      <div className="page-width">
        <div className="section-heading reveal">
          <div>
            <span className="eyebrow section-index">
              05 / CURIOSITY IS PART OF THE PROCESS
            </span>
            <h2>
              A little play.
              <br />
              <em>A lot of possibility.</em>
            </h2>
          </div>
          <p>
            Drag, flip, pull. Go on.
            <br />
            The details are meant to be felt.
          </p>
        </div>
        <div className="playground-grid">
          <div className="spiral-experiment">
            <div className="experiment-label">
              <span>01 / INFINITE POSSIBILITIES</span>
              <span>DRAG TO EXPLORE</span>
            </div>
            <LiveScene
              className="spiral-stage"
              fallback={
                <img
                  src="/work/pulse.png"
                  alt="Pulse automation concept"
                  loading="lazy"
                />
              }
            >
              <Suspense
                fallback={
                  <img src="/work/relay.png" alt="Relay concept study" />
                }
              >
                <InfiniteSpiral
                  items={spiralItems}
                  animationMode="drag"
                  radius={170}
                  cardWidth={170}
                  cardHeight={127}
                  verticalSpacing={74}
                  cardsPerTurn={5}
                  edgeBlur={2}
                  cardRadius={6}
                  centerScale={1.2}
                  speed={0.35}
                />
              </Suspense>
            </LiveScene>
            <p>Ideas don’t move in straight lines.</p>
          </div>
          <div className="flip-experiment">
            <div className="experiment-label">
              <span>02 / A DIFFERENT PERSPECTIVE</span>
              <span>CLICK TO FLIP</span>
            </div>
            <FlipCard
              flipped={flipped}
              onFlipChange={setFlipped}
              width={350}
              height={360}
              radius={10}
              background="#f0eee7"
              color="#1f211b"
              className="studio-flip-card"
              ariaLabel="Flip the studio philosophy card"
              tiltMax={6}
              hoverScale={1.01}
              front={
                <div className="philosophy-face">
                  <span>THE ZYRIX WAY / 001</span>
                  <b>
                    Good code.
                    <br />
                    Great design.
                    <br />
                    <em>No shortcuts.</em>
                  </b>
                  <span className="philosophy-bottom">
                    THERE’S MORE TO IT <Icon icon={arrow} />
                  </span>
                </div>
              }
              back={
                <div className="philosophy-face philosophy-back">
                  <span>THE THINKING BEHIND THE MAKING</span>
                  <h3>
                    Made for people.
                    <br />
                    Built with purpose.
                  </h3>
                  <p>
                    Clear interfaces. Thoughtful interactions. Reliable systems.
                    We believe the best software gets the details right.
                  </p>
                  <span className="philosophy-bottom">
                    THAT’S OUR KIND OF SOFTWARE. <Icon icon={arrow} />
                  </span>
                </div>
              }
            />
            <p>Design and engineering. Two sides of the same idea.</p>
          </div>
        </div>
        <div className="invitation">
          <div>
            <span className="eyebrow orange">YOUR NEXT CHAPTER</span>
            <h3>
              Consider this
              <br />
              <em>your invitation.</em>
            </h3>
            <p>
              Pull the ticket. Start a conversation.
              <br />
              Let’s see where your idea takes us.
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
              height={215}
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
                <span>ZYRIX / AN OPEN INVITATION</span>
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
        </div>
      </div>
    </section>
  );
}

export function ServiceFlow({
  onContact,
}: {
  onContact: (name: string) => void;
}) {
  return (
    <section className="service-flow" aria-labelledby="flow-heading">
      <div className="page-width flow-heading">
        <span className="eyebrow" id="flow-heading">
          WHAT’S YOUR NEXT MOVE?
        </span>
        <span className="eyebrow">LET’S MAKE IT HAPPEN.</span>
      </div>
      <LiveScene
        className="flow-menu"
        fallback={
          <div className="flow-fallback">
            {capabilities.map((c) => (
              <button key={c.name} onClick={() => onContact(c.name)}>
                {c.name} ↗
              </button>
            ))}
          </div>
        }
      >
        <div
          className="flow-live"
          onClick={(e) => {
            const link = (e.target as HTMLElement).closest("a");
            if (link) {
              e.preventDefault();
              onContact(link.textContent?.trim() || "Software");
            }
          }}
        >
          <FlowingMenu
            items={capabilities.map((c) => ({
              text: c.name,
              link: "#contact",
              image: `/work/${c.image}.png`,
            }))}
            textColor="#eeece4"
            bgColor="#111110"
            marqueeBgColor="#ff653b"
            marqueeTextColor="#1b1b15"
            borderColor="#ffffff24"
            speed={25}
          />
        </div>
      </LiveScene>
    </section>
  );
}

export function FooterWordmark() {
  return (
    <LiveScene
      className="footer-techtext"
      fallback={<span className="techtext-fallback">ZYRIX.DEV</span>}
    >
      <Suspense fallback={<span className="techtext-fallback">ZYRIX.DEV</span>}>
        <TechText
          text="ZYRIX.DEV"
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
