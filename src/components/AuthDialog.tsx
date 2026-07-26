import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Github, LoaderCircle, LogOut, Mail, UserRound, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthDialog() {
  const { configured, loading, user, signInWithEmail, signInWithGitHub, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  const sendMagicLink = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      await signInWithEmail(email);
      setMessage({ type: 'success', text: '登录链接已寄出，请前往邮箱查收。' });
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : '登录请求失败，请稍后重试。' });
    } finally {
      setSubmitting(false);
    }
  };

  const userName = user?.user_metadata?.name || user?.user_metadata?.user_name || user?.email?.split('@')[0];
  const avatar = user?.user_metadata?.avatar_url as string | undefined;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="auth-trigger focus-ring" aria-label={user ? `打开 ${userName || '个人'} 账户` : '登录账户'}>
        {avatar ? <img src={avatar} alt="" className="h-7 w-7 rounded-full object-cover" /> : <UserRound className="h-[18px] w-[18px]" />}
        <span className="hidden lg:inline">{loading ? '检印中' : user ? userName : '登录'}</span>
      </button>

      {createPortal(<AnimatePresence>
        {open && (
          <motion.div className="auth-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
            <motion.section role="dialog" aria-modal="true" aria-labelledby={titleId} className="auth-sheet" initial={{ opacity: 0, y: 18, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.985 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}>
              <div className="paper-noise absolute inset-0" aria-hidden="true" />
              <button type="button" onClick={() => setOpen(false)} className="auth-close focus-ring" aria-label="关闭登录窗口"><X className="h-5 w-5" /></button>
              <div className="relative">
                <p className="auth-kicker">一方私印 · 识君归来</p>
                <h2 id={titleId} className="mt-3 font-calligraphy text-4xl text-ink">{user ? '此间有你' : '入席读帖'}</h2>
                <p className="mt-3 max-w-md text-sm leading-7 text-ink-muted">{user ? '你的身份已经确认，收藏、评论与阅读记录将在此账号下保存。' : '登录后可收藏文章、保留阅读足迹，并以自己的身份参与讨论。'}</p>

                {!configured ? (
                  <div className="auth-notice mt-7" role="status">登录界面已就绪，待站主配置 Supabase 项目后即可启用。</div>
                ) : user ? (
                  <div className="mt-8 border-y border-black/10 py-5 dark:border-white/10">
                    <div className="flex items-center gap-4">
                      {avatar ? <img src={avatar} alt="" className="h-12 w-12 rounded-full object-cover" /> : <span className="auth-avatar"><UserRound className="h-5 w-5" /></span>}
                      <div className="min-w-0"><p className="truncate font-medium text-ink">{userName || '已登录读者'}</p><p className="truncate text-xs text-ink-muted">{user.email}</p></div>
                    </div>
                    <button type="button" className="auth-secondary mt-5" onClick={() => signOut().then(() => setOpen(false))}><LogOut className="h-4 w-4" />退出登录</button>
                  </div>
                ) : (
                  <div className="mt-7">
                    <button type="button" className="auth-primary" onClick={() => signInWithGitHub().catch((error) => setMessage({ type: 'error', text: error.message }))}><Github className="h-5 w-5" />使用 GitHub 登录</button>
                    <div className="auth-divider"><span>或以邮箱收取登录帖</span></div>
                    <form onSubmit={sendMagicLink} className="space-y-3">
                      <label htmlFor="auth-email" className="block text-xs tracking-[0.16em] text-ink-muted">邮箱地址</label>
                      <div className="auth-email-row"><Mail className="h-4 w-4 text-ink-muted" aria-hidden="true" /><input id="auth-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /><button type="submit" disabled={submitting}>{submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : '寄出'}</button></div>
                    </form>
                  </div>
                )}
                {message && <p className={`auth-message ${message.type}`} role="status">{message.text}</p>}
                <p className="mt-6 text-[11px] leading-5 text-ink-muted">登录即表示你同意本站仅使用必要信息保存个人阅读数据。</p>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}
    </>
  );
}
