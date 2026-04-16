import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Brain, BookOpen, Fingerprint,
  Share2, Save, Scale, Landmark, Lightbulb,
  FileText, CheckCircle2, Gavel, AlertCircle
} from 'lucide-react';
import { analyzeArticle } from '../services/api';
import KnowledgeGraph from '../components/KnowledgeGraph';

const ICON_MAP: Record<string, React.ElementType> = {
  Scale, FileText, Landmark, Gavel, Lightbulb, Brain, BookOpen,
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.5 } }),
};

/* ─── MOCK fallback ──────────────────────────────────────────────── */
const MOCK: any = {
  summary:
    "The Supreme Court's unanimous verdict strikes down the Electoral Bonds scheme, citing it as unconstitutional and violating citizens' right to information under Article 19(1)(a). The SBI has been directed to disclose all bond details to the Election Commission.",
  subjects: { primary: 'Indian Polity', secondary: ['Governance', 'Ethics & Integrity'] },
  static_concepts: [
    {
      topic: 'Article 19(1)(a) – Freedom of Speech & Expression',
      explanation:
        'Guarantees every citizen the right to freedom of speech and expression. Courts have extended this to include the right to receive information, making electoral funding transparency a fundamental right.',
      icon: 'Scale',
    },
    {
      topic: 'Representation of the People Act, 1951',
      explanation:
        'Governs elections to Parliament and state legislatures. Sections 29A and 29C deal with registration of political parties and financial disclosures, both relevant to the electoral bond judgment.',
      icon: 'FileText',
    },
    {
      topic: 'Judicial Review & Basic Structure Doctrine',
      explanation:
        'The power under Article 13 and 32 allows the Supreme Court to strike down laws inconsistent with the Constitution. Electoral bonds were struck down as violating the basic structure (free & fair elections).',
      icon: 'Gavel',
    },
  ],
  keywords: ['Electoral Bonds', 'Article 19', 'Supreme Court', 'SBI', 'Political Funding', 'Transparency', 'ECI'],
  questions: {
    prelims: {
      question: 'Which Article of the Constitution forms the primary basis for the Right to Information in India?',
      options: ['Article 14', 'Article 19(1)(a)', 'Article 21', 'Article 32'],
      correct_answer: 'Article 19(1)(a)',
    },
    mains: {
      question:
        `Critically examine the implications of anonymous political funding on democratic accountability. How does the Supreme Court's ruling on Electoral Bonds strengthen the constitutional right to information? (250 words)`,
    },
  },
  knowledge_graph: {
    nodes: [
      { id: 'news', label: 'Electoral Bonds', type: 'news' },
      { id: 's1', label: 'Indian Polity', type: 'subject' },
      { id: 's2', label: 'Governance', type: 'subject' },
      { id: 't1', label: 'Article 19', type: 'topic' },
      { id: 't2', label: 'RPA 1951', type: 'topic' },
      { id: 't3', label: 'Judicial Review', type: 'topic' },
    ],
    edges: [
      { from: 'news', to: 's1' },
      { from: 'news', to: 's2' },
      { from: 's1', to: 't1' },
      { from: 's1', to: 't2' },
      { from: 's1', to: 't3' },
    ],
  },
};

export default function AnalysisPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const article = location.state?.article;

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'questions' | 'graph'>('questions');

  useEffect(() => {
    if (!article) { navigate('/'); return; }
    const run = async () => {
      try {
        setLoading(true);
        const text = `${article.title}. ${article.description}`;
        const result = await analyzeArticle(text, article.id);
        setAnalysis(result);
      } catch {
        // Fallback to mock for demo
        setTimeout(() => setAnalysis(MOCK), 2800);
      } finally {
        setTimeout(() => setLoading(false), 3000);
      }
    };
    run();
  }, [article, navigate]);

  if (!article) return null;

  /* ─── Loading State ─────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] gap-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-500 flex items-center justify-center shadow-2xl shadow-indigo-500/40">
            <Brain className="text-white w-12 h-12" />
          </div>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-indigo-400/30"
              animate={{ scale: [1, 1.8 + i * 0.3], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </motion.div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 to-emerald-500 bg-clip-text text-transparent">
            AI Linking to Syllabus...
          </h2>
          <p className="text-muted-foreground">Finding static concepts, generating questions &amp; knowledge graph</p>
        </div>
        {/* Progress steps */}
        <div className="flex gap-6">
          {['Summarising', 'Linking Topics', 'Building Graph'].map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.9 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.4 }}
                className="w-2 h-2 rounded-full bg-indigo-500"
              />
              {step}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  /* ─── Error State ───────────────────────────────────────────── */
  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <AlertCircle className="text-red-400 w-12 h-12" />
        <p className="text-red-400 font-semibold">{error}</p>
        <button onClick={() => navigate('/')} className="text-primary hover:underline">← Back to News</button>
      </div>
    );
  }

  if (!analysis) return null;

  /* ─── Main Content ──────────────────────────────────────────── */
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto space-y-8 pb-20">

      {/* ── HERO HEADER ────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-800 rounded-3xl p-8 md:p-12 text-white shadow-2xl shadow-indigo-500/30">
        {/* Background orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Back to News Feed
        </button>

        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            {article.category} · {article.source}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-6">{article.title}</h1>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 max-w-3xl">
            <p className="text-sm text-white/60 uppercase tracking-widest mb-2 font-bold">AI Summary</p>
            <p className="text-white/90 leading-relaxed">{analysis.summary}</p>
          </div>
        </motion.div>
      </div>

      {/* ── TWO-COLUMN LAYOUT ──────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* LEFT — main content */}
        <div className="xl:col-span-2 space-y-8">

          {/* Static Concepts */}
          <section>
            <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
              <BookOpen className="text-accent" size={22} />
              Static Linked Concepts
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {analysis.static_concepts.map((concept: any, idx: number) => {
                const Icon = ICON_MAP[concept.icon] ?? BookOpen;
                return (
                  <motion.div
                    key={idx}
                    custom={idx}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.02 }}
                    className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl">
                        <Icon size={20} />
                      </div>
                      <h3 className="font-bold text-base leading-snug">{concept.topic}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{concept.explanation}</p>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Tabs: Questions | Knowledge Graph */}
          <section>
            <div className="flex gap-1 bg-muted rounded-xl p-1 mb-6 w-fit">
              {(['questions', 'graph'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab === 'graph' ? 'Knowledge Graph' : 'Practice Questions'}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'questions' && (
                <motion.div
                  key="questions"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  {/* Prelims MCQ */}
                  <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-5">
                      <Fingerprint size={100} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3 block">
                      📝 Prelims MCQ
                    </span>
                    <p className="font-semibold text-lg mb-4 leading-snug">{analysis.questions.prelims.question}</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {analysis.questions.prelims.options.map((opt: string, i: number) => {
                        const isCorrect = opt === analysis.questions.prelims.correct_answer;
                        return (
                          <div
                            key={i}
                            className={`flex items-center gap-3 p-3.5 rounded-xl border text-sm font-medium transition-all ${
                              isCorrect
                                ? 'border-emerald-400 bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                                : 'border-border bg-background text-foreground'
                            }`}
                          >
                            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span className="flex-grow">{opt}</span>
                            {isCorrect && <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mains */}
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-violet-500 mb-4 block">
                      🖊️ Mains Question (GS Paper)
                    </span>
                    <blockquote className="border-l-4 border-violet-500 pl-5 italic text-lg text-foreground/80 leading-relaxed font-serif">
                      "{analysis.questions.mains.question}"
                    </blockquote>
                  </div>
                </motion.div>
              )}

              {activeTab === 'graph' && (
                <motion.div
                  key="graph"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <KnowledgeGraph
                    nodes={analysis.knowledge_graph?.nodes ?? []}
                    edges={analysis.knowledge_graph?.edges ?? []}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>

        {/* RIGHT — sidebar */}
        <div className="space-y-6">

          {/* Syllabus Mapping */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Syllabus Mapping</h3>
            <div className="mb-4">
              <span className="text-xs text-muted-foreground block mb-1.5">Primary Subject</span>
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl text-base shadow-md">
                {analysis.subjects.primary}
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block mb-2">Secondary Topics</span>
              <div className="flex flex-wrap gap-2">
                {analysis.subjects.secondary.map((s: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-muted text-muted-foreground text-sm font-medium rounded-lg border border-border">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.keywords.map((kw: string, i: number) => (
                <motion.span
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-1.5 bg-background border border-border text-sm font-medium rounded-full
                             hover:border-indigo-400 hover:text-indigo-500 cursor-pointer transition-colors"
                >
                  #{kw}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setSaved(!saved)}
              className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                ${saved
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-card border border-border text-foreground hover:bg-muted'
                }`}
            >
              <Save size={18} />
              {saved ? '✓ Saved to Knowledge Base' : 'Save to Notes'}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: article.title, text: analysis.summary, url: window.location.href });
                }
              }}
              className="w-full py-3.5 bg-card border border-border text-foreground hover:bg-muted rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Share2 size={18} /> Share Analysis
            </motion.button>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
