import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { I18nProvider } from './i18n';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CursorFollower from './components/CursorFollower';
import ScrollProgress from './components/ScrollProgress';
import WelcomeToast from './components/WelcomeToast';
import MatrixEasterEgg from './components/MatrixEasterEgg';

const HomePage = lazy(() => import('./pages/HomePage'));
const TimelinePage = lazy(() => import('./pages/TimelinePage'));
const DataExplorerPage = lazy(() => import('./pages/DataExplorerPage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const InteractivePage = lazy(() => import('./pages/InteractivePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const StoryPage = lazy(() => import('./pages/StoryPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const DevHistoryPage = lazy(() => import('./pages/DevHistoryPage'));
const ToolEvolutionPage = lazy(() => import('./pages/ToolEvolutionPage'));

function AppLayout() {
  const location = useLocation();
  const isStory = location.pathname === '/story';
  // Insight page uses its own cursor-reactive canvas background; hide the
  // globally-stacked mesh-gradient / grid-overlay / scanline there so the
  // two don't muddy each other.
  const isInsight = location.pathname === '/data';

  // Story page renders standalone — no navbar, footer, or overlays
  if (isStory) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
        <StoryPage />
      </Suspense>
    );
  }

  return (
    <div className="noise-overlay min-h-screen bg-slate-50 dark:bg-[#0a0a1a] text-slate-900 dark:text-slate-100 transition-colors duration-500">
      {!isInsight && <div className="mesh-gradient" />}
      {!isInsight && <div className="grid-overlay" />}
      {!isInsight && <div className="scanline" />}
      <ScrollProgress />
      <CursorFollower />
      <WelcomeToast />
      <MatrixEasterEgg />
      <Navbar />
      <main className="relative">
        <Suspense fallback={<div className="min-h-screen" />}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/timeline" element={<TimelinePage />} />
              <Route path="/data" element={<DataExplorerPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/interactive" element={<InteractivePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/dev-history" element={<DevHistoryPage />} />
              <Route path="/tool-evolution" element={<ToolEvolutionPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<AppLayout />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </I18nProvider>
  );
}

export default App;
