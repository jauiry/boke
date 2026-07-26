import { motion } from 'framer-motion';
import { 
  Mail, MapPin, Phone, Calendar, Briefcase, GraduationCap,
  Code, Database, Bug, Server, FileText, Users, Award,
  CheckCircle, Star, Zap, Target, Cpu
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { author } from '@/data/blogData';

// 技能分类
const skillCategories = [
  {
    title: 'AI驱动测试',
    icon: Cpu,
    skills: ['AI业务流程梳理', '场景化测试点生成', 'AI辅助用例设计', '减少漏测'],
    color: 'bg-cinnabar'
  },
  {
    title: '接口与自动化',
    icon: Server,
    skills: ['JMeter', 'Postman', 'apifox', 'Python+requests', 'Python+playwright', 'HTTP协议'],
    color: 'bg-cinnabar'
  },
  {
    title: '性能测试',
    icon: Zap,
    skills: ['JMeter压测', 'perfdog性能测试', '分布式压测', '并发测试', '性能测试报告'],
    color: 'bg-cinnabar'
  },
  {
    title: '抓包与调试',
    icon: Bug,
    skills: ['Fiddler', 'Charles', 'F12开发者工具', 'adb命令', 'Monkey压测', '弱网测试'],
    color: 'bg-cinnabar'
  },
  {
    title: 'APP测试',
    icon: Target,
    skills: ['WEB/APP/H5/小程序', 'Google Play审核', 'Apple Store审核', '兼容性测试', '闪退测试'],
    color: 'bg-cinnabar'
  },
  {
    title: '数据库与工具',
    icon: Database,
    skills: ['MySQL', 'Linux', 'Git/SVN', '飞书/JIRA', 'Xmind', 'Claude code辅助'],
    color: 'bg-cinnabar'
  }
];

// 工作经历
const experiences = [
  {
    year: '2024.12 - 2026.02',
    title: '软件测试工程师',
    company: '俊城达网络科技有限公司',
    location: '杭州',
    achievements: [
      '负责各端APP的Google Play & Apple Store & 商米应用市场提交审核',
      '使用AI梳理业务流程、生成场景化测试点，减少漏测',
      '负责带新人，提供入职培训，熟悉项目和工具'
    ]
  },
  {
    year: '2023.06 - 2024.12',
    title: '软件测试工程师',
    company: '上海奇搜网络科技有限公司',
    location: '上海',
    achievements: [
      '3年测试工程师从业经验，负责过多个产品的测试项目',
      '精通JMeter、apifox、postman做接口测试和压力测试',
      '熟练使用Fiddler、Charles抓包工具分析HTTP请求和响应',
      '定期参加技术分享并获得"双月分享之星"称号'
    ]
  }
];

// 项目经历
const projects = [
  {
    year: '2025.05 - 2026.02',
    name: 'JEADA 商家端 (APP & WEB)',
    type: 'APP/WEB',
    description: '为外卖平台商家提供的管理端应用，在商米POS机使用，支持店铺管理、商品上下架、订单处理、财务结算、打印小票等功能。',
    responsibilities: [
      '编写测试计划、用户手册，评审测试用例',
      '使用adb命令定位Android系统手机日志',
      '使用monkey做闪退测试，perfdog做性能测试',
      '测试各种Android机型嵌入APP后的功能情况',
      '编写测试报告，评估软件质量'
    ]
  },
  {
    year: '2025.05 - 2026.02',
    name: 'JEADA M端 (后台管理系统)',
    type: 'WEB',
    description: '为外卖平台内部运营人员提供的后台管理系统，涵盖用户管理、订单管理、商家管理、活动配置、财务结算等功能。',
    responsibilities: [
      '负责需求分析及评审，编写测试计划',
      '使用MySQL数据库对数据进行校验和测试',
      '使用Fiddler和F12抓包定位前后端bug',
      '使用JMeter和apifox做接口测试和性能测试',
      '编写测试报告，评估软件质量'
    ]
  },
  {
    year: '2025.02 - 2025.05',
    name: 'JEADA D端 (骑手端APP)',
    type: 'APP',
    description: '面向外卖配送员的移动端应用，帮助骑手接单、导航取餐、送餐及完成订单管理，具备实时订单推送、路线规划、异常上报等功能。',
    responsibilities: [
      '负责需求评审、测试计划编写',
      '使用MySQL数据库对数据校验',
      '使用Fiddler和F12抓包定位bug',
      '使用JMeter和apifox做接口测试和性能测试',
      '编写测试报告，评估软件质量'
    ]
  },
  {
    year: '2025.02 - 2025.05',
    name: 'JEADA S端 (站点调度管理后台)',
    type: 'WEB',
    description: '为外卖平台打造的智能调度系统，基于实时位置、订单优先级、骑手状态等数据，采用智能算法优化订单分配策略和配送路线。',
    responsibilities: [
      '负责需求分析及评审，编写测试用例',
      '使用MySQL数据库对数据校验',
      '使用Fiddler和F12抓包定位bug',
      '使用JMeter做接口测试和性能测试',
      '编写测试报告，对软件质量进行评估'
    ]
  },
  {
    year: '2024.07 - 2025.01',
    name: '优时通购物 (WEB & APP)',
    type: 'APP/WEB',
    description: '针对母婴用品购物平台，有APP端和WEB端，支持拼团、补贴、满减等活动。',
    responsibilities: [
      '使用JMeter进行登录、购物车、提交订单等性能测试',
      '在禅道提交Bug，进行多轮回归测试',
      '使用Fiddler和F12抓包定位前后端bug',
      '测试Android和IOS两种系统的APP兼容性',
      '使用Charles模拟网络延迟、中断、超时测试'
    ]
  },
  {
    year: '2023.12 - 2024.07',
    name: '优时通购物平台后台管理系统',
    type: 'WEB',
    description: '帮助购物平台高效管理商品、订单、用户等核心业务数据，实现全流程化管理。',
    responsibilities: [
      '执行测试用例，在禅道提交并追踪Bug',
      '使用JMeter和apifox做接口测试和压力测试',
      '使用Fiddler和F12抓包定位前后端bug',
      '使用Linux命令查询日志',
      '编写测试报告，评估软件质量'
    ]
  },
  {
    year: '2023.06 - 2023.12',
    name: '健安 APP',
    type: 'APP',
    description: '在线健康咨询及健康管理APP，由平安健康互联推出，以医生资源为核心，提供实时咨询和健康管理服务。',
    responsibilities: [
      '编写测试用例，召开用例评审会议',
      '执行测试用例，在禅道提交bug并进行回归测试',
      '分别测试Android和IOS系统上面的功能',
      '使用SQL语句对数据库进行查询，检验数据一致性',
      '使用JMeter进行接口测试和性能测试'
    ]
  }
];

// 教育背景
const education = [
  {
    year: '2019.09 - 2023.07',
    school: '马鞍山学院',
    major: '计算机科学与技术',
    degree: '本科'
  }
];

// 个人优势
const advantages = [
  { icon: FileText, title: '文档能力', desc: '良好的文档编写能力' },
  { icon: Code, title: '逻辑思维', desc: '较好的逻辑分析能力' },
  { icon: Users, title: '团队协作', desc: '具有责任心和团队合作能力' },
  { icon: Award, title: '沟通协调', desc: '擅长跨部门协作' },
  { icon: Star, title: '学习能力', desc: '快速学习新技术' },
  { icon: CheckCircle, title: '执行力', desc: '高效完成任务' }
];

export default function AboutPage() {
  return (
    <div className="ink-page min-h-[100dvh] pb-16 pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 顶部个人信息卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="overflow-hidden border-0 shadow-2xl bg-white dark:bg-[var(--paper-deep)]">
            <div className="h-32 bg-gradient-to-r from-[#363d37] via-[#687266] to-[#8f342a]" />
            <CardContent className="relative px-8 pb-8">
              <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 mb-6">
                <Avatar className="w-32 h-32 border-4 border-white dark:border-white/5 shadow-lg">
                  <AvatarImage src={author.avatar} alt={author.name} />
                  <AvatarFallback className="text-4xl bg-gradient-to-br from-[#59615a] to-[#a83f32] text-white">
                    {author.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                  <h1 className="text-3xl font-bold text-ink dark:text-white">
                    {author.name}
                  </h1>
                  <p className="text-xl text-cinnabar dark:text-cinnabar font-medium">
                    软件测试工程师
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Badge variant="secondary" className="text-sm px-4 py-2 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    随时到岗
                  </Badge>
                </div>
              </div>
              
              {/* 基本信息网格 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="flex items-center space-x-2 text-ink-soft dark:text-ink-muted">
                  <Calendar className="w-4 h-4 text-cinnabar" />
                  <span>26岁 · 3年经验</span>
                </div>
                <div className="flex items-center space-x-2 text-ink-soft dark:text-ink-muted">
                  <GraduationCap className="w-4 h-4 text-cinnabar" />
                  <span>本科</span>
                </div>
                <div className="flex items-center space-x-2 text-ink-soft dark:text-ink-muted">
                  <MapPin className="w-4 h-4 text-cinnabar" />
                  <span>杭州市</span>
                </div>
                <div className="flex items-center space-x-2 text-ink-soft dark:text-ink-muted">
                  <Briefcase className="w-4 h-4 text-cinnabar" />
                  <span>离职状态</span>
                </div>
              </div>

              {/* 联系方式 */}
              <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-black/10 dark:border-white/10">
                <a href="tel:183-2597-5419" className="flex items-center space-x-2 px-4 py-2 bg-[var(--paper-deep)] dark:bg-[#292e29] rounded-full text-sm text-ink-soft dark:text-ink-soft hover:bg-[color-mix(in_srgb,var(--cinnabar)_12%,var(--paper))] dark:hover:bg-[color-mix(in_srgb,var(--cinnabar)_18%,var(--paper))] transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>183-2597-5419</span>
                </a>
                <a href="mailto:1102684926@qq.com" className="flex items-center space-x-2 px-4 py-2 bg-[var(--paper-deep)] dark:bg-[#292e29] rounded-full text-sm text-ink-soft dark:text-ink-soft hover:bg-[color-mix(in_srgb,var(--cinnabar)_12%,var(--paper))] dark:hover:bg-[color-mix(in_srgb,var(--cinnabar)_18%,var(--paper))] transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>1102684926@qq.com</span>
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 左侧主要内容 */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 工作经历 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl">
                    <Briefcase className="w-5 h-5 mr-2 text-cinnabar" />
                    工作经历
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {experiences.map((exp, index) => (
                      <div key={index} className="relative pl-6 pb-6 border-l-2 border-black/10 dark:border-white/10 last:pb-0">
                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[color-mix(in_srgb,var(--cinnabar)_7%,var(--paper))]0 border-4 border-white dark:border-white/5" />
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge className="bg-[color-mix(in_srgb,var(--cinnabar)_12%,var(--paper))] text-cinnabar dark:bg-[color-mix(in_srgb,var(--cinnabar)_18%,var(--paper))] dark:text-cinnabar">
                            {exp.year}
                          </Badge>
                          <span className="text-sm text-ink-muted">{exp.location}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-ink dark:text-white">
                          {exp.title}
                        </h3>
                        <p className="text-cinnabar dark:text-cinnabar font-medium mb-3">
                          {exp.company}
                        </p>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, idx) => (
                            <li key={idx} className="flex items-start text-ink-soft dark:text-ink-muted">
                              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                              <span className="text-sm">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 教育背景 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl">
                    <GraduationCap className="w-5 h-5 mr-2 text-cinnabar" />
                    教育背景
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {education.map((edu, index) => (
                    <div key={index} className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-ink dark:text-white">
                          {edu.school}
                        </h3>
                        <p className="text-ink-soft dark:text-ink-muted">
                          {edu.major} · {edu.degree}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-ink-muted">
                        {edu.year}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* 项目经历 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl">
                    <Briefcase className="w-5 h-5 mr-2 text-cinnabar" />
                    项目经历
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {projects.map((project, index) => (
                      <div key={index} className="relative pl-6 pb-6 border-l-2 border-black/10 dark:border-white/10 last:pb-0">
                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[color-mix(in_srgb,var(--cinnabar)_7%,var(--paper))]0 border-4 border-white dark:border-white/5" />
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge className="bg-[color-mix(in_srgb,var(--cinnabar)_12%,var(--paper))] text-cinnabar dark:bg-[color-mix(in_srgb,var(--cinnabar)_18%,var(--paper))] dark:text-cinnabar">
                            {project.year}
                          </Badge>
                          <Badge variant="outline" className="text-ink-muted">
                            {project.type}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-ink dark:text-white mb-2">
                          {project.name}
                        </h3>
                        <p className="text-sm text-ink-soft dark:text-ink-muted mb-3">
                          {project.description}
                        </p>
                        <ul className="space-y-1">
                          {project.responsibilities.map((resp, idx) => (
                            <li key={idx} className="flex items-start text-ink-soft dark:text-ink-muted">
                              <CheckCircle className="w-3 h-3 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                              <span className="text-xs">{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 技能矩阵 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl">
                    <Code className="w-5 h-5 mr-2 text-cinnabar" />
                    专业技能
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {skillCategories.map((category, index) => (
                      <motion.div
                        key={category.title}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                        className="p-4 rounded-xl bg-gradient-to-br from-[var(--paper)] to-white dark:from-[var(--paper-deep)] dark:to-[#292e29] border border-black/10 dark:border-white/15 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center mb-3">
                          <div className={`mr-3 flex h-10 w-10 items-center justify-center ${category.color}`}>
                            <category.icon className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="font-semibold text-ink dark:text-white">
                            {category.title}
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {category.skills.map((skill) => (
                            <span
                              key={skill}
                              className="border border-black/10 bg-[var(--paper)] px-2 py-1 text-xs text-ink-soft dark:border-white/20"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* 右侧侧边栏 */}
          <div className="space-y-8">
            
            {/* 个人优势 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-[#363d37] to-[#8f342a] text-white">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl text-white">
                    <Star className="w-5 h-5 mr-2" />
                    个人优势
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {advantages.map((adv, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                          <adv.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium">{adv.title}</p>
                          <p className="text-sm text-white/80">{adv.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 核心亮点 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <Award className="w-5 h-5 mr-2 text-yellow-500" />
                    核心亮点
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-ink-soft dark:text-ink-muted">
                        3年测试经验，精通JMeter性能与接口测试
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-ink-soft dark:text-ink-muted">
                        AI驱动测试思维，减少漏测提高覆盖率
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-ink-soft dark:text-ink-muted">
                        移动端(WEP/APP/H5/小程序)测试经验
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-ink-soft dark:text-ink-muted">
                        Python+playwright UI自动化实践
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-ink-soft dark:text-ink-muted">
                        负责APP应用市场上架审核
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* 联系我 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="border-0 shadow-lg bg-[var(--paper)] text-white">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold mb-2">有意联系？</h3>
                  <p className="text-sm text-ink-muted mb-4">
                    随时欢迎交流合作机会
                  </p>
                  <a 
                    href="tel:183-2597-5419"
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-cinnabar hover:bg-[#8f342a] rounded-lg text-sm font-medium transition-colors"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    拨打电话
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
