import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, Send, Lock, Bold, Code, List, Hash, Link2, Quote, Image, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { categories, tags } from '@/data/blogData';

interface AdminPageProps {
  onBack: () => void;
}

const STORAGE_KEY = 'blog_admin_secret';

// 轻量 Markdown 预览（复用 PostDetail 渲染逻辑的核心部分）
function renderPreview(content: string): React.ReactNode[] {
  if (!content) return [<p key="placeholder" className="text-slate-400 italic">预览区域，开始输入内容...</p>];

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`preview-code-${i}`} className="bg-slate-800 text-slate-100 rounded-lg p-3 my-2 text-sm overflow-x-auto">
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
      elements.push(<h2 key={i} className="text-xl font-bold text-slate-900 mt-4 mb-2">{trimmed.replace('## ', '')}</h2>);
    } else if (trimmed.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-lg font-semibold text-slate-900 mt-3 mb-1">{trimmed.replace('### ', '')}</h3>);
    } else if (trimmed.startsWith('# ')) {
      elements.push(<h1 key={i} className="text-2xl font-bold text-slate-900 mt-6 mb-3">{trimmed.replace('# ', '')}</h1>);
    } else if (trimmed.startsWith('- ')) {
      elements.push(<li key={i} className="text-slate-700 ml-4 mb-1 list-disc">{trimmed.replace('- ', '')}</li>);
    } else if (/^\d+\.\s/.test(trimmed)) {
      elements.push(<li key={i} className="text-slate-700 ml-4 mb-1 list-decimal">{trimmed.replace(/^\d+\.\s/, '')}</li>);
    } else if (trimmed.startsWith('> ')) {
      elements.push(<blockquote key={i} className="border-l-3 border-violet-400 pl-3 py-1 my-2 bg-slate-50 italic text-slate-600">{trimmed.replace('> ', '')}</blockquote>);
    } else if (trimmed.startsWith('---')) {
      elements.push(<hr key={i} className="my-4 border-slate-200" />);
    } else if (trimmed === '') {
      elements.push(<div key={i} className="h-3" />);
    } else {
      const html = trimmed
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code class="bg-slate-100 px-1 rounded text-violet-600 text-sm">$1</code>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-violet-600 underline" target="_blank">$1</a>');
      elements.push(<p key={i} className="text-slate-700 mb-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />);
    }
  }

  if (inCodeBlock && codeLines.length > 0) {
    elements.push(
      <pre key="preview-code-end" className="bg-slate-800 text-slate-100 rounded-lg p-3 my-2 text-sm overflow-x-auto">
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

  const handlePublish = useCallback(async () => {
    if (!title.trim() || !content.trim()) {
      setMessage({ type: 'error', text: '标题和内容不能为空' });
      return;
    }

    setPublishing(true);
    setMessage(null);

    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          categoryId,
          tags: selectedTags,
          featured,
          secret,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({
          type: 'success',
          text: `发布成功！文章地址：${data.postUrl}`,
        });
        // 清空表单
        setTitle('');
        setContent('');
        setCategoryId('1');
        setSelectedTags(['1']);
        setFeatured(false);
      } else {
        setMessage({ type: 'error', text: data.error || '发布失败' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: '网络错误，发布失败' });
    } finally {
      setPublishing(false);
    }
  }, [title, content, categoryId, selectedTags, featured, secret]);

  // 未认证 — 显示登录
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-16">
        <div className="max-w-md mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">管理后台</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">输入密码以继续</p>
            </div>

            <input
              type="password"
              value={secret}
              onChange={(e) => { setSecret(e.target.value); setAuthError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
              placeholder="输入发布密码"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 mb-3"
              autoFocus
            />

            {authError && (
              <p className="text-red-500 text-sm mb-3">{authError}</p>
            )}

            <Button
              onClick={handleAuth}
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white"
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 顶部栏 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">发布新文章</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className={showPreview ? 'bg-violet-50 border-violet-300 text-violet-700' : ''}
            >
              <Eye className="w-4 h-4 mr-1" />
              {showPreview ? '编辑' : '预览'}
            </Button>
            <Button
              size="sm"
              onClick={handlePublish}
              disabled={publishing}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white"
            >
              {publishing ? (
                <><Sparkles className="w-4 h-4 mr-1 animate-spin" /> 发布中...</>
              ) : (
                <><Send className="w-4 h-4 mr-1" /> 发布</>
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

        <div className="grid lg:grid-cols-2 gap-6">
          {/* 编辑面板 */}
          <div className="space-y-4">
            {/* 元数据 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="文章标题"
                className="w-full text-lg font-semibold bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />

              <div className="flex flex-wrap items-center gap-3">
                {/* 分类 */}
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
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
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                    style={selectedTags.includes(tag.id) ? { backgroundColor: tag.color } : {}}
                  >
                    {tag.name}
                  </button>
                ))}

                <label className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded accent-violet-600"
                  />
                  精选
                </label>
              </div>
            </div>

            {/* Markdown 工具栏 */}
            <div className="flex flex-wrap gap-1 p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              {tools.map((tool) => (
                <button
                  key={tool.label}
                  onClick={() => insertAtCursor(tool.insert)}
                  className="p-2 rounded-lg text-slate-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                  title={tool.label}
                >
                  <tool.icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            {/* 编辑器 / 预览 */}
            {showPreview ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 min-h-[400px] prose prose-slate max-w-none">
                {renderPreview(content)}
              </div>
            ) : (
              <textarea
                id="editor-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="开始写 Markdown 内容...&#10;&#10;## 标题&#10;正文内容...&#10;&#10;```js&#10;console.log('代码块')&#10;```"
                className="w-full min-h-[400px] p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-mono leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-slate-400"
              />
            )}
          </div>

          {/* 实时预览面板（桌面端常显） */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 min-h-[500px] max-h-[calc(100vh-8rem)] overflow-y-auto">
              <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
                <Eye className="w-4 h-4" /> 实时预览
              </h3>
              <div className="prose prose-slate max-w-none">
                {renderPreview(content)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
