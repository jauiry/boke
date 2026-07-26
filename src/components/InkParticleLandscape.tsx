import { useEffect, useRef } from 'react';

type Dot = { x: number; y: number; ox: number; oy: number; r: number; a: number; phase: number; tone: 'ink' | 'gold' | 'red' };
type Ripple = { x: number; y: number; born: number };

export default function InkParticleLandscape() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: -999, y: -999 };
    const ripples: Ripple[] = [];
    let dots: Dot[] = [];
    let width = 1;
    let height = 1;
    let animation = 0;
    let tick = 0;

    const ridge = (x: number, side: 'left' | 'right') => {
      const n = side === 'left' ? x / width : (width - x) / width;
      const primary = Math.exp(-Math.pow((n - 0.13) * 9, 2)) * 0.35;
      const secondary = Math.exp(-Math.pow((n - 0.31) * 13, 2)) * 0.2;
      return height * (0.71 - primary - secondary - Math.sin(n * 28) * 0.025);
    };

    const makeMountainDot = (side: 'left' | 'right'): Dot => {
      const spread = Math.pow(Math.random(), 1.55) * width * 0.44;
      const x = side === 'left' ? spread : width - spread;
      const yTop = ridge(x, side);
      const depth = Math.pow(Math.random(), 1.7) * Math.max(16, height * 0.31);
      const toneRoll = Math.random();
      return {
        x, y: yTop + depth, ox: x, oy: yTop + depth,
        r: 0.35 + Math.random() * 1.7,
        a: 0.16 + Math.random() * 0.52,
        phase: Math.random() * Math.PI * 2,
        tone: toneRoll > 0.965 ? 'red' : toneRoll > 0.91 ? 'gold' : 'ink',
      };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const ratio = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.max(1, Math.floor(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(2100, Math.max(720, Math.floor(width * 1.45)));
      dots = Array.from({ length: count }, (_, index) => makeMountainDot(index % 2 ? 'left' : 'right'));
    };

    const drawWash = () => {
      const horizon = height * 0.68;
      const mist = context.createLinearGradient(0, height * 0.34, 0, height);
      mist.addColorStop(0, 'rgba(44,47,43,0)');
      mist.addColorStop(0.5, 'rgba(62,66,60,.11)');
      mist.addColorStop(0.7, 'rgba(34,38,34,.2)');
      mist.addColorStop(1, 'rgba(34,38,34,0)');
      context.fillStyle = mist;
      context.fillRect(0, height * 0.3, width, height * 0.7);

      context.strokeStyle = 'rgba(45,49,45,.11)';
      context.lineWidth = 1;
      for (let row = 0; row < 5; row++) {
        context.beginPath();
        context.moveTo(0, horizon + row * 9);
        context.bezierCurveTo(width * 0.25, horizon + 3 - row * 2, width * 0.7, horizon + 16 + row * 2, width, horizon + row * 8);
        context.stroke();
      }
    };

    const drawBird = (x: number, y: number, scale: number, alpha: number) => {
      context.strokeStyle = `rgba(31,35,31,${alpha})`;
      context.lineWidth = Math.max(0.7, scale * 0.65);
      context.beginPath();
      context.moveTo(x - scale * 8, y + scale * 2);
      context.quadraticCurveTo(x - scale * 4, y - scale * 5, x, y);
      context.quadraticCurveTo(x + scale * 5, y - scale * 6, x + scale * 10, y + scale * 1.5);
      context.stroke();
    };

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);
      tick += 0.008;
      drawWash();

      for (const dot of dots) {
        const dx = dot.x - pointer.x;
        const dy = dot.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        const push = distance < 125 ? (125 - distance) / 125 : 0;
        const driftX = reduced ? 0 : Math.cos(tick + dot.phase) * 1.4;
        const driftY = reduced ? 0 : Math.sin(tick * 1.2 + dot.phase) * 1.1;
        const tx = dot.ox + driftX + (distance ? (dx / distance) * push * 25 : 0);
        const ty = dot.oy + driftY + (distance ? (dy / distance) * push * 18 : 0);
        dot.x += (tx - dot.x) * 0.055;
        dot.y += (ty - dot.y) * 0.055;
        context.beginPath();
        context.fillStyle = dot.tone === 'gold' ? `rgba(157,117,47,${dot.a * 0.75})` : dot.tone === 'red' ? `rgba(168,63,50,${dot.a * 0.8})` : `rgba(27,31,28,${dot.a})`;
        context.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        context.fill();
      }

      const birdDrift = reduced ? 0 : Math.sin(tick * 0.65) * 8;
      drawBird(width * 0.67 + birdDrift, height * 0.18, 1.15, 0.72);
      drawBird(width * 0.74 + birdDrift * 0.7, height * 0.23, 0.72, 0.58);
      drawBird(width * 0.81 + birdDrift * 0.45, height * 0.17, 0.9, 0.64);
      drawBird(width * 0.87 + birdDrift * 0.3, height * 0.27, 0.58, 0.46);

      for (let index = ripples.length - 1; index >= 0; index--) {
        const age = time - ripples[index].born;
        if (age > 1300) { ripples.splice(index, 1); continue; }
        const progress = age / 1300;
        context.strokeStyle = `rgba(80,68,51,${(1 - progress) * 0.32})`;
        context.lineWidth = 1;
        for (let ring = 0; ring < 3; ring++) {
          context.beginPath();
          context.ellipse(ripples[index].x, ripples[index].y, progress * 78 + ring * 14, progress * 20 + ring * 4, 0, 0, Math.PI * 2);
          context.stroke();
        }
      }
      if (!reduced) animation = requestAnimationFrame(draw);
    };

    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    const ripple = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      ripples.push({ x: event.clientX - rect.left, y: event.clientY - rect.top, born: performance.now() });
    };
    const clear = () => { pointer.x = -999; pointer.y = -999; };

    resize();
    draw(performance.now());
    window.addEventListener('resize', resize);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerdown', ripple);
    canvas.addEventListener('pointerleave', clear);
    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerdown', ripple);
      canvas.removeEventListener('pointerleave', clear);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full touch-none" aria-hidden="true" />;
}
