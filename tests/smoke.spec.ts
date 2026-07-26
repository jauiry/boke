import { test, expect } from '@playwright/test';

test.describe('博客冒烟测试', () => {
  test('首页应该正常加载', async ({ page }) => {
    await page.goto('/');

    // 检查标题
    await expect(page).toHaveTitle(/郏祥瑞/);

    // 检查导航栏
    await expect(page.locator('nav')).toBeVisible();

    // 检查首页有文章列表或 Hero
    const heroOrPosts = page.locator('h1').first();
    await expect(heroOrPosts).toBeVisible();
  });

  test('文章列表页应该正常加载', async ({ page }) => {
    await page.goto('/articles');

    // 检查页面标题
    const heading = page.getByRole('heading', { name: '展卷阅文', exact: true });
    await expect(heading).toBeVisible();
  });

  test('搜索功能应该正常工作', async ({ page }) => {
    await page.goto('/');

    // 打开搜索
    await page.keyboard.press('Meta+k');

    // 等待搜索框出现
    const searchInput = page.getByRole('textbox', { name: '搜索文章标题或内容' });
    await expect(searchInput).toBeVisible({ timeout: 5000 });

    // 输入搜索词
    await searchInput.fill('测试');

    // 等待搜索结果
    await page.waitForTimeout(500);
  });

  test('文章详情页应该正常加载', async ({ page }) => {
    await page.goto('/jmeter-performance-testing-guide');

    // 检查文章标题
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();

    // 检查返回按钮
    const backButton = page.locator('button:has-text("返回")');
    await expect(backButton).toBeVisible();
  });

  test('深色模式切换应该正常', async ({ page }) => {
    await page.goto('/');

    // 查找主题切换按钮
    const themeButton = page.locator('button[aria-label*="主题"]').or(
      page.locator('button').filter({ has: page.locator('svg[class*="moon"]') })
    ).first();

    if (await themeButton.isVisible()) {
      await themeButton.click();

      // 检查 dark class
      const html = page.locator('html');
      await expect(html).toHaveClass(/dark/);
    }
  });

  test('关于页面应该正常加载', async ({ page }) => {
    await page.goto('/about');

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
