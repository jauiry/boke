import type { Post, Tag, Category, Author, BlogStats } from '@/types/blog';

// 作者信息
export const author: Author = {
  id: '1',
  name: '郏祥瑞',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
  bio: '软件测试工程师，4年测试经验，熟悉功能测试、接口测试、性能测试、APP测试等。',
  social: {
    github: '',
    twitter: '',
    email: '1102684926@qq.com',
  },
};

// 标签数据
export const tags: Tag[] = [
  { id: '1', name: '测试', color: '#61DAFB' },
  { id: '2', name: '技术', color: '#3178C6' },
  { id: '3', name: '职场', color: '#339933' },
  { id: '4', name: 'JMeter', color: '#FF6B6B' },
  { id: '5', name: '性能测试', color: '#F39C12' },
];

// 分类数据
export const categories: Category[] = [
  { id: '1', name: '技术分享', description: '测试技术和经验分享', icon: 'Code' },
  { id: '2', name: '职场感悟', description: '工作心得和职业发展', icon: 'Coffee' },
];

// 示例文章
export const posts: Post[] = [
  {
    id: 'mmoslclaykgzr1csb',
    title: 'GitHub API 测试文章',
    slug: 'github-api-',
    excerpt: '这是一篇通过 API 自动发布的测试文章。测试成功，GitHub API 集成已经配置完成，可以正常发布文章了！...',
    content: `这是一篇通过 API 自动发布的测试文章。

## 测试成功

GitHub API 集成已经配置完成，可以正常发布文章了！`,
    coverImage: 'https://hailuo-image-algeng-data.oss-cn-wulanchabu.aliyuncs.com/image_inference_output%2Ftalkie%2Fprod%2Fimg%2F2026-04-11%2F9538d547-6eef-4818-81e3-de715e9b8b07_aigc.jpeg?Expires=1775998953&OSSAccessKeyId=LTAI5tB2SwrRwAtD23etQUbC&Signature=wi3ZF7sz4trEgGMwcFOkL80inMo%3D',
    author: {
      id: '1',
      name: '郏祥瑞',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
      bio: '软件测试工程师，4年测试经验',
      social: { github: '', twitter: '', email: '1102684926@qq.com' },
    },
    tags: [
      { id: '1', name: '测试', color: '#61DAFB' },
      { id: '2', name: '技术', color: '#3178C6' }
    ],
    category: { id: '1', name: '技术分享', description: '测试技术和经验分享', icon: 'Code' },
    createdAt: '2026-03-13T11:07:15.070Z',
    updatedAt: '2026-03-13T11:07:15.070Z',
    readTime: 1,
    views: 0,
    likes: 0,
    comments: [],
    featured: false,
  },
  {
    id: '2',
    title: 'OpenClaw 企业微信接入完全指南',
    slug: 'openclaw-wecom-integration-guide',
    excerpt: '本文介绍两种将 OpenClaw 接入企业微信的方案：智能机器人和自建应用，满足不同场景需求。',
    content: `# OpenClaw 企业微信接入完全指南

> 本文介绍两种将 OpenClaw 接入企业微信的方案：智能机器人和自建应用，满足不同场景需求。

## 前言

OpenClaw 是一个强大的 AI 助手框架，可以连接到多种消息渠道。本文详细介绍如何将 OpenClaw 接入企业微信，实现通过企业微信与 AI 助手对话。

企业微信提供两种接入方式：
1. **智能机器人** - 通过长连接方式，适合快速上手
2. **自建应用** - 功能更全面，适合生产环境

## 方案一：企业微信智能机器人（推荐新手）

这是最简单的接入方式，适合快速体验和轻量级使用。

### 前期准备

在开始之前，请确认已完成：
- [ ] 已安装企业微信最新版本客户端
- [ ] 已在本地设备或云服务器上部署 OpenClaw

### 第一步：创建智能机器人

1. 打开企业微信客户端，进入**工作台**
2. 点击**智能机器人** → **创建机器人**
3. 选择 **API 模式** 创建
4. 选择以**长连接**方式创建
5. 记录下生成的 **Bot ID** 和 **Secret**

### 第二步：关联机器人与 OpenClaw

#### 方式 A：在腾讯云 Lighthouse 中部署

如果你使用腾讯云轻量应用服务器 Lighthouse：

1. 进入轻量云控制台，选中已部署 OpenClaw 的服务器实例
2. 进入**应用管理**页面
3. 在**通道**中，选择**企微机器人（长连接）**
4. 依次输入 Bot ID 和 Secret
5. 点击**添加并应用**，然后重启服务
6. 回到企业微信机器人创建页面，点击**保存并创建**

#### 方式 B：在本地终端部署

1. 安装企微插件：
   \`\`\`bash
   openclaw plugins install @wecom/wecom-openclaw-plugin
   \`\`\`

2. 重启 OpenClaw：
   \`\`\`bash
   openclaw gateway start
   \`\`\`

3. 添加渠道：
   \`\`\`bash
   openclaw channels add
   \`\`\`

4. 按提示操作：
   - 选择 channel 为**企业微信**
   - 输入企业微信机器人的 **Bot ID** 和 **Secret**
   - 选择配对方式：**Pairing**

5. 在企业微信中与机器人对话，会收到一个**配对码**
6. 复制配对码并输入到终端，完成配对

完成！现在你可以在企业微信中与机器人正常对话了。

## 方案二：企业微信自建应用（功能更全面）

自建应用提供更完整的功能，适合需要深度集成的场景。

### 需要安装的插件

将插件克隆到 OpenClaw extensions 目录：

\`\`\`bash
git clone https://github.com/darrryZ/openclaw-wecom-channel.git ~/.openclaw/extensions/wecom
\`\`\`

### Step 1: 创建企业微信应用

#### 1. 登录企业微信管理后台

访问 [企业微信管理后台](https://work.weixin.qq.com/) 并登录。

#### 2. 获取企业 ID

进入**我的企业** → **企业信息**，复制**企业 ID**（格式：wwxxxxxxxxxx）。

#### 3. 创建自建应用

进入**应用管理** → **自建** → **创建应用**：
- 填写应用名称和描述
- 选择可见范围（建议先选自己测试）
- 创建后进入应用详情页

#### 4. 获取应用凭证

在应用详情页复制：
- **AgentId** — 应用 ID（数字格式，如 1000003）
- **Secret** — 应用密钥

> ⚠️ **重要**：Secret 请妥善保管，不要泄露。

#### 5. 配置接收消息

在应用详情页 → **接收消息** → **设置 API 接收**：

| 字段 | 值 |
|------|-----|
| URL | \`https://你的域名/wecom/callback\`（需公网可达） |
| Token | 点击随机生成，复制保存 |
| EncodingAESKey | 点击随机生成，复制保存 |

> 点击保存时 Gateway 必须已启动，否则验证会失败。

#### 6. 配置可信 IP

在应用详情页 → **企业可信 IP**：
- 添加你的服务器公网 IP
- 如果使用家庭宽带，IP 可能会变化，需要及时更新

> 💡 提示：可以通过 \`curl ifconfig.me\` 查询当前公网 IP。

### Step 2: 配置 OpenClaw

#### 方式一：编辑配置文件

编辑 \`~/.openclaw/openclaw.json\`：

\`\`\`json
{
  \"channels\": {
    \"wecom\": {
      \"enabled\": true,
      \"corpId\": \"wwxxxxxxxxxx\",
      \"agentId\": 1000003,
      \"secret\": \"你的应用Secret\",
      \"token\": \"回调Token\",
      \"encodingAESKey\": \"回调AESKey\",
      \"port\": 18800,
      \"dmPolicy\": \"open\"
    }
  },
  \"plugins\": {
    \"entries\": {
      \"wecom\": { \"enabled\": true }
    }
  }
}
\`\`\`

#### 方式二：环境变量

\`\`\`bash
export WECOM_CORP_ID=\"wwxxxxxxxxxx\"
export WECOM_AGENT_ID=\"1000003\"
export WECOM_SECRET=\"你的应用Secret\"
export WECOM_TOKEN=\"回调Token\"
export WECOM_ENCODING_AES_KEY=\"回调AESKey\"
\`\`\`

### Step 3: 配置公网访问

企业微信回调需要公网可达的 HTTPS URL。推荐使用 **Cloudflare Tunnel**（免费）：

\`\`\`bash
# 安装 cloudflared
brew install cloudflared    # macOS
# 或 apt install cloudflared  # Linux

# 登录 Cloudflare
cloudflared tunnel login

# 创建 tunnel
cloudflared tunnel create wecom-tunnel

# 配置 DNS（将子域名指向 tunnel）
cloudflared tunnel route dns wecom-tunnel wecom.yourdomain.com

# 启动 tunnel
cloudflared tunnel run --url http://localhost:18800 wecom-tunnel
\`\`\`

然后在企业微信后台设置回调 URL 为 \`https://wecom.yourdomain.com/wecom/callback\`。

**其他公网方案：**
- ngrok: \`ngrok http 18800\`
- frp: 自建内网穿透
- 云服务器: 直接部署

### Step 4: 启动并测试

1. **启动 Gateway**：
   \`\`\`bash
   openclaw gateway restart
   \`\`\`

2. **发送测试消息**：
   在企业微信中找到你的应用，发送一条消息。

3. **查看日志**：
   \`\`\`bash
   openclaw logs --follow
   \`\`\`

如果一切正常，你应该能看到消息接收和回复的日志。

## 两种方案对比

| 特性 | 智能机器人 | 自建应用 |
|------|-----------|---------|
| **部署难度** | ⭐ 简单 | ⭐⭐⭐ 较复杂 |
| **功能完整度** | 基础功能 | 完整功能 |
| **消息类型** | 仅文本 | 文本、卡片等 |
| **主动推送** | ✅ 支持 | ✅ 支持 |
| **群聊支持** | ❌ 暂不支持 | 待开发 |
| **适合场景** | 个人使用、快速体验 | 企业级应用 |
| **配置复杂度** | 低 | 高 |

## 常见问题

### Q: Agent 不回复消息

1. 确认 Gateway 正在运行：\`openclaw gateway status\`
2. 确认回调 URL 可达
3. 确认企业可信 IP 是否正确
4. 查看日志：\`openclaw logs --follow\`

### Q: 回调验证失败

1. 确认 Token 和 EncodingAESKey 与企业微信后台一致
2. 确认 Gateway 在保存回调配置之前已启动
3. 确认 Cloudflare Tunnel 正在运行

### Q: 消息发送失败（IP 白名单）

企业微信要求发送消息的服务器 IP 在可信列表中：
1. 查询当前公网 IP：\`curl ifconfig.me\`
2. 在企业微信管理后台更新可信 IP
3. 如果使用家庭宽带，IP 可能定期变化，需注意更新

## 参考资源

- [OpenClaw 官方文档](https://docs.openclaw.ai)
- [企业微信开发者文档](https://developer.work.weixin.qq.com/)
- [企业微信 Channel 插件源码](https://github.com/darrryZ/openclaw-wecom-channel)

---

**本文档由 OpenClaw 助手整理生成**`,
    coverImage: 'https://hailuo-image-algeng-data.oss-cn-wulanchabu.aliyuncs.com/image_inference_output%2Ftalkie%2Fprod%2Fimg%2F2026-04-11%2Fa9f5047f-03e7-4be1-83b1-9aadff85c5f7_aigc.jpeg?Expires=1775999002&OSSAccessKeyId=LTAI5tB2SwrRwAtD23etQUbC&Signature=AkmkrAkWQ2h2U%2BIEw8lLI6B0sTc%3D',
    author: {
      id: '1',
      name: '郏祥瑞',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
      bio: '软件测试工程师，4年测试经验',
      social: { github: '', twitter: '', email: '1102684926@qq.com' },
    },
    tags: [
      { id: '1', name: '测试', color: '#61DAFB' },
      { id: '2', name: '技术', color: '#3178C6' },
    ],
    category: { id: '1', name: '技术分享', description: '测试技术和经验分享', icon: 'Code' },
    createdAt: '2026-03-13T10:00:00Z',
    updatedAt: '2026-03-13T10:00:00Z',
    readTime: 15,
    views: 0,
    likes: 0,
    comments: [],
    featured: true,
  },
  {
    id: '1',
    title: 'JMeter 性能测试实战指南',
    slug: 'jmeter-performance-testing-guide',
    excerpt: '性能测试是软件测试中的重要环节，本文将分享使用 JMeter 进行性能测试的实战经验。',
    content: `# JMeter 性能测试实战指南

性能测试是软件测试中的重要环节，本文将分享使用 JMeter 进行性能测试的实战经验。

## 什么是 JMeter

Apache JMeter 是一款开源的性能测试工具，主要用于：

- Web 应用性能测试
- 接口压力测试
- 数据库性能测试
- 分布式压力测试

## 环境准备

### 1. 安装 Java
JMeter 基于 Java 开发，需要先安装 JDK 8 或更高版本。

### 2. 下载 JMeter
从官网下载最新版本的 JMeter，解压即可使用。

## 常用组件

### 线程组（Thread Group）
线程组是 JMeter 测试计划的核心，用于设置并发用户数、循环次数等参数。

### HTTP 请求
用于发送 HTTP/HTTPS 请求，支持 GET、POST、PUT、DELETE 等方法。

### 断言（Assertions）
用于验证响应结果是否符合预期。

## 实战案例

假设我们要测试一个登录接口的性能：

1. 创建线程组，设置 100 并发用户
2. 添加 HTTP 请求，配置登录接口
3. 添加查看结果树和聚合报告
4. 运行测试并分析结果

## 最佳实践

- 合理设置 Ramp-Up 时间
- 使用参数化避免缓存命中
- 添加断言确保结果正确
- 监控服务器资源使用情况

## 总结

JMeter 是一个功能强大的性能测试工具，掌握它对于测试工程师来说非常重要。希望本文对你有所帮助！`,
    author: {
      id: '1',
      name: '郏祥瑞',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
      bio: '软件测试工程师，4年测试经验',
      social: { github: '', twitter: '', email: '1102684926@qq.com' },
    },
    tags: [
      { id: '4', name: 'JMeter', color: '#FF6B6B' },
      { id: '5', name: '性能测试', color: '#F39C12' },
    ],
    category: { id: '1', name: '技术分享', description: '测试技术和经验分享', icon: 'Code' },
    createdAt: '2026-03-13T08:00:00Z',
    updatedAt: '2026-03-13T08:00:00Z',
    readTime: 5,
    views: 0,
    likes: 0,
    comments: [],
    featured: true,
  }
];

// 博客统计数据
export const blogStats: BlogStats = {
  totalPosts: posts.length,
  totalViews: 0,
  totalLikes: 0,
  totalComments: 0,
};

// 辅助函数
export const getPostBySlug = (slug: string): Post | undefined => {
  return posts.find(post => post.slug === slug);
};

export const getRelatedPosts = (currentPost: Post, limit: number = 3): Post[] => {
  return posts
    .filter(post => post.id !== currentPost.id)
    .filter(post => 
      post.tags.some(tag => 
        currentPost.tags.some(currentTag => currentTag.id === tag.id)
      ) || post.category.id === currentPost.category.id
    )
    .slice(0, limit);
};

export const getPostsByTag = (tagName: string): Post[] => {
  return posts.filter(post => 
    post.tags.some(tag => tag.name.toLowerCase() === tagName.toLowerCase())
  );
};
