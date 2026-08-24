import * as THREE from 'three';
import type { VehicleSpec } from './data/vehicles';

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Build the stylized vehicle mesh group from its declarative spec. */
function buildVehicle(spec: VehicleSpec): THREE.Group {
  const group = new THREE.Group();
  const mat = (color: string, metal = 0.25, rough = 0.45) =>
    new THREE.MeshStandardMaterial({ color, metalness: metal, roughness: rough });

  const totalH = spec.body.reduce((s, seg) => s + seg.h, 0);
  const coreR = spec.body[0].rBottom;

  let y = 0;
  for (const seg of spec.body) {
    const geo = new THREE.CylinderGeometry(Math.max(seg.rTop, 0.001), seg.rBottom, seg.h, 48);
    const mesh = new THREE.Mesh(geo, mat(seg.color, seg.metal, seg.rough));
    mesh.position.y = y + seg.h / 2;
    group.add(mesh);
    y += seg.h;
  }

  if (spec.boosters) {
    const { count, r, h, color } = spec.boosters;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + Math.PI / 2;
      const bx = Math.cos(a) * (coreR + r * 0.9);
      const bz = Math.sin(a) * (coreR + r * 0.9);
      const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 32), mat(color));
      body.position.set(bx, h / 2, bz);
      const nose = new THREE.Mesh(new THREE.CylinderGeometry(0.001, r, r * 2.2, 32), mat(color));
      nose.position.set(bx, h + r * 1.1, bz);
      group.add(body, nose);
    }
  }

  if (spec.fins) {
    const { count, h, w, color } = spec.fins;
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(w, 0);
    shape.lineTo(0, h);
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: Math.max(0.06, coreR * 0.06), bevelEnabled: false });
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const fin = new THREE.Mesh(geo, mat(color));
      fin.position.set(Math.cos(a) * coreR * 0.98, 0, Math.sin(a) * coreR * 0.98);
      fin.rotation.y = -a;
      group.add(fin);
    }
  }

  if (spec.engines) {
    const { count, r } = spec.engines;
    const nozzleMat = new THREE.MeshStandardMaterial({ color: '#22262e', metalness: 0.8, roughness: 0.35 });
    const ring = count === 1 ? 0 : coreR * 0.55;
    for (let i = 0; i < count; i++) {
      const a = (i / Math.max(count, 1)) * Math.PI * 2;
      const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.55, r, r * 1.7, 24), nozzleMat);
      nozzle.position.set(Math.cos(a) * ring, -r * 0.55, Math.sin(a) * ring);
      group.add(nozzle);
    }
  }

  // normalize to a display height of ~3 units, centered vertically
  const scale = 3 / totalH;
  group.scale.setScalar(scale);
  group.position.y = -1.5 + (spec.engines ? spec.engines.r * 1.4 * scale : 0) * -1;
  return group;
}

/** Renders one vehicle into a canvas: slow idle spin, drag to rotate. */
export class VehicleViewer {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private vehicle: THREE.Group;
  private raf = 0;
  private last = 0;
  private dragging = false;
  private destroyed = false;

  constructor(private canvas: HTMLCanvasElement, spec: VehicleSpec) {
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(rect.width, 50);
    const h = Math.max(rect.height, 50);
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h, false);

    this.camera = new THREE.PerspectiveCamera(32, w / h, 0.1, 50);
    this.camera.position.set(0, 0.35, 5.9);
    this.camera.lookAt(0, 0, 0);

    this.scene.add(new THREE.AmbientLight('#8fa5c8', 0.55));
    const key = new THREE.DirectionalLight('#ffffff', 1.7);
    key.position.set(2.5, 3, 2.2);
    const rim = new THREE.DirectionalLight(spec.accent, 1.4);
    rim.position.set(-3, 0.8, -2.6);
    const fill = new THREE.DirectionalLight('#3a4a70', 0.5);
    fill.position.set(0, -2, 1);
    this.scene.add(key, rim, fill);

    this.vehicle = buildVehicle(spec);
    this.vehicle.rotation.y = 0.6;
    this.scene.add(this.vehicle);

    canvas.addEventListener('pointerdown', this.onDown);
    this.raf = requestAnimationFrame(this.frame);
  }

  private onDown = (ev: PointerEvent) => {
    ev.stopPropagation();
    this.dragging = true;
    this.canvas.setPointerCapture(ev.pointerId);
    let px = ev.clientX;
    let py = ev.clientY;
    const move = (e: PointerEvent) => {
      this.vehicle.rotation.y += (e.clientX - px) * 0.011;
      this.vehicle.rotation.x = Math.max(-0.5, Math.min(0.5, this.vehicle.rotation.x + (e.clientY - py) * 0.005));
      px = e.clientX;
      py = e.clientY;
    };
    const up = () => {
      this.dragging = false;
      this.canvas.removeEventListener('pointermove', move);
      this.canvas.removeEventListener('pointerup', up);
      this.canvas.removeEventListener('pointercancel', up);
    };
    this.canvas.addEventListener('pointermove', move);
    this.canvas.addEventListener('pointerup', up);
    this.canvas.addEventListener('pointercancel', up);
  };

  private frame = (t: number) => {
    if (this.destroyed) return;
    const dt = this.last ? Math.min((t - this.last) / 1000, 0.1) : 0;
    this.last = t;
    if (!this.dragging && !REDUCED_MOTION) this.vehicle.rotation.y += dt * 0.35;
    this.renderer.render(this.scene, this.camera);
    this.raf = requestAnimationFrame(this.frame);
  };

  destroy(): void {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    this.canvas.removeEventListener('pointerdown', this.onDown);
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach((m) => m.dispose());
      }
    });
    this.renderer.dispose();
  }
}

// ────────────────────────── expandable overlay ──────────────────────────

let overlayViewer: VehicleViewer | null = null;

export function openVehicleOverlay(spec: VehicleSpec): void {
  const el = document.getElementById('vehicle-overlay')!;
  el.innerHTML = `
    <div class="vehicle-stage">
      <button class="panel-close" aria-label="Close vehicle viewer">×</button>
      <canvas class="vehicle-canvas" aria-label="Stylized 3D model of ${spec.name}"></canvas>
      <div class="vehicle-caption">
        <strong>${spec.name}</strong>
        <span>${spec.heightM} m · stylized depiction · drag to rotate</span>
      </div>
    </div>`;
  el.hidden = false;
  el.addEventListener('click', (ev) => {
    if (ev.target === el) closeVehicleOverlay();
  });
  el.querySelector('.panel-close')!.addEventListener('click', () => closeVehicleOverlay());
  overlayViewer = new VehicleViewer(el.querySelector('canvas')!, spec);
}

/** Close the overlay if open; returns whether it was open. */
export function closeVehicleOverlay(): boolean {
  const el = document.getElementById('vehicle-overlay')!;
  if (el.hidden) return false;
  overlayViewer?.destroy();
  overlayViewer = null;
  el.hidden = true;
  el.innerHTML = '';
  return true;
}
