import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Languages, 
  Sparkles, 
  Calendar, 
  ChevronRight, 
  Filter, 
  BookOpen, 
  Clock,
  ArrowRight,
  Brain,
  Search,
  CalendarDays,
  AlertCircle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { fetchNews } from '../services/api';

/* ─── Types ─────────────────────────────────────────────────── */
interface NewsArticle {
  id: string;
  title: string;
  description: string;
  source: string;
  category: string;
  date: string;
  url?: string;
}

const CATEGORIES = ['All', 'Polity', 'Economy', 'Environment', 'Science & Tech', 'International', 'Governance'];
const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'mr', name: 'Marathi' }
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function NewsFeedPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLang, setActiveLang] = useState('en');
  const [selectedDate, setSelectedDate] = useState('All');
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNews = async () => {
    try {
      setLoading(true);
      setError(null);
      setApiKeyMissing(false);
      
      const data = await fetchNews(activeCategory.toLowerCase(), activeLang);
      
      if (data && data.status === 'no_api_key') {
        setApiKeyMissing(true);
        setNews([]);
        return;
      }

      if (data && data.articles && data.articles.length > 0) {
        const transformed: NewsArticle[] = data.articles.map((a: any, i: number) => ({
          id: `api-news-${i}-${activeLang}-${Date.now()}`,
          title: a.title,
          description: a.description || a.content || "Click analyze to see full UPSC context.",
          source: a.source?.name || "Global News",
          category: activeCategory === 'All' ? 'General' : activeCategory,
          date: a.publishedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
          url: a.url
        }));
        setNews(transformed);
      } else {
        setNews([]);
      }
    } catch (err: any) {
      console.error("Failed to fetch news", err);
      setError("Unable to reach the backend server. Please check if it is running.");
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [activeLang, activeCategory]);

  const availableDates = useMemo(() => {
    const dates = Array.from(new Set(news.map(n => n.date)));
    return ['All', ...dates.sort((a, b) => b.localeCompare(a))];
  }, [news]);

  const filtered = useMemo(() => {
    let base = news;
    if (selectedDate !== 'All') {
      base = base.filter(n => n.date === selectedDate);
    }
    return base;
  }, [news, selectedDate]);

  const groupedByDate = useMemo(() => {
    const groups: Record<string, NewsArticle[]> = {};
    filtered.forEach(n => {
      if (!groups[n.date]) groups[n.date] = [];
      groups[n.date].push(n);
    });
    return Object.keys(groups).sort((a, b) => b.localeCompare(a)).map(date => ({
      date,
      articles: groups[date]
    }));
  }, [filtered]);

  const handleAnalyze = (article: NewsArticle) => {
    setAnalyzingId(article.id);
    setTimeout(() => {
      navigate(`/analysis/${article.id}`, { state: { article } });
    }, 500);
  };

  return (
    <div className="space-y-10">
      
      {/* ── HERO BANNER ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-950 dark:to-indigo-950 rounded-3xl p-10 text-white shadow-2xl"
      >
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-emerald-400 text-sm font-semibold tracking-wide uppercase flex items-center gap-2">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Real-Time Feed Alpha
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Live UPSC Insights
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed mb-6">
            Fetching world-wide events and linking them to your syllabus. Change language to see regional news.
          </p>
        </div>
      </motion.div>

      {/* ── API KEY ALERT ──────────────────────────────────────── */}
      <AnimatePresence>
        {apiKeyMissing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-6"
          >
            <div className="flex gap-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-xl h-fit">
                <AlertCircle size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-amber-800 dark:text-amber-300">GNews API Key Required</h3>
                <p className="text-amber-700 dark:text-amber-400/80 text-sm leading-relaxed">
                  To fetch <b>real-time</b> news headlines from English, Hindi, and Marathi sources, you need a free API key from GNews.io.
                </p>
                <div className="flex gap-4 pt-2">
                  <a 
                    href="https://gnews.io/register" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-bold transition-all"
                  >
                    Get Free Key <ExternalLink size={14} />
                  </a>
                  <button 
                    onClick={loadNews}
                    className="px-4 py-2 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 rounded-lg text-sm font-bold hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-all"
                  >
                    Retry Connection
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FILTERS ────────────────────────────────────────────── */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 flex-wrap pb-4 border-b border-border/50">
          <div className="flex items-center gap-2 pr-4 border-r border-border">
            <Languages size={18} className="text-primary" />
            <select 
              value={activeLang}
              onChange={(e) => setActiveLang(e.target.value)}
              className="bg-transparent border-none font-bold text-sm focus:ring-0 cursor-pointer"
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={16} className="text-muted-foreground flex-shrink-0" />
            {CATEGORIES.map(cat => (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-indigo-300'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <CalendarDays size={18} className="text-primary" />
          <div className="flex items-center gap-2 flex-wrap">
            {availableDates.map(date => (
              <motion.button
                key={date}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDate(date)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  selectedDate === date
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-emerald-300'
                }`}
              >
                {date === 'All' ? 'All Dates' : new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* ── NEWS CONTENT ───────────────────────────────────────── */}
      {loading ? (
        <SkeletonLoader count={6} />
      ) : (
        <div className="space-y-12">
          {groupedByDate.map(group => (
            <section key={group.date} className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-px bg-border flex-grow"></div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap bg-muted px-4 py-1 rounded-full border border-border">
                  {new Date(group.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h2>
                <div className="h-px bg-border flex-grow"></div>
              </div>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {group.articles.map(article => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    onAnalyze={handleAnalyze}
                    isAnalyzing={analyzingId === article.id}
                  />
                ))}
              </motion.div>
            </section>
          ))}
          {!loading && !apiKeyMissing && news.length === 0 && (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <Search className="text-muted-foreground w-12 h-12" />
              <div className="space-y-1">
                <p className="text-lg font-bold text-foreground">No real-time results found</p>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">Try changing categories or check if the language has trending UPSC news today.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NewsCard({ article, onAnalyze, isAnalyzing }: { 
  article: NewsArticle; 
  onAnalyze: (a: NewsArticle) => void; 
  isAnalyzing: boolean;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -5 }}
      className="group relative flex flex-col bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-500/20 transition-all duration-300"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-indigo-100 dark:border-indigo-900/50">
            {article.category}
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-medium">
            <Clock size={12} /> {new Date(article.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>
        </div>
        <h3 className="text-lg font-bold leading-snug mb-3 group-hover:text-indigo-600 transition-colors">
          {article.title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 leading-relaxed">
          {article.description}
        </p>
        <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
          <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
            <BookOpen size={12} /> {article.source}
          </span>
          <button
            onClick={() => onAnalyze(article)}
            disabled={isAnalyzing}
            className={`flex items-center gap-2 font-bold text-xs py-2 px-6 rounded-xl transition-all ${
              isAnalyzing 
                ? 'bg-muted text-muted-foreground' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 active:scale-95'
            }`}
          >
            {isAnalyzing ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Sparkles size={14} /></motion.div>
            ) : <Sparkles size={14} />}
            AI Analyze
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonLoader({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-[2rem] p-6 space-y-4 animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-6 bg-muted rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded w-full"></div>
            <div className="h-3 bg-muted rounded w-5/6"></div>
          </div>
          <div className="h-10 bg-muted rounded w-full mt-4"></div>
        </div>
      ))}
    </div>
  );
}
