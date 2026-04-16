import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ExternalLink, Calendar, Newspaper } from 'lucide-react';

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  source: string;
  category: string;
  date: string;
  url?: string;
  imageUrl?: string;
}

interface NewsCardProps {
  article: NewsArticle;
  onAnalyze: (article: NewsArticle) => void;
  isAnalyzing?: boolean;
}

const categoryColors: Record<string, string> = {
  'Polity':        'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'Economy':       'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'Environment':   'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'Science & Tech':'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  'International': 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  'Governance':    'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  'History':       'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
};

export default function NewsCard({ article, onAnalyze, isAnalyzing }: NewsCardProps) {
  const colorClass = categoryColors[article.category] || 'bg-indigo-100 text-indigo-700';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 24px 48px -12px rgba(0,0,0,0.18)' }}
      transition={{ duration: 0.3 }}
      className="relative bg-card border border-border rounded-2xl flex flex-col overflow-hidden group"
    >
      {/* Gradient accent top bar */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500" />

      <div className="p-6 flex flex-col flex-grow gap-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${colorClass}`}>
            {article.category}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar size={12} />
            {new Date(article.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold leading-snug line-clamp-3 group-hover:text-primary transition-colors">
          {article.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-grow">
          {article.description}
        </p>

        {/* Source */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
          <Newspaper size={12} />
          <span className="font-medium">{article.source}</span>
          {article.url && (
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="ml-auto hover:text-primary transition-colors">
              <ExternalLink size={12} />
            </a>
          )}
        </div>

        {/* Analyze Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onAnalyze(article)}
          disabled={isAnalyzing}
          className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all
                     bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md
                     hover:from-indigo-500 hover:to-violet-500 hover:shadow-lg hover:shadow-indigo-500/25
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              AI Analyze
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
