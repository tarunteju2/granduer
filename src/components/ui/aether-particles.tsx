'use client';

import { useEffect, useRef } from 'react';

export const AetherParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;
      color: string;
      draw: () => void;
      update: () => void;
    }> = [];
    const mouse = { x: null as number | null, y: null as number | null, radius: 150 };

    const init = () => {
      particles = [];
      const numberOfParticles = Math.min(96, Math.max(36, (canvas.height * canvas.width) / 24000));
      for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 1.5 + 0.5;
        const x = Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2;
        const y = Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2;
        const directionX = (Math.random() * 0.3) - 0.15;
        const directionY = (Math.random() * 0.3) - 0.15;
        // Gold/champagne particle colors for Grandeur
        const colors = [
          'rgba(226, 168, 145, 0.28)',  // Terracotta
          'rgba(241, 187, 166, 0.2)', // Champagne
          'rgba(255, 255, 255, 0.12)', // White
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];

        const particle = {
          x,
          y,
          directionX,
          directionY,
          size,
          color,
          draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
          },
          update() {
            if (this.x > canvas.width || this.x < 0) {
              this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
              this.directionY = -this.directionY;
            }

            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {
              const dx = mouse.x - this.x;
              const dy = mouse.y - this.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance < mouse.radius + this.size) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouse.radius - distance) / mouse.radius;
                this.x -= forceDirectionX * force * 2;
                this.y -= forceDirectionY * force * 2;
              }
            }

            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
          }
        };
        particles.push(particle);
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const connect = () => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
            + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));

          if (distance < (canvas.width / 10) * (canvas.height / 10)) {
            const calculatedOpacity = Math.max(0, 1 - (distance / 15000));
            ctx.strokeStyle = `rgba(226, 168, 145, ${calculatedOpacity * 0.12})`;
            ctx.lineWidth = 0.35;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      // Clear instead of fading: a translucent fill accumulated polygon trails,
      // eventually turning the entire background into a muddy mesh.
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      connect();
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[1] opacity-25"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
