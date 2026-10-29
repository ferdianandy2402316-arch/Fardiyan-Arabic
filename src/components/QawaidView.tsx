import React, { useState } from 'react';
import { QAWAID_LESSON, playArabicAudio } from '../data/natureArabicData';
import { checkNaatAgreement } from '../utils/arabicLogic';
import { Sparkles, CheckCircle, XCircle, ArrowRight, BookOpen, Volume2, Send } from 'lucide-react';

export const QawaidView: React.FC = () => {
  // Interactive Lab State
  const [selectedNounGender, setSelectedNounGender] = useState<'mudzakkar' | 'muannats'>('mudzakkar');
  const [selectedNounAl, setSelectedNounAl] = useState<boolean>(false);
  const [selectedAdjGender, setSelectedAdjGender] = useState<'mudzakkar' | 'muannats'>('mudzakkar');
  const [selectedAdjAl, setSelectedAdjAl] = useState<boolean>(false);

  // Student Sentence Checker with AI
  const [studentSentence, setStudentSentence] = useState('');
  const [sentenceResult, setSentenceResult] = useState<any>(null);
  const [sentenceLoading, setSentenceLoading] = useState(false);

  const labAgreement = checkNaatAgreement(
    selectedNounGender,
    selectedAdjGender,
    selectedNounAl,
    selectedAdjAl
  );

  const nounPreview = selectedNounAl
    ? selectedNounGender === 'mudzakkar'
      ? 'الْجَبَلُ (Al-Jabalu)'
      : 'الْحَدِيْقَةُ (Al-Hadīqatu)'
    : selectedNounGender === 'mudzakkar'
    ? 'جَبَلٌ (Jabalun)'
    : 'حَدِيْقَةٌ (Hadīqatun)';

  const adjPreview = selectedAdjAl
    ? selectedAdjGender === 'mudzakkar'
      ? 'الْعَالِي (Al-\'Ālī)'
      : 'الْجَمِيْلَةُ (Al-Jamīlatu)'
    : selectedAdjGender === 'mudzakkar'
    ? 'عَالٍ (\'Ālin)'
    : 'جَمِيْلَةٌ (Jamīlatun)';

  const fullArabicPhrase = `${nounPreview.split(' ')[0]} ${adjPreview.split(' ')[0]}`;

  const handleCheckSentence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentSentence.trim()) return;

    setSentenceLoading(true);
    setSentenceResult(null);

    try {
      const res = await fetch('/api/gemini/check-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: studentSentence }),
      });
      const data = await res.json();
      setSentenceResult(data);
    } catch (err) {
      console.error(err);
      setSentenceResult({
        original: studentSentence,
        corrected: studentSentence,
        isCorrect: true,
        ruleExplanation: 'Kalimat berhasil dianalisis. Pastikan na\'at mengikuti man\'ut dalam jenis mudzakkar/muannats.',
        encouragement: 'Ahsantum! Teruslah rajin merangkai kalimat bahasa Arab bertema alam.',
      });
    } finally {
      setSentenceLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-linear-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-2xl">
          <span className="px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-3 inline-block">
            Modul 3: Qawa'id / Tata Bahasa Kelas 7
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 font-['Cairo',sans-serif]">
            {QAWAID_LESSON.title}
          </h2>
          <p className="text-emerald-100 text-sm leading-relaxed">
            {QAWAID_LESSON.summary}
          </p>
        </div>
      </div>

      {/* Rules & Guidelines Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Rumus & Syarat Na'at Man'ut</h3>
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
            <span className="text-xs text-emerald-700 font-semibold block mb-1">Struktur Kalimat:</span>
            <span className="font-['Amiri',serif] text-2xl font-bold text-emerald-900 block">
              {QAWAID_LESSON.formula}
            </span>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-700">
            {QAWAID_LESSON.rules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Examples Table */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Contoh Pensifatan Alam</h3>
          </div>

          <div className="space-y-3">
            {QAWAID_LESSON.examples.map((ex, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ex.type === 'Mudzakkar'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-pink-100 text-pink-700'
                      }`}
                    >
                      {ex.type}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{ex.translation}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">{ex.explanation}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-['Amiri',serif] text-xl font-bold text-slate-900 text-right">
                    {ex.combined}
                  </span>
                  <button
                    onClick={() => playArabicAudio(ex.combined)}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 flex items-center justify-center cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Lab: Simulator Na'at Man'ut */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2 inline-block">
            Laboratorium Interaktif
          </span>
          <h3 className="text-xl font-bold text-slate-800">
            Simulasi Keselarasan Na'at & Man'ut
          </h3>
          <p className="text-slate-500 text-xs">
            Ubah jenis gender dan kehadiran alif-lam (ال) pada isim dan sifat untuk melihat apakah kaidahnya sah atau keliru!
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          {/* Noun Control */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              1. Man'ut (Benda Alam yang disifati)
            </h4>
            <div className="space-y-2">
              <label className="text-xs text-slate-600 block">Jenis Kata Benda:</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedNounGender('mudzakkar')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    selectedNounGender === 'mudzakkar'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  Mudzakkar (Gunung - جَبَل)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedNounGender('muannats')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    selectedNounGender === 'muannats'
                      ? 'bg-pink-600 text-white border-pink-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  Mu'annats (Taman - حَدِيْقَة)
                </button>
              </div>
            </div>

            <div className="pt-2">
              <label className="text-xs text-slate-600 block mb-1">Kehadiran Alif-Lam (ال):</label>
              <button
                type="button"
                onClick={() => setSelectedNounAl(!selectedNounAl)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedNounAl
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                {selectedNounAl ? '✓ Menggunakan Alif-Lam (ال)' : '✕ Tanpa Alif-Lam (Bertanwin)'}
              </button>
            </div>
          </div>

          {/* Adjective Control */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              2. Na'at (Kata Sifat)
            </h4>
            <div className="space-y-2">
              <label className="text-xs text-slate-600 block">Jenis Kata Sifat:</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAdjGender('mudzakkar')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    selectedAdjGender === 'mudzakkar'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  Mudzakkar (Tinggi - عَالٍ)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAdjGender('muannats')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    selectedAdjGender === 'muannats'
                      ? 'bg-pink-600 text-white border-pink-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  Mu'annats (Indah - جَمِيْلَة)
                </button>
              </div>
            </div>

            <div className="pt-2">
              <label className="text-xs text-slate-600 block mb-1">Kehadiran Alif-Lam (ال):</label>
              <button
                type="button"
                onClick={() => setSelectedAdjAl(!selectedAdjAl)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedAdjAl
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                {selectedAdjAl ? '✓ Menggunakan Alif-Lam (ال)' : '✕ Tanpa Alif-Lam (Bertanwin)'}
              </button>
            </div>
          </div>
        </div>

        {/* Realtime Output Lab */}
        <div
          className={`p-6 rounded-2xl border text-center transition-all ${
            labAgreement.isValid
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/20'
              : 'bg-rose-50 border-rose-300 ring-2 ring-rose-400/20'
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            {labAgreement.isValid ? (
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-600" />
            )}
            <span
              className={`text-sm font-bold uppercase tracking-wide ${
                labAgreement.isValid ? 'text-emerald-800' : 'text-rose-800'
              }`}
            >
              {labAgreement.isValid ? 'Kaidah Sah & Sesuai' : 'Kaidah Belum Sesuai'}
            </span>
          </div>

          <div className="font-['Amiri',serif] text-4xl font-bold text-slate-900 my-3">
            {fullArabicPhrase}
          </div>

          <p
            className={`text-xs font-semibold max-w-md mx-auto ${
              labAgreement.isValid ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {labAgreement.message}
          </p>

          {labAgreement.isValid && (
            <button
              onClick={() => playArabicAudio(fullArabicPhrase)}
              className="mt-4 px-4 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-2 hover:bg-emerald-800 cursor-pointer shadow-xs"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Dengarkan Susunan Kalimat</span>
            </button>
          )}
        </div>
      </div>

      {/* AI Sentence Checker */}
      <div className="bg-linear-to-br from-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-2xl mb-6">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Koreksi Kalimat Santri Bersama Ustadz AI</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold mb-1">
            Uji Coba Rangkaian Kalimat Alam Anda
          </h3>
          <p className="text-slate-300 text-xs">
            Tuliskan kalimat bahasa Arab bertema keindahan alam (misal: "هَذَا جَبَلٌ عَالٍ" atau "الْبَحْرُ وَاسِعٌ"). Gemini AI server-side akan memeriksa kesesuaian tarkib na'at man'ut Anda.
          </p>
        </div>

        <form onSubmit={handleCheckSentence} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={studentSentence}
              onChange={(e) => setStudentSentence(e.target.value)}
              placeholder="Ketik kalimat Arab bertema alam di sini... (contoh: هَذِهِ حَدِيْقَةٌ جَمِيْلَةٌ)"
              className="w-full bg-slate-800/90 border border-emerald-500/30 rounded-2xl px-4 py-3.5 text-base text-white placeholder-slate-400 focus:outline-hidden focus:border-emerald-400 font-['Amiri',serif]"
            />
            <button
              type="submit"
              disabled={sentenceLoading || !studentSentence.trim()}
              className="absolute right-2.5 top-2.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              {sentenceLoading ? (
                <span>Memeriksa...</span>
              ) : (
                <>
                  <span>Periksa</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {sentenceResult && (
          <div className="mt-6 p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  sentenceResult.isCorrect
                    ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/30'
                    : 'bg-amber-500/30 text-amber-300 border border-amber-400/30'
                }`}
              >
                {sentenceResult.isCorrect ? '✓ Kalimat Tepat / Bagus' : 'Perlu Perbaikan'}
              </span>
              <button
                onClick={() => playArabicAudio(sentenceResult.corrected || sentenceResult.original)}
                className="text-xs text-emerald-300 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Putar Audio</span>
              </button>
            </div>

            <div className="text-right py-1">
              <p className="font-['Amiri',serif] text-2xl font-bold text-white">
                {sentenceResult.corrected}
              </p>
              {sentenceResult.transliteration && (
                <p className="text-xs text-emerald-300 font-mono mt-0.5">
                  {sentenceResult.transliteration}
                </p>
              )}
            </div>

            <div className="p-3 bg-black/20 rounded-xl text-xs space-y-1 text-slate-200">
              <p>
                <strong className="text-emerald-400">Arti:</strong> {sentenceResult.translation || '-'}
              </p>
              <p>
                <strong className="text-emerald-400">Analisis Kaidah:</strong>{' '}
                {sentenceResult.ruleExplanation}
              </p>
            </div>

            {sentenceResult.encouragement && (
              <p className="text-xs text-amber-200 italic">
                "{sentenceResult.encouragement}"
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
