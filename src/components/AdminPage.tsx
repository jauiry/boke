import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, Send, Lock, Bold, Code, List, Hash, Link2, Quote, Image, Sparkles, Edit3, Trash2, FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { categories, tags } from '@/data/blogData';
import type { PostListItem } from '@/types/api';

interface AdminPageProps {
  onBack: () => void;
}

const STORAGE_KEY = 'blog_admin_secret';

// 轻量 Markdown 预览（复用 PostDetail 渲染逻辑的核心部分）
function renderPreview(content: string): React.ReactNode[] {
  if (!content) return [<p key="placeholder" className="text-ink-muted italic">预览区域，开始输入内容...</p>];

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`preview-code-${i}`} className="bg-[var(--paper-deep)] text-[var(--paper)] rounded-lg p-3 my-2 text-sm overflow-x-auto">
            <code>{codeLines.join('\n')}</code>
          </pre>
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(lines[i]);
      continue;
    }

    if (trimmed.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-xl font-bold text-ink mt-4 mb-2">{trimmed.replace('## ', '')}</h2>);
    } else if (trimmed.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-lg font-semibold text-ink mt-3 mb-1">{trimmed.replace('### ', '')}</h3>);
    } else if (trimmed.startsWith('# ')) {
      elements.push(<h1 key={i} className="text-2xl font-bold text-ink mt-6 mb-3">{trimmed.replace('# ', '')}</h1>);
    } else if (trimmed.startsWith('- ')) {
      elements.push(<li key={i} className="text-ink-soft ml-4 mb-1 list-disc">{trimmed.replace('- ', '')}</li>);
    } else if (/^\d+\.\s/.test(trimmed)) {
      elements.push(<li key={i} className="text-ink-soft ml-4 mb-1 list-decimal">{trimmed.replace(/^\d+\.\s/, '')}</li>);
    } else if (trimmed.startsWith('> ')) {
      elements.push(<blockquote key={i} className="border-l-3 border-[var(--cinnabar)]/55 pl-3 py-1 my-2 bg-[var(--paper)] italic text-ink-soft">{trimmed.replace('> ', '')}</blockquote>);
    } else if (trimmed.startsWith('---')) {
      elements.push(<hr key={i} className="my-4 border-black/10" />);
    } else if (trimmed === '') {
      elements.push(<div key={i} className="h-3" />);
    } else {
      const html = trimmed
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code class="bg-[var(--paper-deep)] px-1 rounded text-cinnabar text-sm">$1</code>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-cinnabar underline" target="_blank">$1</a>');
      elements.push(<p key={i} className="text-ink-soft mb-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />);
    }
  }

  if (inCodeBlock && codeLines.length > 0) {
    elements.push(
      <pre key="preview-code-end" className="bg-[var(--paper-deep)] text-[var(--paper)] rounded-lg p-3 my-2 text-sm overflow-x-auto">
        <code>{codeLines.join('\n')}</code>
      </pre>
    );
  }

  return elements;
}

// Markdown 工具栏按钮
const tools = [
  { label: '粗体', icon: Bold, insert: '**文本**' },
  { label: '代码', icon: Code, insert: '`代码`' },
  { label: '标题', icon: Hash, insert: '## ' },
  { label: '列表', icon: List, insert: '- ' },
  { label: '链接', icon: Link2, insert: '[文本](url)' },
  { label: '引用', icon: Quote, insert: '> ' },
  { label: '图片', icon: Image, insert: '![alt](url)' },
];

export default function AdminPage({ onBack }: AdminPageProps) {
  const [secret, setSecret] = useState(() => sessionStorage.getItem(STORAGE_KEY) || '');
  const [authenticated, setAuthenticated] = useState(!!sessionStorage.getItem(STORAGE_KEY));
  const [authError, setAuthError] = useState('');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('1');
  const [selectedTags, setSelectedTags] = useState<string[]>(['1']);
  const [featured, setFeatured] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 文章管理
  const [tab, setTab] = useState<'new' | 'manage'>('new');
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (data.success && data.data) setPosts(data.data);
    } catch { /* ignore */ }
    setLoadingPosts(false);
  }, []);

  useEffect(() => {
    if (tab === 'manage') fetchPosts();
  }, [tab, fetchPosts]);

  const handleEdit = useCallback(async (post: PostListItem) => {
    setTab('new');
    setEditingSlug(post.slug);
    setTitle(post.title);
    setContent(''); // 需要从详情 API 获取完整内容
    setFeatured(post.featured || false);

    // 获取完整文章内容
    try {
      const res = await fetch(`/api/posts/${post.slug}`);
      const data = await res.json();
      if (data.success && data.data?.content) {
        setContent(data.data.content);
      }
    } catch { /* fallback to excerpt */ }
  }, []);

  const handleDelete = useCallback(async (slug: string) => {
    const secretStr = sessionStorage.getItem(STORAGE_KEY) || '';
    setDeletingSlug(slug);
    try {
      const res = await fetch('/api/posts/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, secret: secretStr }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => prev.filter(p => p.slug !== slug));
        setMessage({ type: 'success', text: '文章已删除' });
      } else {
        setMessage({ type: 'error', text: data.error || '删除失败' });
      }
    } catch {
      setMessage({ type: 'error', text: '网络错误' });
    }
    setDeletingSlug(null);
  }, []);

  const handlePublish = useCallback(async () => {
    if (!title.trim() || !content.trim()) {
      setMessage({ type: 'error', text: '标题和内容不能为空' });
      return;
    }

    setPublishing(true);
    setMessage(null);

    const secretStr = sessionStorage.getItem(STORAGE_KEY) || '';
    const isEdit = !!editingSlug;

    try {
      const url = isEdit ? '/api/posts/edit' : '/api/publish';
      const method = isEdit ? 'PUT' : 'POST';
      const body: any = {
        title: title.trim(),
        content: content.trim(),
        categoryId,
        tags: selectedTags,
        featured,
        secret: secretStr,
      };
      if (isEdit) body.slug = editingSlug;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({
          type: 'success',
          text: isEdit ? '更新成功！' : `发布成功！${data.postUrl || ''}`,
        });
        resetForm();
      } else {
        setMessage({ type: 'error', text: data.error || '操作失败' });
      }
    } catch {
      setMessage({ type: 'error', text: '网络错误' });
    } finally {
      setPublishing(false);
    }
  }, [title, content, categoryId, selectedTags, featured, editingSlug]);

  const resetForm = useCallback(() => {
    setTitle('');
    setContent('');
    setCategoryId('1');
    setSelectedTags(['1']);
    setFeatured(false);
    setEditingSlug(null);
    setTab('manage');
    fetchPosts();
  }, [fetchPosts]);

  const handleAuth = useCallback(() => {
    if (secret.trim().length < 3) {
      setAuthError('请输入有效的密码');
      return;
    }
    sessionStorage.setItem(STORAGE_KEY, secret);
    setAuthenticated(true);
    setAuthError('');
  }, [secret]);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAuthenticated(false);
    setSecret('');
    setAuthError('');
  }, []);

  const insertAtCursor = useCallback((insertText: string) => {
    const textarea = document.getElementById('editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.substring(0, start);
    const after = content.substring(end);

    setContent(before + insertText + after);

    // 恢复光标位置
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + insertText.length, start + insertText.length);
    });
  }, [content]);

  const toggleTag = useCallback((tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  }, []);

  // 未认证 — 显示登录
  if (!authenticated) {
    return (
      <div className="ink-page min-h-[100dvh] pb-16 pt-24">
        <div className="max-w-md mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[var(--paper-deep)] rounded-2xl p-8 shadow-lg border border-black/10 dark:border-white/10"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#59615a] to-[#a83f32] flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-xl font-bold text-ink dark:text-white">管理后台</h1>
              <p className="text-ink-muted dark:text-ink-muted text-sm mt-1">输入密码以继续</p>
            </div>

            <input
              type="password"
              value={secret}
              onChange={(e) => { setSecret(e.target.value); setAuthError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
              placeholder="输入发布密码"
              className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/15 bg-[var(--paper)] dark:bg-[#292e29] text-ink dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--cinnabar)] mb-3"
              autoFocus
            />

            {authError && (
              <p className="text-red-500 text-sm mb-3">{authError}</p>
            )}

            <Button
              onClick={handleAuth}
              className="w-full bg-gradient-to-r from-[#363d37] to-[#8f342a] hover:from-[#202521] hover:to-[#782c24] text-white"
            >
              进入后台
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // 已认证 — 编辑器
  return (
    <div className="ink-page min-h-[100dvh] pb-16 pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 顶部栏 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-ink dark:text-white">
              {editingSlug ? '编辑文章' : '发布新文章'}
            </h1>
            {editingSlug && (
              <button onClick={resetForm} className="text-sm text-cinnabar hover:underline">取消编辑</button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className={showPreview ? 'bg-[color-mix(in_srgb,var(--cinnabar)_7%,var(--paper))] border-[var(--cinnabar)]/35 text-cinnabar' : ''}
            >
              <Eye className="w-4 h-4 mr-1" />
              {showPreview ? '编辑' : '预览'}
            </Button>
            <Button
              size="sm"
              onClick={handlePublish}
              disabled={publishing}
              className="bg-gradient-to-r from-[#363d37] to-[#8f342a] hover:from-[#202521] hover:to-[#782c24] text-white"
            >
              {publishing ? (
                <><Sparkles className="w-4 h-4 mr-1 animate-spin" /> {editingSlug ? '更新中...' : '发布中...'}</>
              ) : (
                <>{editingSlug ? <Edit3 className="w-4 h-4 mr-1" /> : <Send className="w-4 h-4 mr-1" />} {editingSlug ? '更新' : '发布'}</>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <Lock className="w-3 h-3 mr-1" /> 退出
            </Button>
          </div>
        </div>

        {/* 消息提示 */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mb-4 p-4 rounded-xl text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Bar */}
        <div className="flex gap-1 mb-6 bg-white dark:bg-[var(--paper-deep)] rounded-xl p-1 border border-black/10 dark:border-white/10 w-fit">
          <button
            onClick={() => { setTab('new'); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'new'
                ? 'bg-[color-mix(in_srgb,var(--cinnabar)_12%,var(--paper))] dark:bg-[color-mix(in_srgb,var(--cinnabar)_16%,var(--paper))] text-cinnabar dark:text-cinnabar'
                : 'text-ink-muted hover:text-ink-soft dark:hover:text-ink-soft'
            }`}
          >
            <Plus className="w-4 h-4" /> 新建
          </button>
          <button
            onClick={() => { setTab('manage'); fetchPosts(); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'manage'
                ? 'bg-[color-mix(in_srgb,var(--cinnabar)_12%,var(--paper))] dark:bg-[color-mix(in_srgb,var(--cinnabar)_16%,var(--paper))] text-cinnabar dark:text-cinnabar'
                : 'text-ink-muted hover:text-ink-soft dark:hover:text-ink-soft'
            }`}
          >
            <FileText className="w-4 h-4" /> 管理 ({posts.length})
          </button>
        </div>

        {/* 文章管理列表 */}
        {tab === 'manage' && (
          <div className="mb-8">
            {loadingPosts ? (
              <div className="text-center py-12 text-ink-muted">加载中...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 text-ink-muted">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>暂无文章</p>
              </div>
            ) : (
              <div className="space-y-2">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-4 bg-white dark:bg-[var(--paper-deep)] rounded-xl border border-black/10 dark:border-white/10 hover:border-black/10 dark:hover:border-[var(--cinnabar)]/35 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-ink dark:text-white truncate">
                        {post.title}
                      </h3>
                      <p className="text-sm text-ink-muted truncate mt-0.5">
                        {post.slug} · {post.createdAt?.slice(0, 10)} · {post.readTime}分钟
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-4 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(post)}
                        className="text-ink-muted hover:text-cinnabar"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm(`确定删除「${post.title}」？此操作不可撤销。`)) {
                            handleDelete(post.slug);
                          }
                        }}
                        disabled={deletingSlug === post.slug}
                        className="text-ink-muted hover:text-red-600"
                      >
                        {deletingSlug === post.slug ? (
                          <Sparkles className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'new' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* 编辑面板 */}
          <div className="space-y-4">
            {/* 元数据 */}
            <div className="bg-white dark:bg-[var(--paper-deep)] rounded-xl p-5 border border-black/10 dark:border-white/10 space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="文章标题"
                className="w-full bg-transparent text-lg font-semibold text-ink placeholder:text-ink-muted focus:outline-none"
              />

              <div className="flex flex-wrap items-center gap-3">
                {/* 分类 */}
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="text-sm rounded-lg border border-black/10 dark:border-white/15 bg-[var(--paper)] dark:bg-[#292e29] px-3 py-1.5 text-ink-soft dark:text-ink-soft focus:outline-none focus:ring-2 focus:ring-[var(--cinnabar)]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                {/* 标签选择 */}
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                      selectedTags.includes(tag.id)
                        ? 'text-white'
                        : 'bg-[var(--paper-deep)] dark:bg-[#292e29] text-ink-soft dark:text-ink-muted hover:bg-[color-mix(in_srgb,var(--ink)_10%,var(--paper))]'
                    }`}
                    style={selectedTags.includes(tag.id) ? { backgroundColor: tag.color } : {}}
                  >
                    {tag.name}
                  </button>
                ))}

                <label className="flex items-center gap-1.5 text-sm text-ink-soft dark:text-ink-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded accent-[var(--cinnabar)]"
                  />
                  精选
                </label>
              </div>
            </div>

            {/* Markdown 工具栏 */}
            <div className="flex flex-wrap gap-1 p-2 bg-white dark:bg-[var(--paper-deep)] rounded-xl border border-black/10 dark:border-white/10">
              {tools.map((tool) => (
                <button
                  key={tool.label}
                  onClick={() => insertAtCursor(tool.insert)}
                  className="p-2 rounded-lg text-ink-muted hover:text-cinnabar hover:bg-[color-mix(in_srgb,var(--cinnabar)_7%,var(--paper))] dark:hover:bg-[color-mix(in_srgb,var(--cinnabar)_18%,var(--paper))]/20 transition-colors"
                  title={tool.label}
                >
                  <tool.icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            {/* 编辑器 / 预览 */}
            {showPreview ? (
              <div className="prose min-h-[400px] max-w-none border border-black/10 bg-[var(--paper)] p-6 dark:border-white/10 dark:prose-invert">
                {renderPreview(content)}
              </div>
            ) : (
              <textarea
                id="editor-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="开始写 Markdown 内容...&#10;&#10;## 标题&#10;正文内容...&#10;&#10;```js&#10;console.log('代码块')&#10;```"
                className="min-h-[400px] w-full resize-y border border-black/10 bg-[var(--paper)] p-5 font-mono text-sm leading-relaxed text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-[var(--cinnabar)] dark:border-white/10"
              />
            )}
          </div>

          {/* 实时预览面板（桌面端常显） */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-white dark:bg-[var(--paper-deep)] rounded-xl p-6 border border-black/10 dark:border-white/10 min-h-[500px] max-h-[calc(100vh-8rem)] overflow-y-auto">
              <h3 className="text-sm font-medium text-ink-muted mb-4 flex items-center gap-2">
                <Eye className="w-4 h-4" /> 实时预览
              </h3>
              <div className="prose max-w-none dark:prose-invert">
                {renderPreview(content)}
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
