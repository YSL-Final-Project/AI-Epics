import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
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
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="noise-overlay min-h-screen bg-slate-50 dark:bg-[#0a0a1a] text-slate-900 dark:text-slate-100 transition-colors duration-500">
          <div className="mesh-gradient" />
          <div className="grid-overlay" />
          <div className="scanline" />
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
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
