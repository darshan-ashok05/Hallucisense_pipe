import { Brain, Search, FileCheck, MessageSquare, Settings, Info, X } from 'lucide-react';
import PipelineStatus from './PipelineStatus';
import PerformanceCard from './PerformanceCard';
import type { PageId } from '@/types';

interface SidebarProps {
  active: PageId;
  onNavigate: (page: PageId) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_SECTIONS = [
  {
    label: 'Verify',
    items: [
      { id: 'ask' as PageId, label: 'Ask a Question', icon: Search },
      { id: 'check' as PageId, label: 'Check Pasted Text', icon: FileCheck },
      { id: 'chat' as PageId, label: 'Chatbot', icon: MessageSquare },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'settings' as PageId, label: 'Settings', icon: Settings },
      { id: 'about' as PageId, label: 'About', icon: Info },
    ],
  },
];

export default function Sidebar({ active, onNavigate, mobileOpen, onCloseMobile }: SidebarProps) {
  const handleNavigate = (page: PageId) => {
    onNavigate(page);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 lg:z-auto
          w-72 shrink-0 h-screen flex flex-col
          bg-white/70 backdrop-blur-xl border-r border-brand-100/60
          px-6 py-7 overflow-y-auto
          transition-transform duration-300 ease-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Mobile close */}
        <button
          onClick={onCloseMobile}
          className="absolute top-5 right-5 lg:hidden p-1.5 rounded-lg text-gray-400 hover:bg-brand-50"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-1">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-glow">
            <Brain className="w-6 h-6 text-white" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text leading-tight">HalluciSense</h1>
            <p className="text-[11px] text-gray-400 font-medium">AI Response Verification</p>
          </div>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed mt-4 mb-7">
          Detect, analyze and reduce hallucinations in AI-generated responses.
        </p>

        {/* Navigation */}
        <nav className="flex flex-col gap-5 mb-7">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                {section.label}
              </h3>
              <div className="flex flex-col gap-1.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = active === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-soft'
                          : 'text-gray-600 hover:bg-brand-50 hover:text-brand-600'
                      }`}
                    >
                      <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Pipeline */}
        <div className="mb-7">
          <PipelineStatus />
        </div>

        {/* Performance */}
        <div className="mt-auto">
          <PerformanceCard />
        </div>
      </aside>
    </>
  );
}
