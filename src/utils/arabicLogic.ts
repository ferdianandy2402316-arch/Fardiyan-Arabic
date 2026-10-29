/**
 * Arabic Learning Pure Logic & Helper Utilities
 * Specialized for Grade 7 MTsN Theme: Keindahan Alam (جمال الطبيعة)
 */

export interface MufrodatItem {
  id: string;
  arabic: string;
  latin: string;
  indonesian: string;
  category: 'gunung' | 'pantai' | 'taman' | 'cuaca' | 'flora';
  gender: 'mudzakkar' | 'muannats';
  plural?: string;
  sampleSentence: string;
  sentenceTranslation: string;
  iconName: string;
}

export interface QuizQuestion {
  id: string;
  questionArabic: string;
  questionIndo: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  topic: 'mufrodat' | 'qawaid' | 'qiraah';
}

/**
 * Validates Na'at and Man'ut agreement:
 * In Arabic grade 7, an adjective (na'at) must match the noun (man'ut) in:
 * 1. Gender (mudzakkar vs muannats)
 * 2. Definiteness (ma'rifah with al- vs nakirah without al-)
 */
export function checkNaatAgreement(
  nounGender: 'mudzakkar' | 'muannats',
  adjGender: 'mudzakkar' | 'muannats',
  nounHasAl: boolean,
  adjHasAl: boolean
): { isValid: boolean; message: string } {
  if (nounGender !== adjGender) {
    return {
      isValid: false,
      message: `Na'at tidak cocok dalam jenis! Isim '${nounGender}' harus disifati dengan na'at '${nounGender}' pula.`,
    };
  }

  if (nounHasAl !== adjHasAl) {
    return {
      isValid: false,
      message: `Na'at tidak cocok dalam ma'rifah/nakirah! Jika isim beralif-lam (ال), maka sifatnya juga wajib ber-alif-lam (ال).`,
    };
  }

  return {
    isValid: true,
    message: "MasyaAllah, susunan Na'at & Man'ut sudah tepat dan selaras!",
  };
}

/**
 * Calculate student score and determine grade praise according to Madrasah standard
 */
export function calculateQuizScore(
  totalQuestions: number,
  correctCount: number
): {
  score: number;
  percentage: number;
  arabicPraise: string;
  indoPraise: string;
  badge: string;
  passed: boolean;
} {
  if (totalQuestions <= 0) {
    return {
      score: 0,
      percentage: 0,
      arabicPraise: 'حَاوِلْ مَرَّةً أُخْرَى',
      indoPraise: 'Ayo coba lagi!',
      badge: 'Pemula',
      passed: false,
    };
  }

  const percentage = Math.round((correctCount / totalQuestions) * 100);

  if (percentage >= 90) {
    return {
      score: percentage,
      percentage,
      arabicPraise: 'مُمْتَازٌ جِدًّا ! (Mumtāz Jiddan)',
      indoPraise: 'Luar Biasa Sempurna! Pemahaman keindahan alam sangat tinggi.',
      badge: 'Bintang Alam (نَجْمُ الطَّبِيْعَةِ)',
      passed: true,
    };
  }

  if (percentage >= 75) {
    return {
      score: percentage,
      percentage,
      arabicPraise: 'جَيِّدٌ جِدًّا ! (Jayyid Jiddan)',
      indoPraise: 'Sangat Bagus! KKM MTsN terlampaui dengan baik.',
      badge: 'Sahabat Alam (صَدِيْقُ الطَّبِيْعَةِ)',
      passed: true,
    };
  }

  if (percentage >= 60) {
    return {
      score: percentage,
      percentage,
      arabicPraise: 'جَيِّدٌ (Jayyid)',
      indoPraise: 'Cukup Baik. Pelajari kembali materi mufrodat & qawaid.',
      badge: 'Penjelajah (الْمُسْتَكْشِفُ)',
      passed: true,
    };
  }

  return {
    score: percentage,
    percentage,
    arabicPraise: 'حَاوِلْ مَرَّةً أُخْرَى بِهِمَّةٍ عَالِيَةٍ !',
    indoPraise: 'Jangan patah semangat! Pelajari kembali kosakata alam.',
    badge: 'Santri Pemula',
    passed: false,
  };
}

/**
 * Filter mufrodat by keyword (supports Arabic, Latin, or Indonesian searching)
 */
export function filterMufrodat(items: MufrodatItem[], keyword: string): MufrodatItem[] {
  const query = keyword.trim().toLowerCase();
  if (!query) return items;

  return items.filter(
    item =>
      item.indonesian.toLowerCase().includes(query) ||
      item.latin.toLowerCase().includes(query) ||
      item.arabic.includes(query)
  );
}
