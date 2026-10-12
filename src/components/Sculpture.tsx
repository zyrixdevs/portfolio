import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const forms = ["Signal", "Structure", "Orbit"];
/** The Idea Engine: 144 instanced aluminium fins, assembled into three original forms. */
export default function Sculpture() {
  const host = useRef<HTMLDivElement>(null);
  const controls = useRef({ mode: 1, energy: 0.35, paused: false, burst: 0 });
  const [mode, setMode] = useState(1);
  const [energy, setEnergy] = useState(35);
  const [paused, setPaused] = useState(false);
  const wakeRef = useRef<() => void>(() => {});
  const readout = useRef<HTMLOutputElement>(null);
  useEffect(() => {
    const el = host.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    const compact = innerWidth < 800;
    let dpr = Math.min(devicePixelRatio, compact ? 1.25 : 1.6);
    renderer.setPixelRatio(dpr);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.domElement.setAttribute("aria-hidden", "true");
    el.prepend(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
    camera.position.set(0, 0, 9.5);
    const studio = new THREE.Scene();
    studio.background = new THREE.Color("#181c1b");
    const lights: THREE.Mesh[] = [];
    for (const [x, y, z, w, h, intensity] of [
      [-4, 3, 4, 4, 6, 5],
      [4, 1, 2, 2, 7, 4],
      [0, 5, -2, 7, 2, 5],
      [-1, -4, 3, 4, 1, 2],
    ]) {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(intensity, intensity * 0.86, intensity * 0.7),
          side: THREE.DoubleSide,
        }),
      );
      m.position.set(x, y, z);
      m.lookAt(0, 0, 0);
      studio.add(m);
      lights.push(m);
    }
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(studio, 0.05);
    scene.environment = environment.texture;
    const geometry = new THREE.BoxGeometry(0.078, 0.64, 0.58);
    const material = new THREE.MeshPhysicalMaterial({
      color: "#ff783e",
      metalness: 0.88,
      roughness: 0.26,
      clearcoat: 0.5,
      envMapIntensity: 1.4,
    });
    const count = 144,
      fins = new THREE.InstancedMesh(geometry, material, count);
    fins.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const group = new THREE.Group();
    group.add(fins);
    scene.add(group);
    const key = new THREE.DirectionalLight("#fff5df", 3);
    key.position.set(-3, 4, 5);
    scene.add(key);
    scene.add(new THREE.AmbientLight("#d5e3e1", 0.7));
    const dummy = new THREE.Object3D();
    const positions = Array.from({ length: count }, () => new THREE.Vector3());
    const rnd = (n: number) => {
      const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
      return x - Math.floor(x);
    };
    const dustGeo = new THREE.BufferGeometry();
    const dustArray = new Float32Array(240 * 3);
    for (let i = 0; i < 240; i++) {
      dustArray[i * 3] = (rnd(i) - 0.5) * 11;
      dustArray[i * 3 + 1] = (rnd(i + 400) - 0.5) * 8;
      dustArray[i * 3 + 2] = (rnd(i + 800) - 0.5) * 5;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustArray, 3));
    const dustMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uTime: { value: 0 }, uDpr: { value: dpr } },
      vertexShader: `uniform float uTime; uniform float uDpr; varying float vAlpha; void main(){ vec3 p=position; p.y+=sin(uTime*.15+position.x)*.08; vec4 mv=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mv; gl_PointSize=2.0*uDpr; vAlpha=.18+.24*sin(position.x*5.+uTime*.25); }`,
      fragmentShader: `varying float vAlpha; void main(){ float d=length(gl_PointCoord-.5); gl_FragColor=vec4(.88,.79,.62,vAlpha*smoothstep(.5,.1,d)); }`,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);
    const ringGeo = new THREE.BufferGeometry().setFromPoints(
      Array.from(
        { length: 129 },
        (_, i) =>
          new THREE.Vector3(
            Math.cos((i / 128) * Math.PI * 2) * 2.55,
            Math.sin((i / 128) * Math.PI * 2) * 2.55,
            0,
          ),
      ),
    );
    const ringMat = new THREE.LineBasicMaterial({
      color: "#a5b1a4",
      transparent: true,
      opacity: 0.19,
    });
    const ring = new THREE.Line(ringGeo, ringMat);
    ring.rotation.x = 0.45;
    ring.rotation.y = 0.45;
    scene.add(ring);
    let frame = 0,
      visible = true,
      lost = false,
      time = 0,
      last = 0,
      slowFrames = 0,
      rotation = -0.35,
      targetRotation = -0.35,
      pointerY = 0,
      dragX: number | null = null,
      lastMode = -1,
      lastUI = 0;
    const target = new THREE.Vector3();
    const draw = (now: number) => {
      frame = 0;
      if (!visible || document.hidden || lost || reduced.matches) {
        el.dataset.renderState = "suspended";
        return;
      }
      const elapsed = last ? now - last : 16;
      last = now;
      if (elapsed > 34 && ++slowFrames > 12 && dpr > 1) {
        dpr = 1;
        renderer.setPixelRatio(dpr);
        dustMat.uniforms.uDpr.value = dpr;
        el.dataset.quality = "balanced";
      }
      const dt = Math.min(elapsed / 1000, 0.05),
        c = controls.current;
      if (!c.paused) time += dt;
      const changed = lastMode !== c.mode;
      lastMode = c.mode;
      const scroll = Math.min(window.scrollY / innerHeight, 1);
      rotation +=
        (targetRotation - rotation) *
        (1 - Math.exp(-Math.min(elapsed / 1000, 0.5) * 8));
      group.rotation.set(0.1 + pointerY * 0.12, rotation + scroll * 0.6, -0.09);
      const blend = 1 - Math.exp(-Math.min(elapsed / 1000, 0.5) * 5);
      let unsettled = Math.abs(targetRotation - rotation) > 0.001;
      for (let i = 0; i < count; i++) {
        const t = i / count,
          section = Math.floor(t * 3),
          f = (t * 3) % 1;
        let rz = 0,
          ry = 0;
        if (c.mode === 1) {
          if (section === 0) target.set(-1.6 + f * 3.2, 1.42, 0);
          else if (section === 1) {
            target.set(1.6 - f * 3.2, 1.42 - f * 2.84, 0);
            rz = 0.726;
          } else target.set(-1.6 + f * 3.2, -1.42, 0);
          target.z = Math.sin(t * 24 + time * 0.5) * 0.12 * c.energy;
          ry = Math.sin(t * 18 + time * 0.35) * (0.2 + c.energy * 0.5);
        } else if (c.mode === 2) {
          const a = t * Math.PI * 8,
            y = 1 - t * 2,
            r = Math.sqrt(1 - y * y) * 1.8;
          target.set(Math.cos(a) * r, y * 1.8, Math.sin(a) * r);
          rz = a;
          ry = a * 0.5 + time * 0.1;
        } else {
          target.set(
            (rnd(i) - 0.5) * 4.4,
            (rnd(i + 200) - 0.5) * 3.6,
            (rnd(i + 500) - 0.5) * 3.2,
          );
          target.y += Math.sin(time * 0.6 + i) * 0.12;
          rz = rnd(i + 9) * Math.PI;
          ry = time * 0.13 + rnd(i) * 4;
        }
        const wave = Math.sin(time * 0.8 + t * 18) * c.energy * 0.08;
        target.x += wave + c.burst * (rnd(i + 20) - 0.5) * 2.5;
        target.y += c.burst * (rnd(i + 30) - 0.5) * 2.5;
        if (positions[i].distanceToSquared(target) > 0.00001) unsettled = true;
        positions[i].lerp(target, changed ? 0.02 : blend);
        dummy.position.copy(positions[i]);
        dummy.rotation.set(
          Math.sin(t * 8 + time * 0.3) * c.energy * 0.12,
          ry,
          rz,
        );
        dummy.scale.set(1, 1 + c.energy * 0.12 * Math.sin(t * 30 + time), 1);
        dummy.updateMatrix();
        fins.setMatrixAt(i, dummy.matrix);
      }
      fins.instanceMatrix.needsUpdate = true;
      dustMat.uniforms.uTime.value = time;
      ring.rotation.z = time * 0.025;
      renderer.render(scene, camera);
      el.dataset.ready = "true";
      el.dataset.form = forms[c.mode].toLowerCase();
      if (now - lastUI > 120 && readout.current) {
        readout.current.value = `${String(Math.round(c.energy * 100)).padStart(3, "0")} / ${String(Math.round(((rotation + 0.35) * 180) / Math.PI)).padStart(3, "0")}°`;
        lastUI = now;
      }
      if (!c.paused || unsettled) {
        el.dataset.renderState = "running";
        frame = requestAnimationFrame(draw);
      } else el.dataset.renderState = "idle";
    };
    const wake = () => {
      if (!frame) {
        last = 0;
        frame = requestAnimationFrame(draw);
      }
    };
    wakeRef.current = wake;
    const resize = () => {
      const w = el.clientWidth,
        h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = camera.aspect < 0.85 ? 12 : 9.5;
      camera.updateProjectionMatrix();
      wake();
    };
    const down = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("button,input")) return;
      dragX = e.clientX;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      wake();
      if (dragX !== null) {
        targetRotation += (e.clientX - dragX) * 0.008;
        dragX = e.clientX;
      } else
        pointerY =
          (e.clientY - el.getBoundingClientRect().top) / el.clientHeight - 0.5;
    };
    const keyTurn = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        targetRotation += event.key === "ArrowLeft" ? -0.2 : 0.2;
        wake();
      }
    };
    const up = () => {
      dragX = null;
    };
    const contextLost = (e: Event) => {
      e.preventDefault();
      lost = true;
      el.dataset.ready = "false";
    };
    const restore = () => {
      lost = false;
      wake();
    };
    const motion = () => {
      el.dataset.ready = reduced.matches ? "false" : "true";
      wake();
    };
    const observer = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      wake();
    });
    observer.observe(el);
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    el.addEventListener("keydown", keyTurn);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    document.addEventListener("visibilitychange", wake);
    window.addEventListener("scroll", wake, { passive: true });
    reduced.addEventListener("change", motion);
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    renderer.domElement.addEventListener("webglcontextrestored", restore);
    resize();
    return () => {
      wakeRef.current = () => {};
      window.removeEventListener("scroll", wake);
      cancelAnimationFrame(frame);
      observer.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", wake);
      reduced.removeEventListener("change", motion);
      el.removeEventListener("keydown", keyTurn);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      renderer.domElement.removeEventListener("webglcontextrestored", restore);
      geometry.dispose();
      material.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      environment.dispose();
      pmrem.dispose();
      lights.forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
      delete el.dataset.ready;
    };
  }, []);
  return (
    <div className="idea-engine">
      <div className="engine-topline">
        <span>EXPERIMENT 001 / THE IDEA ENGINE</span>
        <span className="engine-live">
          <i /> FORM STUDY
        </span>
      </div>
      <div
        className="sculpture"
        ref={host}
        role="group"
        tabIndex={0}
        aria-label="Rotate the idea engine using arrow keys or drag"
      >
        <img
          className="sculpture-poster"
          src="/engine-poster.svg"
          alt="144 copper fins arranged into a dimensional Z"
        />
        <span className="engine-axis axis-x" aria-hidden="true">
          X ─────
        </span>
        <span className="engine-axis axis-y" aria-hidden="true">
          Y ─────
        </span>
      </div>
      <div className="engine-controls">
        <div className="engine-modes" aria-label="Sculpture form">
          {forms.map((name, i) => (
            <button
              key={name}
              aria-pressed={mode === i}
              onClick={() => {
                setMode(i);
                controls.current.mode = i;
                wakeRef.current();
              }}
            >
              <small>0{i + 1}</small>
              {name}
            </button>
          ))}
        </div>
        <div className="engine-tuning">
          <label htmlFor="engine-energy">
            ENERGY
            <input
              id="engine-energy"
              type="range"
              min="0"
              max="100"
              value={energy}
              onChange={(e) => {
                setEnergy(+e.target.value);
                controls.current.energy = +e.target.value / 100;
                wakeRef.current();
              }}
            />
          </label>
          <output ref={readout} aria-label="Engine energy and angle">
            035 / 000°
          </output>
          <button
            className="engine-pause"
            aria-label={paused ? "Resume sculpture" : "Pause sculpture"}
            onClick={() => {
              setPaused(!paused);
              controls.current.paused = !paused;
              wakeRef.current();
            }}
          >
            {paused ? "PLAY" : "PAUSE"}
          </button>
        </div>
      </div>
      <span className="engine-hint">
        144 ELEMENTS · DRAG TO TURN · MAKE IT YOURS
      </span>
    </div>
  );
}
