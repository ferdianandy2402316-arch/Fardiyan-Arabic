import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { QUIZ_BANK, QuizQuestionItem, playArabicAudio } from '../data/natureArabicData';
import { calculateQuizScore } from '../utils/arabicLogic';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import {
  Award,
  HelpCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Volume2,
  Trophy,
  History,
  Sparkles,
} from 'lucide-react';

export const QuizView: React.FC = () => {
  const { user, firebaseUser, addPoints } = useAuth();
  const [questions, setQuestions] = useState<QuizQuestionItem[]>(QUIZ_BANK);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [savedQuizHistory, setSavedQuizHistory] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch student's previous quiz history
  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      try {
        if (firebaseUser) {
          const path = `users/${user.uid}/quizResults`;
          const q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(5));
          const snap = await getDocs(q);
          const historyList: any[] = [];
          snap.forEach((doc) => {
            historyList.push({ id: doc.id, ...doc.data() });
          });
          setSavedQuizHistory(historyList);
        } else {
          // Check local storage for guest
          const localHistory = localStorage.getItem(`arabiyah_quiz_${user.uid}`);
          if (localHistory) {
            setSavedQuizHistory(JSON.parse(localHistory));
          }
        }
      } catch (err) {
        console.warn('Could not load quiz history:', err);
      }
    };

    fetchHistory();
  }, [user, firebaseUser]);

  const currentQ = questions[currentIndex];
  const userSelectedOption = selectedAnswers[currentIndex];
  const hasSubmittedCurrent = Boolean(isAnswerSubmitted[currentIndex]);

  const handleSelectOption = (optIndex: number) => {
    if (hasSubmittedCurrent) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optIndex,
    }));
  };

  const handleCheckCurrentAnswer = () => {
    if (userSelectedOption === undefined) return;
    setIsAnswerSubmitted((prev) => ({
      ...prev,
      [currentIndex]: true,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const finishQuiz = async () => {
    setIsFinished(true);

    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const scoreResult = calculateQuizScore(questions.length, correctCount);

    // Trigger confetti if high score
    if (scoreResult.percentage >= 75) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    // Award bonus points based on score
    addPoints(scoreResult.score);

    // Save to Firestore per user
    if (user) {
      setIsSaving(true);
      const quizRecord = {
        userId: user.uid,
        quizTitle: 'Kuis Keindahan Alam Kelas 7 MTsN',
        score: scoreResult.score,
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        badge: scoreResult.badge,
        createdAt: new Date().toISOString(),
      };

      try {
        if (firebaseUser) {
          const path = `users/${user.uid}/quizResults`;
          try {
            await addDoc(collection(db, path), quizRecord);
          } catch (err) {
            handleFirestoreError(err, OperationType.CREATE, path);
          }
        } else {
          // Local storage for guest
          const updated = [quizRecord, ...savedQuizHistory].slice(0, 5);
          localStorage.setItem(`arabiyah_quiz_${user.uid}`, JSON.stringify(updated));
        }
        setSavedQuizHistory((prev) => [quizRecord, ...prev].slice(0, 5));
      } catch (err) {
        console.error('Error saving quiz record:', err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleRestartQuiz = () => {
    setSelectedAnswers({});
    setIsAnswerSubmitted({});
    setCurrentIndex(0);
    setIsFinished(false);
  };

  // Calculate current score summary
  let correctCount = 0;
  questions.forEach((q, idx) => {
    if (selectedAnswers[idx] === q.correctAnswerIndex) {
      correctCount++;
    }
  });
  const finalSummary = calculateQuizScore(questions.length, correctCount);

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-linear-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-2 inline-block">
            Modul 5: Uji Pemahaman Santri
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-1 font-['Cairo',sans-serif]">
            اخْتِبَارُ جَمَالِ الطَّبِيْعَةِ
          </h2>
          <p className="text-emerald-100 text-sm">
            Kuis Evaluasi Keindahan Alam: 10 Soal Mufrodat, Kaidah Na'at Man'ut, dan Pemahaman Bacaan.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-center">
          <span className="text-[11px] text-emerald-200 block font-medium">Nilai KKM MTsN:</span>
          <span className="text-lg font-extrabold text-amber-300">75 (Jayyid)</span>
        </div>
      </div>

      {!isFinished ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-700" />
              <span className="font-bold text-slate-800 text-sm">
                Soal {currentIndex + 1} dari {questions.length}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <span className="capitalize px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Topik: {currentQ.topic}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Box */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700">
                {currentQ.questionIndo}
              </span>
              <button
                onClick={() => playArabicAudio(currentQ.questionArabic)}
                title="Dengarkan soal"
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 flex items-center justify-center cursor-pointer shadow-xs"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="text-right py-2">
              <p className="font-['Amiri',serif] text-2xl sm:text-3xl font-bold text-slate-900 leading-relaxed">
                {currentQ.questionArabic}
              </p>
            </div>
          </div>

          {/* Options */}
          <div className="grid sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = userSelectedOption === optIdx;
              const isCorrectAnswer = optIdx === currentQ.correctAnswerIndex;

              let btnClass = 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300';
              if (isSelected && !hasSubmittedCurrent) {
                btnClass = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20';
              }
              if (hasSubmittedCurrent) {
                if (isCorrectAnswer) {
                  btnClass = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold';
                } else if (isSelected && !isCorrectAnswer) {
                  btnClass = 'bg-rose-50 border-rose-400 text-rose-900';
                } else {
                  btnClass = 'opacity-60 bg-slate-50 border-slate-200 text-slate-500';
                }
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={hasSubmittedCurrent}
                  className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${btnClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="font-['Amiri',serif] text-lg font-bold">
                      {opt}
                    </span>
                  </div>

                  {hasSubmittedCurrent && isCorrectAnswer && (
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {hasSubmittedCurrent && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation if submitted */}
          {hasSubmittedCurrent && (
            <div
              className={`p-4 rounded-2xl border text-xs space-y-1 ${
                userSelectedOption === currentQ.correctAnswerIndex
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                {userSelectedOption === currentQ.correctAnswerIndex ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Jawaban Anda Tepat (Shahih)!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-amber-600" />
                    <span>Jawaban Belum Tepat</span>
                  </>
                )}
              </div>
              <p className="leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Nav Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              ← Soal Sebelumnya
            </button>

            {!hasSubmittedCurrent ? (
              <button
                onClick={handleCheckCurrentAnswer}
                disabled={userSelectedOption === undefined}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs disabled:opacity-50 cursor-pointer"
              >
                Kunci & Cek Jawaban
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                {currentIndex < questions.length - 1 ? 'Soal Berikutnya →' : 'Lihat Hasil Kuis 🏆'}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* FINISHED QUIZ RESULTS */
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
              Hasil Evaluasi Belajar
            </span>
            <h3 className="text-3xl font-extrabold text-slate-900 font-['Cairo',sans-serif]">
              {finalSummary.arabicPraise}
            </h3>
            <p className="text-slate-600 text-sm mt-1">{finalSummary.indoPraise}</p>
          </div>

          {/* Score Badge */}
          <div className="max-w-xs mx-auto p-5 bg-emerald-50 rounded-3xl border border-emerald-200 space-y-2">
            <span className="text-slate-500 text-xs font-medium">Skor Akhir:</span>
            <div className="text-5xl font-black text-emerald-800 tracking-tight">
              {finalSummary.score}
              <span className="text-xl text-slate-400 font-normal"> / 100</span>
            </div>
            <div className="text-xs text-slate-600 pt-1 border-t border-emerald-200">
              Benar: <strong className="text-emerald-700">{correctCount}</strong> dari{' '}
              <strong>{questions.length}</strong> soal
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700 text-white text-xs font-bold mt-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{finalSummary.badge}</span>
            </div>
          </div>

          {isSaving && (
            <p className="text-xs text-slate-400">
              Menyimpan data hasil kuis ke database Firestore...
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={handleRestartQuiz}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi Kuis</span>
            </button>
          </div>
        </div>
      )}

      {/* Quiz History per User */}
      {savedQuizHistory.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <History className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-slate-800 text-sm">
              Riwayat Nilai Santri di Firestore
            </h3>
          </div>

          <div className="space-y-2">
            {savedQuizHistory.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-slate-800">{item.quizTitle}</p>
                  <span className="text-[11px] text-slate-500">
                    {new Date(item.createdAt).toLocaleDateString('id-ID', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                    {item.score} / 100
                  </span>
                  <span className="hidden sm:inline text-xs text-slate-600 font-medium">
                    {item.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
