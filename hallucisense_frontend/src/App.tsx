import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopHeader from '@/components/TopHeader';
import AskQuestion from '@/pages/AskQuestion';
import CheckText from '@/pages/CheckText';
import Chatbot from '@/pages/Chatbot';
import Settings from '@/pages/Settings';
import About from '@/pages/About';
import type { PageId } from '@/types';

export default function App() {
  const [page, setPage] = useState<PageId>('ask');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50/40 via-white to-accent-500/5 flex">
      <Sidebar
        active={page}
        onNavigate={setPage}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <main className="flex-1 min-w-0 px-6 lg:px-10 py-7 overflow-x-hidden">
        <TopHeader
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onNavigateSettings={() => setPage('settings')}
        />

        <div key={page} className="animate-fade-in">
          {page === 'ask' && <AskQuestion onNavigate={setPage} />}
          {page === 'check' && <CheckText onNavigate={setPage} />}
          {page === 'chat' && <Chatbot />}
          {page === 'settings' && <Settings />}
          {page === 'about' && <About />}
        </div>
      </main>
    </div>
  );
}
