import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Shield, User, Lock, ArrowRight, BookOpen, Trees, Award } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { signInWithGoogle, loginAsAdmin, loginAsDemoStudent } = useAuth();
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'google' | 'admin' | 'guest'>('google');

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      console.error(err);
      // If popup was blocked or failed, give friendly hint
      alert('Gagal membuka popup Google Sign-In. Pastikan popup tidak diblokir browser, atau gunakan tab Admin/Santri Tamu untuk akses instan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    if (!adminUser || !adminPass) {
      setAdminError('Harap masukkan username dan password');
      return;
    }

    setIsSubmitting(true);
    const result = await loginAsAdmin(adminUser, adminPass);
    setIsSubmitting(false);
    if (!result.success) {
      setAdminError(result.message || 'Username atau password salah! (Gunakan Ferdi / Ferdi123)');
    }
  };

  const fillAdminCredentials = () => {
    setAdminUser('Ferdi');
    setAdminPass('Ferdi123');
    setAdminError('');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-900 via-teal-900 to-slate-900 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-4xl grid md:grid-cols-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Visual Column */}
        <div className="md:col-span-5 bg-linear-to-b from-emerald-800/80 to-teal-900/90 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-6">
              <Trees className="w-3.5 h-3.5" />
              <span>Bahasa Arab MTsN Kelas 7</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 font-['Cairo',sans-serif]">
              جَمَالُ الطَّبِيْعَةِ
            </h1>
            <p className="text-xl font-bold text-emerald-300 mb-3 font-['Plus_Jakarta_Sans',sans-serif]">
              Keindahan Alam
            </p>
            <p className="text-emerald-100/80 text-sm leading-relaxed mb-6">
              Media pembelajaran interaktif bahasa Arab Kurikulum Merdeka & KMA 183. Jelajahi mufrodat alam, percakapan (hiwar), kaidah na'at man'ut, dan bimbingan asisten cerdas Ustadz AI.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-emerald-200">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <span>Mufrodat Berharakat & Audio Asli</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-emerald-200">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span>Kaidah Na'at & Man'ut Interaktif</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-emerald-200">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <span>Kuis & Poin Prestasi Siswa</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/10 text-xs text-emerald-300/70">
            MTsN Unggulan • Pembelajaran Berbasis Digital
          </div>
        </div>

        {/* Right Form Column */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-slate-900/40">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">Masuk ke Aplikasi</h2>
            <p className="text-slate-400 text-sm">
              Silakan login untuk menyimpan progres belajar, rekapan kuis, dan poin prestasi Anda.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="grid grid-cols-3 gap-1 bg-white/5 p-1 rounded-xl mb-6 border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('google')}
              className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'google'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Google Auth
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'admin'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Admin Ferdi
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('guest')}
              className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'guest'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Santri Tamu
            </button>
          </div>

          {/* TAB 1: GOOGLE SIGN-IN */}
          {activeTab === 'google' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <p className="text-sm text-slate-300 mb-4">
                  Gunakan akun Google siswa/madrasah untuk masuk secara instan via Firebase Authentication.
                </p>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-white text-slate-800 font-bold hover:bg-slate-100 transition-all shadow-lg flex items-center justify-center gap-3 active:scale-98 disabled:opacity-50 cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>{isSubmitting ? 'Menghubungkan...' : 'Masuk dengan Google'}</span>
                </button>
              </div>

              <div className="text-center">
                <span className="text-xs text-slate-400">
                  Data profil dan nilai kuis otomatis disimpan di Google Firestore database.
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: ADMIN FERDI */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
                <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Portal Khusus Admin Ferdi:</strong>
                  <br />
                  User: <code className="bg-amber-900/40 px-1.5 py-0.5 rounded text-amber-300 font-mono">Ferdi</code> |
                  Password: <code className="bg-amber-900/40 px-1.5 py-0.5 rounded text-amber-300 font-mono">Ferdi123</code>
                </div>
              </div>

              {adminError && (
                <div className="p-3 bg-rose-500/20 border border-rose-500/30 text-rose-200 rounded-xl text-xs">
                  {adminError}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Username Admin</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={adminUser}
                    onChange={(e) => setAdminUser(e.target.value)}
                    placeholder="Ferdi"
                    className="w-full bg-slate-800/80 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-800/80 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={fillAdminCredentials}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors cursor-pointer border border-white/10"
                >
                  ⚡ Auto-Isi Ferdi
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Memverifikasi...' : 'Masuk sebagai Admin'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: GUEST DEMO */}
          {activeTab === 'guest' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <p className="text-sm text-slate-300 mb-4">
                  Masuk langsung tanpa akun Google untuk meninjau materi keindahan alam, audio mufrodat, dan latihan kuis santri MTsN.
                </p>

                <button
                  type="button"
                  onClick={() => loginAsDemoStudent('Siswa Kelas 7 MTsN')}
                  className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Masuk Cepat Sebagai Santri</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
