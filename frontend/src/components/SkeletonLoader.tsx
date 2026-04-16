import { motion } from 'framer-motion';

interface SkeletonCardProps {
  count?: number;
}

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-4 animate-pulse">
      <div className="flex justify-between">
        <div className="h-5 bg-muted rounded-full w-24" />
        <div className="h-4 bg-muted rounded-full w-16" />
      </div>
      <div className="space-y-2">
        <div className="h-5 bg-muted rounded w-full" />
        <div className="h-5 bg-muted rounded w-4/5" />
      </div>
      <div className="space-y-1">
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-3/4" />
      </div>
      <div className="h-10 bg-muted rounded-xl w-full mt-4" />
    </div>
  );
}

export default function SkeletonLoader({ count = 3 }: SkeletonCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
          <SkeletonCard />
        </motion.div>
      ))}
    </div>
  );
}
