import { motion } from 'framer-motion';
import { useI18n } from '../../i18n';
import type { ToolInfo } from '../../data/tool_evolution';

interface Props {
  tool: ToolInfo;
  index: number;
}

export default function ToolCard({ tool, index }: Props) {
  const { lang } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative p-4 rounded-xl border border-[#2a2520] bg-[#1a1a1a]/40 hover:bg-[#1a1a1a]/70 hover:border-[#3a3530] transition-all duration-300"
    >
      {/* Color accent bar */}
      <div
        className="absolute top-0 left-4 right-4 h-[2px] rounded-b-full opacity-40 group-hover:opacity-80 transition-opacity"
        style={{ backgroundColor: tool.color }}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <h4
              className="text-base font-semibold text-[#e8e4df] truncate"
              style={{ fontFamily: '"Space Grotesk", sans-serif' }}
            >
              {tool.name}
            </h4>
            <span className="text-xs font-mono text-[#5a5550] shrink-0">{tool.year}</span>
          </div>
          <p
            className="text-sm text-[#8a8580] leading-relaxed"
            style={{ fontFamily: '"Source Serif 4", Georgia, serif' }}
          >
            {lang === 'zh' ? tool.description.zh : tool.description.en}
          </p>
        </div>

        {/* Color dot */}
        <div
          className="w-3 h-3 rounded-full shrink-0 mt-1.5 opacity-50 group-hover:opacity-100 transition-opacity"
          style={{ backgroundColor: tool.color }}
        />
      </div>
    </motion.div>
  );
}
