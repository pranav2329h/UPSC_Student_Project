import { Link, useLocation } from 'react-router-dom';
import { BrainCircuit, Moon, Sun, BookMarked, Rss } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface NavItem {
  to: string;
  label: string;
  Icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/',      label: 'News Feed',    Icon: Rss        },
  { to: '/notes', label: 'Saved Notes',  Icon: BookMarked },
];

export default function Navbar() {
  const [isDark, setIsDark] = useState<boolean>(false);
  const { pathname } = useLocation();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* ── Logo ─────────────────────────────────── */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-emerald-500 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/30">
            <BrainCircuit size={22} />
          </div>
          <div className="hidden sm:block">
            <span className="font-extrabold text-base leading-none bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              UPSC Linker AI
            </span>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
              Current Affairs → Static Knowledge
            </p>
          </div>
        </Link>

        {/* ── Nav Links ────────────────────────────── */}
        <div className="hidden md:flex items-center gap-1 flex-grow justify-center">
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              className={[
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
                pathname === to
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
              ].join(' ')}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </div>

        {/* ── Right Actions ────────────────────────── */}
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDark((prev) => !prev)}
            className="p-2.5 rounded-xl hover:bg-muted transition-colors text-foreground"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>
        </div>

      </div>
    </nav>
  );
}
