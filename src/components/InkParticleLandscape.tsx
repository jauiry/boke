import { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  originX: number;
  originY: number;
  size: number;
  alpha: number;
  drift: number;
};

export default function InkParticleLandscape() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: -1000, y: -1000 };
    let particles: Particle[] = [];
    let frame = 0;
    let animationFrame = 0;

    const mountainY = (x: number, width: number, height: number) => {
      const normalized = x / width;
      const ridge =
        Math.sin(normalized * Math.PI * 2.4) * 0.1 +
        Math.sin(normalized * Math.PI * 5.2 + 0.8) * 0.045;
      const peaks =
        Math.exp(-Math.pow((normalized - 0.27) * 7, 2)) * 0.19 +
        Math.exp(-Math.pow((normalized - 0.68) * 9, 2)) * 0.13;
      return height * (0.63 - ridge - peaks);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.min(620, Math.max(260, Math.floor(rect.width * 0.55)));
      particles = Array.from({ length: count }, (_, index) => {
        const x = (index / count) * rect.width + (Math.random() - 0.5) * 26;
        const ridge = mountainY(x, rect.width, rect.height);
        const depth = Math.pow(Math.random(), 1.8) * rect.height * 0.28;
        return {
          x,
          y: ridge + depth,
          originX: x,
          originY: ridge + depth,
          size: Math.random() * 1.7 + 0.35,
          alpha: Math.random() * 0.35 + 0.1,
          drift: Math.random() * Math.PI * 2,
        };
      });
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      context.clearRect(0, 0, rect.width, rect.height);
      frame += 0.008;

      for (const particle of particles) {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        const influence = distance < 110 ? (110 - distance) / 110 : 0;
        const targetX = particle.originX + Math.cos(frame + particle.drift) * (reduceMotion ? 0 : 2.2);
        const targetY = particle.originY + Math.sin(frame * 1.4 + particle.drift) * (reduceMotion ? 0 : 1.5);

        particle.x += (targetX + (distance ? (dx / distance) * influence * 20 : 0) - particle.x) * 0.04;
        particle.y += (targetY + (distance ? (dy / distance) * influence * 14 : 0) - particle.y) * 0.04;

        context.beginPath();
        context.fillStyle = `rgba(28, 32, 29, ${particle.alpha})`;
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      }

      if (!reduceMotion) animationFrame = requestAnimationFrame(draw);
    };

    const handlePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };

    const clearPointer = () => {
      pointer.x = -1000;
      pointer.y = -1000;
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    canvas.addEventListener('pointermove', handlePointer);
    canvas.addEventListener('pointerleave', clearPointer);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', handlePointer);
      canvas.removeEventListener('pointerleave', clearPointer);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
