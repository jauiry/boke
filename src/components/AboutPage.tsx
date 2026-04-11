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
    title: '测试理论与方法',
    icon: Target,
    skills: ['功能测试', '兼容性测试', 'UI测试', '安全测试', '敏捷开发', '测试流程设计'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: '接口测试',
    icon: Server,
    skills: ['HTTP协议', 'Cookie/Token认证', 'Postman', 'JMeter自动化', '状态码', '请求方法'],
    color: 'from-green-500 to-emerald-500'
  },
  {
    title: '性能测试',
    icon: Zap,
    skills: ['JMeter压测', '性能测试方案', '性能测试报告', '分布式压测', '并发测试', '全链路测试'],
    color: 'from-yellow-500 to-orange-500'
  },
  {
    title: '抓包与调试',
    icon: Bug,
    skills: ['Fiddler', 'Charles', 'F12开发者工具', '数据包分析', '断点改包', '弱网测试'],
    color: 'from-red-500 to-pink-500'
  },
  {
    title: 'APP测试',
    icon: Cpu,
    skills: ['兼容性测试', '闪退测试', '性能测试', '弱网测试', 'adb命令', 'Monkey压测'],
    color: 'from-purple-500 to-violet-500'
  },
  {
    title: '数据库与工具',
    icon: Database,
    skills: ['MySQL', '数据校验', '禅道', 'JIRA', 'Meego', 'Xshell', 'Linux命令'],
    color: 'from-indigo-500 to-blue-500'
  }
];

// 工作经历
const experiences = [
  {
    year: '2023.07 - 2026.01',
    title: '软件测试工程师',
    company: '上海奇搜网络科技有限公司',
    location: '上海',
    achievements: [
      '4年测试工程师从业经验，负责过多个产品的测试项目',
      '可以独立完成产品测试工作，独立负责项目从测试到上线',
      '负责带新人，给新人提供入职培训，熟悉项目和工具',
      '定期参加技术分享并获得"双月分享之星"称号'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 顶部个人信息卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="overflow-hidden border-0 shadow-2xl bg-white dark:bg-slate-800">
            <div className="h-32 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600" />
            <CardContent className="relative px-8 pb-8">
              <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 mb-6">
                <Avatar className="w-32 h-32 border-4 border-white dark:border-slate-800 shadow-lg">
                  <AvatarImage src={author.avatar} alt={author.name} />
                  <AvatarFallback className="text-4xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
                    {author.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {author.name}
                  </h1>
                  <p className="text-xl text-violet-600 dark:text-violet-400 font-medium">
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
                <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                  <Calendar className="w-4 h-4 text-violet-500" />
                  <span>26岁 · 4年经验</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                  <GraduationCap className="w-4 h-4 text-violet-500" />
                  <span>本科</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                  <MapPin className="w-4 h-4 text-violet-500" />
                  <span>上海市</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                  <Briefcase className="w-4 h-4 text-violet-500" />
                  <span>离职状态</span>
                </div>
              </div>

              {/* 联系方式 */}
              <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <a href="tel:183-2597-5419" className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-full text-sm text-slate-700 dark:text-slate-300 hover:bg-violet-100 dark:hover:bg-violet-900 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>183-2597-5419</span>
                </a>
                <a href="mailto:1102684926@qq.com" className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-full text-sm text-slate-700 dark:text-slate-300 hover:bg-violet-100 dark:hover:bg-violet-900 transition-colors">
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
                    <Briefcase className="w-5 h-5 mr-2 text-violet-500" />
                    工作经历
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {experiences.map((exp, index) => (
                      <div key={index} className="relative pl-6 pb-6 border-l-2 border-violet-200 dark:border-violet-800 last:pb-0">
                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-violet-500 border-4 border-white dark:border-slate-800" />
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                            {exp.year}
                          </Badge>
                          <span className="text-sm text-slate-500">{exp.location}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {exp.title}
                        </h3>
                        <p className="text-violet-600 dark:text-violet-400 font-medium mb-3">
                          {exp.company}
                        </p>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, idx) => (
                            <li key={idx} className="flex items-start text-slate-600 dark:text-slate-400">
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
                    <GraduationCap className="w-5 h-5 mr-2 text-violet-500" />
                    教育背景
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {education.map((edu, index) => (
                    <div key={index} className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {edu.school}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          {edu.major} · {edu.degree}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-slate-500">
                        {edu.year}
                      </Badge>
                    </div>
                  ))}
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
                    <Code className="w-5 h-5 mr-2 text-violet-500" />
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
                        className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-600 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center mb-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center mr-3`}>
                            <category.icon className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {category.title}
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {category.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 text-xs bg-white dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-500"
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
              <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white">
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
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        4年测试经验，独立负责多个项目
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        精通JMeter性能测试与自动化
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        丰富的APP和Web端测试经验
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        带新人经验，获得分享之星称号
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        擅长跨部门沟通协作
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
              <Card className="border-0 shadow-lg bg-slate-900 text-white">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold mb-2">有意联系？</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    随时欢迎交流合作机会
                  </p>
                  <a 
                    href="tel:183-2597-5419"
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm font-medium transition-colors"
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
