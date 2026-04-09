import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconCheck } from '../icons/TechIcons';
import { useI18n } from '../../i18n';

export default function ContactForm() {
  const { t } = useI18n();
  const tc = t.about.contact;
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-10"
      >
        <div className="mb-3"><IconCheck size={40} className="text-emerald-400 mx-auto" /></div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{tc.thankYou}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{tc.replyNote}</p>
        <button
          onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', message: '' }); }}
          className="mt-4 text-sm text-cyan-500 hover:underline"
        >
          {tc.sendAnother}
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{tc.labelName}</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{tc.labelEmail}</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{tc.labelMessage}</label>
        <textarea
          required
          rows={4}
          value={formData.message}
          onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2.5 rounded-lg bg-cyan-500 text-white font-medium hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/25"
      >
        {tc.submit}
      </button>
    </form>
  );
}
