import React, { useState } from 'react';
import { HIWAR_LIST, HiwarItem, playArabicAudio } from '../data/natureArabicData';
import { MessageSquare, Volume2, Play, Pause, Trees, Compass } from 'lucide-react';

export const HiwarView: React.FC = () => {
  const [selectedHiwarId, setSelectedHiwarId] = useState<string>('h1');
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);

  const currentHiwar: HiwarItem =
    HIWAR_LIST.find((h) => h.id === selectedHiwarId) || HIWAR_LIST[0];

  const handlePlayLine = (arabicText: string, index: number) => {
    setActiveLineIndex(index);
    playArabicAudio(arabicText);
    setTimeout(() => {
      setActiveLineIndex(null);
    }, 2500);
  };

  const handlePlayAllLines = async () => {
    if (isPlayingAll) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlayingAll(false);
      setActiveLineIndex(null);
      return;
    }

    setIsPlayingAll(true);
    for (let i = 0; i < currentHiwar.lines.length; i++) {
      setActiveLineIndex(i);
      playArabicAudio(currentHiwar.lines[i].arabic);
      // Wait for audio
      await new Promise((resolve) => setTimeout(resolve, 3800));
    }
    setIsPlayingAll(false);
    setActiveLineIndex(null);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-linear-to-r from-teal-800 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl">
          <span className="px-3 py-1 rounded-full bg-teal-500/30 text-teal-200 text-xs font-semibold uppercase tracking-wider mb-3 inline-block">
            Modul 2: Percakapan Tematik (الْحِوَار)
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 font-['Cairo',sans-serif]">
            حِوَارَاتُ جَمَالِ الطَّبِيْعَةِ
          </h2>
          <p className="text-teal-100 text-sm leading-relaxed">
            Latih keterampilan berbicara (Maharah Kalam) melalui percakapan santri mengenai rekreasi ke alam bebas, mengagumi gunung, lautan, dan ciptaan Allah Ta'ala.
          </p>
        </div>
      </div>

      {/* Hiwar Selector */}
      <div className="flex flex-wrap gap-3">
        {HIWAR_LIST.map((h) => {
          const isSelected = selectedHiwarId === h.id;
          return (
            <button
              key={h.id}
              onClick={() => {
                setSelectedHiwarId(h.id);
                setIsPlayingAll(false);
                setActiveLineIndex(null);
              }}
              className={`flex-1 min-w-[240px] text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-white/80 border-slate-200 hover:bg-white text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {h.id === 'h1' ? (
                  <Trees className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Compass className="w-4 h-4 text-cyan-600" />
                )}
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                  {h.subtitle}
                </span>
              </div>
              <h3 className="font-['Amiri',serif] font-bold text-xl text-slate-900">
                {h.title}
              </h3>
            </button>
          );
        })}
      </div>

      {/* Dialog Shell */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        {/* Situation Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-3">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase block">Situasi Dialog:</span>
            <p className="text-sm text-slate-700 italic">{currentHiwar.situation}</p>
          </div>
          <button
            onClick={handlePlayAllLines}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto ${
              isPlayingAll
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
            }`}
          >
            {isPlayingAll ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Hentikan Suara</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Putar Semua Dialog</span>
              </>
            )}
          </button>
        </div>

        {/* Conversation Bubbles */}
        <div className="space-y-4">
          {currentHiwar.lines.map((line, idx) => {
            const isActive = activeLineIndex === idx;
            const isSpeaker1 = idx % 2 === 0;

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all ${
                  isActive
                    ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/30 shadow-xs'
                    : isSpeaker1
                    ? 'bg-slate-50/80 border-slate-100'
                    : 'bg-teal-50/40 border-teal-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{line.avatar}</span>
                    <span className="text-xs font-bold text-slate-800">{line.speaker}</span>
                  </div>
                  <button
                    onClick={() => handlePlayLine(line.arabic, idx)}
                    title="Dengarkan baris ini"
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white hover:bg-emerald-100 text-slate-600 hover:text-emerald-800 border border-slate-200'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Arabic line */}
                <div className="text-right py-1">
                  <p className="font-['Amiri',serif] text-2xl font-bold text-slate-900 leading-relaxed tracking-wide">
                    {line.arabic}
                  </p>
                </div>

                {/* Latin & Translation */}
                <div className="mt-2 pt-2 border-t border-slate-200/60 text-xs space-y-0.5">
                  <p className="text-emerald-700 font-medium font-mono text-[11px]">
                    {line.latin}
                  </p>
                  <p className="text-slate-600">
                    "{line.indonesian}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
