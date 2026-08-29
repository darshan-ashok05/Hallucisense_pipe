import { Bell, Settings as SettingsIcon, Menu } from 'lucide-react';

interface TopHeaderProps {
  onOpenMobileMenu: () => void;
  onNavigateSettings: () => void;
}

export default function TopHeader({ onOpenMobileMenu, onNavigateSettings }: TopHeaderProps) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <header className="mb-6">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-brand-50 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {greeting} <span className="inline-block">👋</span>
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Verify your AI responses with confidence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="relative p-2 rounded-xl text-gray-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-500" />
          </button>
          <button
            onClick={onNavigateSettings}
            className="p-2 rounded-xl text-gray-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"
            aria-label="Settings"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold shadow-soft">
            U
          </div>
        </div>
      </div>

      {/* System status */}
      <div className="mt-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-400 pulse-glow" />
        <span className="text-[13px] text-gray-500 font-medium">
          Verification Engine Ready
        </span>
      </div>
    </header>
  );
}
