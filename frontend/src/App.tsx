import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import NewsFeedPage from './pages/NewsFeedPage';
import AnalysisPage from './pages/AnalysisPage';

/** Inner wrapper so useLocation() is inside <Router> context */
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<NewsFeedPage />} />
        <Route path="/analysis/:id" element={<AnalysisPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-10 max-w-7xl">
          <AnimatedRoutes />
        </main>
        <footer className="py-8 text-center text-muted-foreground border-t border-border mt-auto">
          <p className="text-sm">
            © 2026{' '}
            <span className="font-semibold text-foreground">
              UPSC Current Affairs Static Linker AI
            </span>
            {' '}· Powered by Google Gemini · Built for Aspiring Civil Servants
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
