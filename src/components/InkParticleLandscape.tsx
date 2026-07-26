import { useEffect, useRef } from 'react';

type Dot = { x: number; y: number; ox: number; oy: number; r: number; a: number; phase: number; speed: number; tone: 'ink' | 'gold' | 'red' };
type Ripple = { x: number; y: number; born: number };
type Mote = { x: number; y: number; vx: number; vy: number; r: number; a: number; life: number; tone: 'ink' | 'gold' | 'red' };

export default function InkParticleLandscape() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: -999, y: -999 };
    const ripples: Ripple[] = [];
    let motes: Mote[] = [];
    let dots: Dot[] = [];
    let width = 1;
    let height = 1;
    let animation = 0;
    let tick = 0;
    let lastTrail = 0;
    let motionEnabled = localStorage.getItem('ink-motion') !== 'off';

    const ridge = (x: number, side: 'left' | 'right') => {
      const n = side === 'left' ? x / width : (width - x) / width;
      const primary = Math.exp(-Math.pow((n - 0.13) * 9, 2)) * 0.28;
      const secondary = Math.exp(-Math.pow((n - 0.31) * 13, 2)) * 0.16;
      return height * (0.76 - primary - secondary - Math.sin(n * 28) * 0.022);
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
        speed: 0.65 + Math.random() * 1.5,
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
      const count = Math.min(3600, Math.max(1100, Math.floor(width * 2.45)));
      dots = Array.from({ length: count }, (_, index) => makeMountainDot(index % 2 ? 'left' : 'right'));
      motes = Array.from({ length: Math.min(180, Math.max(80, Math.floor(width / 8))) }, (_, index) => ({
        x: Math.random() * width,
        y: height * (0.2 + Math.random() * 0.62),
        vx: (Math.random() - 0.35) * 0.7,
        vy: -0.12 - Math.random() * 0.42,
        r: 0.8 + Math.random() * 2.4,
        a: 0.28 + Math.random() * 0.52,
        life: 1,
        tone: index % 11 === 0 ? 'red' : index % 3 === 0 ? 'gold' : 'ink',
      }));
    };

    const drawInkMass = (side: 'left' | 'right') => {
      const extent = width * 0.46;
      const start = side === 'left' ? 0 : width - extent;
      const end = side === 'left' ? extent : width;
      const gradient = context.createLinearGradient(0, height * 0.34, 0, height * 0.77);
      gradient.addColorStop(0, 'rgba(24,29,25,.38)');
      gradient.addColorStop(0.38, 'rgba(27,32,28,.25)');
      gradient.addColorStop(1, 'rgba(35,39,35,.03)');
      context.save();
      context.filter = 'blur(1.2px)';
      context.fillStyle = gradient;
      context.beginPath();
      context.moveTo(start, height * 0.76);
      const steps = 90;
      for (let index = 0; index <= steps; index++) {
        const x = start + ((end - start) * index) / steps;
        const y = ridge(x, side) + Math.sin(index * 1.7) * 3;
        context.lineTo(x, y);
      }
      context.lineTo(end, height * 0.78);
      context.closePath();
      context.fill();
      context.restore();
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

    const addBurst = (x: number, y: number, amount: number) => {
      for (let index = 0; index < amount; index++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.7 + Math.random() * 3.2;
        motes.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, r: 0.8 + Math.random() * 2.8, a: 0.45 + Math.random() * 0.5, life: 1, tone: index % 5 === 0 ? 'red' : index % 2 === 0 ? 'gold' : 'ink' });
      }
    };

    const drawMotes = () => {
      const intensity = reduced ? 0.45 : 1;
      for (let index = motes.length - 1; index >= 0; index--) {
        const mote = motes[index];
        if (motionEnabled) {
          mote.x += (mote.vx + Math.sin(tick * 3 + index) * 0.18) * intensity;
          mote.y += mote.vy * intensity;
          mote.life -= mote.life < 1 ? 0.012 : 0;
        }
        if (mote.y < height * 0.12 || mote.x > width + 30 || mote.x < -30 || mote.life <= 0) {
          if (motes.length > 220) { motes.splice(index, 1); continue; }
          mote.x = Math.random() * width;
          mote.y = height * (0.62 + Math.random() * 0.24);
          mote.life = 1;
        }
        context.save();
        context.shadowBlur = mote.tone === 'ink' ? 2 : 9;
        context.shadowColor = mote.tone === 'red' ? 'rgba(177,61,43,.8)' : mote.tone === 'gold' ? 'rgba(190,145,57,.9)' : 'rgba(28,32,29,.45)';
        context.fillStyle = mote.tone === 'red' ? `rgba(177,61,43,${mote.a * mote.life})` : mote.tone === 'gold' ? `rgba(190,145,57,${mote.a * mote.life})` : `rgba(28,32,29,${mote.a * .72 * mote.life})`;
        context.beginPath();
        context.arc(mote.x, mote.y, mote.r, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
    };

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);
      tick += 0.008;
      drawWash();
      drawInkMass('left');
      drawInkMass('right');

      for (const dot of dots) {
        const dx = dot.x - pointer.x;
        const dy = dot.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        const push = distance < 155 ? (155 - distance) / 155 : 0;
        const gust = dot.tone === 'gold' ? 11 : dot.tone === 'red' ? 6 : 3.8;
        const driftX = reduced ? 0 : Math.cos(tick * 2.8 * dot.speed + dot.phase) * gust;
        const driftY = reduced ? 0 : Math.sin(tick * 3.6 * dot.speed + dot.phase) * gust * 0.68;
        const wind = reduced ? 0 : Math.sin(tick * 1.8 + dot.oy * 0.015) * (dot.tone === 'ink' ? 2.5 : 7);
        const tx = dot.ox + driftX + wind + (distance ? (dx / distance) * push * 68 : 0);
        const ty = dot.oy + driftY - (dot.tone === 'gold' ? Math.sin(tick * dot.speed + dot.phase) * 8 : 0) + (distance ? (dy / distance) * push * 48 : 0);
        dot.x += (tx - dot.x) * 0.085;
        dot.y += (ty - dot.y) * 0.085;
        context.beginPath();
        context.fillStyle = dot.tone === 'gold' ? `rgba(157,117,47,${dot.a * 0.75})` : dot.tone === 'red' ? `rgba(168,63,50,${dot.a * 0.8})` : `rgba(27,31,28,${dot.a})`;
        context.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        context.fill();
      }

      drawMotes();

      const birdDrift = reduced ? 0 : Math.sin(tick * 2.3) * 24;
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
      if (motionEnabled) animation = requestAnimationFrame(draw);
    };

    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
        clear();
        return;
      }
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      if (motionEnabled && performance.now() - lastTrail > 34) {
        addBurst(pointer.x, pointer.y, 3);
        lastTrail = performance.now();
      }
    };
    const ripple = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) return;
      ripples.push({ x: event.clientX - rect.left, y: event.clientY - rect.top, born: performance.now() });
      addBurst(event.clientX - rect.left, event.clientY - rect.top, 46);
    };
    const clear = () => { pointer.x = -999; pointer.y = -999; };
    const toggleMotion = (event: Event) => {
      const enabled = (event as CustomEvent<boolean>).detail;
      motionEnabled = enabled;
      cancelAnimationFrame(animation);
      if (enabled) animation = requestAnimationFrame(draw);
    };

    resize();
    draw(performance.now());
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', ripple, { passive: true });
    window.addEventListener('blur', clear);
    window.addEventListener('ink-motion-toggle', toggleMotion);
    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', ripple);
      window.removeEventListener('blur', clear);
      window.removeEventListener('ink-motion-toggle', toggleMotion);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full touch-none" aria-hidden="true" />;
}
