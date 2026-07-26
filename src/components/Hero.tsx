import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, BookOpen, Github, Pause, Play, ScrollText } from 'lucide-react';
import InkParticleLandscape from './InkParticleLandscape';

interface HeroProps { onExplore: () => void; }

const disciplines = ['测试基础', '自动化测试', '性能测试', '质量保障', '工具与框架', '随笔杂谈'];

export default function Hero({ onExplore }: HeroProps) {
  const [motionOn, setMotionOn] = useState(() => localStorage.getItem('ink-motion') !== 'off');
  const toggleMotion = () => {
    const next = !motionOn;
    setMotionOn(next);
    localStorage.setItem('ink-motion', next ? 'on' : 'off');
    window.dispatchEvent(new CustomEvent('ink-motion-toggle', { detail: next }));
  };

  return (
    <section className="scroll-hero relative min-h-[100dvh] overflow-hidden pt-20" aria-labelledby="hero-title">
      <div className="paper-noise absolute inset-0" aria-hidden="true" />
      <div className="scroll-cloud scroll-cloud-one" aria-hidden="true" />
      <div className="scroll-cloud scroll-cloud-two" aria-hidden="true" />
      <div className="absolute inset-0" aria-hidden="true"><InkParticleLandscape /></div>
      <div className="scroll-side-verse" aria-hidden="true"><span>○</span><em>行到水穷处，坐看云起时。</em><i>嘉明</i></div>
      <button type="button" onClick={toggleMotion} className="scroll-motion-toggle" aria-label={motionOn ? '暂停粒子动效' : '播放粒子动效'}>
        {motionOn ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}{motionOn ? '动效中' : '已暂停'}
      </button>

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-5rem)] max-w-[1500px] flex-col justify-center px-5 pb-8 pt-8 sm:px-8 lg:px-16">
        <div className="mx-auto mt-4 max-w-5xl text-center">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] tracking-[0.38em] text-ink-muted md:text-xs">
            嘉明的数字山水 · SOFTWARE QUALITY & CRAFT
          </motion.p>
          <motion.h1 id="hero-title" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="scroll-title mt-6 font-calligraphy text-ink">
            山河入卷，代码成章
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="mt-5 flex items-center justify-center gap-4 text-sm tracking-[0.2em] text-ink-soft md:text-lg">
            <span>郏祥瑞 · 软件测试与技术札记</span><span className="scroll-seal">嘉明<br />手札</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button onClick={onExplore} className="scroll-primary"><ScrollText className="h-4 w-4" />展开卷轴<ArrowDown className="h-4 w-4" /></button>
            <button onClick={onExplore} className="scroll-secondary"><BookOpen className="h-4 w-4" />进入文章</button>
            <a href="https://github.com/jauiry" target="_blank" rel="noopener noreferrer" className="scroll-github" aria-label="访问 GitHub"><Github className="h-4 w-4" /></a>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }} className="scroll-disciplines">
          {disciplines.map((item, index) => <span key={item}><b>{['◇', '⌘', '↗', '⬡', '✣', '◆'][index]}</b>{item}</span>)}
        </motion.div>
        <div className="scroll-waterline" aria-hidden="true"><span /><span /><span /></div>
      </div>
    </section>
  );
}
