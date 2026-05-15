// 3D garden scene for Nikis Lawn & Garden Services.
// Lightweight Three.js scene: ground, hedges, planter boxes, sun, sky
// gradient, drifting particles. Auto-degrades on mobile / low-power /
// reduced-motion devices.

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

export function canRun3D() {
  if (typeof window === 'undefined') return false;
  try {
    const c = document.createElement('canvas');
    if (!(c.getContext('webgl') || c.getContext('experimental-webgl'))) return false;
  } catch (e) { return false; }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return false;
  return true;
}

export function isLowPower() {
  const cores = navigator.hardwareConcurrency || 4;
  const small = window.matchMedia('(max-width: 720px)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  return (small && coarse) || cores < 4;
}

export function getSeason(date = new Date()) {
  const m = date.getMonth();
  if (m <= 1 || m === 11) return 'winter';
  if (m <= 4) return 'spring';
  if (m <= 7) return 'summer';
  return 'autumn';
}

export function mountScene(container, opts = {}) {
  const lowPower = opts.lowPower ?? isLowPower();
  const season = opts.season ?? getSeason();

  const scene = new THREE.Scene();

  // Sky gradient via vertex colors on a big sphere.
  const skyColors = {
    spring: ['#a7d8ff', '#f5e9c8'],
    summer: ['#7fc1ff', '#fff3c2'],
    autumn: ['#ffb877', '#ffe7b2'],
    winter: ['#bfd6e6', '#eef3f7'],
  }[season];
  const skyGeo = new THREE.SphereGeometry(60, 24, 16);
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {
      top:    { value: new THREE.Color(skyColors[0]) },
      bottom: { value: new THREE.Color(skyColors[1]) },
    },
    vertexShader: `varying float vY; void main(){ vY = normalize(position).y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);} `,
    fragmentShader: `uniform vec3 top; uniform vec3 bottom; varying float vY; void main(){ float t = clamp(vY*0.5+0.5,0.0,1.0); gl_FragColor = vec4(mix(bottom, top, t), 1.0);} `,
  });
  scene.add(new THREE.Mesh(skyGeo, skyMat));

  // Ground
  const groundGeo = new THREE.CircleGeometry(30, 48);
  const groundMat = new THREE.MeshLambertMaterial({ color: 0x5c8e4b });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // Stylized grass blades (instanced)
  const bladeCount = lowPower ? 400 : 1800;
  const bladeGeo = new THREE.PlaneGeometry(0.05, 0.45);
  bladeGeo.translate(0, 0.22, 0);
  const bladeMat = new THREE.MeshBasicMaterial({
    color: 0x7fb24a, side: THREE.DoubleSide, transparent: true, opacity: 0.9,
  });
  const blades = new THREE.InstancedMesh(bladeGeo, bladeMat, bladeCount);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < bladeCount; i++) {
    const r = Math.sqrt(Math.random()) * 12;
    const a = Math.random() * Math.PI * 2;
    dummy.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
    dummy.rotation.y = Math.random() * Math.PI;
    dummy.scale.setScalar(0.6 + Math.random() * 0.9);
    dummy.updateMatrix();
    blades.setMatrixAt(i, dummy.matrix);
  }
  scene.add(blades);

  // Hedges (rounded boxes via simple boxes for budget)
  const hedgeMat = new THREE.MeshLambertMaterial({ color: 0x2e5a2e });
  const hedgePositions = [
    [-5, 0.6, -3], [-3, 0.6, -3.6], [-1, 0.6, -3.2],
    [ 5, 0.7,  -2], [ 6.2, 0.7, -3.2],
  ];
  hedgePositions.forEach(([x, y, z]) => {
    const g = new THREE.BoxGeometry(1.6, y * 2, 1.1);
    const m = new THREE.Mesh(g, hedgeMat);
    m.position.set(x, y, z);
    scene.add(m);
  });

  // Flower planter trio
  function planter(x, z, color) {
    const grp = new THREE.Group();
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.5, 0.7),
      new THREE.MeshLambertMaterial({ color: 0x8a5a36 })
    );
    box.position.y = 0.25;
    grp.add(box);
    for (let i = 0; i < 6; i++) {
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6),
        new THREE.MeshLambertMaterial({ color: 0x3e6b2f })
      );
      const fx = (i - 2.5) * 0.2;
      stem.position.set(fx, 0.75, (i % 2 === 0 ? -0.1 : 0.1));
      grp.add(stem);
      const flower = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 8, 6),
        new THREE.MeshLambertMaterial({ color })
      );
      flower.position.set(fx, 1.05, (i % 2 === 0 ? -0.1 : 0.1));
      grp.add(flower);
    }
    grp.position.set(x, 0, z);
    return grp;
  }
  scene.add(planter(-3, 2, 0xffb347));
  scene.add(planter(0, 2.5, 0xff6ea3));
  scene.add(planter(3, 2, 0xfff177));

  // Tree (low-poly)
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.32, 1.6, 8),
    new THREE.MeshLambertMaterial({ color: 0x6b4424 })
  );
  trunk.position.set(-7, 0.8, 1);
  scene.add(trunk);
  const canopyColor = { spring: 0x9fd24a, summer: 0x6fb23a, autumn: 0xd97836, winter: 0xbcc7c2 }[season];
  const canopy = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.6, 0),
    new THREE.MeshLambertMaterial({ color: canopyColor, flatShading: true })
  );
  canopy.position.set(-7, 2.4, 1);
  scene.add(canopy);

  // Sun
  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 16, 12),
    new THREE.MeshBasicMaterial({ color: 0xfff1a8 })
  );
  sun.position.set(10, 12, -14);
  scene.add(sun);

  // Lights
  scene.add(new THREE.HemisphereLight(0xffffff, 0x4a6a3a, 0.85));
  const dir = new THREE.DirectionalLight(0xffffff, 0.7);
  dir.position.set(8, 10, 4);
  scene.add(dir);

  // Particles (season-tinted)
  const particleColor = { spring: 0xffd1e8, summer: 0xfff7a8, autumn: 0xd97836, winter: 0xffffff }[season];
  const particleCount = lowPower ? 80 : 240;
  const pGeo = new THREE.BufferGeometry();
  const pos = new Float32Array(particleCount * 3);
  const vel = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    pos[i*3]   = (Math.random() - 0.5) * 24;
    pos[i*3+1] = Math.random() * 8 + 1;
    pos[i*3+2] = (Math.random() - 0.5) * 24;
    vel[i*3]   = (Math.random() - 0.5) * 0.01;
    vel[i*3+1] = -0.005 - Math.random() * 0.01;
    vel[i*3+2] = (Math.random() - 0.5) * 0.01;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const particles = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({ color: particleColor, size: 0.12, transparent: true, opacity: 0.85 })
  );
  scene.add(particles);

  // Camera + renderer
  const width = container.clientWidth || 600;
  const height = container.clientHeight || 400;
  const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 200);
  camera.position.set(6, 4.5, 9);

  const renderer = new THREE.WebGLRenderer({ antialias: !lowPower, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1 : 1.5));
  renderer.setSize(width, height);
  renderer.domElement.setAttribute('aria-label', "Interactive 3D garden — drag to look around");
  renderer.domElement.setAttribute('role', 'img');
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 5;
  controls.maxDistance = 18;
  controls.minPolarAngle = 0.4;
  controls.maxPolarAngle = Math.PI / 2.05;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.4;
  controls.target.set(0, 1, 0);

  function onResize() {
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  let running = true;
  const io = new IntersectionObserver((ents) => {
    ents.forEach(e => { running = e.isIntersecting; });
  }, { threshold: 0.05 });
  io.observe(container);

  let raf;
  const clock = new THREE.Clock();
  function tick() {
    raf = requestAnimationFrame(tick);
    if (!running || document.hidden) return;
    const dt = clock.getDelta();
    // particle drift
    const arr = pGeo.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      arr[i*3]   += vel[i*3]   * 60 * dt;
      arr[i*3+1] += vel[i*3+1] * 60 * dt;
      arr[i*3+2] += vel[i*3+2] * 60 * dt;
      if (arr[i*3+1] < 0.1) {
        arr[i*3]   = (Math.random() - 0.5) * 24;
        arr[i*3+1] = 8 + Math.random() * 2;
        arr[i*3+2] = (Math.random() - 0.5) * 24;
      }
    }
    pGeo.attributes.position.needsUpdate = true;
    canopy.rotation.y += dt * 0.15;
    controls.update();
    renderer.render(scene, camera);
  }
  tick();

  return {
    destroy() {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    },
  };
}
