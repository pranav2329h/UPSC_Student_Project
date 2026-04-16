import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Filter, Sparkles, Globe2, Zap } from 'lucide-react';
import NewsCard, { NewsArticle } from '../components/NewsCard';
import SkeletonLoader from '../components/SkeletonLoader';

const CATEGORIES = ['All', 'Polity', 'Economy', 'Environment', 'Science & Tech', 'International', 'Governance'];

const MOCK_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Supreme Court unanimously strikes down Electoral Bonds scheme as unconstitutional',
    description: 'In a landmark verdict, the Supreme Court of India struck down the Electoral Bonds scheme, ruling it as a violation of the right to information under Article 19(1)(a). SBI has been directed to submit all bond details to the Election Commission of India.',
    source: 'The Hindu',
    category: 'Polity',
    date: '2026-04-16',
  },
  {
    id: 'news-2',
    title: 'ISRO launches INSAT-3DS satellite for enhanced weather and climate monitoring',
    description: 'The Indian Space Research Organisation successfully launched INSAT-3DS, a next-generation meteorological satellite to provide real-time weather data, disaster warning systems, and climate observation capabilities.',
    source: 'Indian Express',
    category: 'Science & Tech',
    date: '2026-04-15',
  },
  {
    id: 'news-3',
    title: 'RBI unveils comprehensive digital lending framework to curb predatory fintech practices',
    description: 'The Reserve Bank of India released detailed guidelines for digital lending, mandating NBFCs and banks to maintain strict KYC, transparent interest disclosures, and prohibiting third-party data sharing without explicit user consent.',
    source: 'Economic Times',
    category: 'Economy',
    date: '2026-04-14',
  },
  {
    id: 'news-4',
    title: 'Record heatwave sweeps across South Asia as climate finance gap widens',
    description: 'Unprecedented temperatures recorded across India, Pakistan and Bangladesh highlight the urgency of climate adaptation funding. Developed nations are under pressure to meet the $100 billion annual climate finance commitment for the Global South.',
    source: 'Down To Earth',
    category: 'Environment',
    date: '2026-04-13',
  },
  {
    id: 'news-5',
    title: 'India signs landmark Mineral Partnership with five African nations at AU Summit',
    description: 'India formalised a critical minerals partnership with five African countries to secure supply chains for lithium, cobalt, and rare earth elements, crucial for its electric vehicle and semiconductor manufacturing ambitions.',
    source: 'Hindustan Times',
    category: 'International',
    date: '2026-04-12',
  },
  {
    id: 'news-6',
    title: 'PM GatiShakti portal integration boosts infra project approval speed by 45%',
    description: 'The Ministry of Finance reports that the PM GatiShakti National Master Plan portal has cut inter-ministry approval time for major infrastructure projects by 45%, with real-time geospatial data enabling holistic multi-modal connectivity planning.',
    source: 'PIB',
    category: 'Governance',
    date: '2026-04-11',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function NewsFeedPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const filtered = activeCategory === 'All'
    ? MOCK_NEWS
    : MOCK_NEWS.filter(n => n.category === activeCategory);

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
        {/* Animated blobs */}
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-16 -right-16 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-16 -left-16 w-72 h-72 bg-emerald-600/15 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <motion.div key={i} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                  className="w-2 h-2 rounded-full bg-emerald-400" />
              ))}
            </div>
            <span className="text-emerald-400 text-sm font-semibold tracking-wide">LIVE NEWS FEED</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Current Affairs,{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              Intelligently Linked
            </span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed mb-6">
            Click any news article and let AI connect it to the UPSC syllabus, static concepts, and practice questions in seconds.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
              <Zap size={14} className="text-yellow-400" /> Instant AI Mapping
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
              <Globe2 size={14} className="text-blue-400" /> Static Concept Linking
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
              <Sparkles size={14} className="text-purple-400" /> Prelims + Mains Qs
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── CATEGORY FILTER ────────────────────────────────────── */}
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
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} articles</span>
      </div>

      {/* ── NEWS GRID ──────────────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filtered.map(article => (
          <NewsCard
            key={article.id}
            article={article}
            onAnalyze={handleAnalyze}
            isAnalyzing={analyzingId === article.id}
          />
        ))}
      </motion.div>

    </div>
  );
}
