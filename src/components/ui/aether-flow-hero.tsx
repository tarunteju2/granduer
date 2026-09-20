"use client";

import React, { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { COMPANY } from '@/data/content';

interface Particle {
  x: number;
  y: number;
  directionX: number;
  directionY: number;
  size: number;
  color: string;
  update: () => void;
}

interface MouseState {
  x: number | null;
  y: number | null;
  radius: number;
}

interface AetherFlowHeroProps {
  /** Render only the animated background when embedding it in an existing hero. */
  backgroundOnly?: boolean;
}

const AetherFlowHero: React.FC<AetherFlowHeroProps> = ({ backgroundOnly = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const initParticles = useCallback((
    canvas: HTMLCanvasElement,
    ParticleClass: new (x: number, y: number, dx: number, dy: number, size: number, color: string) => Particle
  ): Particle[] => {
    const particles: Particle[] = [];
    const numberOfParticles = (canvas.height * canvas.width) / 9000;

    for (let i = 0; i < numberOfParticles; i++) {
      const size = Math.random() * 2 + 1;
      const x = Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2;
      const y = Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2;
      const directionX = Math.random() * 0.4 - 0.2;
      const directionY = Math.random() * 0.4 - 0.2;
      // Warm champagne particles keep the flow visible without overpowering the silk.
      const color = 'rgba(226, 168, 145, 0.62)';
      particles.push(new ParticleClass(x, y, directionX, directionY, size, color));
    }

    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse: MouseState = { x: null, y: null, radius: 150 };

    class ParticleClass {
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;
      color: string;

      constructor(x: number, y: number, directionX: number, directionY: number, size: number, color: string) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        if (!canvas) return;

        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius + this.size) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= forceDirectionX * force * 5;
            this.y -= forceDirectionY * force * 5;
          }
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = initParticles(canvas, ParticleClass);
    };

    const connect = () => {
      if (!ctx || !canvas) return;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
            + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));

          if (distance < (canvas.width / 7) * (canvas.height / 7)) {
            const opacityValue = 1 - (distance / 20000);

            const dxMouseA = particles[a].x - (mouse.x ?? 0);
            const dyMouseA = particles[a].y - (mouse.y ?? 0);
            const distanceMouseA = Math.sqrt(dxMouseA * dxMouseA + dyMouseA * dyMouseA);

            if (mouse.x && distanceMouseA < mouse.radius) {
              ctx.strokeStyle = `rgba(240, 238, 231, ${opacityValue * 0.34})`;
            } else {
              ctx.strokeStyle = `rgba(226, 168, 145, ${opacityValue * 0.46})`;
            }

            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      animationFrameId = requestAnimationFrame(animate);

      // In embedded mode, preserve the silk layer beneath the particles.
      // The standalone version keeps its original dark background.
      if (backgroundOnly) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = '#0d1112';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      connect();
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, [initParticles]);

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2 + 0.5,
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const scrollToForm = () => {
    const element = document.querySelector('#request-staff');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (backgroundOnly) {
    return (
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden="true">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-55 mix-blend-screen" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(226,168,145,.05),transparent_60%)]" />
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Canvas particle background */}
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d1112]/90 pointer-events-none" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(226, 168, 145, 0.08), transparent 60%)' }} />

      {/* Content */}
      <div className="relative z-10 text-center p-6 max-w-4xl mx-auto">
        <motion.div
          custom={0}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#e2a891]/10 border border-[#e2a891]/25 mb-8 backdrop-blur-sm"
        >
          <Sparkles className="h-4 w-4 text-[#e2a891]" />
          <span className="text-sm font-medium text-[#f0eee7]/80 tracking-wide">
            Hospitality Staffing Excellence
          </span>
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-[#f0eee7] via-[#f0eee7] to-[#f0eee7]/50"
          style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
        >
          {COMPANY.name}
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl mx-auto text-lg md:text-xl text-[#f0eee7]/50 mb-12 leading-relaxed font-light"
        >
          Premier staffing solutions for the hospitality industry. Connecting exceptional talent with distinguished establishments since {COMPANY.founded}.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={scrollToForm}
            className="group px-10 py-4 bg-[#e2a891] text-[#101416] font-medium rounded-sm shadow-lg hover:bg-[#f1bba6] transition-all duration-500 flex items-center gap-3"
          >
            Request Staff
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-10 py-4 border border-[#f0eee7]/20 text-[#f0eee7]/80 font-medium rounded-sm hover:border-[#e2a891]/50 hover:text-[#f0eee7] transition-all duration-500"
          >
            Learn More
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-2 text-[#f0eee7]/30">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-8 bg-gradient-to-b from-[#f0eee7]/30 to-transparent"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default AetherFlowHero;
