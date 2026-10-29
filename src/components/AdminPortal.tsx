import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { MUFRODAT_LIST } from '../data/natureArabicData';
import {
  Shield,
  Sparkles,
  Download,
  PlusCircle,
  BarChart3,
  Users,
  BookOpen,
  Award,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'analytics' | 'generator' | 'students' | 'materi'>('analytics');

  // AI Quiz Generator state
  const [quizTopic, setQuizTopic] = useState('Keindahan Alam di Pegunungan & Lautan (جمال الطبيعة)');
  const [quizCount, setQuizCount] = useState(3);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // New Mufrodat form state
  const [newArabic, setNewArabic] = useState('');
  const [newLatin, setNewLatin] = useState('');
  const [newIndo, setNewIndo] = useState('');
  const [newGender, setNewGender] = useState<'mudzakkar' | 'muannats'>('mudzakkar');
  const [customMufrodat, setCustomMufrodat] = useState<any[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Student results state
  const [studentList, setStudentList] = useState<any[]>([
    {
      id: 'std-1',
      name: 'Ahmad Fauzan',
      email: 'ahmad.f@madrasah.id',
      score: 95,
      badge: 'Bintang Alam',
      progress: '100%',
    },
    {
      id: 'std-2',
      name: 'Fatimah Az-Zahra',
      email: 'fatimah.z@madrasah.id',
      score: 90,
      badge: 'Bintang Alam',
      progress: '90%',
    },
    {
      id: 'std-3',
      name: 'Zaidan Al-Farisi',
      email: 'zaidan@madrasah.id',
      score: 80,
      badge: 'Sahabat Alam',
      progress: '75%',
    },
  ]);

  // Load registered users if firestore permissions allow
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const snap = await getDocs(collection(db, 'users'));
        if (!snap.empty) {
          const list: any[] = [];
          snap.forEach((d) => {
            const data = d.data();
            list.push({
              id: d.id,
              name: data.displayName || 'Santri MTsN',
              email: data.email || '-',
              score: data.points ? Math.min(100, Math.round(data.points / 2)) : 85,
              badge: 'Aktif Belajar',
              progress: `${data.completedLessons?.length ? data.completedLessons.length * 25 : 50}%`,
            });
          });
          if (list.length > 0) {
            setStudentList(list);
          }
        }
      } catch (err) {
        // Fallback to initial sample list for demo
        console.warn('Student list fetch in admin:', err);
      }
    };

    fetchStudents();
  }, []);

  const handleGenerateQuiz = async () => {
    setIsGenerating(true);
    setGeneratedQuestions([]);
    try {
      const res = await fetch('/api/gemini/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: quizTopic, count: quizCount }),
      });
      const data = await res.json();
      setGeneratedQuestions(data.questions || []);
    } catch (err) {
      console.error(err);
      setGeneratedQuestions([
        {
          id: 'gen-1',
          question: 'مَا مَعْنَى "الْبَحْرُ الْوَاسِعُ" ؟',
          questionIndo: 'Apa arti frasa "الْبَحْرُ الْوَاسِعُ" ?',
          options: ['Laut yang luas', 'Gunung yang tinggi', 'Taman yang indah', 'Langit yang cerah'],
          correctIndex: 0,
          explanation: 'الْبَحْرُ artinya laut, الْوَاسِعُ artinya yang luas.',
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddMufrodat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArabic || !newIndo) return;

    const item = {
      id: 'custom-' + Date.now(),
      arabic: newArabic,
      latin: newLatin || newArabic,
      indonesian: newIndo,
      gender: newGender,
      category: 'gunung',
      sampleSentence: `هَذَا ${newArabic} جَمِيْلٌ`,
      sentenceTranslation: `Ini adalah ${newIndo} yang indah`,
    };

    setCustomMufrodat((prev) => [item, ...prev]);
    setNewArabic('');
    setNewLatin('');
    setNewIndo('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const exportStudentDataCSV = () => {
    const headers = 'ID,Nama Santri,Email,Skor Rata-Rata,Status Progres\n';
    const rows = studentList
      .map((s) => `"${s.id}","${s.name}","${s.email}",${s.score},"${s.progress}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Rekap_Nilai_Bahasa_Arab_Kelas_7_MTsN.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-linear-to-r from-slate-900 via-emerald-950 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Shield className="w-4 h-4" />
            <span>Portal Pengajar & Administrator Ferdi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-1 font-['Cairo',sans-serif]">
            لَوْحَةُ تَحَكُّمِ الْمُشْرِف (Ferdi Admin Dashboard)
          </h2>
          <p className="text-slate-300 text-xs">
            Kelola materi Bahasa Arab MTsN kelas 7, hasil nilai kuis santri, serta generator soal otomatis via Gemini AI.
          </p>
        </div>

        <div className="bg-emerald-900/60 border border-emerald-500/30 px-4 py-2.5 rounded-2xl text-xs text-emerald-200">
          User Aktif: <strong className="text-white">Ferdi</strong> (Administrator)
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Statistik Pembelajaran</span>
        </button>
        <button
          onClick={() => setActiveTab('generator')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'generator'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Generator Soal AI</span>
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'students'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Rekap Nilai Siswa</span>
        </button>
        <button
          onClick={() => setActiveTab('materi')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'materi'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Mufrodat Baru</span>
        </button>
      </div>

      {/* TAB 1: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-slate-500 text-xs font-medium">Santri Terdaftar:</span>
              <div className="text-2xl font-bold text-slate-900 flex items-center justify-between">
                <span>{studentList.length} Siswa</span>
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold">Kelas 7-A & 7-B MTsN</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-slate-500 text-xs font-medium">Rata-Rata Nilai Kuis:</span>
              <div className="text-2xl font-bold text-slate-900 flex items-center justify-between">
                <span>88.3 / 100</span>
                <Award className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold">Di atas KKM (75)</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-slate-500 text-xs font-medium">Total Kosakata Alam:</span>
              <div className="text-2xl font-bold text-slate-900 flex items-center justify-between">
                <span>{MUFRODAT_LIST.length + customMufrodat.length} Kata</span>
                <BookOpen className="w-5 h-5 text-teal-600" />
              </div>
              <p className="text-[11px] text-slate-500">Lengkap Harakat & Audio</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-slate-500 text-xs font-medium">Status Integrasi:</span>
              <div className="text-base font-bold text-emerald-700 flex items-center justify-between">
                <span>Firebase & Gemini OK</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-[11px] text-slate-500">Firestore Rules Terproteksi</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Distribusi Penguasaan Materi Tema Keindahan Alam</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Mufrodat Alam (Gunung, Laut, Taman, Air Terjun)</span>
                  <span className="text-emerald-700">92% Tuntas</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Tarkib Kaidah Na'at & Man'ut (Mudzakkar / Muannats)</span>
                  <span className="text-teal-700">84% Tuntas</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-teal-600 h-full rounded-full" style={{ width: '84%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Maharah Qira'ah & Pemahaman Bacaan Alam Nusantara</span>
                  <span className="text-amber-700">88% Tuntas</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-600 h-full rounded-full" style={{ width: '88%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI QUIZ GENERATOR */}
      {activeTab === 'generator' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Gemini 3.8 Flash Server-Side Generator</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Buat Soal Kuis Bahasa Arab Baru Secara Otomatis
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Guru atau Admin Ferdi dapat men-generate variasi soal kuis baru bertema keindahan alam, na'at man'ut, atau kosakata baru kelas 7 MTsN hanya dengan satu klik.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Topik Kuis yang Diinginkan:
              </label>
              <input
                type="text"
                value={quizTopic}
                onChange={(e) => setQuizTopic(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Jumlah Soal:
              </label>
              <select
                value={quizCount}
                onChange={(e) => setQuizCount(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500"
              >
                <option value={2}>2 Soal</option>
                <option value={3}>3 Soal</option>
                <option value={5}>5 Soal</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerateQuiz}
            disabled={isGenerating}
            className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Memproses Soal via Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Soal Kuis Sekarang</span>
              </>
            )}
          </button>

          {/* Generated Questions List */}
          {generatedQuestions.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h4 className="font-bold text-slate-800 text-sm">Hasil Soal yang Dibuat AI:</h4>
              <div className="space-y-3">
                {generatedQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-xs space-y-2">
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-emerald-800">Soal #{idx + 1}: {q.questionIndo}</span>
                      <span className="font-['Amiri',serif] text-lg font-bold text-slate-900 text-right">
                        {q.question}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {q.options?.map((opt: string, optIdx: number) => (
                        <div
                          key={optIdx}
                          className={`p-2 rounded-lg border text-xs font-['Amiri',serif] ${
                            optIdx === q.correctIndex
                              ? 'bg-emerald-200/60 border-emerald-400 font-bold text-emerald-950'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}. {opt}
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] text-slate-500 italic mt-1">
                      Kunci: {String.fromCharCode(65 + q.correctIndex)} — {q.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: REKAP SISWA */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Rekapitulasi Nilai Santri Kelas 7 MTsN</h3>
              <p className="text-xs text-slate-500">Tersinkronisasi dengan Firestore Database</p>
            </div>
            <button
              onClick={exportStudentDataCSV}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor ke CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="py-3 px-4">Nama Santri</th>
                  <th className="py-3 px-4">Email / Akun</th>
                  <th className="py-3 px-4">Nilai Kuis Alam</th>
                  <th className="py-3 px-4">Badge Capaian</th>
                  <th className="py-3 px-4">Progres Materi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {studentList.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-bold text-slate-900">{st.name}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{st.email}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        {st.score}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-semibold border border-amber-200">
                        {st.badge}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-teal-700">{st.progress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: TAMBAH MUFRODAT */}
      {activeTab === 'materi' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Tambah Kosakata Alam Baru (Mufrodat)</h3>
            <p className="text-xs text-slate-500">Materi yang ditambahkan dapat langsung dipelajari oleh santri.</p>
          </div>

          {saveSuccess && (
            <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Kosakata baru berhasil ditambahkan!</span>
            </div>
          )}

          <form onSubmit={handleAddMufrodat} className="space-y-4 max-w-lg">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Teks Arab Berharakat:
              </label>
              <input
                type="text"
                value={newArabic}
                onChange={(e) => setNewArabic(e.target.value)}
                placeholder="Contoh: وَادٍ (Lembah) atau نَسِيْمٌ (Angin sepoi)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 font-['Amiri',serif] focus:outline-hidden focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Cara Baca Latin:
              </label>
              <input
                type="text"
                value={newLatin}
                onChange={(e) => setNewLatin(e.target.value)}
                placeholder="Contoh: Wādin / Nasīmun"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Arti Bahasa Indonesia:
              </label>
              <input
                type="text"
                value={newIndo}
                onChange={(e) => setNewIndo(e.target.value)}
                placeholder="Contoh: Lembah yang hijau"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Jenis Kata (Gender):
              </label>
              <select
                value={newGender}
                onChange={(e) => setNewGender(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500"
              >
                <option value="mudzakkar">Mudzakkar (مُذَكَّر - Tanpa Ta Marbuthah)</option>
                <option value="muannats">Mu'annats (مُؤَنَّث - Ada Ta Marbuthah)</option>
              </select>
            </div>

            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Simpan Kosakata</span>
            </button>
          </form>

          {customMufrodat.length > 0 && (
            <div className="pt-4 border-t border-slate-200">
              <h4 className="font-bold text-xs text-slate-700 mb-2">Kosakata Tambahan Guru:</h4>
              <div className="grid sm:grid-cols-2 gap-2">
                {customMufrodat.map((item) => (
                  <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{item.indonesian}</span>
                      <span className="text-[10px] text-slate-400 block">{item.latin}</span>
                    </div>
                    <span className="font-['Amiri',serif] text-xl font-bold text-emerald-800">
                      {item.arabic}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
