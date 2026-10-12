import { useEffect, useRef, useState } from "react";
const chapters = [
  ["main", "Origin"],
  ["work", "Explorations"],
  ["services", "Possibilities"],
  ["lab", "The experiment"],
  ["studio", "The studio"],
  ["playground", "Perspective"],
  ["contact", "Your turn"],
];
export default function ChapterDial() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLElement>(null);
  const number = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? scrollY / max : 0;
      root.current?.style.setProperty("--reading", String(p));
      setVisible(scrollY > innerHeight * 0.5);
      if (number.current)
        number.current.textContent = String(Math.round(p * 100)).padStart(
          2,
          "0",
        );
      let current = 0;
      chapters.forEach(([id], i) => {
        if (
          (document.getElementById(id)?.getBoundingClientRect().top ??
            Infinity) <
          innerHeight * 0.45
        )
          current = i;
      });
      setActive(current);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    update();
    return () => {
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <nav
      ref={root}
      inert={!visible}
      aria-hidden={!visible}
      className={`chapter-dial ${visible ? "is-visible" : ""} ${open ? "is-open" : ""}`}
      aria-label="Story chapters"
    >
      <button
        className="dial-toggle"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className="dial-number" ref={number}>
          00
        </span>
        <span>{chapters[active][1]}</span>
        <b>{open ? "−" : "+"}</b>
      </button>
      <div className="dial-links">
        {chapters.map(([id, name], i) => (
          <a
            key={id}
            href={`#${id}`}
            aria-label={`Chapter ${i + 1}: ${name}`}
            aria-current={i === active ? "location" : undefined}
            onClick={() => setOpen(false)}
          >
            <span>0{i + 1}</span>
            <small>{name}</small>
          </a>
        ))}
      </div>
      <i className="dial-progress" />
    </nav>
  );
}
