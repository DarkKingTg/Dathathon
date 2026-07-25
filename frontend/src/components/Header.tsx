import React, { useState, useEffect } from 'react';
import { Shield, Bell, FileUp, Share2, Search, Users, Activity, Clock, ShieldCheck } from 'lucide-react';
import { ViewMode, UserRole } from '../types';
import { ASSET_IMAGES } from '../data/mockData';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  pendingQueriesCount: number;
  onOpenExportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  userRole,
  onRoleChange,
  pendingQueriesCount,
  onOpenExportModal
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { view: ViewMode; icon: React.ElementType; label: string; shortcut: string }[] = [
    { view: 'field', icon: Users, label: 'Field', shortcut: '1' },
    { view: 'graph', icon: Share2, label: 'Graph', shortcut: '2' },
    { view: 'semantic', icon: Search, label: 'Search', shortcut: '3' },
    { view: 'leadership', icon: Activity, label: 'Leadership', shortcut: '4' },
    { view: 'timeline', icon: Clock, label: 'Timeline', shortcut: '5' },
    { view: 'audit', icon: ShieldCheck, label: 'Audit', shortcut: '6' },
  ];

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
      scrolled ? 'bg-[#0b1326]/95 backdrop-blur-sm border-b border-[#434655]/70' : 'bg-[#0b1326] border-b border-[#434655]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">

        {/* Brand */}
        <div className="flex items-center justify-between md:justify-start gap-4">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onViewChange('field')}>
            <div className="w-9 h-9 rounded-lg bg-[#2563eb]/15 flex items-center justify-center text-[#b4c5ff] group-hover:bg-[#2563eb]/25 transition-colors duration-200">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg sm:text-xl text-[#b4c5ff] leading-none flex items-center gap-2">
                KSP-Chanakya
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#2563eb]/15 text-[#b4c5ff] hidden sm:inline-block">
                  v4.2
                </span>
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <select
                  value={userRole}
                  onChange={(e) => onRoleChange(e.target.value as UserRole)}
                  className="bg-transparent text-[#c3c6d7] text-[11px] font-medium px-1 py-0 rounded border-none focus:outline-none cursor-pointer hover:text-[#dae2fd] transition-colors"
                >
                  <option value="Field Officer (SHO)">Field Officer (SHO)</option>
                  <option value="Investigative Analyst">Investigative Analyst</option>
                  <option value="Leadership / Commissioner">Leadership / Commissioner</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mobile Export */}
          <button
            onClick={onOpenExportModal}
            className="md:hidden p-2 rounded-lg bg-[#2563eb] text-white text-xs font-medium flex items-center gap-1 hover:bg-[#1d4ed8] active:scale-95 transition-all duration-150"
          >
            <FileUp className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0.5 bg-[#131b2e]/80 p-0.5 rounded-lg border border-[#434655]/60">
          {navItems.map(({ view, icon: Icon, label, shortcut }) => (
            <button
              key={view}
              onClick={() => onViewChange(view)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-1.5 group relative ${
                currentView === view
                  ? 'bg-[#2563eb] text-white'
                  : 'text-[#c3c6d7] hover:text-[#dae2fd] hover:bg-[#1a2340]'
              }`}
              title={`${label} (${shortcut})`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
              <kbd className={`text-[9px] font-mono px-1 py-0 rounded ml-0.5 ${
                currentView === view
                  ? 'bg-white/15 text-white/70'
                  : 'bg-[#222a3d] text-[#8d90a0] group-hover:text-[#c3c6d7]'
              }`}>
                {shortcut}
              </kbd>
            </button>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center justify-end gap-2.5">
          {/* Quick search hint */}
          <button
            onClick={onOpenExportModal}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#171f33] border border-[#434655]/40 rounded-lg text-[11px] text-[#8d90a0] hover:text-[#c3c6d7] hover:border-[#434655]/70 transition-colors"
            title="Command palette (Cmd+K)"
          >
            <Search className="w-3 h-3" />
            <span className="text-[10px]">Search...</span>
            <kbd className="text-[9px] font-mono bg-[#222a3d] px-1 py-0 rounded text-[#8d90a0]">⌘K</kbd>
          </button>

          <button
            onClick={onOpenExportModal}
            className="hidden md:flex items-center gap-1.5 bg-[#2563eb]/90 hover:bg-[#1d4ed8] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 active:scale-95"
          >
            <FileUp className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button
            onClick={() => onViewChange('field')}
            className="relative p-2 rounded-lg text-[#c3c6d7] hover:text-[#dae2fd] hover:bg-[#1a2340] transition-colors duration-150"
            title={`${pendingQueriesCount} pending`}
          >
            <Bell className="w-4 h-4" />
            {pendingQueriesCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#d52022] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {pendingQueriesCount}
              </span>
            )}
          </button>

          <div className="w-px h-5 bg-[#434655]/60" />

          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#434655]">
            <img
              src={ASSET_IMAGES.policeOfficer}
              alt="Officer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </header>
  );
};
