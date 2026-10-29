import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { Navbar, NavTab } from './components/Navbar';
import { MufrodatView } from './components/MufrodatView';
import { HiwarView } from './components/HiwarView';
import { QawaidView } from './components/QawaidView';
import { QiraahView } from './components/QiraahView';
import { QuizView } from './components/QuizView';
import { GeminiTutorView } from './components/GeminiTutorView';
import { AdminPortal } from './components/AdminPortal';
import { Trees, Heart } from 'lucide-react';

const MainApp: React.FC = () => {
  const { user, loading, isAdmin } = useAuth();
  const [currentTab, setCurrentTab] = useState<NavTab>('mufrodat');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="font-['Cairo',sans-serif] text-xl font-bold text-emerald-300">
          جَمَالُ الطَّبِيْعَةِ
        </span>
        <p className="text-xs text-slate-400 mt-1">Memuat media pembelajaran Bahasa Arab MTsN...</p>
      </div>
    );
  }

  // Wajib Login: jika belum login, tampilkan halaman Login
  if (!user) {
    return <LoginPage />;
  }

  // Fallback to mufrodat if user is not admin but tries admin tab
  if (currentTab === 'admin' && !isAdmin) {
    setCurrentTab('mufrodat');
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Navigation */}
      <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'mufrodat' && <MufrodatView />}
        {currentTab === 'hiwar' && <HiwarView />}
        {currentTab === 'qawaid' && <QawaidView />}
        {currentTab === 'qiraah' && <QiraahView />}
        {currentTab === 'quiz' && <QuizView />}
        {currentTab === 'gemini' && <GeminiTutorView />}
        {currentTab === 'admin' && isAdmin && <AdminPortal />}
      </main>

      {/* Footer */}
      <footer className="bg-emerald-950 text-emerald-200/80 border-t border-emerald-900/60 py-8 px-4 text-center text-xs">
        <div className="max-w-7xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold">
            <Trees className="w-4 h-4" />
            <span className="font-['Cairo',sans-serif] text-base">
              الْعَرَبِيَّةُ لِلطَّبِيْعَةِ • مَدْرَسَةُ الثَّانَوِيَّةِ
            </span>
          </div>
          <p className="text-slate-400">
            Aplikasi Pembelajaran Bahasa Arab Tema Keindahan Alam (جمال الطبيعة) Kelas 7 MTsN.
          </p>
          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 pt-2 border-t border-emerald-900/40">
            <span>Dikembangkan untuk MTsN Unggulan dengan Firebase Auth, Firestore & Gemini AI</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Heart className="w-3 h-3 text-rose-400 fill-rose-400" /> Ferdi Administrator
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
