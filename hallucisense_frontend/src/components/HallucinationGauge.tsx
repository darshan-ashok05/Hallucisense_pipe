import { useEffect, useState } from 'react';

interface HallucinationGaugeProps {
  score: number; // 0.00 - 1.00
  size?: number;
}

function colorForScore(score: number): { stroke: string; glow: string; text: string; label: string } {
  const pct = score * 100;
  if (pct < 35)
    return { stroke: '#22c55e', glow: 'rgba(34,197,94,0.35)', text: 'text-green-500', label: 'Low Risk' };
  if (pct < 60)
    return { stroke: '#f59e0b', glow: 'rgba(245,158,11,0.35)', text: 'text-amber-500', label: 'Moderate Risk' };
  return { stroke: '#ef4444', glow: 'rgba(239,68,68,0.35)', text: 'text-red-500', label: 'High Risk' };
}

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function HallucinationGauge({ score, size = 180 }: HallucinationGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const colors = colorForScore(score);

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 1200;
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(score * eased);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const offset = CIRCUMFERENCE - animatedScore * CIRCUMFERENCE;
  const displayPct = Math.round(animatedScore * 100);

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 120 120" className="-rotate-90">
          <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="#eef2ff" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke 0.4s ease',
              filter: `drop-shadow(0 0 6px ${colors.glow})`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-extrabold ${colors.text}`}>
            {displayPct}
            <span className="text-xl">%</span>
          </span>
        </div>
      </div>
      <span className="text-[12px] font-medium text-gray-400 mt-1">Hallucination Score</span>
      <span className={`text-[11px] font-semibold mt-0.5 ${colors.text}`}>{colors.label}</span>
    </div>
  );
}
