import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CursorFollower from './components/CursorFollower';
import ScrollProgress from './components/ScrollProgress';
import WelcomeToast from './components/WelcomeToast';
import MatrixEasterEgg from './components/MatrixEasterEgg';
import HomePage from './pages/HomePage';
import TimelinePage from './pages/TimelinePage';
import DataExplorerPage from './pages/DataExplorerPage';
import ComparePage from './pages/ComparePage';
import InteractivePage from './pages/InteractivePage';
import AboutPage from './pages/AboutPage';

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
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/timeline" element={<TimelinePage />} />
                <Route path="/data" element={<DataExplorerPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/interactive" element={<InteractivePage />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
