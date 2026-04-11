// Vercel Edge Function - 动态 OG 图片生成
// 使用 Satori 将 JSX 渲染为 PNG

import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get('title') || '郏祥瑞的技术博客';
  const date = searchParams.get('date') || '';

  // 格式化日期
  const formattedDate = date
    ? new Date(date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          backgroundColor: '#0f172a',
          backgroundImage: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)',
          padding: '60px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* 背景装饰 */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '40px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '100px',
            left: '100px',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            filter: 'blur(40px)',
          }}
        />

        {/* Logo */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: '40px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
            }}
          >
            M
          </div>
          <span
            style={{
              marginLeft: '12px',
              fontSize: '20px',
              fontWeight: '600',
              color: 'white',
              opacity: 0.9,
            }}
          >
            mxqys.xyz
          </span>
        </div>

        {/* 文章标题 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '900px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <span
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              技术分享
            </span>
          </div>

          <h1
            style={{
              color: 'white',
              fontSize: title.length > 30 ? '48px' : '56px',
              fontWeight: '700',
              lineHeight: 1.2,
              margin: 0,
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            }}
          >
            {title.length > 60 ? title.slice(0, 60) + '...' : title}
          </h1>

          {formattedDate && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '24px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '18px',
              }}
            >
              <span>{formattedDate}</span>
              <span style={{ margin: '0 12px' }}>·</span>
              <span>郏祥瑞</span>
            </div>
          )}
        </div>

        {/* 底部装饰线 */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #7c3aed, #a855f7, #ec4899)',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
