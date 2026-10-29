import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Trees,
  BookOpen,
  MessageSquare,
  Sparkles,
  FileText,
  HelpCircle,
  Bot,
  Shield,
  LogOut,
  Award,
} from 'lucide-react';

export type NavTab = 'mufrodat' | 'hiwar' | 'qawaid' | 'qiraah' | 'quiz' | 'gemini' | 'admin';

interface NavbarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  const { user, logout, isAdmin } = useAuth();

  const navItems: { id: NavTab; label: string; arabic: string; icon: React.ReactNode; adminOnly?: boolean }[] = [
    { id: 'mufrodat', label: 'Mufrodat', arabic: 'الْمُفْرَدَات', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'hiwar', label: 'Hiwar', arabic: 'الْحِوَار', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'qawaid', label: "Qawa'id", arabic: 'الْقَوَاعِد', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'qiraah', label: "Qira'ah", arabic: 'الْقِرَاءَة', icon: <FileText className="w-4 h-4" /> },
    { id: 'quiz', label: 'Kuis Alam', arabic: 'الِاخْتِبَار', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'gemini', label: 'Ustadz AI', arabic: 'مُسَاعِد AI', icon: <Bot className="w-4 h-4" /> },
  ];

  if (isAdmin) {
    navItems.push({
      id: 'admin',
      label: 'Admin Ferdi',
      arabic: 'الْمُشْرِف',
      icon: <Shield className="w-4 h-4 text-amber-300" />,
      adminOnly: true,
    });
  }

  return (
    <header className="sticky top-0 z-40 bg-emerald-950/95 backdrop-blur-md border-b border-emerald-800/50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('mufrodat')}>
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-900/50 border border-emerald-300/30">
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Cairo',sans-serif] font-bold text-lg text-emerald-300">
                  جَمَالُ الطَّبِيْعَةِ
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-800/80 text-emerald-200 border border-emerald-600/40">
                  Kelas 7 MTsN
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Bahasa Arab • Keindahan Alam
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-700/50'
                      : 'text-emerald-100/80 hover:text-white hover:bg-emerald-900/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-900/40 border border-emerald-800/50">
                <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold" title="Poin Prestasi">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>{user.points || 0} pts</span>
                </div>
                <div className="w-px h-4 bg-emerald-800" />
                <div className="flex items-center gap-2">
                  <img
                    src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`}
                    alt={user.displayName || 'User'}
                    className="w-6 h-6 rounded-full border border-emerald-400/40 object-cover bg-emerald-900"
                  />
                  <div className="text-left">
                    <p className="text-xs font-medium text-emerald-100 max-w-[100px] truncate leading-tight">
                      {user.displayName || 'Santri'}
                    </p>
                    <span className="text-[9px] text-emerald-400 font-semibold">
                      {user.role === 'admin' ? 'Pengajar Admin' : 'Santri Kelas 7'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={() => {
                if (confirm('Apakah Anda yakin ingin keluar dari aplikasi?')) {
                  logout();
                }
              }}
              title="Keluar / Logout"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors cursor-pointer active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs (Scrollable) */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-emerald-800/40 no-scrollbar">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-200/80 hover:bg-emerald-900/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
