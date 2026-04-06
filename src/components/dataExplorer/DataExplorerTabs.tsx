import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import AdoptionTab from './AdoptionTab';
import StackOverflowTab from './StackOverflowTab';
import CodeGenTab from './CodeGenTab';
import SalaryTab from './SalaryTab';
import { useI18n } from '../../i18n';

const TAB_KEYS = ['adoption', 'stackoverflow', 'codegen', 'salary'] as const;

export default function DataExplorerTabs() {
  const [activeTab, setActiveTab] = useState<string>('adoption');
  const prefersReduced = useReducedMotion();
  const { t } = useI18n();
  const tabLabels = t.dataExplorer.tabs;
  const tabs = TAB_KEYS.map(key => ({ key, label: (tabLabels as Record<string, string>)[key] ?? key }));

  return (
    <div>
      {/* Tab Bar — Apple-style text pills */}
      <div className="flex gap-1 justify-center mb-12">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300"
          >
            {activeTab === tab.key && (
              <motion.div
                layoutId="data-tab"
                className="absolute inset-0 rounded-full bg-slate-900 dark:bg-white/10"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className={`relative z-10 transition-colors duration-200 ${
              activeTab === tab.key
                ? 'text-white'
                : 'text-slate-400 dark:text-white/25 hover:text-slate-700 dark:hover:text-white/50'
            }`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={prefersReduced ? false : { opacity: 0, scale: 0.97, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
          transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
        >
          {activeTab === 'adoption' && <AdoptionTab />}
          {activeTab === 'stackoverflow' && <StackOverflowTab />}
          {activeTab === 'codegen' && <CodeGenTab />}
          {activeTab === 'salary' && <SalaryTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
