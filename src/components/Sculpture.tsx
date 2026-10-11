import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/** Original studio sculpture; lighting and lifecycle follow MengTo's Three.js skills. */
export default function Sculpture() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); }
    catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    element.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-hidden', 'true');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 7.8);
    const studio = new THREE.Scene();
    studio.background = new THREE.Color('#181818');
    const cards: THREE.Mesh[] = [];
    const card = (width: number, height: number, x: number, y: number, z: number, color: THREE.Color) => {
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, toneMapped: false }));
      mesh.position.set(x, y, z); mesh.lookAt(0, 0, 0); studio.add(mesh); cards.push(mesh);
    };
    card(4, 7, -4, 3, 4, new THREE.Color(5, 4, 3));
    card(2, 8, 5, 0, 2, new THREE.Color(3, 3, 3));
    card(6, 2, 0, 6, -2, new THREE.Color(3, 1.4, 0.7));
    card(3, 5, -3, -3, -3, new THREE.Color(0.4, 0.5, 0.7));
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(studio, 0.04);
    scene.environment = environment.texture;
    const geometry = new THREE.TorusKnotGeometry(1.27, 0.43, 240, 40, 2, 3);
    const material = new THREE.MeshPhysicalMaterial({ color: '#f65b25', metalness: 0.86, roughness: 0.23, clearcoat: 0.65, clearcoatRoughness: 0.2, envMap: environment.texture, envMapIntensity: 1.25 });
    const sculpture = new THREE.Mesh(geometry, material);
    sculpture.rotation.set(0.35, -0.4, -0.3);
    scene.add(sculpture);
    const light = new THREE.DirectionalLight('#fff1e3', 3);
    light.position.set(-3, 5, 4); scene.add(light);
    const fill = new THREE.PointLight('#ff5522', 25, 20);
    fill.position.set(3, -2, 3); scene.add(fill);
    let visible = true, frame = 0, time = 0, last = 0, pointerX = 0, pointerY = 0, lost = false;
    const render = (now: number) => {
      frame = 0;
      if (!visible || document.hidden || reduced.matches || lost) return;
      time += Math.min((now - (last || now)) / 1000, 0.04); last = now;
      sculpture.rotation.y += ((-0.4 + pointerX * 0.32 + Math.sin(time * 0.2) * 0.28) - sculpture.rotation.y) * 0.035;
      sculpture.rotation.x += ((0.35 + pointerY * 0.2) - sculpture.rotation.x) * 0.035;
      sculpture.rotation.z = -0.3 + Math.sin(time * 0.17) * 0.12;
      sculpture.position.y = Math.sin(time * 0.6) * 0.08;
      renderer.render(scene, camera);
      element.dataset.ready = 'true';
      frame = requestAnimationFrame(render);
    };
    const wake = () => { if (!frame) { last = 0; frame = requestAnimationFrame(render); } };
    const resize = () => {
      const { width, height } = element.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); wake();
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const rect = element.getBoundingClientRect();
      pointerX = (e.clientX - rect.left) / rect.width * 2 - 1;
      pointerY = (e.clientY - rect.top) / rect.height * 2 - 1;
    };
    const leave = () => { pointerX = 0; pointerY = 0; };
    const motionChange = () => { element.dataset.ready = reduced.matches ? 'false' : 'true'; wake(); };
    const contextLost = (event: Event) => { event.preventDefault(); lost = true; element.dataset.ready = 'false'; };
    const contextRestored = () => { lost = false; wake(); };
    const observer = new ResizeObserver(resize); observer.observe(element);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) wake(); }); intersection.observe(element);
    element.addEventListener('pointermove', move); element.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', wake); reduced.addEventListener('change', motionChange);
    renderer.domElement.addEventListener('webglcontextlost', contextLost);
    renderer.domElement.addEventListener('webglcontextrestored', contextRestored);
    resize();
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect();
      element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', wake); reduced.removeEventListener('change', motionChange);
      renderer.domElement.removeEventListener('webglcontextlost', contextLost); renderer.domElement.removeEventListener('webglcontextrestored', contextRestored);
      geometry.dispose(); material.dispose(); environment.dispose(); pmrem.dispose();
      cards.forEach(mesh => { mesh.geometry.dispose(); (mesh.material as THREE.Material).dispose(); });
      renderer.dispose(); renderer.domElement.remove(); delete element.dataset.ready;
    };
  }, []);
  return <div className="sculpture" ref={host}><img className="sculpture-poster" src="/sculpture.png" alt="" aria-hidden="true" /></div>;
}
