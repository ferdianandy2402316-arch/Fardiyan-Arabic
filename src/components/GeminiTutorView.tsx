import React, { useState } from 'react';
import { playArabicAudio } from '../data/natureArabicData';
import { Bot, Send, Sparkles, Volume2, User, RefreshCw } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const GeminiTutorView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُه! (Assalāmu \'alaikum wa rahmatullāhi wa barakātuh!).\n\nSaya adalah Ustadz Al-Bi\'ah, asisten cerdas pembelajaran Bahasa Arab kelas 7 MTsN. Ada yang ingin antum tanyakan seputar kosakata keindahan alam (جمال الطبيعة), kaidah Na\'at Man\'ut, atau latihan membuat kalimat?',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    'Apa arti dan harakat kata "شَلَّالٌ" ?',
    'Jelaskan kaidah Na\'at Man\'ut untuk kata "سَمَاءٌ" ?',
    'Buatkan contoh kalimat tentang keindahan pantai dalam bahasa Arab',
    'Bagaimana membedakan isim mudzakkar & mu\'annats pada benda alam?',
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const historyContext = messages.map((m) => ({
        sender: m.sender === 'user' ? 'Siswa' : 'Ustadz AI',
        text: m.text,
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, history: historyContext }),
      });
      const data = await res.json();

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'assistant',
        text: data.reply || 'Maaf, saya tidak dapat merespons saat ini.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: 'bot-err-' + Date.now(),
        sender: 'assistant',
        text: 'مَرْحَبًا! Pembelajaran Bahasa Arab bertema keindahan alam: جَبَلٌ عَالٍ (gunung yang tinggi) adalah contoh susunan na\'at man\'ut yang sah. Silakan tanyakan hal lain.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const extractArabicAndPlay = (text: string) => {
    // Extract arabic characters to pronounce
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s,.?!]+/g;
    const matches = text.match(arabicRegex);
    if (matches && matches.length > 0) {
      const arabicSpeech = matches.join(' ').trim();
      if (arabicSpeech.length > 2) {
        playArabicAudio(arabicSpeech);
        return;
      }
    }
    playArabicAudio(text);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex items-center justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Didukung Gemini 3.8 Flash (Server-Side)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-1 font-['Cairo',sans-serif]">
            أُسْتَاذُ الطَّبِيْعَةِ الذَّكِيّ
          </h2>
          <p className="text-emerald-200 text-xs font-semibold mb-2">
            Ustadz Al-Bi'ah: Tutor Bahasa Arab Kelas 7 MTsN
          </p>
          <p className="text-slate-300 text-xs leading-relaxed">
            Tanyakan segala hal mengenai kosakata keindahan alam, harakat, i'rab, kaidah na'at man'ut, atau terjemahan ayat-ayat tadabbur alam.
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[580px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => {
            const isBot = m.sender === 'assistant';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-xs space-y-2 ${
                    isBot
                      ? 'bg-slate-50 border border-slate-200 text-slate-800'
                      : 'bg-emerald-700 text-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] opacity-70">
                    <span className="font-bold">{isBot ? 'Ustadz AI' : 'Santri'}</span>
                    <span>{m.timestamp}</span>
                  </div>

                  <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-['Cairo',sans-serif]">
                    {m.text}
                  </div>

                  {isBot && (
                    <div className="pt-2 border-t border-slate-200 flex justify-end">
                      <button
                        onClick={() => extractArabicAndPlay(m.text)}
                        title="Dengarkan pengucapan Arab"
                        className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer bg-emerald-50 px-2.5 py-1 rounded-lg"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Dengarkan Teks Arab</span>
                      </button>
                    </div>
                  )}
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                <span>Ustadz AI sedang menyusun jawaban berharakat...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">
            Pertanyaan Cepat:
          </span>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="text-xs bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 rounded-xl px-3 py-1.5 whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tanyakan kosakata, kaidah na'at man'ut, atau kalimat tentang alam..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
            >
              <span>Kirim</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
