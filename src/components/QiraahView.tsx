import React, { useState } from 'react';
import { QIRAAH_ITEM, playArabicAudio } from '../data/natureArabicData';
import { useAuth } from '../context/AuthContext';
import { FileText, Volume2, CheckCircle2, HelpCircle, Eye, EyeOff } from 'lucide-react';

export const QiraahView: React.FC = () => {
  const { markLessonComplete } = useAuth();
  const [playingParagraph, setPlayingParagraph] = useState<number | null>(null);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const handlePlayParagraph = (text: string, idx: number) => {
    setPlayingParagraph(idx);
    playArabicAudio(text);
    setTimeout(() => {
      setPlayingParagraph(null);
    }, 4500);
  };

  const toggleRevealAnswer = (idx: number) => {
    setRevealedAnswers((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleFinishLesson = () => {
    setIsCompleted(true);
    markLessonComplete('qiraah');
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-linear-to-r from-teal-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-2xl">
          <span className="px-3 py-1 rounded-full bg-teal-500/30 text-teal-200 text-xs font-semibold uppercase tracking-wider mb-3 inline-block">
            Modul 4: Maharah Qira'ah (Kemahiran Membaca)
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-1 font-['Cairo',sans-serif]">
            {QIRAAH_ITEM.title}
          </h2>
          <p className="text-teal-200 text-xs font-mono mb-2">
            {QIRAAH_ITEM.latinTitle}
          </p>
          <p className="text-slate-200 text-sm leading-relaxed">
            Bacalah teks narasi keindahan alam nusantara berikut dengan tartil, perhatikan baris harakatnya, dan jawablah pertanyaan pemahaman bacaan (Fahm Al-Maqru').
          </p>
        </div>
      </div>

      {/* Reading Text Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-slate-800 text-base">Naskah Bacaan Arab & Terjemahan</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">3 Paragraf</span>
        </div>

        <div className="space-y-6">
          {QIRAAH_ITEM.paragraphs.map((para, idx) => {
            const isPlaying = playingParagraph === idx;
            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition-all ${
                  isPlaying
                    ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-400/20'
                    : 'bg-slate-50/80 border-slate-200/80'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <button
                    onClick={() => handlePlayParagraph(para.arabic, idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isPlaying
                        ? 'bg-emerald-700 text-white'
                        : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Dengarkan Paragraf</span>
                  </button>
                </div>

                <div className="text-right py-2">
                  <p className="font-['Amiri',serif] text-2xl font-bold text-slate-900 leading-loose tracking-wide">
                    {para.arabic}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/60">
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{para.translation}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comprehension Questions (Fahm al-Maqru') */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <HelpCircle className="w-5 h-5 text-teal-700" />
          <h3 className="font-bold text-slate-800 text-base">
            فَهْمُ الْمَقْرُوْءِ (Latihan Pemahaman Teks)
          </h3>
        </div>

        <p className="text-xs text-slate-500">
          Jawablah pertanyaan berikut secara lisan atau catatan, lalu buka tombol untuk mencocokkan jawaban Anda.
        </p>

        <div className="space-y-4 pt-2">
          {QIRAAH_ITEM.comprehensionQuestions.map((q, idx) => {
            const isRevealed = Boolean(revealedAnswers[idx]);
            return (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-teal-700 uppercase block mb-0.5">
                      Soal {idx + 1}:
                    </span>
                    <p className="text-xs text-slate-700 font-medium">{q.questionIndo}</p>
                  </div>
                  <span className="font-['Amiri',serif] text-xl font-bold text-slate-900 text-right">
                    {q.questionArabic}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                  <button
                    onClick={() => toggleRevealAnswer(idx)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 cursor-pointer"
                  >
                    {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{isRevealed ? 'Tutup Kunci Jawaban' : 'Buka Kunci Jawaban'}</span>
                  </button>

                  <button
                    onClick={() => playArabicAudio(q.questionArabic)}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-emerald-700 flex items-center justify-center cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isRevealed && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950">
                    <p className="font-bold mb-1 text-emerald-800">Kunci Jawaban Tepat:</p>
                    <p className="font-['Amiri',serif] text-lg font-bold text-right mb-1 text-emerald-900">
                      {q.answer.split('(')[0]}
                    </p>
                    <p className="text-emerald-800 text-[11px] italic">
                      ({q.answer.split('(')[1] || ''}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={handleFinishLesson}
            disabled={isCompleted}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? '✓ Modul Telah Selesai (+50 Poin)' : 'Tandai Selesai & Klaim 50 Poin'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
