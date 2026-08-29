import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import type { Verdict } from '@/types';

interface VerdictBannerProps {
  verdict: Verdict;
}

const CONFIG: Record<
  Verdict,
  { icon: typeof CheckCircle2; message: string; bg: string; border: string; text: string }
> = {
  reliable: {
    icon: CheckCircle2,
    message: 'This response looks factually reliable',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
  },
  uncertain: {
    icon: AlertTriangle,
    message: 'Some uncertainty detected — worth double-checking',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
  },
  hallucinated: {
    icon: XCircle,
    message: 'This response likely contains hallucinated content',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
  },
};

export default function VerdictBanner({ verdict }: VerdictBannerProps) {
  const config = CONFIG[verdict];
  const Icon = config.icon;
  return (
    <div
      className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border ${config.bg} ${config.border} animate-fade-in-up w-full max-w-md mx-auto`}
    >
      <Icon className={`w-5 h-5 ${config.text} shrink-0`} strokeWidth={2.2} />
      <span className={`text-sm font-semibold ${config.text}`}>{config.message}</span>
    </div>
  );
}
