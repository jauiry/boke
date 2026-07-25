import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Github, Sparkles } from 'lucide-react';
import { posts } from '@/data/blogData';
import InkParticleLandscape from './InkParticleLandscape';

interface HeroProps {
  onExplore: () => void;
}

export default function Hero({ onExplore }: HeroProps) {
  const stats = useMemo(() => {
    const views = posts.reduce((sum, post) => sum + (post.views || 0), 0);
    return [
      { value: String(posts.length).padStart(2, '0'), label: '篇章' },
      { value: views > 999 ? `${(views / 1000).toFixed(1)}k` : String(views), label: '阅览' },
      { value: '∞', label: '求索' },
    ];
  }, []);

  return (
    <section className="ink-hero relative min-h-[100svh] overflow-hidden pt-20" aria-labelledby="hero-title">
      <div className="paper-noise absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-[72%] opacity-90" aria-hidden="true">
        <InkParticleLandscape />
      </div>
      <div className="ink-sun absolute right-[13%] top-[20%] h-28 w-28 rounded-full md:h-40 md:w-40" aria-hidden="true" />
      <div className="absolute left-[8%] top-[24%] hidden text-[11px] tracking-[0.45em] text-ink-muted lg:block [writing-mode:vertical-rl]">
        山高水长 · 向内求索
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl items-center px-5 pb-20 sm:px-8 lg:px-12">
        <div className="max-w-3xl pt-4 md:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 inline-flex items-center gap-3 text-xs tracking-[0.28em] text-ink-muted"
          >
            <span className="h-px w-10 bg-cinnabar/70" />
            <Sparkles className="h-3.5 w-3.5 text-cinnabar" />
            嘉明的数字山水
          </motion.div>

          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.7 }}
            className="font-serif-cn text-[clamp(3.5rem,10vw,8rem)] font-semibold leading-[0.92] tracking-[0.04em] text-ink"
          >
            见字
            <span className="relative ml-[0.08em] inline-block text-cinnabar">
              如面
              <span className="absolute -right-7 -top-5 rotate-6 border border-cinnabar/60 px-1.5 py-1 text-[10px] font-normal leading-none tracking-normal text-cinnabar md:-right-10 md:text-xs">
                嘉明
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.7 }}
            className="mt-8 max-w-xl font-serif-cn text-lg leading-9 tracking-[0.08em] text-ink-soft md:text-xl"
          >
            以代码为笔，以思考为墨。记录技术、设计与生活里那些值得被慢慢看见的瞬间。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.7 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <button onClick={onExplore} className="ink-button group">
              入卷阅读
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
            </button>
            <a
              href="https://github.com/jauiry"
              target="_blank"
              rel="noopener noreferrer"
              className="ink-link"
            >
              <Github className="h-4 w-4" /> GitHub 手札
            </a>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.42, duration: 0.8 }}
            className="mt-14 flex gap-10 border-l border-ink/15 pl-6 sm:gap-14"
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <dd className="font-serif-cn text-2xl text-ink md:text-3xl">{stat.value}</dd>
                <dt className="mt-1 text-[10px] tracking-[0.3em] text-ink-muted">{stat.label}</dt>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-[10px] tracking-[0.32em] text-ink-muted">
        向下 · 展卷
      </div>
    </section>
  );
}
