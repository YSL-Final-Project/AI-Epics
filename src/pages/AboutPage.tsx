import { motion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import TeamCard from '../components/about/TeamCard';
import DataSourceList from '../components/about/DataSourceList';
import ContactForm from '../components/about/ContactForm';
import { IconTerminal, IconMicroscope, IconPalette, IconChart, IconRefresh, IconTrendUp } from '../components/icons/TechIcons';
import { useI18n } from '../i18n';

function useTeamMembers() {
  const { t } = useI18n();
  return [
    { name: 'Chengkun Liao', role: t.about.roles.chengkun, avatar: <IconTerminal size={24} className="text-cyan-400" />, github: 'https://github.com/' },
    { name: 'Junyao Yang', role: t.about.roles.junyao, avatar: <IconMicroscope size={24} className="text-violet-400" />, github: 'https://github.com/' },
    { name: 'Mingjie Shen', role: t.about.roles.mingjie, avatar: <IconPalette size={24} className="text-rose-400" />, github: 'https://github.com/' },
  ];
}

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] as const } },
};

export default function AboutPage() {
  const { t } = useI18n();
  const teamMembers = useTeamMembers();

  return (
    <PageTransition>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <span className="text-sm font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-widest">{t.about.badge}</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mt-2 mb-3 tracking-tight"
            >
              {t.about.title}
            </motion.h1>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
            {/* Project Background — spans full width */}
            <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="md:col-span-2 rounded-2xl p-6 sm:p-8 glass-subtle">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{t.about.background}</h2>
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>{t.about.backgroundP1}</p>
                <p>{t.about.backgroundP2}</p>
              </div>
            </motion.div>

            {/* Methodology */}
            <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="rounded-2xl p-6 glass-subtle">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5">{t.about.methodology}</h2>
              <div className="space-y-4">
                {[
                  { icon: <IconChart size={18} className="text-cyan-400" />, title: t.about.dataCollection, desc: t.about.dataCollectionDesc },
                  { icon: <IconRefresh size={18} className="text-violet-400" />, title: t.about.dataCleaning, desc: t.about.dataCleaningDesc },
                  { icon: <IconTrendUp size={18} className="text-emerald-400" />, title: t.about.visualization, desc: t.about.visualizationDesc },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5">{item.icon}</span>
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
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{t.about.contactUs}</h2>
              <ContactForm />
            </motion.div>
          </div>

          {/* Team */}
          <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">{t.about.teamMembers}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {teamMembers.map((member, i) => (
                <TeamCard key={member.name} {...member} index={i} />
              ))}
            </div>
          </motion.section>

          {/* Data Sources */}
          <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">{t.about.dataSources}</h2>
            <div className="rounded-2xl p-6 sm:p-8 glass-subtle">
              <DataSourceList />
            </div>
          </motion.section>
        </div>
      </div>
    </PageTransition>
  );
}
