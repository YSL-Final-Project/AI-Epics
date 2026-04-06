import { motion } from 'framer-motion';

interface Props {
  number: string;
  title: string;
  subtitle: string;
}

/**
 * ccunpacked-style section header:
 * <span class="font-heading text-accent text-sm tracking-widest uppercase">01</span>
 * <div class="h-px flex-1 bg-border"></div>
 * <h2 class="font-heading text-5xl font-bold">Title</h2>
 * <p class="mt-3 text-text-muted">Subtitle</p>
 */
export default function SectionHeader({ number, title, subtitle }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-10 md:mb-16"
    >
      {/* Number + horizontal rule — matches ccunpacked exactly */}
      <div className="flex items-baseline gap-4 mb-4">
        <span
          className="text-[#d4a853] text-sm tracking-widest uppercase font-semibold"
          style={{ fontFamily: '"Space Grotesk", sans-serif' }}
        >
          {number}
        </span>
        <div className="h-px flex-1 bg-[#2a2520]" />
      </div>

      {/* Title — Space Grotesk heading */}
      <h2
        className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#e8e4df] tracking-tight"
        style={{ fontFamily: '"Space Grotesk", sans-serif' }}
      >
        {title}
      </h2>

      {/* Subtitle — Source Serif 4 body */}
      <p
        className="mt-3 text-base sm:text-lg text-[#8a8580] max-w-2xl leading-relaxed"
        style={{ fontFamily: '"Source Serif 4", Georgia, serif' }}
      >
        {subtitle}
      </p>
    </motion.div>
  );
}
