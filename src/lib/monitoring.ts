// 简单的监控接口 - 支持 Sentry、Loglib 或自定义后端
// 使用方式：替换 __SENTRY__ 为实际的监控 SDK

declare global {
  interface Window {
    __SENTRY__?: {
      captureException: (error: Error, options?: unknown) => void;
      captureMessage: (message: string, options?: unknown) => void;
    };
  }
}

// 日志级别
export const LogLevel = {
  Debug: 'debug',
  Info: 'info',
  Warn: 'warn',
  Error: 'error',
} as const;
export type LogLevel = typeof LogLevel[keyof typeof LogLevel];

// 监控服务接口
export interface MonitoringService {
  captureException(error: Error, context?: Record<string, unknown>): void;
  captureMessage(message: string, level?: LogLevel): void;
}

// Loglib 集成（Vercel 友好）
class LoglibMonitor implements MonitoringService {
  private endpoint: string;

  constructor() {
    this.endpoint = 'https://in.loglib.io';
  }

  async captureException(error: Error, context?: Record<string, unknown>) {
    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'error',
          message: error.message,
          stack: error.stack,
          url: typeof window !== 'undefined' ? window.location.href : '',
          ...context,
        }),
      });
    } catch (e) {
      console.error('Failed to send error to monitoring:', e);
    }
  }

  async captureMessage(message: string, level: LogLevel = LogLevel.Info) {
    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: level,
          message,
          url: typeof window !== 'undefined' ? window.location.href : '',
        }),
      });
    } catch (e) {
      console.error('Failed to send message to monitoring:', e);
    }
  }
}

// 创建全局监控实例
export const monitoring: MonitoringService = new LoglibMonitor();

// 便捷的错误上报函数
export function reportError(error: Error, context?: Record<string, unknown>) {
  monitoring.captureException(error, context);
}

// 便捷的消息上报函数
export function reportMessage(message: string, level?: LogLevel) {
  monitoring.captureMessage(message, level);
}

// API 错误自动上报
export async function fetchWithMonitoring<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      reportError(error, { url, options });
    }
    throw error;
  }
}
