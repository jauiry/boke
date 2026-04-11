import { Component, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // 上报错误到监控服务
    if (typeof window !== 'undefined' && window.__SENTRY__) {
      window.__SENTRY__.captureException(error, {
        extra: errorInfo,
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDev = typeof window !== 'undefined' &&
        window.location.hostname === 'localhost';

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">😵</div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              出错了
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              抱歉，页面遇到了一个问题。请尝试刷新页面或返回首页。
            </p>
            <div className="space-x-4">
              <Button onClick={this.handleRetry}>
                重试
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/'}
              >
                返回首页
              </Button>
            </div>
            {isDev && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="text-sm text-slate-500 cursor-pointer">
                  错误详情（开发模式）
                </summary>
                <pre className="mt-2 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs overflow-auto">
                  {this.state.error.message}
                  {'\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// 全局错误处理
export function setupGlobalErrorHandler() {
  if (typeof window === 'undefined') return;

  // 处理未捕获的 Promise 错误
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);

    if (window.__SENTRY__) {
      window.__SENTRY__.captureException(event.reason);
    }
  });

  // 处理全局 JavaScript 错误
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);

    if (window.__SENTRY__) {
      window.__SENTRY__.captureException(event.error);
    }
  });
}
