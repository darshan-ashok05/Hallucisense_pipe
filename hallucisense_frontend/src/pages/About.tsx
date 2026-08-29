import { Brain, ScanSearch, GitBranch, BarChart3, Shield, Zap, Eye } from 'lucide-react';

const FEATURES = [
  {
    icon: ScanSearch,
    title: 'Retrieval Check',
    desc: 'Validates claims against trusted knowledge sources and evidence databases.',
  },
  {
    icon: GitBranch,
    title: 'Semantic Verification',
    desc: 'Cross-references response content with knowledge-graph relationships.',
  },
  {
    icon: BarChart3,
    title: 'Consistency Analysis',
    desc: 'Detects internal contradictions and logical inconsistencies in responses.',
  },
];

const STATS = [
  { label: 'F1-Score', value: '94.2%' },
  { label: 'Precision', value: '92.8%' },
  { label: 'Recall', value: '95.6%' },
];

export default function About() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">About HalluciSense</h2>
        <p className="text-sm text-gray-500 mt-1">
          A powerful AI hallucination detection and verification dashboard.
        </p>
      </div>

      {/* Hero */}
      <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50/60 to-accent-500/5 p-6 shadow-card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-glow">
            <Brain className="w-6 h-6 text-white" strokeWidth={2.2} />
          </div>
          <div>
            <h3 className="text-lg font-bold gradient-text">HalluciSense</h3>
            <p className="text-[12px] text-gray-400">AI Response Verification</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          HalluciSense is a frontend dashboard designed to detect, analyze, and
          reduce hallucinations in AI-generated responses. It provides
          sentence-level breakdown, factual error detection, confidence gap
          analysis, and consistency scoring — all through a clean, modern
          interface ready to connect to your existing hallucination-detection
          pipeline.
        </p>
      </div>

      {/* Features */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className="rounded-2xl border border-brand-100 bg-white p-5 shadow-soft hover:shadow-card transition-shadow duration-300 animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-brand-500" strokeWidth={2} />
              </div>
              <h4 className="text-sm font-bold text-gray-700 mb-1">{f.title}</h4>
              <p className="text-[12px] text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Model Performance */}
      <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-brand-500" strokeWidth={2.2} />
          <h3 className="text-sm font-bold text-gray-700">Model Performance</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold gradient-text">{stat.value}</p>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech badges */}
      <div className="flex flex-wrap gap-2">
        {['React', 'TypeScript', 'Tailwind CSS', 'Lucide Icons'].map((tech) => (
          <span
            key={tech}
            className="px-3 py-1.5 rounded-full bg-white border border-brand-100 text-[12px] font-medium text-gray-500 shadow-soft"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-6 text-[12px] text-gray-400">
        <span className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5" /> Frontend-Only Demo
        </span>
        <span className="flex items-center gap-1">
          <Eye className="w-3.5 h-3.5" /> API-Ready
        </span>
      </div>
    </div>
  );
}
