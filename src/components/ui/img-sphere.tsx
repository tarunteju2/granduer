import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";

export interface ImageData {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

export interface SphereImageGridProps {
  images?: ImageData[];
  containerSize?: number;
  sphereRadius?: number;
  dragSensitivity?: number;
  momentumDecay?: number;
  maxRotationSpeed?: number;
  baseImageScale?: number;
  perspective?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  className?: string;
}

type Rotation = { x: number; y: number };
type Point = { x: number; y: number; z: number };

const normalizeAngle = (angle: number) => {
  let next = angle;
  while (next > 180) next -= 360;
  while (next < -180) next += 360;
  return next;
};

/** Interactive, drag-rotatable sphere of images for visual review showcases. */
export default function SphereImageGrid({
  images = [],
  containerSize = 440,
  sphereRadius = 155,
  dragSensitivity = 0.55,
  momentumDecay = 0.94,
  maxRotationSpeed = 5,
  baseImageScale = 0.15,
  perspective = 900,
  autoRotate = true,
  autoRotateSpeed = 0.12,
  className = "",
}: SphereImageGridProps) {
  const [mounted, setMounted] = useState(false);
  const [rotation, setRotation] = useState<Rotation>({ x: 12, y: -18 });
  const [velocity, setVelocity] = useState<Rotation>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [selected, setSelected] = useState<ImageData | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const lastPointer = useRef({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);

  const positions = useMemo(() => {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    return images.map((_, index) => {
      const y = 1 - (index / Math.max(images.length - 1, 1)) * 2;
      const radius = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * index;
      return {
        x: Math.cos(theta) * radius * sphereRadius,
        y: y * sphereRadius,
        z: Math.sin(theta) * radius * sphereRadius,
      };
    });
  }, [images, sphereRadius]);

  const limit = useCallback(
    (value: number) => Math.max(-maxRotationSpeed, Math.min(maxRotationSpeed, value)),
    [maxRotationSpeed],
  );

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const tick = () => {
      if (!dragging) {
        setVelocity((current) => ({
          x: current.x * momentumDecay,
          y: current.y * momentumDecay,
        }));
        setRotation((current) => ({
          x: normalizeAngle(current.x + velocity.x),
          y: normalizeAngle(current.y + velocity.y + (autoRotate ? autoRotateSpeed : 0)),
        }));
      }
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [autoRotate, autoRotateSpeed, dragging, momentumDecay, mounted, velocity]);

  const rotatePoint = (point: Point) => {
    const xAngle = (rotation.x * Math.PI) / 180;
    const yAngle = (rotation.y * Math.PI) / 180;
    const x1 = point.x * Math.cos(yAngle) + point.z * Math.sin(yAngle);
    const z1 = -point.x * Math.sin(yAngle) + point.z * Math.cos(yAngle);
    return {
      x: x1,
      y: point.y * Math.cos(xAngle) - z1 * Math.sin(xAngle),
      z: point.y * Math.sin(xAngle) + z1 * Math.cos(xAngle),
    };
  };

  const pointerDown = (x: number, y: number) => {
    setDragging(true);
    setVelocity({ x: 0, y: 0 });
    lastPointer.current = { x, y };
  };

  const pointerMove = (x: number, y: number) => {
    if (!dragging) return;
    const dx = limit((x - lastPointer.current.x) * dragSensitivity);
    const dy = limit((lastPointer.current.y - y) * dragSensitivity);
    setRotation((current) => ({
      x: normalizeAngle(current.x + dy),
      y: normalizeAngle(current.y + dx),
    }));
    setVelocity({ x: dy, y: dx });
    lastPointer.current = { x, y };
  };

  if (!mounted || images.length === 0) return null;

  return (
    <>
      <div
        className={`relative select-none touch-none cursor-grab active:cursor-grabbing ${className}`}
        style={{ width: "100%", maxWidth: containerSize, aspectRatio: "1", perspective }}
        onMouseDown={(event) => pointerDown(event.clientX, event.clientY)}
        onMouseMove={(event) => pointerMove(event.clientX, event.clientY)}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onTouchStart={(event) => {
          const touch = event.touches[0];
          if (touch) pointerDown(touch.clientX, touch.clientY);
        }}
        onTouchMove={(event) => {
          const touch = event.touches[0];
          if (touch) pointerMove(touch.clientX, touch.clientY);
        }}
        onTouchEnd={() => setDragging(false)}
        aria-label="Interactive sphere of client review imagery"
      >
        <div className="absolute inset-0 rounded-full border border-gold-400/15 bg-[radial-gradient(circle_at_50%_42%,rgba(226,168,145,.14),transparent_54%)] shadow-[inset_0_0_80px_rgba(0,0,0,.3),0_25px_80px_rgba(0,0,0,.2)]" />
        {images.map((image, index) => {
          const point = rotatePoint(positions[index]);
          const depth = (point.z + sphereRadius) / (sphereRadius * 2);
          const visible = point.z > -sphereRadius * 0.72;
          const size = containerSize * baseImageScale * (0.7 + depth * 0.45);
          const scale = hovered === image.id ? 1.22 : 1;
          return (
            <button
              key={image.id}
              type="button"
              aria-label={`View ${image.alt}`}
              className="absolute rounded-full border border-white/25 bg-neutral-900/60 p-0.5 shadow-[0_8px_22px_rgba(0,0,0,.35)] transition-transform duration-200 hover:border-gold-400/80"
              style={{
                width: size,
                height: size,
                left: `calc(50% + ${point.x}px)`,
                top: `calc(50% + ${point.y}px)`,
                zIndex: Math.round(1000 + point.z),
                opacity: visible ? 0.35 + depth * 0.65 : 0,
                pointerEvents: visible ? "auto" : "none",
                transform: `translate(-50%, -50%) scale(${scale})`,
              }}
              onMouseEnter={() => setHovered(image.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setSelected(image)}
            >
              <img src={image.src} alt={image.alt} className="h-full w-full rounded-full object-cover" draggable={false} />
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="relative w-full max-w-md overflow-hidden border border-white/15 bg-neutral-900" onClick={(event) => event.stopPropagation()}>
            <img src={selected.src} alt={selected.alt} className="aspect-square w-full object-cover" />
            <button type="button" onClick={() => setSelected(null)} className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white" aria-label="Close image">
              <X size={16} />
            </button>
            {(selected.title || selected.description) && (
              <div className="p-5">
                {selected.title && <h3 className="font-serif text-xl text-white">{selected.title}</h3>}
                {selected.description && <p className="mt-2 text-sm text-white/60">{selected.description}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
