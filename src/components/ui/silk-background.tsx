'use client';

import { useEffect, useRef } from 'react';

export const SilkBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let time = 0;
    const speed = 0.02;
    const scale = 2;
    const noiseIntensity = 0.8;
    // Render at 1/3 resolution (CSS stretches it) and cap ~24fps — the
    // per-pixel JS loop is the heaviest work on the page.
    const RES_DIVISOR = 3;
    const FRAME_MIN_MS = 1000 / 24;
    let lastFrame = 0;

    const resizeCanvas = () => {
      canvas.width = Math.max(1, Math.floor(window.innerWidth / RES_DIVISOR));
      canvas.height = Math.max(1, Math.floor(window.innerHeight / RES_DIVISOR));
      lastFrame = 0;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // A stable, tile-free hash keeps the silk grain deterministic between frames.
    const noise = (x: number, y: number) => {
      const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      return value - Math.floor(value);
    };

    const writePixel = (
      data: Uint8ClampedArray,
      width: number,
      x: number,
      y: number,
      r: number,
      g: number,
      b: number,
    ) => {
      const index = (y * width + x) * 4;
      data[index] = r;
      data[index + 1] = g;
      data[index + 2] = b;
      data[index + 3] = 255;
    };

    const prefersReducedTransparency = window.matchMedia('(prefers-reduced-transparency: reduce)').matches;
    const blockSize = 2;

    const renderBlock = (
      data: Uint8ClampedArray,
      width: number,
      height: number,
      x: number,
      y: number,
      r: number,
      g: number,
      b: number,
    ) => {
      for (let blockX = 0; blockX < blockSize && x + blockX < width; blockX += 1) {
        for (let blockY = 0; blockY < blockSize && y + blockY < height; blockY += 1) {
          writePixel(data, width, x + blockX, y + blockY, r, g, b);
        }
      }
    };

    const animate = (now: number) => {
      if (now - lastFrame < FRAME_MIN_MS) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrame = now;

      const { width, height } = canvas;

      // Build a fully opaque base first; writing only every second pixel without
      // filling its neighbor left transparent holes in the canvas.
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;
      const tOffset = speed * time;

      for (let x = 0; x < width; x += blockSize) {
        for (let y = 0; y < height; y += blockSize) {
          const u = (x / width) * scale;
          const v = (y / height) * scale;
          const texX = u;
          const texY = v + 0.03 * Math.sin(8.0 * texX - tOffset);
          const pattern = 0.6 + 0.4 * Math.sin(
            5.0 * (texX + texY + Math.cos(3.0 * texX + 5.0 * texY) + 0.02 * tOffset) +
            Math.sin(20.0 * (texX + texY - 0.1 * tOffset)),
          );
          const grain = (noise(x, y) - 0.5) * noiseIntensity;
          const intensity = Math.min(1, Math.max(0.08, pattern - grain / 15));
          const gold = Math.max(0, Math.sin((texX - texY) * 8 + tOffset * 0.45)) * 0.28;
          const edgeShade = 1 - 0.24 * Math.max(
            Math.abs(x / width - 0.5) * 2,
            Math.abs(y / height - 0.5) * 2,
          );
          const luminance = intensity * edgeShade;

          const red = Math.floor((38 + 92 * luminance + 34 * gold) * (prefersReducedTransparency ? 0.82 : 1));
          const green = Math.floor((43 + 75 * luminance + 23 * gold) * (prefersReducedTransparency ? 0.82 : 1));
          const blue = Math.floor((43 + 63 * luminance + 9 * gold) * (prefersReducedTransparency ? 0.82 : 1));
          renderBlock(data, width, height, x, y, red, green, blue);
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // A narrow champagne sheen gives the fabric direction without flattening it.
      const sheen = ctx.createLinearGradient(0, height, width, 0);
      sheen.addColorStop(0, 'rgba(226, 168, 145, 0)');
      sheen.addColorStop(0.42, 'rgba(226, 168, 145, 0.035)');
      sheen.addColorStop(0.52, 'rgba(255, 219, 173, 0.115)');
      sheen.addColorStop(0.62, 'rgba(226, 168, 145, 0.035)');
      sheen.addColorStop(1, 'rgba(226, 168, 145, 0)');
      ctx.fillStyle = sheen;
      ctx.fillRect(0, 0, width, height);

      const overlayGradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) / 2,
      );
      overlayGradient.addColorStop(0, 'rgba(4, 7, 8, 0.02)');
      overlayGradient.addColorStop(1, 'rgba(4, 7, 8, 0.5)');
      ctx.fillStyle = overlayGradient;
      ctx.fillRect(0, 0, width, height);

      // Fine gold grain is intentionally sparse so text remains readable.
      if (!prefersReducedTransparency) {
        ctx.globalAlpha = 0.14;
        for (let x = 0; x < width; x += 5) {
          for (let y = 0; y < height; y += 5) {
            if (noise(x + time * 0.25, y) > 0.93) {
              ctx.fillStyle = 'rgba(247, 205, 155, 0.22)';
              ctx.fillRect(x, y, 1, 1);
            }
          }
        }
        ctx.globalAlpha = 1;
      }

      time += 1;
      if (!prefersReducedMotion) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (prefersReducedMotion) {
      animate(performance.now());
    } else {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
};
