import type { Post, Tag, Category, Author, BlogStats } from '@/types/blog';

// 作者信息
export const author: Author = {
  id: '1',
  name: '郏祥瑞',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
  bio: '软件测试工程师，4年测试经验，熟悉功能测试、接口测试、性能测试、APP测试等。',
  social: {
    github: 'https://github.com/mxqys',
    twitter: 'https://twitter.com/mxqys',
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
  { id: '6', name: 'Git', color: '#314C3D' },
  { id: '7', name: '工程效率', color: '#A33A2B' },
  { id: '8', name: 'Docker', color: '#9A7435' },
  { id: '9', name: '接口测试', color: '#596B63' },
  { id: '10', name: 'Pytest', color: '#314C3D' },
  { id: '11', name: '自动化测试', color: '#A33A2B' },
  { id: '12', name: '软件测试', color: '#9A7435' },
  { id: '13', name: '知识库', color: '#596B63' },
  { id: '14', name: '故障恢复', color: '#314C3D' },
  { id: '15', name: 'CI/CD', color: '#A33A2B' },
  { id: '16', name: '效率工具', color: '#9A7435' },
  { id: '17', name: 'Web自动化', color: '#596B63' },
  { id: '18', name: 'Codex', color: '#314C3D' },
];

// 分类数据
export const categories: Category[] = [
  { id: '1', name: '技术分享', description: '测试技术和经验分享', icon: 'Code' },
  { id: '2', name: '职场感悟', description: '工作心得和职业发展', icon: 'Coffee' },
];

// 示例文章
export const posts: Post[] = [
  // obsidian-import: 2026-07-26
  {
    id: 'obs-01',
    title: 'Git 提交流程模板',
    slug: 'git-commit-workflow-template',
    excerpt: 'Git 提交流程模板',
    content: `# Git 提交流程模板

> **仓库信息**
> 仓库：\`C:\\Users\\Administrator\\接口自动化\`
> 远程：\`https://codeup.aliyun.com/dffit/ops/接口测试.git\`

---

## 查看改动

\`\`\`powershell
cd C:\\Users\\Administrator\\接口自动化
git status
\`\`\`

> **每次提交前都跑一遍**
> 先执行 \`pytest\` 确认测试通过，再提交。

---

## 添加文件

\`\`\`powershell
git add .
\`\`\`

\`\`\`powershell
git add testcases/user/test_xxx.py
git add testcases/conftest.py
\`\`\`

---

## 提交

\`\`\`powershell
git commit -m "做了什么"
\`\`\`

| 例子              | 说明    |
| --------------- | ----- |
| \`"周期办理搜索筛选测试"\`  | 新增测试  |
| \`"修复订单状态筛选参数名"\` | 修 bug |
| \`"离营模块测试"\`      | 新建模块  |
| \`"签合同流程参数化"\`    | 增加功能  |

> **commit message 规范**
> 不要写 \`"update"\`、\`"fix"\` 这种空话，写清楚具体做了什么。

---

## 推送

\`\`\`powershell
git push origin master
\`\`\`

---

## push 被拒绝时

\`\`\`powershell
git pull origin master --rebase
git push origin master
\`\`\`

---

## 一键提交

\`\`\`powershell
cd C:\\Users\\Administrator\\接口自动化
git add .
git commit -m "改动说明"
git push origin master
\`\`\`

---

## 常见问题

> **服务器 502 怎么办？**
> dev 环境偶尔会挂，等恢复后再跑测试和提交。

> **git stash 里的东西怎么办？**
> - 不需要了：\`git stash drop\`
> - 恢复后提交：\`git stash pop\` → \`git add .\` → \`git commit\``,
    author,
    tags: [{ id: 'obs-1-1', name: 'Git', color: '#314C3D' }, { id: 'obs-1-2', name: '工程效率', color: '#A33A2B' }],
    category: { id: '1', name: '技术分享', description: '测试技术和经验分享', icon: 'Code' },
    createdAt: '2026-07-24T10:00:00+08:00',
    updatedAt: '2026-07-24T10:00:00+08:00',
    readTime: 2,
    views: 0,
    likes: 0,
    comments: [],
    featured: true,
  },
  {
    id: 'obs-02',
    title: 'Ubuntu、WSL 2 与 Docker 本地接口自动化测试指南',
    slug: 'ubuntu-wsl2-docker-api-testing-guide',
    excerpt: 'Ubuntu / WSL 2 / Docker 本地测试指南',
    content: `# Ubuntu / WSL 2 / Docker 本地测试指南

> **> 用于在 Windows 的 Ubuntu（WSL 2）中，通过 Docker 运行接口自动化测试并查看 Allure 报告。**

关联主题：接口自动化 · Docker · WSL 2 · Pytest · Allure

本文用于在 Windows 的 Ubuntu（WSL 2）中运行接口自动化项目。日常执行时按“快速运行”操作即可。

## 1. 环境说明

- Windows 安装 Docker Desktop。
- Docker Desktop 使用 WSL 2 引擎。
- Ubuntu 是 WSL 2 发行版。
- 项目目录：

  \`\`\`text
  C:\\Users\\Administrator\\接口自动化
  \`\`\`

- Ubuntu 中对应路径：

  \`\`\`text
  /mnt/c/Users/Administrator/接口自动化
  \`\`\`

- 测试环境接口：

  \`\`\`text
  https://api-dev.bangso.com
  \`\`\`

## 2. 首次配置 Docker Desktop

打开 Docker Desktop：

1. 进入 \`Settings\`。
2. 在 \`General\` 中选择 \`WSL 2\`。
3. 进入 \`Resources > WSL Integration\`。
4. 开启当前 Ubuntu 发行版。
5. 点击 \`Apply & restart\`。

不要开启：

\`\`\`text
Expose daemon on tcp://localhost:2375 without TLS
\`\`\`

该选项没有必要，而且存在安全风险。

在 Ubuntu 中验证：

\`\`\`bash
docker --version
docker info
\`\`\`

两个命令都成功才说明 Docker 可以使用。

如果提示：

\`\`\`text
docker: command not found
\`\`\`

检查 Docker Desktop 是否启动，以及 Ubuntu 的 WSL Integration 是否开启。

## 3. 进入项目

打开 Ubuntu，执行：

\`\`\`bash
cd /mnt/c/Users/Administrator/接口自动化
\`\`\`

检查当前位置：

\`\`\`bash
pwd
\`\`\`

预期：

\`\`\`text
/mnt/c/Users/Administrator/接口自动化
\`\`\`

## 4. 快速运行（推荐）

首次执行：

\`\`\`bash
chmod +x run_test.sh
\`\`\`

运行：

\`\`\`bash
./run_test.sh
\`\`\`

脚本会依次执行：

1. 拉取最新代码；
2. 检查本地 Python 基础镜像；
3. 构建测试镜像；
4. 运行用户模块、认证模块、自动生成接口测试；
5. 生成 Allure HTML 报告。

脚本中的单条测试失败不会阻断后续测试，目的是收集完整结果。

### \`git pull\` 失败时

\`run_test.sh\` 开头会执行 \`git pull\`。如果当前目录有未提交修改、没有网络或 Git 权限不足，脚本可能提前停止。

此时可以跳过脚本，使用下面的手动运行方式。

## 5. 手动构建和运行

### 5.1 检查基础镜像

\`\`\`bash
docker image inspect python:3.12-slim-bookworm
\`\`\`

如果不存在，而且项目提供离线镜像：

\`\`\`bash
docker load -i packages/docker/python-3.12-slim-bookworm.tar
\`\`\`

### 5.2 构建测试镜像

\`\`\`bash
docker build -t api-test -f Dockerfile.test .
\`\`\`

\`Dockerfile.test\` 使用项目自带的：

- Python 离线依赖；
- Allure 2.27.0；
- Java 17；
- \`python:3.12-slim-bookworm\`。

### 5.3 运行完整测试

\`\`\`bash
mkdir -p reports

docker run --rm --network=host \\
  -v "$(pwd)/reports:/app/reports" \\
  api-test
\`\`\`

说明：

- \`--rm\`：测试结束后删除测试容器；
- \`--network=host\`：容器使用宿主机网络；
- \`-v\`：将报告保存到 Windows 项目目录；
- 测试镜像内的 \`entrypoint.sh\` 会继续执行所有阶段，即使部分用例失败。

## 6. 只运行指定范围

测试镜像默认执行完整流程。如果只想调试某个模块，可以覆盖容器启动命令。

### 6.1 自定义收款模块

\`\`\`bash
docker run --rm --network=host \\
  -v "$(pwd)/reports:/app/reports" \\
  api-test \\
  pytest testcases/user/test_order_diy.py \\
  --alluredir=reports/allure-results \\
  -q --tb=short
\`\`\`

### 6.2 单个测试

\`\`\`bash
docker run --rm --network=host \\
  -v "$(pwd)/reports:/app/reports" \\
  api-test \\
  pytest \\
  testcases/user/test_order_diy.py::TestOrderDiy::test_qr_pay \\
  -q --tb=short
\`\`\`

### 6.3 用户模块

\`\`\`bash
docker run --rm --network=host \\
  -v "$(pwd)/reports:/app/reports" \\
  api-test \\
  pytest testcases/user/ \\
  --ignore=testcases/user/test_business_card.py \\
  --alluredir=reports/allure-results \\
  -q --tb=short
\`\`\`

### 6.4 认证模块

\`\`\`bash
docker run --rm --network=host \\
  -v "$(pwd)/reports:/app/reports" \\
  api-test \\
  pytest testcases/auth/ \\
  --alluredir=reports/allure-results \\
  -q --tb=short
\`\`\`

### 6.5 冒烟和优先级

\`\`\`bash
docker run --rm --network=host api-test pytest -m smoke
\`\`\`

\`\`\`bash
docker run --rm --network=host api-test pytest -m p0
\`\`\`

## 7. Allure 报告

完整脚本执行后，报告位于：

\`\`\`text
reports/allure-report/index.html
\`\`\`

Ubuntu 路径：

\`\`\`text
/mnt/c/Users/Administrator/接口自动化/reports/allure-report/index.html
\`\`\`

Windows 路径：

\`\`\`text
C:\\Users\\Administrator\\接口自动化\\reports\\allure-report\\index.html
\`\`\`

可以直接使用 Windows 浏览器打开。

如果只生成了原始结果，可在测试容器中生成 HTML：

\`\`\`bash
docker run --rm \\
  -v "$(pwd)/reports:/app/reports" \\
  api-test \\
  allure generate reports/allure-results \\
  -o reports/allure-report --clean
\`\`\`

## 8. 如何理解结果

### Passed

\`\`\`text
PASSED
\`\`\`

测试符合当前预期。

### Failed

\`\`\`text
FAILED
\`\`\`

普通断言失败，需要分析接口、测试数据或测试代码。

### Skipped

\`\`\`text
SKIPPED
\`\`\`

前置数据或环境条件不满足。自动生成接口测试的业务失败不应使用跳过。

### XFAIL

\`\`\`text
XFAIL
\`\`\`

已提交、尚未修复的已知缺陷。断言仍然保留，但不会阻断流水线。

当前典型已知缺陷：

- 自定义收款订单删除成功后，详情接口仍返回已删除数据；
- 不存在的离营记录返回 HTTP 500 / \`X00001\`。

### XPASS

\`\`\`text
XPASS
\`\`\`

标记为已知缺陷的测试意外通过，通常说明后端已经修复。应复核后移除 \`xfail\` 标记。

## 9. 自定义收款订单规则

### 9.1 普通测试订单

自定义收款测试会记录每条用例创建的订单 ID。

正常结束时：

\`\`\`text
创建订单
→ 执行测试
→ 查询状态
→ 未取消则先取消
→ 删除
\`\`\`

清理失败会使测试失败，不会静默忽略。

### 9.2 唯一待支付预留订单

模块始终保留一笔：

\`\`\`text
name = manual_payment_reserved
amount = 0.01
status = 0（待支付）
\`\`\`

规则：

- 已存在一笔：直接复用；
- 不存在：创建一笔；
- 多于一笔：测试失败；
- 不调用二维码支付；
- 不调用转账支付；
- 不取消；
- 不删除。

如果该订单被人工支付，下一次运行时不再属于“待支付”，测试会创建一笔新的待支付预留订单。

### 9.3 强制终止的限制

如果正常运行完成，清理逻辑会执行。

如果出现以下情况：

- 直接关闭终端；
- 强制停止容器；
- Docker Desktop 被关闭；
- WSL 被强制结束；
- 电脑断电；

pytest 的 teardown 可能来不及执行，当前测试订单可能遗留。下次运行前应检查自定义收款列表。

运行测试时不要使用：

\`\`\`bash
docker kill
\`\`\`

优先等待测试自然结束。

## 10. 常见问题

### 10.1 登录接口返回 502

表现：

\`\`\`text
登录请求失败: 502
\`\`\`

这通常是测试环境网关或登录服务短暂不可用。所有依赖登录的测试都会在前置阶段报错，但不会创建业务订单。

处理：

1. 等待测试环境恢复；
2. 单独检查登录接口；
3. 恢复后重新运行。

### 10.2 Docker Desktop 未启动

表现：

\`\`\`text
Cannot connect to the Docker daemon
\`\`\`

处理：

1. 启动 Docker Desktop；
2. 等待状态变为 Running；
3. 在 Ubuntu 中重新执行 \`docker info\`。

### 10.3 WSL 没有 Docker 命令

检查：

\`\`\`text
Docker Desktop > Settings > Resources > WSL Integration
\`\`\`

开启 Ubuntu 后重启 Docker Desktop 和 Ubuntu 终端。

### 10.4 基础镜像不存在

\`\`\`bash
docker load -i packages/docker/python-3.12-slim-bookworm.tar
\`\`\`

### 10.5 Allure 命令不存在

Ubuntu 主机不需要单独安装 Allure。使用 \`Dockerfile.test\` 构建的 \`api-test\` 镜像生成报告。

### 10.6 报告打不开

确认文件存在：

\`\`\`bash
ls -l reports/allure-report/index.html
\`\`\`

如果不存在，重新执行 Allure 生成命令。

## 11. 测试配置

主要配置文件：

\`\`\`text
config/settings.py
\`\`\`

包括：

- \`BASE_URL\`；
- 登录手机号；
- 测试验证码；
- 请求超时；
- 重试次数；
- 并行数量；
- Allure 目录。

不要在聊天、日志、截图或 curl 文件中公开：

- Bearer Token；
- Cookie；
- 密码；
- 短信验证码；
- 身份证号；
- 银行卡号。

如果 Token 已经公开，应立即重新登录或让旧 Token 失效。

## 12. 日常使用清单

每次运行只需：

\`\`\`bash
cd /mnt/c/Users/Administrator/接口自动化
docker info
./run_test.sh
\`\`\`

结束后查看：

\`\`\`text
C:\\Users\\Administrator\\接口自动化\\reports\\allure-report\\index.html
\`\`\`

重点关注：

- \`FAILED\`：真实失败；
- \`XFAIL\`：已知缺陷；
- \`XPASS\`：可能已经修复；
- 普通测试订单是否完成清理；
- 是否只保留一笔 \`manual_payment_reserved\` 待支付订单。`,
    author,
    tags: [{ id: 'obs-2-1', name: 'Docker', color: '#A33A2B' }, { id: 'obs-2-2', name: '接口测试', color: '#9A7435' }],
    category: { id: '1', name: '技术分享', description: '测试技术和经验分享', icon: 'Code' },
    createdAt: '2026-07-24T11:00:00+08:00',
    updatedAt: '2026-07-24T11:00:00+08:00',
    readTime: 9,
    views: 0,
    likes: 0,
    comments: [],
    featured: true,
  },
  {
    id: 'obs-03',
    title: 'Pytest Fixture：自动化测试资源管理详解',
    slug: 'pytest-fixture-resource-management',
    excerpt: '一句话理解 Fixture Fixture 就是自动化测试中的"环境管理员"，负责在测试开始前准备资源，在测试结束后释放资源。',
    content: `> **一句话理解 Fixture**
> Fixture 就是自动化测试中的"环境管理员"，负责在测试开始前准备资源，在测试结束后释放资源。

适用场景：pytest、接口自动化（requests + pytest）、UI 自动化（Minium + pytest）、fixture / conftest.py / 作用域管理 / 登录状态管理 / 测试数据初始化。

---

# 1. Fixture 是什么？

在 pytest 自动化测试框架中，fixture 是一种用于管理测试环境和测试资源的机制。

\`\`\`mermaid
graph LR
    A[测试开始前<br/>准备资源] --> B[执行测试<br/>用例]
    B --> C[测试结束后<br/>释放资源]
\`\`\`

Fixture 主要负责：

- 测试环境初始化
- 登录操作
- 浏览器 / 小程序启动
- 数据准备
- 测试资源释放
- 测试状态隔离

---

# 2. 为什么需要 Fixture？

## 没有 fixture 的问题

\`\`\`python
def test_add_user():
    token = login()
    response = requests.post("/user", headers={"Authorization": token})

def test_delete_user():
    token = login()
    response = requests.delete("/user", headers={"Authorization": token})
\`\`\`

> **问题**
> - 每个测试都需要登录
> - 代码重复
> - 登录逻辑修改需要改多个文件

## 使用 fixture 后

\`\`\`python
@pytest.fixture
def token():
    token = login()
    return token

def test_add_user(token):
    response = requests.post("/user", headers={"Authorization": token})

def test_delete_user(token):
    response = requests.delete("/user", headers={"Authorization": token})
\`\`\`

> **优势**
> - 登录逻辑统一管理
> - 测试代码更简洁
> - 提高维护效率

---

# 3. Fixture 基本结构

\`\`\`python
import pytest

@pytest.fixture
def data():
    print("准备测试数据")

    yield

    print("清理测试数据")
\`\`\`

执行流程：

\`\`\`mermaid
graph TD
    A["fixture 前置<br/>准备测试数据"] --> B["执行测试用例"]
    B --> C["fixture 后置<br/>清理测试数据"]
\`\`\`

---

# 4. yield 的作用

\`yield\` 在 fixture 中代表测试执行的位置：

- \`yield\` **之前** → 测试前置准备
- \`yield\` 返回的对象 → 注入给测试用例
- \`yield\` **之后** → 测试后置清理（无论测试是否通过都会执行）

\`\`\`python
@pytest.fixture
def database():
    db = connect_database()    # 前置：连接数据库

    yield db                   # 返回数据库对象，进入测试

    db.close()                 # 后置：关闭数据库连接
\`\`\`

执行过程：

\`\`\`mermaid
graph TD
    A["连接数据库"] --> B["yield 返回数据库对象"]
    B --> C["执行测试"]
    C --> D["关闭数据库连接"]
\`\`\`

---

# 5. Fixture 作用域（Scope）

pytest 提供多个生命周期，通过 \`scope\` 参数控制。

| Scope | 生命周期 | 适用场景 |
|-------|---------|---------|
| \`function\`（默认） | 每个测试函数 | 测试数据、页面对象、临时资源 |
| \`class\` | 每个测试类 | 类级别共享资源 |
| \`module\` | 每个 Python 文件 | 模块级别共享 |
| \`session\` | 整个运行周期 | 登录、服务启动、浏览器创建、环境初始化 |

## 5.1 function（默认）

\`\`\`python
@pytest.fixture(scope="function")
\`\`\`

\`\`\`mermaid
graph LR
    subgraph test_01
        A1["创建 fixture"] --> B1["执行测试"] --> C1["销毁 fixture"]
    end

    subgraph test_02
        A2["重新创建 fixture"] --> B2["执行测试"] --> C2["销毁 fixture"]
    end
\`\`\`

## 5.2 class

\`\`\`python
@pytest.fixture(scope="class")
\`\`\`

一个测试类内所有测试共享同一次 fixture。

## 5.3 module

\`\`\`python
@pytest.fixture(scope="module")
\`\`\`

一个 Python 文件内所有测试共享同一次 fixture。

## 5.4 session

\`\`\`python
@pytest.fixture(scope="session")
\`\`\`

> **session 级 fixture**
> 整个测试运行期间只执行一次。适合登录、启动服务、创建浏览器、初始化环境等重量级操作。

---

# 6. Fixture 在接口自动化中的应用

## 场景

接口测试需要 token：

\`\`\`mermaid
graph LR
    A["登录接口"] --> B["获取 token"] --> C["调用业务接口"]
\`\`\`

## conftest.py 中的 session 级 fixture

\`\`\`python
import pytest
import requests

@pytest.fixture(scope="session")
def token():
    response = requests.post(
        "/login",
        json={"username": "admin", "password": "123456"}
    )
    token = response.json()["token"]
    return token
\`\`\`

## 测试用例

\`\`\`python
def test_query_user(token):
    response = requests.get(
        "/user",
        headers={"Authorization": token}
    )
    assert response.status_code == 200
\`\`\`

> **优势**
> - 登录只执行一次
> - 多个接口共享 token

---

# 7. Fixture 在 UI 自动化中的应用

## 场景

小程序 UI 自动化（Minium + pytest）：

\`\`\`mermaid
graph LR
    A["启动微信"] --> B["打开小程序"]
    B --> C["登录"]
    C --> D["获取页面对象"]
    D --> E["执行测试"]
\`\`\`

## session 级 fixture

\`\`\`python
@pytest.fixture(scope="session")
def app():
    app = minium.App()
    login(app)
    return app
\`\`\`

整个测试过程只登录一次。

## function 级 fixture

\`\`\`python
@pytest.fixture(scope="function")
def page(app):
    page = app.current_page

    yield page

    page.close()
\`\`\`

每个测试创建独立页面。

---

# 8. UI 自动化中的 Fixture 隔离问题

## 问题：fixture 污染

如果所有测试共享同一个 page：

\`\`\`mermaid
graph LR
    subgraph test_01
        A["修改页面状态"]
    end

    subgraph test_02
        B["受到影响"]
    end

    A -.->|污染| B
\`\`\`

> **Fixture 污染**
> 共享可变资源时，前一个测试的状态变更会影响到后续测试。

## 优化方案

推荐分层结构：

| 层级 | scope | 管理内容 |
|------|-------|---------|
| 基础层 | session | 微信连接、登录状态（只创建一次） |
| 隔离层 | function | 页面对象、测试数据（每测试独立） |

\`\`\`mermaid
graph TD
    A["微信启动 / 登录"] -->|session 共享| B["测试 1<br/>创建 page → 执行 → 关闭"]
    A -->|session 共享| C["测试 2<br/>重新创建 page → 执行 → 关闭"]
\`\`\`

> **优势**
> - 测试互不影响
> - 稳定性提高

---

# 9. conftest.py

pytest 提供的公共 fixture 文件，放在项目目录中即可自动加载。

\`\`\`
project
├── conftest.py    ← 公共 fixture 放这里，无需 import
├── test_api.py
└── test_ui.py
\`\`\`

## 例子

\`\`\`python
# conftest.py
@pytest.fixture
def token():
    return "xxxx"

# test_api.py
def test_api(token):    # pytest 自动从 conftest 发现
    print(token)
\`\`\`

> **> conftest 中的 fixture 不用 import，pytest 自动发现并注入。**

---

# 10. 接口自动化和 UI 自动化统一设计

推荐的项目结构：

\`\`\`
automation_project
├── api_tests
│   ├── conftest.py      ← API 专用 fixture
│   ├── test_login.py
│   └── test_order.py
├── ui_tests
│   ├── conftest.py      ← UI 专用 fixture
│   ├── test_customer.py
│   └── test_order.py
└── common
    ├── config.py
    ├── request.py
    └── logger.py
\`\`\`

---

# 11. 常见 Fixture 设计原则

## 原则 1：不要所有东西都使用 session

> **错误做法**
> 用 session 管理浏览器、页面、测试数据 — 容易污染，难以隔离。

> **推荐做法**
> - session：环境、登录
> - function：页面、数据

## 原则 2：fixture 只负责资源管理

> **不要**
> \`\`\`python
> @pytest.fixture
> def login():
>     login()
>     点击按钮
>     输入数据
>     校验结果     ← 验证逻辑不应放在 fixture 里
> \`\`\`

> **职责分离**
> - **Fixture 负责准备** — 搭建环境、获取资源
> - **测试用例负责验证** — 断言结果、检查行为

---

# 12. 常见问题

> **fixture 找不到**
> **原因：** fixture 没有放在 conftest.py 中，或者测试文件不在 conftest 的作用域下。
>
> **解决：** 将 fixture 移到合适的 conftest.py 中，pytest 会自动发现。

> **测试之间互相影响**
> **原因：** fixture 的 scope 过大（如 session 共享页面）。
>
> **解决：** 降低 scope：session → function。

---

# 13. 实际工作总结

## 接口自动化

| 项目        | 技术栈                               |
|-------------|--------------------------------------|
| 框架        | pytest + requests                    |
| fixture 负责 | token 获取、数据初始化、环境配置       |

## UI 自动化

| 项目        | 技术栈                               |
|-------------|--------------------------------------|
| 框架        | Minium + pytest                      |
| fixture 负责 | 微信启动、小程序登录、页面管理、测试隔离 |

## 整体框架

\`\`\`mermaid
graph LR
    subgraph 接口自动化
        A1["登录"] --> B1["token"] --> C1["接口测试"]
    end

    subgraph UI自动化
        A2["启动微信"] --> B2["登录"] --> C2["页面"] --> D2["UI测试"]
    end
\`\`\`

> **核心观点**
> Fixture 是 pytest 自动化框架的核心能力。接口自动化和 UI 自动化中的资源管理都可以通过 fixture 进行统一管理。
>
> 面试时面对"你们 pytest 框架怎么设计？"，可以按照这个思路讲。`,
    author,
    tags: [{ id: 'obs-3-1', name: 'Pytest', color: '#9A7435' }, { id: 'obs-3-2', name: '自动化测试', color: '#596B63' }],
    category: { id: '1', name: '技术分享', description: '测试技术和经验分享', icon: 'Code' },
    createdAt: '2026-07-24T12:00:00+08:00',
    updatedAt: '2026-07-24T12:00:00+08:00',
    readTime: 10,
    views: 0,
    likes: 0,
    comments: [],
    featured: true,
  },
  {
    id: 'obs-04',
    title: '测试岗位知识库索引',
    slug: 'software-testing-knowledge-index',
    excerpt: '测试岗位知识库索引',
    content: `# 测试岗位知识库索引

> **> 这是测试岗位 Codex 提问模板的总入口，适合在 Obsidian 里作为导航页使用。**

## 专题入口

- 测试岗位 Codex 提问手册
- 接口测试提问模板合集
- Web自动化提问模板合集
- CI-CD-Docker提问模板合集

## 使用建议

### 日常顺序

1. 先判断问题属于接口、Web 自动化，还是 CI/CD 和 Docker
2. 打开对应专题页，直接复制模板
3. 让 Codex 先给测试点，再给方案，最后再落文档

### 你最常用的技能组合

- 接口测试：\`fetch\`、\`filesystem\`、\`memory\`、\`sequentialthinking\`、\`notion-research-documentation\`
- Web / UI 自动化：\`playwright\`、\`screenshot\`、\`filesystem\`
- CI/CD / Git / Docker：\`git\`、\`gh-fix-ci\`、\`gh-address-comments\`、\`filesystem\`、\`sequentialthinking\`

## 快速入口

> **> 如果你只想快速找模板，先看：**
> - 接口测试 -> 接口测试提问模板合集#接口测试总览
> - Web 自动化 -> Web自动化提问模板合集#Web 自动化总览
> - CI/CD 排查 -> CI-CD-Docker提问模板合集#流水线排查清单`,
    author,
    tags: [{ id: 'obs-4-1', name: '软件测试', color: '#596B63' }, { id: 'obs-4-2', name: '知识库', color: '#314C3D' }],
    category: { id: '1', name: '技术分享', description: '测试技术和经验分享', icon: 'Code' },
    createdAt: '2026-07-24T13:00:00+08:00',
    updatedAt: '2026-07-24T13:00:00+08:00',
    readTime: 2,
    views: 0,
    likes: 0,
    comments: [],
    featured: false,
  },
  {
    id: 'obs-05',
    title: 'Git 误修改前端代码恢复处理记录',
    slug: 'git-accidental-change-recovery',
    excerpt: '二、问题排查',
    content: `# 二、问题排查

## 1. 查看 Git 当前状态

执行：

\`\`\`bash
git status
\`\`\`

发现：

\`\`\`text
On branch feature/milestone3

Your branch is ahead of 'origin/feature/milestone3' by 13 commits.
\`\`\`

说明：

当前本地分支比远程分支多出了 13 个提交。

同时发现：

\`\`\`text
Untracked files:

api_tests/
reports/
test/
\`\`\`

说明：

存在未被 Git 管理的本地文件。

---

# 三、问题分析

## 1. 本地提交问题

提示：

\`\`\`
Your branch is ahead of 'origin/feature/milestone3' by 13 commits
\`\`\`

表示：

本地存在：

\`\`\`
本地 feature/milestone3

        ↓

比远程多 13 个 commit
\`\`\`

这些提交没有推送到远程。

因此：

- 远程仓库没有受到影响

- 可以安全恢复本地


---

## 2. 未跟踪文件问题

发现：

\`\`\`
api_tests/
reports/
test/
\`\`\`

分析：

这些不是前端源码修改，而是：

- 测试代码

- 自动化测试报告

- 测试运行生成文件


其中：

\`\`\`
__pycache__
.pyc
reports
outputs
\`\`\`

属于测试运行产生的临时文件。

---

# 四、解决方案

## 第一步：获取远程最新代码状态

执行：

\`\`\`bash
git fetch origin
\`\`\`

作用：

- 获取远程仓库最新信息

- 不修改本地代码

- 更新远程分支引用


执行结果：

无报错。

---

# 第二步：强制恢复本地分支

执行：

\`\`\`bash
git reset --hard origin/feature/milestone3
\`\`\`

作用：

将当前本地分支强制恢复到远程分支状态。

执行后：

\`\`\`
HEAD is now at 4b0a1fed Merge branch 'feature/milestone3'
\`\`\`

说明：

恢复成功。

效果：

|内容|结果|
|---|---|
|本地修改代码|删除|
|本地多余13个commit|删除|
|代码版本|恢复远程版本|
|远程仓库|未影响|

---

# 第三步：检查未跟踪文件

执行：

\`\`\`bash
git clean -nd
\`\`\`

作用：

预览哪些未跟踪文件会被删除。

输出：

\`\`\`
Would remove api_tests/__pycache__/
Would remove api_tests/scenarios/
Would remove outputs/
Would remove reports/
Would remove test/
\`\`\`

确认：

这些文件均为测试产生文件，不需要保留。

---

# 第四步：删除未跟踪文件

执行：

\`\`\`bash
git clean -fd
\`\`\`

作用：

删除所有未被 Git 管理的文件。

删除：

\`\`\`
api_tests/__pycache__/
api_tests/scenarios/
outputs/
reports/
test/
\`\`\`

---

# 五、最终验证

执行：

\`\`\`bash
git status
\`\`\`

结果：

\`\`\`
On branch feature/milestone3

Your branch is up to date with 'origin/feature/milestone3'.

nothing to commit, working tree clean
\`\`\`

表示：

恢复成功。

当前状态：

\`\`\`
本地 feature/milestone3
            |
            |
            ↓
远程 origin/feature/milestone3


完全一致
\`\`\`

---

# 六、本次使用 Git 命令说明

## 1. 查看仓库状态

\`\`\`bash
git status
\`\`\`

用途：

查看：

- 修改文件

- 未跟踪文件

- 当前分支状态


---

## 2. 拉取远程信息

\`\`\`bash
git fetch origin
\`\`\`

用途：

获取远程最新提交信息。

特点：

- 不修改代码

- 不合并代码

- 安全


---

## 3. 强制恢复远程版本

\`\`\`bash
git reset --hard origin/分支名
\`\`\`

例如：

\`\`\`bash
git reset --hard origin/feature/milestone3
\`\`\`

作用：

让本地完全等于远程。

会清除：

- 未提交修改

- 本地commit


⚠️ 注意：

该命令不可恢复，执行前确认没有重要代码。

---

## 4. 查看将删除的文件

\`\`\`bash
git clean -nd
\`\`\`

参数：

\`\`\`
-n
\`\`\`

表示：

只预览，不删除。

---

## 5. 删除未跟踪文件

\`\`\`bash
git clean -fd
\`\`\`

参数：

\`\`\`
-f 强制删除

-d 删除目录
\`\`\`

用于清理：

- 测试报告

- 缓存

- 临时文件


---

# 七、经验总结

## 1. 测试代码不要直接放前端项目目录

错误方式：

\`\`\`
DF-uniapp-business

├── pages
├── components
├── api_tests
├── reports
└── test
\`\`\`

容易导致：

- Git状态混乱

- 误提交测试代码

- 污染开发仓库


推荐：

\`\`\`
workspace

├── DF-uniapp-business
│
└── DF-test
    ├── api_tests
    ├── reports
    └── scripts
\`\`\`

---

## 2. 修改代码前先检查状态

习惯：

\`\`\`bash
git status
\`\`\`

确认：

\`\`\`
working tree clean
\`\`\`

再开始工作。

---

## 3. 测试生成文件加入.gitignore

例如：

\`\`\`gitignore
__pycache__/
*.pyc
reports/
outputs/
\`\`\`

避免测试运行产生垃圾文件。

---

# 八、最终结果

问题：

> 测试人员误修改前端代码，并产生本地提交和测试文件。

解决：

通过：

\`\`\`bash
git fetch origin

git reset --hard origin/feature/milestone3

git clean -fd
\`\`\`

完成恢复。

最终：

✅ 本地代码恢复远程版本
✅ 本地提交清除
✅ 测试临时文件清理
✅ 远程仓库未受到影响

---`,
    author,
    tags: [{ id: 'obs-5-1', name: 'Git', color: '#314C3D' }, { id: 'obs-5-2', name: '故障恢复', color: '#A33A2B' }],
    category: { id: '1', name: '技术分享', description: '测试技术和经验分享', icon: 'Code' },
    createdAt: '2026-07-24T14:00:00+08:00',
    updatedAt: '2026-07-24T14:00:00+08:00',
    readTime: 5,
    views: 0,
    likes: 0,
    comments: [],
    featured: false,
  },
  {
    id: 'obs-06',
    title: 'CI/CD 与 Docker 提问模板合集',
    slug: 'cicd-docker-prompt-templates',
    excerpt: 'CI-CD-Docker提问模板合集',
    content: `# CI-CD-Docker提问模板合集

> **> 这页适合 CI/CD、Docker、流水线失败排查、发布前检查和 Git 组合排查。**

## CI/CD 总览

\`\`\`text
我是做测试的，帮我从 CI/CD 和 Docker 的角度分析这个自动化测试项目。
请重点覆盖：
1. 如何在 CI 里执行
2. 依赖安装
3. 测试命令
4. 报告输出
5. 失败退出码
6. 日志保存
7. Docker 镜像封装
8. 容器运行参数
9. 服务器部署注意事项
10. 可能的流水线风险
\`\`\`

## 自动化项目 CI 改造

\`\`\`text
帮我把这个自动化测试项目改造成适合 CI/CD 执行的流程。
请输出：
1. 推荐执行顺序
2. 环境变量
3. 测试报告路径
4. 失败处理建议
5. 重试策略
6. 缓存建议
7. 并行执行建议
\`\`\`

## Docker 封装检查

\`\`\`text
帮我检查这个 Dockerfile 和流水线配置，看看有没有可能影响测试执行的坑，比如依赖缺失、时区、编码、权限、缓存、网络和镜像体积。
\`\`\`

## 容器化测试方案

\`\`\`text
帮我把这个自动化测试项目封装成 Docker 方案。
请输出：
1. Dockerfile 结构建议
2. 镜像构建命令
3. 容器运行命令
4. 挂载目录建议
5. 环境变量建议
6. 报告导出方式
7. 日志和结果保存方式
\`\`\`

## 流水线失败排查

\`\`\`text
这是 CI 失败日志，帮我定位最可能的原因，并给出修复顺序。
\`\`\`

## 构建通过但部署后失败

\`\`\`text
帮我分析为什么这次构建通过了，但部署后接口测试挂了。
请从：
1. 环境差异
2. 配置差异
3. 镜像差异
4. 数据差异
5. 网络差异
6. 依赖差异
来排查。
\`\`\`

## 发布前检查

\`\`\`text
帮我列一份测试项目发布前检查清单，覆盖代码、镜像、配置、报告、回滚和监控。
\`\`\`

## Git + CI 组合排查

\`\`\`text
帮我看一下这次代码改动和 CI 日志，判断哪些改动最可能引起测试失败，并告诉我应该优先回归哪些部分。
\`\`\`

## 流水线排查清单

\`\`\`text
请帮我整理一份 CI/CD + Docker 流水线排查清单。
请按下面顺序输出：
1. 代码层
2. 依赖层
3. 配置层
4. 镜像层
5. 容器运行层
6. 网络层
7. 数据层
8. 报告层
9. 发布层
10. 回滚层

每一层都帮我列出最常见的问题、排查方法和修复建议。
\`\`\`

## 复用提示

> **> 流水线类问题，先看“失败日志 + 环境差异 + 镜像差异”，通常能最快缩小范围。**`,
    author,
    tags: [{ id: 'obs-6-1', name: 'CI/CD', color: '#A33A2B' }, { id: 'obs-6-2', name: 'Docker', color: '#9A7435' }],
    category: { id: '1', name: '技术分享', description: '测试技术和经验分享', icon: 'Code' },
    createdAt: '2026-07-24T15:00:00+08:00',
    updatedAt: '2026-07-24T15:00:00+08:00',
    readTime: 2,
    views: 0,
    likes: 0,
    comments: [],
    featured: false,
  },
  {
    id: 'obs-07',
    title: '接口自动化 CI 部署全流程修复记录',
    slug: 'api-automation-ci-deployment-repair',
    excerpt: '2026-07-24 接口自动化 CI 部署全流程修复',
    content: `# 2026-07-24 接口自动化 CI 部署全流程修复

## 一句话总结

把接口自动化测试项目从"本地手动 docker build"改造为"云效 Flow 自动构建 + 主机自动部署"，过程中修了 4 个真实问题（BOM 头、CI 部署路径、缺失 cd、allure 历史保留）。

---

## 工作内容（按时间顺序）

### 1. 审查 7 个 worktree 项目

工作目录：\`C:\\Users\\Administrator\\.codex\\worktrees\\\`

| 项目 | HEAD | 状态 |
|------|------|------|
| f1aa | fdc7a02 | 落后 master 2 commit |
| 35d3 | e66743c | 落后 4 commit |
| 8022 | e66743c | 落后 4 commit |
| b14a | 78ca13c | 落后 3 commit |
| c95a | e66743c | 落后 4 commit |
| fb83 | e66743c | 落后 4 commit + 残留工具 |
| bab0 | （空） | worktree 创建失败 |

**结论**：所有 worktree 都是 \`detached HEAD\`，落后 master。f1aa 是嘉明最初说要审查的项目。

### 2. 合并 b14a

把其他项目的"值得放入"内容合并到 b14a：
- 合并 fb83 的 \`run.ps1\`（PowerShell 启动脚本）
- 测试 \`test_purchase_course.py\` 行 598 改为更完整字段
- 清理 b14a 跑测残留（tmp/、reports/、.hypothesis/、pycache）
- 不合并 35d3/8022 的 session-summary（session log）
- 不合并 fb83 的 wechat-miniapp-re-mcp（独立项目）

### 3. 审查主仓库

\`C:\\Users\\Administrator\\接口自动化\`（master HEAD = 8c81e39）

**结论**：主仓库是 master 最新版，没有缺失任何内容。所有 worktree 都落后。

### 4. 清理主仓库跑测残留

清理：
- \`tmp_obj/\`
- \`tmp_objects/\`
- \`.hypothesis/\`
- \`.agents/\`
- \`reports/\`（allure-results、allure-report、api_test.log、report.html）
- 所有 \`__pycache__/\`

**结果**：工作区干净（git status clean）。

### 5. 验证 packages 离线包完整

| 子目录 | 大小 | 内容 |
|--------|------|------|
| packages/allure | 25M | allure-2.27.0.zip |
| packages/docker | 46M | python-3.12-slim-bookworm.tar |
| packages/pip | 6.4M | 27 个 .whl |

**结论**：packages 全部 29 个文件 git tracked，无需重新 build。

### 6. 审查 Allure 报告

- 测试报告：\`reports/allure-report/index.html\`
- 数据来源：\`reports/allure-results/\`
- entrypoint.sh 4 步：用户模块 → 登录 → 全量接口 → 生成 report
- entrypoint.sh 每个步骤带 \`|| true\`，失败不中断

### 7. 创建 CI 流水线配置

新建 \`.aliyun-ci.yml\`（云效 Flow 专用）：
- build_and_push stage：DockerBuildPushACREE 专用步骤
- deploy stage：ssh-command 部署
- 关键变量：\`ACI_REGISTRY\`、\`ACI_NAMESPACE\`、\`SERVER_HOST\`、\`SERVER_USER\`、\`SERVER_KEY\`、\`DEPLOY_DIR\`

### 8. 创建 .gitattributes

新建 \`.gitattributes\`：
\`\`\`
*.sh text eol=lf
entrypoint.sh text eol=lf
run_test.sh text eol=lf
\`\`\`

**问题**：Windows git 默认 \`core.autocrlf=true\`，会把 LF 改成 CRLF。
**解决**：强制 LF，避免 BOM/CRLF 污染。

---

## 遇到的问题与解决方案

### 问题 1：entrypoint.sh 有 BOM 头导致 exec format error

**症状**：容器一启动就 \`Exited (1)\`，日志 \`exec ./entrypoint.sh: exec format error\`

**根因**：entrypoint.sh 是 Windows 格式（CRLF + UTF-8 BOM \`EF BB BF\`）

**修复**：
\`\`\`python
with open('entrypoint.sh', 'rb') as f:
    data = f.read()
if data.startswith(b'\\xef\\xbb\\xbf'):
    data = data[3:]
data = data.replace(b'\\r\\n', b'\\n')
with open('entrypoint.sh', 'wb') as f:
    f.write(data)
\`\`\`

**commit**：\`22e6f84 fix: 去除 entrypoint.sh BOM 头和 CRLF 行尾\`

### 问题 2：CI deploy 步骤找不到 docker-compose.yml

**症状**：\`Can't find a suitable configuration file in this directory or any parent\`

**根因**：SSH 步骤默认在 \`/root/\` 目录执行，不在 deploy 目录

**修复**：主机部署脚本加 \`cd /dffit/docker-compose/py_test/api-test-master/\`：
\`\`\`bash
cd /dffit/docker-compose/py_test/api-test-master && docker-compose up -d --force-recreate
\`\`\`

**部署脚本通过云效 Flow UI 主机的"部署脚本"字段配置**

### 问题 3：allure-report 每次跑不更新

**症状**：第二次跑后 allure-report/index.html mtime 还是 14:05（第一次跑时间）

**根因**：去掉了 \`--clean-alluredir\` 后，allure generate 默认也不覆盖

**修复**：保留 \`--clean\` 在 \`allure generate\`（步骤 4）上：
\`\`\`bash
# 步骤 1：保留 allure-results（无 --clean-alluredir）
pytest ... --alluredir=reports/allure-results --tb=line ...

# 步骤 4：每次重生成 allure-report（加了 --clean）
allure generate ... -o reports/allure-report --clean
\`\`\`

**最终效果**：
- allure-results：保留历史（4 次跑累计 28258 个文件）
- allure-report 目录：保留（inode 2237995 不变）
- allure-report 内容：每次刷新（index.html inode 变化）

### 问题 4：怎么判断目录是否被删除重建

**方案**：用 Inode 编号跨多次对比

\`\`\`bash
stat -c 'Inode=%i Birth=%w' /dffit/.../reports/allure-report
\`\`\`

**判断**：
- Inode 不变 → 目录没重建
- Inode 变 → 目录被重建
- Birth=-是 Linux ext4 不支持，正常

---

## 关键 commit

| commit | 改动 |
|--------|------|
| \`22e6f84\` | fix: 去除 entrypoint.sh BOM 头和 CRLF 行尾 |
| \`6bcdbc4\` | feat: 改用 shell 环境变量传递 CI_COMMIT_ID |
| \`eb573bf\` | feat: 添加云效 Flow 流水线配置（\`.aliyun-ci.yml\`） |

---

## 文件变更

### 新增

- \`.aliyun-ci.yml\`（49 行）— 云效 Flow 流水线
- \`.gitattributes\`（4 行）— 强制 shell 脚本 LF

### 修改

- \`entrypoint.sh\`：
  - 删 BOM 头 + 42 个 CRLF → LF
  - 步骤 1：去掉 \`--clean-alluredir\`
  - 步骤 4：加回 \`--clean\`

### 清理（不 commit）

- \`tmp_obj/\`、\`tmp_objects/\`、\`.hypothesis/\`、\`.agents/\`、\`reports/\`、所有 \`__pycache__/\`

### 工作树变更（b14a）

- 新增 \`run.ps1\`
- 修改 \`test_purchase_course.py\` 行 598

---

## 端到端部署流程（验证通过）

\`\`\`
git push 22e6f84
   ↓
云效 Flow 触发
   ↓
构建镜像：dffit-ops/apitest:22e6f842
   ↓
推送阿里云 CR（专用步骤 DockerBuildPushACREE）
   ↓
主机部署 SSH 步骤
   ↓
docker-compose up -d --force-recreate
   ↓
拉新镜像 → 启动容器 → 跑 entrypoint.sh
   ↓
pytest testcases/user/    → 23 用例
pytest testcases/auth/    → 9 用例
pytest testcases/api/     → 122 用例（54 failed, 210 passed）
allure generate --clean   → 报告
   ↓
reports/allure-report/index.html（最新数据）
reports/allure-results/（4 次跑累计 28258 个 JSON）
\`\`\`

---

## 关键验证证据

### allure-results 4 次跑 mtime 分布

\`\`\`
Jul 24 14:04   ← 第一次（commit 22e6f84）
Jul 24 14:05
Jul 24 14:25   ← 第二次（保留历史）
Jul 24 14:26
Jul 24 14:32   ← 第三次
Jul 24 14:33
Jul 24 14:51   ← 第四次（最新）
Jul 24 14:52
\`\`\`

### allure-report 目录 Inode 跨多次跑

\`\`\`
第一次跑后：Inode=2237995
第四次跑后：Inode=2237995  ← 不变，目录没重建
\`\`\`

### 测试结果

\`\`\`
54 failed, 210 passed, 578 skipped in 26.07s
\`\`\`

---

## 学习点

1. **Linux 文件格式问题**：Windows 编辑的文件带 BOM/CRLF，Linux 执行会报 \`exec format error\`
2. **CI 部署脚本工作目录**：主机部署默认在 \`/root/\`，需要 \`cd\` 到目标目录
3. **Docker compose volume bind mount**：容器内 \`/app/reports\` 挂载到主机 \`/dffit/.../reports\`
4. **allure --clean 行为**：在 allure-results 上 = 每次清空，在 allure-report 上 = 重新生成
5. **Inode 验证**：判断目录是否被删重建的可靠方法
6. **autocrlf 配置**：Windows git 默认把 LF 改成 CRLF，需要 \`.gitattributes\` 强制

---

## 待办

- 处理 54 个 failed 用例（依赖真实业务数据的 detail 接口）
- 把 docker-compose.yml 加到主仓库（目前仅在服务器）
- 在 OPS.md 中更新新流程
- 评估是否要按 commit ID 分 allure 目录（方案 B）`,
    author,
    tags: [{ id: 'obs-7-1', name: '接口测试', color: '#9A7435' }, { id: 'obs-7-2', name: 'CI/CD', color: '#596B63' }],
    category: { id: '1', name: '技术分享', description: '测试技术和经验分享', icon: 'Code' },
    createdAt: '2026-07-24T16:00:00+08:00',
    updatedAt: '2026-07-24T16:00:00+08:00',
    readTime: 9,
    views: 0,
    likes: 0,
    comments: [],
    featured: false,
  },
  {
    id: 'obs-08',
    title: '接口测试提问模板合集',
    slug: 'api-testing-prompt-templates',
    excerpt: '接口测试提问模板合集',
    content: `# 接口测试提问模板合集

> **> 这页适合接口测试、接口自动化、接口联调排障、接口评审和测试用例设计。**

## 接口测试总览

\`\`\`text
我是做测试的，帮我从接口测试视角分析这个接口或接口组。
请重点覆盖：
1. 接口功能主流程
2. 参数校验
3. 边界值
4. 异常场景
5. 幂等性
6. 权限和鉴权
7. 返回值断言
8. 接口自动化可落地性
9. 可能的测试风险点
\`\`\`

## 需求转接口用例

\`\`\`text
帮我把下面这些接口整理成一套接口测试用例，按“正常、异常、边界、权限、数据依赖、幂等性”分类输出，并补充每条用例的前置条件、步骤和预期结果。
\`\`\`

## 接口文档转测试点

\`\`\`text
这是接口文档，请帮我提取适合测试的关键点。
我希望你输出：
1. 必测接口列表
2. 每个接口的正向和异常场景
3. 参数校验点
4. 接口联动关系
5. 自动化优先级
\`\`\`

## 接口返回值分析

\`\`\`text
这是接口请求参数、响应结果和报错信息，帮我定位问题可能出在哪一层，并给出排查顺序。
\`\`\`

## 接口自动化方案

\`\`\`text
帮我基于这个接口组设计一套接口自动化测试方案。
请输出：
1. 目录结构建议
2. 测试数据设计
3. 依赖关系处理
4. 断言策略
5. 登录态 / token 处理
6. 报告输出建议
7. CI 里如何执行
\`\`\`

## 接口回归补漏

\`\`\`text
帮我检查这套接口测试点，找出可能漏掉的异常场景、边界条件和数据依赖问题。
\`\`\`

## 接口联调问题排查

\`\`\`text
这是接口联调时出现的问题，请帮我按“请求参数、签名鉴权、环境配置、数据准备、下游依赖、返回断言”顺序排查。
\`\`\`

## 接口测试评审

\`\`\`text
请从测试视角评审这套接口设计，重点看：
1. 是否容易测
2. 是否容易自动化
3. 是否存在歧义字段
4. 是否缺少错误码
5. 是否有明显的回归风险
\`\`\`

## 用例设计清单

\`\`\`text
请帮我把这个接口整理成接口测试用例设计清单。
请按下面维度输出：
1. 功能主流程
2. 参数必填校验
3. 参数格式校验
4. 参数边界值
5. 空值和特殊值
6. 鉴权和权限
7. 幂等性
8. 重复提交
9. 数据依赖
10. 下游异常
11. 返回码和返回体
12. 接口联动
13. 性能和稳定性风险
14. 自动化优先级

每一项都帮我给出具体测试点，最好能直接落成测试用例。
\`\`\`

## 复用提示

> **> 如果接口很多，先让 Codex 输出“必测接口列表”，再按优先级逐个展开。**`,
    author,
    tags: [{ id: 'obs-8-1', name: '接口测试', color: '#596B63' }, { id: 'obs-8-2', name: '效率工具', color: '#314C3D' }],
    category: { id: '1', name: '技术分享', description: '测试技术和经验分享', icon: 'Code' },
    createdAt: '2026-07-24T17:00:00+08:00',
    updatedAt: '2026-07-24T17:00:00+08:00',
    readTime: 2,
    views: 0,
    likes: 0,
    comments: [],
    featured: false,
  },
  {
    id: 'obs-09',
    title: 'Web 自动化测试提问模板合集',
    slug: 'web-automation-prompt-templates',
    excerpt: 'Web自动化提问模板合集',
    content: `# Web自动化提问模板合集

> **> 这页适合 Web/UI 自动化、页面回归、截图留证、Playwright 脚本设计和多端表现分析。**

## Web 自动化总览

\`\`\`text
我是做测试的，帮我从 Web/UI 自动化测试视角分析这个页面或流程。
请重点覆盖：
1. 页面核心功能
2. 页面跳转和交互
3. 表单校验
4. 异常提示
5. DOM 元素定位稳定性
6. 自动化脚本可维护性
7. 截图或回归验证点
8. 适合做 Playwright 自动化的步骤
9. 需要重点回归的风险点
\`\`\`

## 页面转自动化脚本思路

\`\`\`text
帮我基于这个页面和需求，设计一套 Web 自动化测试脚本思路。
请输出：
1. 测试场景
2. 断言点
3. 数据准备方式
4. 建议的页面对象结构
5. 稳定定位策略
6. 适合放进 CI 的部分
\`\`\`

## 页面问题排查

\`\`\`text
这是页面截图、操作步骤和需求说明，帮我检查 UI 和交互上可能存在的问题，并告诉我哪些地方适合加截图回归。
\`\`\`

## 页面回归点梳理

\`\`\`text
请帮我把这个页面整理成回归清单，按：
1. 首屏
2. 核心业务流
3. 表单校验
4. 异常提示
5. 跳转逻辑
6. 按钮状态
7. 权限控制
8. 多浏览器兼容
来输出。
\`\`\`

## Playwright 自动化设计

\`\`\`text
帮我用 Playwright 的思路设计一套 Web 自动化测试方案。
请重点给我：
1. 登录态处理
2. 页面对象设计
3. 等待和稳定性策略
4. 测试数据管理
5. 截图和视频留证建议
6. CI 运行注意事项
\`\`\`

## UI 交互检查

\`\`\`text
请从测试角度检查这个页面的 UI 交互是否合理。
重点看：
1. 按钮状态
2. 输入框校验
3. 提示文案
4. 弹窗流程
5. 空状态
6. 加载态
7. 错误态
8. 视觉一致性
\`\`\`

## Web 测试风险分析

\`\`\`text
帮我分析这个 Web 功能在自动化测试中最容易出问题的地方，并告诉我怎么降低脚本不稳定性。
\`\`\`

## 多端表现分析

\`\`\`text
这是同一个页面在不同浏览器或不同分辨率下的表现，请帮我判断哪些是兼容性问题，哪些是需求问题，哪些适合做自动化回归。
\`\`\`

## 复用提示

> **> Web 自动化类问题，优先先问“核心流程 + 断言点 + 稳定定位策略”。**`,
    author,
    tags: [{ id: 'obs-9-1', name: 'Web自动化', color: '#314C3D' }, { id: 'obs-9-2', name: '效率工具', color: '#A33A2B' }],
    category: { id: '1', name: '技术分享', description: '测试技术和经验分享', icon: 'Code' },
    createdAt: '2026-07-24T18:00:00+08:00',
    updatedAt: '2026-07-24T18:00:00+08:00',
    readTime: 2,
    views: 0,
    likes: 0,
    comments: [],
    featured: false,
  },
  {
    id: 'obs-10',
    title: '测试岗位 Codex 提问手册',
    slug: 'codex-prompt-handbook-for-testers',
    excerpt: '测试岗位 Codex 提问手册',
    content: `# 测试岗位 Codex 提问手册

这份手册按测试工作场景拆成了 3 个专题。

## 专题页

- 接口测试提问模板合集
- Web自动化提问模板合集
- CI-CD-Docker提问模板合集

## 适用方式

> **> 先确定问题属于接口、Web 自动化，还是流水线和容器，再打开对应专题页直接复制模板提问。**

## 搭配建议

- 接口测试：\`fetch\`、\`filesystem\`、\`memory\`、\`sequentialthinking\`、\`notion-research-documentation\`
- Web / UI 自动化：\`playwright\`、\`screenshot\`、\`filesystem\`
- CI/CD / Git / Docker：\`git\`、\`gh-fix-ci\`、\`gh-address-comments\`、\`filesystem\`、\`sequentialthinking\``,
    author,
    tags: [{ id: 'obs-10-1', name: 'Codex', color: '#A33A2B' }, { id: 'obs-10-2', name: '软件测试', color: '#9A7435' }],
    category: { id: '1', name: '技术分享', description: '测试技术和经验分享', icon: 'Code' },
    createdAt: '2026-07-24T19:00:00+08:00',
    updatedAt: '2026-07-24T19:00:00+08:00',
    readTime: 2,
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
    coverImage: '/covers/openclaw.json',
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
    views: 186,
    likes: 24,
    comments: [
      {
        id: 'c1',
        author: '王明',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        content: '文章写得非常详细！按照步骤操作终于接入了企业微信，感谢分享！',
        createdAt: '2026-03-14',
      },
      {
        id: 'c2',
        author: '李华',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        content: '自建应用方案的部分讲得很清楚，比官方文档好懂多了',
        createdAt: '2026-03-15',
      },
    ],
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
    coverImage: '/covers/jmeter.json',
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
    views: 324,
    likes: 42,
    comments: [
      {
        id: 'c3',
        author: '张伟',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        content: 'JMeter 教程是我看过最详细的，特别是实战案例部分很实用',
        createdAt: '2026-03-14',
      },
      {
        id: 'c4',
        author: '陈静',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        content: '收藏了！正准备学习性能测试，这篇文章来得太及时',
        createdAt: '2026-03-15',
      },
      {
        id: 'c5',
        author: '刘强',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        content: '最佳实践部分总结得很有价值，感谢博主分享',
        createdAt: '2026-03-16',
      },
    ],
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

export const getPostsByTag = (tagIdOrName: string): Post[] => {
  return posts.filter(post =>
    post.tags.some(tag =>
      tag.id === tagIdOrName || tag.name.toLowerCase() === tagIdOrName.toLowerCase()
    )
  );
};
