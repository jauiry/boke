import { useEffect, useRef } from 'react';

type Dot = { x: number; y: number; ox: number; oy: number; r: number; a: number; phase: number; speed: number; kind: 'mountain' | 'bird' };
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
    const source = new Image();
    source.src = '/art/ink-scroll-hero-v1.png';
    let imageReady = false;

    const sampleArtwork = () => {
      if (!imageReady) return;
      const buffer = document.createElement('canvas');
      buffer.width = Math.max(1, Math.round(width));
      buffer.height = Math.max(1, Math.round(height));
      const bufferContext = buffer.getContext('2d', { willReadFrequently: true });
      if (!bufferContext) return;
      const scale = Math.max(width / source.naturalWidth, height / source.naturalHeight);
      const drawWidth = source.naturalWidth * scale;
      const drawHeight = source.naturalHeight * scale;
      const offsetX = (width - drawWidth) * 0.5;
      const offsetY = (height - drawHeight) * 0.42;
      bufferContext.drawImage(source, offsetX, offsetY, drawWidth, drawHeight);
      const pixels = bufferContext.getImageData(0, 0, buffer.width, buffer.height).data;
      const step = width < 640 ? 7 : 5;
      const sampled: Dot[] = [];
      for (let y = step; y < height; y += step) {
        for (let x = step; x < width; x += step) {
          const mountainZone = y > height * 0.27 && y < height * 0.72 && (x < width * 0.4 || x > width * 0.6);
          const birdZone = y > height * 0.08 && y < height * 0.31 && x > width * 0.54;
          if (!mountainZone && !birdZone) continue;
          const pixel = (Math.floor(y) * buffer.width + Math.floor(x)) * 4;
          const luminance = pixels[pixel] * 0.299 + pixels[pixel + 1] * 0.587 + pixels[pixel + 2] * 0.114;
          const threshold = birdZone ? 118 : 145;
          if (luminance > threshold || Math.random() > (birdZone ? 0.82 : 0.56)) continue;
          const kind = birdZone ? 'bird' : 'mountain';
          sampled.push({
            x, y, ox: x, oy: y,
            r: kind === 'bird' ? 0.65 + Math.random() * 1.15 : 0.45 + Math.random() * 1.65,
            a: Math.min(0.92, 0.28 + (threshold - luminance) / threshold + Math.random() * 0.18),
            phase: Math.random() * Math.PI * 2,
            speed: 0.6 + Math.random() * 1.5,
            kind,
          });
        }
      }
      dots = sampled;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const ratio = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.max(1, Math.floor(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      sampleArtwork();
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
      context.save();
      context.globalAlpha = 0.5;
      drawWash();
      for (const dot of dots) {
        const dx = dot.x - pointer.x;
        const dy = dot.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        const push = distance < 155 ? (155 - distance) / 155 : 0;
        const gust = dot.kind === 'bird' ? 9 : 4.6;
        const driftX = reduced ? 0 : Math.cos(tick * 2.8 * dot.speed + dot.phase) * gust;
        const driftY = reduced ? 0 : Math.sin(tick * 3.6 * dot.speed + dot.phase) * gust * 0.68;
        const wind = reduced ? 0 : Math.sin(tick * (dot.kind === 'bird' ? 1.2 : 1.8) + dot.oy * 0.015) * (dot.kind === 'bird' ? 10 : 3.2);
        const tx = dot.ox + driftX + wind + (distance ? (dx / distance) * push * (dot.kind === 'bird' ? 88 : 68) : 0);
        const ty = dot.oy + driftY + (dot.kind === 'bird' ? Math.sin(tick * 6 + dot.phase) * 3.5 : 0) + (distance ? (dy / distance) * push * 48 : 0);
        dot.x += (tx - dot.x) * 0.085;
        dot.y += (ty - dot.y) * 0.085;
        context.beginPath();
        context.fillStyle = `rgba(24,28,25,${dot.a})`;
        context.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();

      drawMotes();

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

    void source.decode().then(() => {
      imageReady = true;
      sampleArtwork();
      if (!motionEnabled) draw(performance.now());
    }).catch(() => { imageReady = false; });
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
