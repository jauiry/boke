import { test, expect } from '@playwright/test';

test.describe('博客冒烟测试', () => {
  test('首页应该正常加载', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // 检查标题
    await expect(page).toHaveTitle(/郏祥瑞/);

    // 检查导航栏
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('.auth-trigger')).toBeVisible();

    // 检查首页有文章列表或 Hero
    const heroOrPosts = page.locator('h1').first();
    await expect(heroOrPosts).toBeVisible();
  });

  test('文章列表页应该正常加载', async ({ page }) => {
    await page.goto('/articles', { waitUntil: 'domcontentloaded' });

    // 检查页面标题
    const heading = page.getByRole('heading', { name: '展卷阅文', exact: true });
    await expect(heading).toBeVisible();
  });

  test('搜索功能应该正常工作', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // 打开搜索
    await page.evaluate(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
    });

    // 等待搜索框出现
    const searchInput = page.getByRole('textbox', { name: '搜索文章标题或内容' });
    await expect(searchInput).toBeVisible({ timeout: 5000 });

    // 输入搜索词
    await searchInput.fill('测试');

    // 等待搜索结果
    await page.waitForTimeout(500);
  });

  test('文章详情页应该正常加载', async ({ page }) => {
    await page.goto('/jmeter-performance-testing-guide', { waitUntil: 'domcontentloaded' });

    // 检查文章标题
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();

    // 检查返回按钮
    const backButton = page.locator('button:has-text("返回")');
    await expect(backButton).toBeVisible();
  });

  test('导入的 Obsidian 文章应该能够打开', async ({ page }) => {
    await page.goto('/pytest-fixture-resource-management', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Pytest Fixture：自动化测试资源管理详解', exact: true })).toBeVisible();
  });

  test('连续切换文章不应请求失败的详情接口', async ({ page }) => {
    const detailRequests: string[] = [];
    page.on('request', (request) => {
      if (/\/api\/posts\//.test(request.url())) detailRequests.push(request.url());
    });
    await page.goto('/articles', { waitUntil: 'domcontentloaded' });
    for (let index = 0; index < 6; index++) {
      await page.locator('a.ink-card').first().click();
      await page.getByRole('button', { name: '返回', exact: true }).click();
    }
    expect(detailRequests).toEqual([]);
  });

  test('首页连续点击后仍应保持响应', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      for (let index = 0; index < 80; index++) {
        window.dispatchEvent(new PointerEvent('pointerdown', {
          clientX: 120 + (index % 7),
          clientY: 260 + (index % 9),
          bubbles: true,
        }));
      }
    });
    const frameTime = await page.evaluate(() => new Promise<number>((resolve) => {
      const started = performance.now();
      requestAnimationFrame(() => requestAnimationFrame(() => resolve(performance.now() - started)));
    }));
    expect(frameTime).toBeLessThan(1000);
    await expect(page.locator('.scroll-motion-toggle')).toBeVisible();
  });

  test('深色模式切换应该正常', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // 查找主题切换按钮
    const themeButton = page.locator('button[aria-label*="主题"]').or(
      page.locator('button').filter({ has: page.locator('svg[class*="moon"]') })
    ).first();

    if (await themeButton.isVisible()) {
      const html = page.locator('html');
      const wasDark = await html.evaluate((element) => element.classList.contains('dark'));
      await themeButton.click();

      // 检查 dark class
      await expect.poll(() => html.evaluate((element) => element.classList.contains('dark'))).toBe(!wasDark);
    }
  });

  test('关于页面应该正常加载', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });

    // 检查关于页面内容
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('API 接口应该正常响应', async ({ request }) => {
    const response = await request.get('https://www.mxqys.xyz/api/posts');
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBeTruthy();
  });

  test('搜索 API 应该正常响应', async ({ request }) => {
    const response = await request.get('https://www.mxqys.xyz/api/search?q=测试');
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBeTruthy();
  });

  test('Sitemap 应该正常生成', async ({ request }) => {
    const response = await request.get('https://www.mxqys.xyz/api/sitemap.xml');
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('xml');
  });
});
