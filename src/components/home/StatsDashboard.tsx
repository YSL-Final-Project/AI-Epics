import { motion, useReducedMotion } from 'framer-motion';
import StatCard from './StatCard';
import { IconBolt, IconTrendUp, IconRocket, IconCpu } from '../icons/TechIcons';

const stats = [
  {
    value: '40',
    numericValue: 40,
    suffix: '%',
    label: 'GitHub 上 AI 辅助生成的代码占比',
    gradient: 'bg-gradient-to-r from-cyan-500 to-blue-500',
    glowColor: 'rgba(6,182,212,0.4)',
    icon: <IconBolt size={22} className="text-cyan-400" />,
  },
  {
    value: '55',
    numericValue: 55,
    suffix: '%',
    label: 'Stack Overflow 流量下降幅度',
    gradient: 'bg-gradient-to-r from-rose-500 to-orange-500',
    glowColor: 'rgba(244,63,94,0.4)',
    icon: <IconTrendUp size={22} className="text-rose-400" />,
  },
  {
    value: '1.5',
    numericValue: 15,
    suffix: 'M+',
    label: 'GitHub Copilot 活跃用户数',
    gradient: 'bg-gradient-to-r from-violet-500 to-purple-500',
    glowColor: 'rgba(139,92,246,0.4)',
    icon: <IconRocket size={22} className="text-violet-400" />,
  },
  {
    value: '92',
    numericValue: 92,
    suffix: '%',
    label: '开发者已使用或计划使用 AI 工具',
    gradient: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    glowColor: 'rgba(16,185,129,0.4)',
    icon: <IconCpu size={22} className="text-emerald-400" />,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { y: 36, opacity: 0, scale: 0.94 },
  show: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 260, damping: 26 },
  },
};

export default function StatsDashboard() {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
      variants={prefersReduced ? undefined : container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
    >
      {stats.map((stat) => (
        <motion.div key={stat.label} variants={prefersReduced ? undefined : item}>
          <StatCard {...stat} />
        </motion.div>
      ))}
    </motion.div>
  );
}
