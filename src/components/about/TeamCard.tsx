import { motion } from 'framer-motion';

interface TeamCardProps {
  name: string;
  role: string;
  avatar: string;
  github: string;
  index: number;
}

export default function TeamCard({ name, role, avatar, github, index }: TeamCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, ease: [0.23, 1, 0.32, 1] }}
      className="card-3d hover-shine"
    >
      <div className="glass-subtle rounded-2xl p-6 text-center group">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 mx-auto mb-4 flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow rotate-3 group-hover:rotate-0 transition-transform">
          {avatar}
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-0.5">{name}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{role}</p>
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-cyan-500 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          GitHub
        </a>
      </div>
    </motion.div>
  );
}
