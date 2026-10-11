import { lazy, Suspense, useEffect, useRef, useState, type FormEvent } from 'react';
import { Icon } from '@iconify/react';
import arrowRightUp from '@iconify-icons/solar/arrow-right-up-linear';
import arrowDown from '@iconify-icons/solar/arrow-down-linear';
import close from '@iconify-icons/solar/close-circle-linear';
import code from '@iconify-icons/solar/code-square-linear';
import layers from '@iconify-icons/solar/layers-linear';
import planet from '@iconify-icons/solar/planet-linear';
import stars from '@iconify-icons/solar/stars-minimalistic-linear';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import Magnet from './components/react-bits/Magnet';
import SpotlightCard from './components/react-bits/SpotlightCard';
import AnimatedContent from './components/react-bits/AnimatedContent';
import { CircleButtons } from './components/threeui/CircleButtons';

const Sculpture = lazy(() => import('./components/Sculpture'));
gsap.registerPlugin(ScrollTrigger);
const Arrow = ({ className = '' }: { className?: string }) => <Icon icon={arrowRightUp} className={className} aria-hidden="true" />;
const projects = [
  { id: '01', name: 'Orbit', category: 'Product design · Development', type: 'product', title: 'A little less noise. A lot more clarity.', text: 'A concept for a calmer analytics workspace. An intentional hierarchy brings the important signals forward, while a flexible dashboard makes complex information feel approachable.', stack: ['React', 'TypeScript', 'Design system'], color: '#c6cdbb' },
  { id: '02', name: 'Forma', category: 'Art direction · E-commerce', type: 'brand', title: 'Objects with a point of view.', text: 'An editorial commerce concept for considered objects. Oversized typography, generous space, and a tactile palette let the product tell its own story.', stack: ['Creative direction', 'Commerce UI', 'Motion'], color: '#d7b7a5' },
  { id: '03', name: 'Parallel', category: 'Creative development · 3D', type: 'web', title: 'An experiment in another dimension.', text: 'A digital playground exploring spatial interfaces and real-time interaction. A study in bringing the curiosity of physical spaces to the browser.', stack: ['Three.js', 'WebGL', 'Interaction'], color: '#a1aeca' },
];
type Project = typeof projects[number];

function WorkVisual({ type }: { type: string }) {
  if (type === 'product') return <div className="orbit-ui" aria-hidden="true"><aside><b>◒ orbit</b><span className="active">◈ Overview</span><span>⌁ Analytics</span><span>▧ Projects</span><span>⊞ Workspace</span><small>YOUR WORK, IN ORBIT.</small></aside><div className="dashboard"><div className="dash-nav">Workspace overview <span>↗</span></div><p>Good things are taking shape.</p><div className="metrics"><div><small>Total views</small><b>24,892 <i>↗ 12.8%</i></b></div><div><small>Engagement</small><b>68.4% <i>↗ 8.2%</i></b></div></div><div className="chart-label">Activity overview <small>Last 7 days</small></div><div className="bars">{[30, 46, 38, 67, 52, 76, 65, 86, 72, 92, 77, 100, 84, 95].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div><div className="chart-axis"><span>MON</span><span>WED</span><span>FRI</span><span>SUN</span></div></div></div>;
  if (type === 'brand') return <div className="forma-ui" aria-hidden="true"><div className="forma-top">FORMA<span>OBJECTS / SPACE / CULTURE</span></div><div className="forma-title">Less, but<br /><em>better.</em></div><div className="forma-index">COLLECTION — 001<br />A STUDY IN EVERYDAY OBJECTS</div><div className="forma-object">f.</div><span className="forma-bottom">Considered by design. ↗</span></div>;
  return <div className="parallel-ui" aria-hidden="true"><div className="parallel-top">PARALLEL <span>EXPERIMENT 003</span></div><div className="parallel-orbits"><i /><i /><i /><i /><b><Arrow /></b></div><div className="parallel-title">A different<br /><em>dimension.</em></div><span className="parallel-bottom">EXPLORING WHAT COMES NEXT <span>↗</span></span></div>;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [briefReady, setBriefReady] = useState(false);
  const [emailLink, setEmailLink] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const contactDialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const lenis = new Lenis({ duration: 1.05, anchors: { offset: -80 } });
      lenis.on('scroll', ScrollTrigger.update);
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      const intro = gsap.timeline();
      intro.from('.hero-line', { y: 50, duration: 1.1, stagger: 0.1, ease: 'power3.out' })
        .from('.hero-copy, .hero-actions', { y: 16, opacity: 0, stagger: 0.1, duration: 0.65 }, '-=0.7');
      document.fonts.ready.then(() => ScrollTrigger.refresh());
      return () => { gsap.ticker.remove(tick); lenis.destroy(); intro.revert(); };
    });
    return () => media.revert();
  }, []);
  useEffect(() => { if (selected) dialog.current?.showModal(); }, [selected]);
  useEffect(() => { if (contactOpen) contactDialog.current?.showModal(); }, [contactOpen]);
  useEffect(() => {
    if (!selected && !contactOpen) return;
    const old = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = old; };
  }, [selected, contactOpen]);
  const openContact = () => { setBriefReady(false); setMenuOpen(false); setContactOpen(true); };
  const closeProject = () => { dialog.current?.close(); setSelected(null); };
  const closeContact = () => { contactDialog.current?.close(); setContactOpen(false); };
  const submitBrief = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = `Hi Zyrix,\n\nI'm ${data.get('name')}.\nEmail: ${data.get('email')}\nInterested in: ${data.get('service')}\n\n${data.get('message')}\n\nLet's make something great.`;
    const url = `mailto:imzyrixx@gmail.com?subject=${encodeURIComponent(`A new project — ${data.get('name')}`)}&body=${encodeURIComponent(body)}`;
    setEmailLink(url); setBriefReady(true);
  };

  return <>
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="site-header">
      <a href="#" className="wordmark" aria-label="Zyrix home"><span className="brand-symbol"><Arrow /></span>zyrix<span className="wordmark-dot">*</span></a>
      <nav className="desktop-nav" aria-label="Main navigation"><a href="#work">Work <span>03</span></a><a href="#studio">Studio</a><a href="#services">Expertise</a></nav>
      <button className="nav-contact" onClick={openContact}>Let’s talk <Arrow /></button>
      <button ref={menuButton} className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Close −' : 'Menu +'}</button>
      {menuOpen && <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation" onKeyDown={e => { if (e.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); } }}>{[['Work', '#work'], ['Studio', '#studio'], ['Expertise', '#services']].map(([text, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{text}<Arrow /></a>)}<button onClick={openContact}>Let’s talk <Arrow /></button></nav>}
    </header>
    <main id="main">
      <section className="hero page-width" aria-labelledby="hero-heading">
        <div className="hero-top"><span className="eyebrow"><i className="status-dot" /> INDEPENDENT DIGITAL STUDIO</span><span className="hero-coordinate">DESIGN × TECHNOLOGY × POSSIBILITY</span></div>
        <div className="hero-content">
          <div className="hero-text"><h1 id="hero-heading"><span className="hero-line">Beyond</span><span className="hero-line serif orange">ordinary.</span></h1><p className="hero-copy">We turn bold ideas into digital experiences<br className="desktop-break" /> that feel different. And work beautifully.</p><div className="hero-actions"><Magnet padding={24} magnetStrength={7}><a className="button button-light" href="#work">Explore our work <Arrow /></a></Magnet><a className="text-link" href="#studio">Meet the studio <Arrow /></a></div></div>
          <div className="hero-art"><div className="art-cross top-left">+</div><div className="art-cross bottom-right">+</div><span className="art-label">FIG. 01 — IDEAS IN MOTION</span><Suspense fallback={<img src="/sculpture.png" alt="" className="sculpture-loading" />}><Sculpture /></Suspense><div className="art-caption"><i /> A DIFFERENT PERSPECTIVE.</div><span className="art-number">[ Z / 001 ]</span></div>
        </div>
        <div className="hero-bottom"><span>THOUGHTFULLY DESIGNED. PRECISELY BUILT.</span><a href="#work">SCROLL TO EXPLORE <Icon icon={arrowDown} /></a><span className="hero-bottom-right">BASED ONLINE. BUILDING EVERYWHERE.</span></div>
      </section>

      <div className="discipline-strip" aria-label="Our disciplines"><div><span>Digital experiences</span><b><Icon icon={stars} aria-hidden="true" /></b><span>Creative development</span><b><Icon icon={stars} aria-hidden="true" /></b><span>Purposeful design</span><b><Icon icon={stars} aria-hidden="true" /></b><span>Made to matter</span><b><Icon icon={stars} aria-hidden="true" /></b></div></div>

      <section className="work-section page-width section-space" id="work" aria-labelledby="work-heading">
        <AnimatedContent distance={35}><div className="section-heading"><div><span className="eyebrow section-index">01 / EXPLORATIONS</span><h2 id="work-heading">Ideas made <em>tangible.</em></h2></div><p>A glimpse into our creative world.<br />Independent concepts. Endless possibilities.</p></div></AnimatedContent>
        <div className="work-grid">{projects.map((project, index) => <AnimatedContent key={project.id} distance={35} delay={index * 0.07} className={index === 0 ? 'featured-work' : ''}><button className={`project-card project-${project.type}`} onClick={() => setSelected(project)} aria-label={`Explore ${project.name} concept study`}><div className="project-art"><span className="concept-badge">CONCEPT STUDY / {project.id}</span><WorkVisual type={project.type} /><span className="project-open"><Arrow /></span></div><div className="project-info"><div><h3>{project.name}</h3><p>{project.category}</p></div><span className="project-year">EXPLORATION {project.id}</span></div></button></AnimatedContent>)}</div>
        <p className="work-note"><span>↳</span> Studio experiments, not client commissions. Made to explore what’s possible.</p>
      </section>

      <section id="studio" className="studio-section section-space" aria-labelledby="studio-heading"><div className="page-width studio-layout"><div className="studio-side"><span className="eyebrow section-index">02 / THE STUDIO</span><div className="studio-mark" aria-hidden="true">z<span><Arrow /></span></div><span className="eyebrow studio-caption">SMALL STUDIO. BIG-PICTURE THINKING.</span></div><AnimatedContent distance={35}><h2 id="studio-heading">Good design gets<br />your attention.<br /><em>Great experiences</em><br />make you stay.</h2><div className="studio-description"><p>We’re Zyrix. A digital studio at the intersection of design and development. We bring curious thinking, careful craft, and a love for the details that make something feel right.</p><p>From the first sketch to the final interaction, we connect the dots between how a product looks, how it works, and how it makes people feel.</p></div><a className="text-link studio-link" href="https://github.com/zyrixdevs" target="_blank" rel="noreferrer">Find us on GitHub <Arrow /></a></AnimatedContent></div></section>

      <section id="services" className="services-section page-width section-space" aria-labelledby="services-heading"><AnimatedContent distance={35}><div className="section-heading"><div><span className="eyebrow section-index">03 / WHAT WE DO</span><h2 id="services-heading">From what if.<br /><em>To what’s next.</em></h2></div><p>One connected approach.<br />From the spark to the shipped product.</p></div></AnimatedContent><div className="services-grid">{[
        { icon: layers, number: '01', title: 'Digital design', text: 'Distinctive identities and intuitive interfaces. Every pixel with purpose.', tags: ['UI / UX design', 'Design systems', 'Brand experiences'] },
        { icon: code, number: '02', title: 'Development', text: 'Fast, responsive, and built to last. Thoughtful code behind beautiful experiences.', tags: ['Web applications', 'E-commerce', 'Creative development'] },
        { icon: planet, number: '03', title: 'Immersive web', text: 'A new dimension of interaction. Experiences that invite people to explore.', tags: ['3D & WebGL', 'Motion design', 'Micro-interactions'] },
      ].map(service => <SpotlightCard key={service.number} className="service-card" spotlightColor="#ff653b" intensity={0.08} proximity={40}><div className="service-top"><Icon icon={service.icon} /><span>{service.number}</span></div><h3>{service.title}</h3><p>{service.text}</p><ul>{service.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></SpotlightCard>)}</div></section>

      <section className="process-section page-width"><span className="eyebrow section-index">A SIMPLE PROCESS. A SHARED VISION.</span><div className="process-grid">{[['01', 'Discover', 'We listen, ask questions, and find the real opportunity.'], ['02', 'Define', 'We shape a clear direction before a single line of code.'], ['03', 'Create', 'We design, build, and refine. Together, at every step.'], ['04', 'Launch', 'We test the details and bring your next chapter to life.']].map(([number, title, text]) => <div key={number}><span>{number} <Arrow /></span><h3>{title}</h3><p>{text}</p></div>)}</div></section>

      <section id="contact" className="contact-section" aria-labelledby="contact-heading"><div className="page-width"><div className="contact-top"><span className="eyebrow"><i className="status-dot" /> HAVE SOMETHING IN MIND?</span><span className="eyebrow">LET’S MAKE IT REAL.</span></div><div className="contact-main"><h2 id="contact-heading">Your next big thing.<br /><em>Starts with a hello.</em></h2><Magnet padding={30} magnetStrength={8}><button className="contact-circle" aria-label="Start a project" onClick={openContact}><Arrow /></button></Magnet></div><div className="contact-bottom"><a href="mailto:imzyrixx@gmail.com">imzyrixx@gmail.com <Arrow /></a><p>Great work starts with a good conversation.</p></div></div></section>
    </main>
    <footer className="page-width"><div className="footer-top"><a className="wordmark" href="#" aria-label="Zyrix home"><span className="brand-symbol"><Arrow /></span>zyrix<span className="wordmark-dot">*</span></a><p>Digital craft. Human connection.</p><a href="https://github.com/zyrixdevs" target="_blank" rel="noreferrer">GitHub <Arrow /></a><a href="#main">Back to top ↑</a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Zyrix. All rights reserved.</span><span>DESIGNED WITH INTENT. BUILT WITH CARE.</span><span className="footer-status"><i /> ALWAYS EXPLORING</span></div></footer>

    <dialog ref={dialog} className="project-dialog" aria-labelledby="project-dialog-title" onCancel={closeProject} onClose={() => setSelected(null)} onClick={e => { if (e.target === e.currentTarget) closeProject(); }}>{selected && <div className="dialog-content"><button className="dialog-close" aria-label="Close project" onClick={closeProject}><Icon icon={close} /></button><span className="eyebrow">INDEPENDENT CONCEPT STUDY / {selected.id}</span><h2 id="project-dialog-title">{selected.name}</h2><div className={`dialog-art project-${selected.type}`}><WorkVisual type={selected.type} /></div><h3>{selected.title}</h3><p>{selected.text}</p><div className="tags">{selected.stack.map(tag => <span key={tag}>{tag}</span>)}</div><p className="concept-note">This is an original visual exploration, not a live product or a client commission.</p><button className="button button-light" onClick={() => { closeProject(); openContact(); }}>Build something like this <Arrow /></button></div>}</dialog>

    <dialog ref={contactDialog} className="contact-dialog" aria-labelledby="contact-dialog-title" onCancel={closeContact} onClose={() => setContactOpen(false)} onClick={e => { if (e.target === e.currentTarget) closeContact(); }}><div className="dialog-content"><button className="dialog-close" aria-label="Close contact form" onClick={closeContact}><Icon icon={close} /></button><span className="eyebrow orange">LET’S MAKE SOMETHING MATTER</span><h2 id="contact-dialog-title">A good place<br /><em>to start.</em></h2>{briefReady && <div className="brief-ready" role="status"><h3>Your introduction is ready.</h3><p>Open your email app to review and send it to imzyrixx@gmail.com. Nothing has been sent yet.</p><a className="button button-light" href={emailLink}>Open email app <Arrow /></a><button className="text-link" onClick={() => setBriefReady(false)}>Edit your introduction</button></div>}<form hidden={briefReady} onSubmit={submitBrief}><div className="form-row"><label>Your name<input name="name" autoComplete="name" required maxLength={100} placeholder="Alex Morgan" /></label><label>Email address<input name="email" autoComplete="email" type="email" required maxLength={200} placeholder="you@company.com" /></label></div><label>What are you thinking?<select name="service" defaultValue="A new website"><option>A new website</option><option>A digital product</option><option>A 3D experience</option><option>Something else entirely</option></select></label><label>A little about your idea<textarea name="message" required rows={4} maxLength={1500} placeholder="The big idea, the little details, and anything in between…" /></label><div className="form-submit"><p>We’ll prepare an email for you to review and send.</p><CircleButtons variant="mail" ariaLabel="Prepare project email" type="submit" className="contact-submit" /></div></form><a className="direct-email" href="mailto:imzyrixx@gmail.com">Or email us directly: imzyrixx@gmail.com ↗</a></div></dialog>
  </>;
}
