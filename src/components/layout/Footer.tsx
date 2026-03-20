import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-200/50 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-cyan-500 font-mono">{'<'}</span>
            <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">AI Code Era</span>
            <span className="text-violet-500 font-mono">{'/>'}</span>
            <span className="text-slate-400 dark:text-slate-500 text-sm ml-2">© 2025</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-400 dark:text-slate-500">
            <Link to="/about" className="hover:text-cyan-500 transition-colors">关于项目</Link>
            <Link to="/about" className="hover:text-cyan-500 transition-colors">数据来源</Link>
            <Link to="/about" className="hover:text-cyan-500 transition-colors">联系我们</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
