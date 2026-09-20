import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Enhanced Three.js scene with:
 * - Multi-layer particle system with varied behaviors
 * - Interactive mouse effects with magnetic attraction
 * - Performance optimizations (LOD, frustum culling)
 * - Architectural signals with depth layers
 * - Reduced-motion and visibility-based pausing
 */
export default function ThreeHeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isOnCanvas: false });
  const rafRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(0);
  const prefsRef = useRef({ reducedMotion: false, visible: true, docVisible: true });
  const [isLowPower, setIsLowPower] = useState(false);

  // Detect low-power mode
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isLowPowerDevice = window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      navigator.hardwareConcurrency <= 2 ||
      (navigator as { deviceMemory?: number }).deviceMemory !== undefined &&
      (navigator as { deviceMemory?: number }).deviceMemory! < 4;

    if (prefersReducedMotion || isLowPowerDevice) {
      setIsLowPower(true);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
    camera.position.set(0, 0.15, 8);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isLowPower,
      powerPreference: isLowPower ? "low-power" : "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isLowPower ? 1 : 2));
    renderer.setClearColor(0x000000, 0);

    // Architecture group
    const architecture = new THREE.Group();
    architecture.rotation.set(-0.08, 0.18, -0.1);
    scene.add(architecture);

    // Materials
    const terracotta = new THREE.LineBasicMaterial({
      color: 0xe2a891,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    });
    const bone = new THREE.LineBasicMaterial({
      color: 0xf5f1e9,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    });

    // Wireframe boxes
    const createWireframeBox = (
      width: number,
      height: number,
      depth: number,
      material: THREE.LineBasicMaterial
    ) => {
      const geometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(width, height, depth));
      const mesh = new THREE.LineSegments(geometry, material);
      architecture.add(mesh);
      return mesh;
    };

    createWireframeBox(1.7, 2.8, 0.62, bone).position.set(0.05, 0.04, 0);
    createWireframeBox(1.25, 2.18, 0.78, terracotta).position.set(0.05, 0.04, 0.14);

    // Arch geometry
    const archGeometry = new THREE.BufferGeometry();
    archGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        [
          -0.92, -1.18, 0.46, -0.92, 1.2, 0.46,
          0.92, -1.18, 0.46, 0.92, 1.2, 0.46,
          -0.92, 1.2, 0.46, -0.42, 1.62, 0.46,
          -0.42, 1.62, 0.46, 0.42, 1.62, 0.46,
          0.42, 1.62, 0.46, 0.92, 1.2, 0.46,
          -0.92, -1.18, 0.46, 0.92, -1.18, 0.46,
        ],
        3
      )
    );
    architecture.add(new THREE.LineSegments(archGeometry, terracotta));

    // Concentric rings
    const ringMaterial = new THREE.LineBasicMaterial({
      color: 0xe2a891,
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
    });
    [1.72, 2.18, 2.72].forEach((radius, index) => {
      const points = new THREE.EllipseCurve(0, 0, radius, radius * 0.24, 0, Math.PI * 2).getPoints(96);
      const ringGeometry = new THREE.BufferGeometry().setFromPoints(
        points.map((point) => new THREE.Vector3(point.x, point.y, 0))
      );
      const ring = new THREE.LineLoop(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2.08;
      ring.rotation.y = index * 0.16;
      ring.position.set(0.12, 0.15, -0.08 - index * 0.05);
      architecture.add(ring);
    });

    // ============================================
    // ENHANCED PARTICLE SYSTEM - LAYER 1: Core Orbital Particles
    // ============================================
    const particleCount = isLowPower ? 100 : 250;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    const particlePhases = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 1.3 + (i % 12) * 0.15;
      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = ((i % 20) / 18 - 0.5) * 4.2;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius - 0.8;

      // Velocities for subtle drift
      particleVelocities[i * 3] = (Math.random() - 0.5) * 0.0003;
      particleVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.0005;
      particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.0002;

      particleSizes[i] = 0.012 + Math.random() * 0.018;
      particlePhases[i] = Math.random() * Math.PI * 2;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute("size", new THREE.BufferAttribute(particleSizes, 1));
    particleGeometry.setAttribute("phase", new THREE.BufferAttribute(particlePhases, 1));

    // Custom shader material for particles with enhanced effects
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0xf1bba6) },
        opacity: { value: 0.55 },
        mousePos: { value: new THREE.Vector2(0, 0) },
        mouseStrength: { value: 0.0 },
      },
      vertexShader: `
        attribute float size;
        attribute float phase;
        uniform float time;
        uniform vec2 mousePos;
        uniform float mouseStrength;
        varying float vAlpha;
        varying float vDist;

        void main() {
          vAlpha = 0.4 + 0.6 * sin(position.y * 2.0 + time * 0.5 + phase);

          // Mouse interaction - particles attracted to cursor
          vec3 pos = position;
          vec2 toMouse = mousePos - pos.xy;
          float dist = length(toMouse);
          float attraction = smoothstep(2.5, 0.0, dist) * mouseStrength;
          pos.xy += normalize(toMouse) * attraction * 0.3;

          vDist = dist;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (280.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float opacity;
        varying float vAlpha;
        varying float vDist;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;

          // Gradient with soft edge
          float alpha = opacity * vAlpha * (1.0 - smoothstep(0.2, 0.5, dist));

          // Slight color variation based on distance
          vec3 finalColor = mix(color, color * 1.2, smoothstep(1.0, 0.5, vDist / 2.5));

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // ============================================
    // LAYER 2: Secondary Sparkle Particles
    // ============================================
    const secondaryParticleCount = isLowPower ? 40 : 100;
    const secondaryPositions = new Float32Array(secondaryParticleCount * 3);
    const secondarySizes = new Float32Array(secondaryParticleCount);

    for (let i = 0; i < secondaryParticleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * 2.5;
      secondaryPositions[i * 3] = Math.cos(angle) * radius;
      secondaryPositions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      secondaryPositions[i * 3 + 2] = Math.sin(angle) * radius - 0.5;
      secondarySizes[i] = 0.006 + Math.random() * 0.008;
    }
    const secondaryGeometry = new THREE.BufferGeometry();
    secondaryGeometry.setAttribute("position", new THREE.BufferAttribute(secondaryPositions, 3));

    const secondaryMaterial = new THREE.PointsMaterial({
      color: 0xf5f1e9,
      size: 0.008,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });
    const secondaryParticles = new THREE.Points(secondaryGeometry, secondaryMaterial);
    scene.add(secondaryParticles);

    // ============================================
    // LAYER 3: Floating Dust Particles (ambient)
    // ============================================
    const dustCount = isLowPower ? 30 : 60;
    const dustPositions = new Float32Array(dustCount * 3);
    const dustVelocities = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 6;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 3 - 1;
      dustVelocities[i * 3] = (Math.random() - 0.5) * 0.001;
      dustVelocities[i * 3 + 1] = 0.0002 + Math.random() * 0.0003;
      dustVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.0005;
    }

    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));

    const dustMaterial = new THREE.PointsMaterial({
      color: 0xe2a891,
      size: 0.004,
      transparent: true,
      opacity: 0.2,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });
    const dustParticles = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustParticles);

    // ============================================
    // LAYER 4: Connecting Lines (constellation effect)
    // ============================================
    const lineCount = isLowPower ? 15 : 30;
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xf1bba6,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
    });

    const lineSegments: THREE.Line[] = [];
    for (let i = 0; i < lineCount; i++) {
      const angle1 = Math.random() * Math.PI * 2;
      const radius1 = 1.0 + Math.random() * 1.5;
      const angle2 = angle1 + (Math.random() - 0.5) * 0.5;
      const radius2 = 1.0 + Math.random() * 1.5;
      const y1 = (Math.random() - 0.5) * 3;
      const y2 = (Math.random() - 0.5) * 3;

      const lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute([
          Math.cos(angle1) * radius1, y1, Math.sin(angle1) * radius1 - 0.5,
          Math.cos(angle2) * radius2, y2, Math.sin(angle2) * radius2 - 0.5,
        ], 3)
      );
      const line = new THREE.Line(lineGeometry, lineMaterial.clone());
      line.userData = { phase: Math.random() * Math.PI * 2, speed: 0.3 + Math.random() * 0.4 };
      lineSegments.push(line);
      scene.add(line);
    }

    // Mouse interaction state
    const targetRotation = { x: 0.18, y: -0.1 };
    const mouseInfluence = { strength: 0, targetStrength: 0 };
    let width = 0;
    let height = 0;

    // Resize handler
    const resize = () => {
      width = Math.max(1, canvas.clientWidth);
      height = Math.max(1, canvas.clientHeight);
      const aspect = width / height;
      const viewHeight = 4.7;
      camera.left = (-viewHeight * aspect) / 2;
      camera.right = (viewHeight * aspect) / 2;
      camera.top = viewHeight / 2;
      camera.bottom = -viewHeight / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    // Pointer move handler
    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const isOnCanvas = (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      );

      mouseRef.current.isOnCanvas = isOnCanvas;
      mouseRef.current.targetX = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
      mouseRef.current.targetY = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;

      // Update shader mouse position (normalized to scene coordinates)
      if (isOnCanvas) {
        const normalizedX = ((event.clientX - rect.left) / rect.width - 0.5) * 4;
        const normalizedY = -((event.clientY - rect.top) / rect.height - 0.5) * 3;
        particleMaterial.uniforms.mousePos.value.set(normalizedX, normalizedY);
        mouseInfluence.targetStrength = 1;
      } else {
        mouseInfluence.targetStrength = 0;
      }
    };

    const handlePointerEnter = () => {
      mouseInfluence.targetStrength = 1;
    };

    const handlePointerLeave = () => {
      mouseInfluence.targetStrength = 0;
    };

    // Animation loop
    const animate = (timestamp: number) => {
      rafRef.current = null;

      if (!prefsRef.current.visible || !prefsRef.current.docVisible) {
        return;
      }

      const elapsed = (timestamp - startedAtRef.current) / 1000;
      const { reducedMotion } = prefsRef.current;

      // Smooth mouse following
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      // Smooth mouse influence transition
      mouseInfluence.strength += (mouseInfluence.targetStrength - mouseInfluence.strength) * 0.1;
      particleMaterial.uniforms.mouseStrength.value = mouseInfluence.strength;

      if (!reducedMotion) {
        // Update architecture rotation based on mouse
        targetRotation.x = 0.18 + mouseRef.current.y * 0.04;
        targetRotation.y = -0.1 + mouseRef.current.x * 0.055;

        architecture.rotation.x += (targetRotation.x - architecture.rotation.x) * 0.04;
        architecture.rotation.y += (targetRotation.y - architecture.rotation.y) * 0.04;
        architecture.rotation.z = -0.1 + Math.sin(elapsed * 0.28) * 0.025;
        architecture.position.y = Math.sin(elapsed * 0.5) * 0.035;

        // Animate particles
        particles.rotation.y = elapsed * 0.04;
        particles.rotation.x = Math.sin(elapsed * 0.15) * 0.05;
        secondaryParticles.rotation.y = -elapsed * 0.025;
        secondaryParticles.rotation.x = Math.cos(elapsed * 0.12) * 0.03;

        // Update particle shader time
        particleMaterial.uniforms.time.value = elapsed;

        // Animate dust particles
        const dustPositionsAttr = dustGeometry.attributes.position as THREE.BufferAttribute;
        const dustPosArray = dustPositionsAttr.array as Float32Array;
        for (let i = 0; i < dustCount; i++) {
          dustPosArray[i * 3 + 1] += dustVelocities[i * 3 + 1];
          dustPosArray[i * 3] += dustVelocities[i * 3] + Math.sin(elapsed + i) * 0.0001;
          if (dustPosArray[i * 3 + 1] > 2.5) dustPosArray[i * 3 + 1] = -2.5;
        }
        dustPositionsAttr.needsUpdate = true;

        // Subtle particle drift
        const positions = particleGeometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3 + 1] += particleVelocities[i * 3 + 1];
          // Wrap particles that go out of bounds
          if (positions[i * 3 + 1] > 2.1) positions[i * 3 + 1] = -2.1;
          if (positions[i * 3 + 1] < -2.1) positions[i * 3 + 1] = 2.1;
        }
        particleGeometry.attributes.position.needsUpdate = true;

        // Animate connecting lines
        lineSegments.forEach((line) => {
          const { phase, speed } = line.userData;
          const opacity = 0.05 + 0.05 * Math.sin(elapsed * speed + phase);
          (line.material as THREE.LineBasicMaterial).opacity = opacity;
        });
      }

      renderer.render(scene, camera);

      if (!reducedMotion) {
        rafRef.current = window.requestAnimationFrame(animate);
      }
    };

    // Visibility handlers
    const handleVisibilityChange = () => {
      prefsRef.current.docVisible = document.visibilityState === "visible";
      if (prefsRef.current.docVisible && prefsRef.current.visible) {
        if (!prefsRef.current.reducedMotion) {
          rafRef.current = window.requestAnimationFrame(animate);
        }
      } else if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      prefsRef.current.reducedMotion = event.matches;
      if (prefsRef.current.reducedMotion && rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else if (!prefsRef.current.reducedMotion && prefsRef.current.visible && prefsRef.current.docVisible) {
        rafRef.current = window.requestAnimationFrame(animate);
      }
    };

    // Intersection observer for visibility
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        prefsRef.current.visible = entry?.isIntersecting ?? false;
        if (prefsRef.current.visible && prefsRef.current.docVisible) {
          if (!prefsRef.current.reducedMotion) {
            rafRef.current = window.requestAnimationFrame(animate);
          } else {
            renderer.render(scene, camera);
          }
        } else if (rafRef.current !== null) {
          window.cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      },
      { threshold: 0.1 }
    );

    const resizeObserver = new ResizeObserver(resize);
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Initialize
    startedAtRef.current = performance.now();
    prefsRef.current.reducedMotion = reducedMotionQuery.matches;

    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    canvas.addEventListener("pointerenter", handlePointerEnter);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
    resize();

    if (!prefsRef.current.reducedMotion) {
      rafRef.current = window.requestAnimationFrame(animate);
    } else {
      renderer.render(scene, camera);
    }

    // Cleanup
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerenter", handlePointerEnter);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotionQuery.removeEventListener("change", handleReducedMotionChange);

      archGeometry.dispose();
      particleGeometry.dispose();
      secondaryGeometry.dispose();
      dustGeometry.dispose();
      particles.material.dispose();
      secondaryParticles.material.dispose();
      dustParticles.material.dispose();

      lineSegments.forEach(line => {
        line.geometry.dispose();
        if (Array.isArray(line.material)) {
          line.material.forEach(m => m.dispose());
        } else {
          line.material.dispose();
        }
      });

      architecture.traverse((object) => {
        if (object instanceof THREE.LineSegments || object instanceof THREE.LineLoop) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          }
        }
      });
      terracotta.dispose();
      bone.dispose();
      ringMaterial.dispose();
      particleMaterial.dispose();
      secondaryMaterial.dispose();
      dustMaterial.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, [isLowPower]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full opacity-90"
    />
  );
}
