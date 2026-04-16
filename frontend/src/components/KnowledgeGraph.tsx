import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { Network } from 'lucide-react';

interface KnowledgeGraphProps {
  nodes: Array<{ id: string; label: string; type: 'news' | 'subject' | 'topic' }>;
  edges: Array<{ from: string; to: string }>;
}

const typeColors: Record<string, string> = {
  news:    '#6366f1',
  subject: '#10b981',
  topic:   '#f59e0b',
};

const typeSize: Record<string, number> = {
  news:    56,
  subject: 44,
  topic:   36,
};

export default function KnowledgeGraph({ nodes, edges }: KnowledgeGraphProps) {
  // Simple visual layout — place nodes in a radial pattern
  const cx = 400, cy = 240, r = 160;
  const angleStep = (2 * Math.PI) / Math.max(nodes.length - 1, 1);

  const newsNode = nodes.find(n => n.type === 'news');
  const otherNodes = nodes.filter(n => n.type !== 'news');

  const positioned = [
    newsNode ? { ...newsNode, x: cx, y: cy } : null,
    ...otherNodes.map((n, i) => ({
      ...n,
      x: cx + r * Math.cos(i * angleStep - Math.PI / 2),
      y: cy + r * Math.sin(i * angleStep - Math.PI / 2),
    })),
  ].filter(Boolean) as Array<{ id: string; label: string; type: string; x: number; y: number }>;

  const getPos = (id: string) => positioned.find(n => n.id === id);

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Network className="text-accent" /> Knowledge Graph
      </h2>
      <svg viewBox="0 0 800 480" className="w-full h-auto">
        {/* Render edges */}
        {edges.map((edge, i) => {
          const from = getPos(edge.from);
          const to = getPos(edge.to);
          if (!from || !to) return null;
          return (
            <motion.line
              key={i}
              x1={from.x} y1={from.y} x2={to.x} y2={to.y}
              stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
            />
          );
        })}

        {/* Render nodes */}
        {positioned.map((node, i) => {
          const size = typeSize[node.type] ?? 40;
          const color = typeColors[node.type] ?? '#6366f1';
          return (
            <motion.g
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.12, type: 'spring' }}
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
            >
              <circle
                cx={node.x} cy={node.y} r={size / 2}
                fill={color} fillOpacity={0.15} stroke={color} strokeWidth={2}
              />
              <text
                x={node.x} y={node.y + 4}
                textAnchor="middle" fontSize={11} fontWeight={600}
                fill={color}
              >
                {node.label.length > 14 ? node.label.slice(0, 13) + '…' : node.label}
              </text>
              {/* Type label below */}
              <text
                x={node.x} y={node.y + size / 2 + 16}
                textAnchor="middle" fontSize={9}
                fill="#94a3b8"
              >
                {node.type.toUpperCase()}
              </text>
            </motion.g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        {Object.entries(typeColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="capitalize">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
