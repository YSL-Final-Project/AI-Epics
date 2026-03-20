import { motion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import TeamCard from '../components/about/TeamCard';
import DataSourceList from '../components/about/DataSourceList';
import ContactForm from '../components/about/ContactForm';

const teamMembers = [
  { name: 'Chengkun Liao', role: 'Scrum Master / 首页 & 关于页开发', avatar: '👨‍💻', github: 'https://github.com/' },
  { name: 'Junyao Yang', role: '数据架构 / 数据洞察 & 竞技场开发', avatar: '👩‍🔬', github: 'https://github.com/' },
  { name: 'Mingjie Shen', role: '交互设计 / 时间线 & 实验室开发', avatar: '🎨', github: 'https://github.com/' },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } },
};

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <span className="text-sm font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-widest">About</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mt-2 mb-3 tracking-tight"
            >
              关于项目
            </motion.h1>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
            {/* Project Background — spans full width */}
            <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="md:col-span-2 rounded-2xl p-6 sm:p-8 glass-subtle">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">项目背景</h2>
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>
                  自 2022 年底 ChatGPT 发布以来，AI 编程工具经历了爆发式增长。GitHub Copilot 用户突破百万，
                  Cursor 异军突起挑战传统 IDE，Stack Overflow 流量断崖式下滑——软件开发行业正在经历一场前所未有的变革。
                </p>
                <p>
                  本项目通过数据可视化和交互体验全景展示这场变革。25 个里程碑事件串起 AI 编程的进化史，
                  15+ 张交互式图表呈现关键数据洞察，互动游戏让你亲身感受 AI 代码生成的能力。
                </p>
              </div>
            </motion.div>

            {/* Methodology */}
            <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="rounded-2xl p-6 glass-subtle">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5">研究方法</h2>
              <div className="space-y-4">
                {[
                  { icon: '📊', title: '数据采集', desc: 'GitHub Octoverse、SO Survey、SimilarWeb 等权威来源' },
                  { icon: '🔄', title: '数据清洗', desc: '标准化处理，消除异常值，确保可比性' },
                  { icon: '📈', title: '可视化', desc: 'Recharts + 自定义动画，匹配最优图表形式' },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-3">
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Contact */}
            <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="rounded-2xl p-6 glass-subtle">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">联系我们</h2>
              <ContactForm />
            </motion.div>
          </div>

          {/* Team */}
          <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">团队成员</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {teamMembers.map((member, i) => (
                <TeamCard key={member.name} {...member} index={i} />
              ))}
            </div>
          </motion.section>

          {/* Data Sources */}
          <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">数据来源</h2>
            <div className="rounded-2xl p-6 sm:p-8 glass-subtle">
              <DataSourceList />
            </div>
          </motion.section>
        </div>
      </div>
    </PageTransition>
  );
}
