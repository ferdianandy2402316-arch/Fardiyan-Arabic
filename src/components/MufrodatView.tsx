import React, { useState } from 'react';
import { MUFRODAT_LIST, MufrodatItem, playArabicAudio } from '../data/natureArabicData';
import { filterMufrodat } from '../utils/arabicLogic';
import {
  Volume2,
  Search,
  Sparkles,
  Mountain,
  Waves,
  Flower2,
  CloudRain,
  SunMedium,
  Trees,
  CloudSun,
  Compass,
  TreePine,
  Sun,
  Moon,
  Info,
  CheckCircle2,
} from 'lucide-react';

export const MufrodatView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [aiModalWord, setAiModalWord] = useState<MufrodatItem | null>(null);
  const [aiExplanation, setAiExplanation] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const categories = [
    { id: 'all', label: 'Semua Kosakata' },
    { id: 'gunung', label: 'Pegunungan & Air Terjun' },
    { id: 'pantai', label: 'Pantai & Lautan' },
    { id: 'taman', label: 'Taman & Sawah' },
    { id: 'cuaca', label: 'Langit & Benda Langit' },
    { id: 'flora', label: 'Tumbuhan & Flora' },
  ];

  const filteredByCategory =
    selectedCategory === 'all'
      ? MUFRODAT_LIST
      : MUFRODAT_LIST.filter((item) => item.category === selectedCategory);

  const displayedItems = filterMufrodat(filteredByCategory, searchTerm);

  const handlePlayAudio = (item: MufrodatItem) => {
    setPlayingId(item.id);
    playArabicAudio(item.arabic);
    setTimeout(() => {
      setPlayingId(null);
    }, 1500);
  };

  const handleAskAiAboutWord = async (item: MufrodatItem) => {
    setAiModalWord(item);
    setAiLoading(true);
    setAiExplanation(null);
    try {
      const res = await fetch('/api/gemini/explain-tashkeel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: item.arabic }),
      });
      const data = await res.json();
      setAiExplanation(data);
    } catch (err) {
      console.error(err);
      setAiExplanation({
        word: item.arabic,
        withHarakat: item.arabic,
        latin: item.latin,
        meaning: item.indonesian,
        type: item.gender === 'mudzakkar' ? 'Isim Mudzakkar' : "Isim Mu'annats",
        exampleSentence: item.sampleSentence,
        exampleTranslation: item.sentenceTranslation,
        tip: 'Hafalkan kosakata ini dan perhatikan huruf penyusunnya!',
      });
    } finally {
      setAiLoading(false);
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Mountain':
        return <Mountain className="w-5 h-5 text-emerald-600" />;
      case 'Waves':
        return <Waves className="w-5 h-5 text-cyan-600" />;
      case 'Flower2':
        return <Flower2 className="w-5 h-5 text-pink-600" />;
      case 'CloudRain':
        return <CloudRain className="w-5 h-5 text-blue-600" />;
      case 'SunMedium':
        return <SunMedium className="w-5 h-5 text-amber-600" />;
      case 'Trees':
        return <Trees className="w-5 h-5 text-emerald-700" />;
      case 'CloudSun':
        return <CloudSun className="w-5 h-5 text-sky-600" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-teal-600" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-violet-600" />;
      case 'TreePine':
        return <TreePine className="w-5 h-5 text-green-700" />;
      case 'Sun':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'Moon':
        return <Moon className="w-5 h-5 text-indigo-500" />;
      default:
        return <Mountain className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner Intro */}
      <div className="bg-linear-to-r from-emerald-800 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Trees className="w-64 h-64" />
        </div>
        <div className="max-w-2xl relative z-10">
          <span className="px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-3 inline-block">
            Modul 1: Mufrodat Alam
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 font-['Cairo',sans-serif]">
            مُفْرَدَاتُ جَمَالِ الطَّبِيْعَةِ
          </h2>
          <p className="text-emerald-100 text-sm leading-relaxed">
            Pelajari kosakata bahasa Arab seputar keindahan alam ciptaan Allah SWT. Dengarkan pelafalan fasihnya, perhatikan harakatnya, dan ketahui apakah termasuk <em>Mudzakkar</em> (laki-laki) atau <em>Mu'annats</em> (perempuan).
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari kosakata (contoh: gunung, jabal, laut)..."
            className="w-full bg-white border border-slate-200 rounded-2xl pl-9 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs"
          />
        </div>

        {/* Categories scrollable */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mufrodat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedItems.map((item) => {
          const isPlaying = playingId === item.id;
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all hover:border-emerald-300 flex flex-col justify-between group"
            >
              <div>
                {/* Header card with category and audio button */}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform">
                    {getCategoryIcon(item.iconName)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        item.gender === 'mudzakkar'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-pink-50 text-pink-700 border border-pink-200'
                      }`}
                    >
                      {item.gender === 'mudzakkar' ? 'مُذَكَّر (L)' : "مُؤَنَّث (P)"}
                    </span>
                    <button
                      onClick={() => handlePlayAudio(item)}
                      title="Dengarkan pelafalan Arab"
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                        isPlaying
                          ? 'bg-emerald-600 text-white scale-95'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Arabic big text */}
                <div className="text-right py-2 border-b border-slate-100 mb-3">
                  <span className="font-['Amiri',serif] text-3xl font-bold text-slate-900 block leading-tight tracking-wide hover:text-emerald-700 transition-colors">
                    {item.arabic}
                  </span>
                  <span className="text-xs text-emerald-600 font-semibold font-mono">
                    {item.latin}
                  </span>
                </div>

                {/* Meaning & Details */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-slate-500 text-xs">Arti:</span>
                    <span className="font-bold text-slate-800">{item.indonesian}</span>
                  </div>
                  {item.plural && (
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-slate-500">Bentuk Jamak:</span>
                      <span className="font-['Amiri',serif] font-bold text-slate-700">
                        {item.plural}
                      </span>
                    </div>
                  )}
                </div>

                {/* Sample Sentence */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs">
                  <p className="text-slate-500 text-[11px] font-medium mb-1">Contoh Kalimat:</p>
                  <p className="font-['Amiri',serif] text-base font-bold text-slate-800 text-right leading-relaxed">
                    {item.sampleSentence}
                  </p>
                  <p className="text-slate-600 italic text-[11px] mt-1">
                    "{item.sentenceTranslation}"
                  </p>
                </div>
              </div>

              {/* Action Button: Ask AI */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={() => handleAskAiAboutWord(item)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Bedah Harakat AI</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {displayedItems.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
          <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-700">Kosakata tidak ditemukan</h3>
          <p className="text-xs text-slate-500 mt-1">
            Coba cari dengan kata kunci lain atau pilih kategori "Semua Kosakata".
          </p>
        </div>
      )}

      {/* AI Explanation Modal */}
      {aiModalWord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Bedah Kata Bersama Ustadz AI</h3>
                  <p className="text-[11px] text-slate-500">Didukung Gemini Server-Side</p>
                </div>
              </div>
              <button
                onClick={() => setAiModalWord(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {aiLoading ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-semibold text-slate-700">
                  Ustadz AI sedang menganalisis kata "{aiModalWord.arabic}"...
                </p>
                <p className="text-xs text-slate-400">Menyusun harakat, jenis kata, dan kaidah na'at</p>
              </div>
            ) : aiExplanation ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                  <span className="font-['Amiri',serif] text-4xl font-bold text-emerald-900 block mb-1">
                    {aiExplanation.withHarakat || aiExplanation.word}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700">
                    {aiExplanation.latin || aiModalWord.latin} • {aiExplanation.meaning || aiModalWord.indonesian}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Klasifikasi Kata:</span>
                    <span className="font-bold text-slate-800">{aiExplanation.type || 'Isim'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Bentuk Jamak / Mufrad:</span>
                    <span className="font-bold text-slate-800 font-['Amiri',serif]">
                      {aiExplanation.pluralOrSingular || aiModalWord.plural || '-'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-xs font-semibold text-slate-700 mb-1">Contoh Kalimat Sifat (Na'at):</p>
                  <p className="font-['Amiri',serif] text-lg font-bold text-slate-900 text-right">
                    {aiExplanation.exampleSentence}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 italic">
                    "{aiExplanation.exampleTranslation}"
                  </p>
                </div>

                {aiExplanation.tip && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Tips Mengingat:</strong> {aiExplanation.tip}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => playArabicAudio(aiExplanation.withHarakat || aiModalWord.arabic)}
                  className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Dengarkan Pelafalan</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
