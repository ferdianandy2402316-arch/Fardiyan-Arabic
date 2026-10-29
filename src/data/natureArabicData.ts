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

export interface HiwarLine {
  speaker: string;
  arabic: string;
  latin: string;
  indonesian: string;
  avatar: string;
}

export interface HiwarItem {
  id: string;
  title: string;
  subtitle: string;
  situation: string;
  lines: HiwarLine[];
}

export interface QawaidLesson {
  id: string;
  title: string;
  summary: string;
  formula: string;
  rules: string[];
  examples: {
    manut: string;
    naat: string;
    combined: string;
    translation: string;
    type: 'Mudzakkar' | 'Mu\'annats';
    explanation: string;
  }[];
}

export interface QiraahItem {
  id: string;
  title: string;
  latinTitle: string;
  paragraphs: {
    arabic: string;
    translation: string;
  }[];
  comprehensionQuestions: {
    questionArabic: string;
    questionIndo: string;
    answer: string;
  }[];
}

export interface QuizQuestionItem {
  id: string;
  questionArabic: string;
  questionIndo: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  topic: 'mufrodat' | 'qawaid' | 'qiraah';
}

export const MUFRODAT_LIST: MufrodatItem[] = [
  {
    id: 'm1',
    arabic: 'جَبَلٌ',
    latin: 'Jabalun',
    indonesian: 'Gunung',
    category: 'gunung',
    gender: 'mudzakkar',
    plural: 'جِبَالٌ (Jibālun)',
    sampleSentence: 'هَذَا جَبَلٌ عَالٍ وَمُرْتَفِعٌ',
    sentenceTranslation: 'Ini adalah gunung yang tinggi dan menjulang.',
    iconName: 'Mountain',
  },
  {
    id: 'm2',
    arabic: 'بَحْرٌ',
    latin: 'Bahrun',
    indonesian: 'Laut',
    category: 'pantai',
    gender: 'mudzakkar',
    plural: 'بِحَارٌ (Bihārun)',
    sampleSentence: 'الْبَحْرُ وَاسِعٌ وَمَاؤُهُ صَافٍ',
    sentenceTranslation: 'Laut itu sangat luas dan airnya jernih.',
    iconName: 'Waves',
  },
  {
    id: 'm3',
    arabic: 'حَدِيْقَةٌ',
    latin: 'Hadīqatun',
    indonesian: 'Taman / Kebun',
    category: 'taman',
    gender: 'muannats',
    plural: 'حَدَائِقُ (Hadā\'iqu)',
    sampleSentence: 'فِي الْمَدْرَسَةِ حَدِيْقَةٌ جَمِيْلَةٌ',
    sentenceTranslation: 'Di sekolah ada taman yang indah.',
    iconName: 'Flower2',
  },
  {
    id: 'm4',
    arabic: 'شَلَّالٌ',
    latin: 'Syallālun',
    indonesian: 'Air Terjun',
    category: 'gunung',
    gender: 'mudzakkar',
    plural: 'شَلَّالَاتٌ (Syallālātun)',
    sampleSentence: 'مَاءُ الشَّلَّالِ بَارِدٌ وَعَذْبٌ',
    sentenceTranslation: 'Air terjun itu terasa dingin dan segar.',
    iconName: 'CloudRain',
  },
  {
    id: 'm5',
    arabic: 'شَاطِئٌ',
    latin: 'Syāthi\'un',
    indonesian: 'Pantai / Pesisir',
    category: 'pantai',
    gender: 'mudzakkar',
    plural: 'شَوَاطِئُ (Syawāthi\'u)',
    sampleSentence: 'نَجْلِسُ عَلَى شَاطِئِ الْبَحْرِ فِي الْمَسَاءِ',
    sentenceTranslation: 'Kita duduk di pantai laut pada waktu sore.',
    iconName: 'SunMedium',
  },
  {
    id: 'm6',
    arabic: 'غَابَةٌ',
    latin: 'Ghābatun',
    indonesian: 'Hutan',
    category: 'gunung',
    gender: 'muannats',
    plural: 'غَابَاتٌ (Ghābātun)',
    sampleSentence: 'الْغَابَةُ كَثِيْفَةٌ بِالْأَشْجَارِ الْخَضْرَاءِ',
    sentenceTranslation: 'Hutan itu lebat dengan pohon-pohon yang hijau.',
    iconName: 'Trees',
  },
  {
    id: 'm7',
    arabic: 'سَمَاءٌ',
    latin: 'Samā\'un',
    indonesian: 'Langit',
    category: 'cuaca',
    gender: 'muannats',
    plural: 'سَمَاوَاتٌ (Samāwātun)',
    sampleSentence: 'السَّمَاءُ زَرْقَاءُ وَصَافِيَةٌ الْيَوْمَ',
    sentenceTranslation: 'Langit biru cerah dan jernih hari ini.',
    iconName: 'CloudSun',
  },
  {
    id: 'm8',
    arabic: 'نَهْرٌ',
    latin: 'Nahrun',
    indonesian: 'Sungai',
    category: 'gunung',
    gender: 'mudzakkar',
    plural: 'أَنْهَارٌ (Anhārun)',
    sampleSentence: 'يَجْرِي النَّهْرُ فِي وَسَطِ الْقَرْيَةِ',
    sentenceTranslation: 'Sungai mengalir di tengah-tengah desa.',
    iconName: 'Compass',
  },
  {
    id: 'm9',
    arabic: 'زَهْرَةٌ',
    latin: 'Zahratun',
    indonesian: 'Bunga',
    category: 'flora',
    gender: 'muannats',
    plural: 'أَزْهَارٌ (Azhārun)',
    sampleSentence: 'هَذِهِ زَهْرَةٌ حَمْرَاءُ وَرَائِحَتُهَا طَيِّبَةٌ',
    sentenceTranslation: 'Ini adalah bunga merah yang aromanya harum.',
    iconName: 'Sparkles',
  },
  {
    id: 'm10',
    arabic: 'مَزْرَعَةٌ',
    latin: 'Mazra\'atun',
    indonesian: 'Sawah / Ladang',
    category: 'taman',
    gender: 'muannats',
    plural: 'مَزَارِعُ (Mazāri\'u)',
    sampleSentence: 'الْمَزْرَعَةُ خَضْرَاءُ وَوَاسِعَةٌ جِدًّا',
    sentenceTranslation: 'Sawah itu hijau dan sangat luas membentang.',
    iconName: 'TreePine',
  },
  {
    id: 'm11',
    arabic: 'شَمْسٌ',
    latin: 'Syamsun',
    indonesian: 'Matahari',
    category: 'cuaca',
    gender: 'muannats',
    plural: 'شُمُوْسٌ',
    sampleSentence: 'تَشْرُقُ الشَّمْسُ فِي الصَّبَاحِ الْبَاكِرِ',
    sentenceTranslation: 'Matahari terbit di pagi yang dini berseri.',
    iconName: 'Sun',
  },
  {
    id: 'm12',
    arabic: 'قَمَرٌ',
    latin: 'Qamarun',
    indonesian: 'Bulan',
    category: 'cuaca',
    gender: 'mudzakkar',
    plural: 'أَقْمَارٌ',
    sampleSentence: 'الْقَمَرُ مُنِيْرٌ فِي اللَّيْلَةِ الْمُظْلِمَةِ',
    sentenceTranslation: 'Bulan bersinar terang di malam yang gelap.',
    iconName: 'Moon',
  },
];

export const HIWAR_LIST: HiwarItem[] = [
  {
    id: 'h1',
    title: 'الرِّحْلَةُ إِلَى جَبَلِ بُرُوْمُوْ',
    subtitle: 'Tamasya Menikmati Gunung Bromo',
    situation: 'Dua siswa kelas 7 MTsN, Hasan dan Ahmad, sedang berbincang tentang liburan tadabbur alam ke Gunung Bromo.',
    lines: [
      {
        speaker: 'حَسَن (Hasan)',
        arabic: 'السَّلَامُ عَلَيْكُمْ يَا أَحْمَد، أَيْنَ ذَهَبْتَ فِي عُطْلَةِ الْأُسْبُوْعِ؟',
        latin: 'Assalāmu \'alaikum yā Ahmad, aina dzahabta fī \'uthlatil usbū\'?',
        indonesian: 'Assalamu\'alaikum wahai Ahmad, ke mana kamu pergi di liburan akhir pekan?',
        avatar: '👨‍🎓',
      },
      {
        speaker: 'أَحْمَد (Ahmad)',
        arabic: 'وَعَلَيْكُمُ السَّلَام. ذَهَبْتُ مَعَ أُسْرَتِي إِلَى جَبَلِ بُرُوْمُوْ.',
        latin: 'Wa \'alaikumussalām. Dzahabtu ma\'a usratī ilā jabali Burūmū.',
        indonesian: 'Wa\'alaikumsalam. Aku pergi bersama keluargaku ke Gunung Bromo.',
        avatar: '🎒',
      },
      {
        speaker: 'حَسَن (Hasan)',
        arabic: 'مَا شَاءَ الله! كَيْفَ الْمَنْظَرُ هُنَاكَ؟',
        latin: 'Mā syā\'Allāh! Kaifal mandzaru hunāk?',
        indonesian: 'MasyaAllah! Bagaimana pemandangan di sana?',
        avatar: '👨‍🎓',
      },
      {
        speaker: 'أَحْمَد (Ahmad)',
        arabic: 'الْمَنْظَرُ هُنَاكَ جَمِيْلٌ جِدًّا، وَالْهَوَاءُ نَقِيٌّ وَبَارِدٌ.',
        latin: 'Al-mandzaru hunāka jamīlun jiddan, wal-hawā\'u naqiyyun wa bāridun.',
        indonesian: 'Pemandangannya sangat indah, dan udaranya murni serta sejuk.',
        avatar: '🎒',
      },
      {
        speaker: 'حَسَن (Hasan)',
        arabic: 'سُبْحَانَ اللهِ الْخَالِقِ! هَلْ شَاهَدْتَ طُلُوْعَ الشَّمْسِ؟',
        latin: 'Subhānallāhil khāliq! Hal syāhadta thulū\'asy-syamsi?',
        indonesian: 'Mahasuci Allah Sang Pencipta! Apakah kamu menyaksikan terbitnya matahari?',
        avatar: '👨‍🎓',
      },
      {
        speaker: 'أَحْمَد (Ahmad)',
        arabic: 'نَعَمْ، شَاهَدْتُ طُلُوْعَ الشَّمْسِ، كَانَتِ السَّمَاءُ حَمْرَاءَ جَمِيْلَةً!',
        latin: 'Na\'am, syāhadtu thulū\'asy-syamsi, kānatissamā\'u hamrā\'a jamīlah!',
        indonesian: 'Ya, aku menyaksikan matahari terbit, langit tampak kemerahan yang begitu elok!',
        avatar: '🎒',
      },
    ],
  },
  {
    id: 'h2',
    title: 'عَلَى شَاطِئِ الْبَحْرِ',
    subtitle: 'Di Pesisir Pantai yang Asri',
    situation: 'Fatimah dan Aisyah mengagumi keindahan laut ciptaan Allah SWT.',
    lines: [
      {
        speaker: 'فَاطِمَة (Fatimah)',
        arabic: 'انْظُرِي يَا عَائِشَة، هَذَا بَحْرٌ وَاسِعٌ كَبِيْرٌ!',
        latin: 'Undzurī yā \'Ā\'isyah, hādzā bahrun wāsi\'un kabīr!',
        indonesian: 'Lihatlah wahai Aisyah, ini laut yang sangat luas dan besar!',
        avatar: '🧕',
      },
      {
        speaker: 'عَائِشَة (Aisyah)',
        arabic: 'نَعَمْ، وَالْأَمْوَاجُ عَالِيَةٌ، وَالشَّاطِئُ نَظِيْفٌ جِدًّا.',
        latin: 'Na\'am, wal-amwāju \'āliyah, wasy-syāthi\'u nadzīfun jiddan.',
        indonesian: 'Ya, ombaknya berdebur tinggi, dan pantainya sangat bersih.',
        avatar: '🌸',
      },
      {
        speaker: 'فَاطِمَة (Fatimah)',
        arabic: 'وَهُنَاكَ أَشْجَارُ جَوْزِ الْهِنْدِ الطَّوِيْلَةُ عَلَى الشَّاطِئِ.',
        latin: 'Wa hunāka asyjāru jauzil hindith-thawīlah \'alasy-syāthi\'.',
        indonesian: 'Dan di sana ada pohon-pohon kelapa yang tinggi di sepanjang pantai.',
        avatar: '🧕',
      },
      {
        speaker: 'عَائِشَة (Aisyah)',
        arabic: 'سُبْحَانَ مَنْ خَلَقَ هَذَا الْجَمَالَ لَنَا!',
        latin: 'Subhāna man khalaqa hādzal jamāla lanā!',
        indonesian: 'Mahasuci Dzat yang menciptakan keindahan ini untuk kita!',
        avatar: '🌸',
      },
    ],
  },
];

export const QAWAID_LESSON: QawaidLesson = {
  id: 'qawaid-naat',
  title: 'النَّعْتُ وَالْمَنْعُوْتُ (Na\'at & Man\'ut)',
  summary: 'Kaidah pensifatan kata dalam bahasa Arab kelas 7 MTs: Kata sifat (Na\'at) wajib mengikuti kata yang disifati (Man\'ut) dalam jenis (Mudzakkar/Muannats) dan ketentuannya (Ma\'rifah/Nakirah).',
  formula: 'مَنْعُوْتٌ (Benda yang disifati) + نَعْتٌ (Kata Sifat)',
  rules: [
    'Jika Man\'ut berupa Mudzakkar (laki-laki/tanpa ta marbuthah), maka Na\'at juga harus Mudzakkar. Contoh: جَبَلٌ عَالٍ (Gunung yang tinggi).',
    'Jika Man\'ut berupa Mu\'annats (perempuan/memiliki ta marbuthah ة), maka Na\'at wajib ber-ta marbuthah (Mu\'annats). Contoh: حَدِيْقَةٌ جَمِيْلَةٌ (Taman yang indah).',
    'Jika Man\'ut bertanwin (Nakirah/umum), Na\'at juga bertanwin: بَحْرٌ وَاسِعٌ.',
    'Jika Man\'ut ber-alif lam (ال / Ma\'rifah), Na\'at juga wajib ber-alif lam: الْبَحْرُ الْوَاسِعُ (Laut yang luas itu).',
    'Isim Isyarah yang mendahului: هَذَا جَبَلٌ مُرْتَفِعٌ (Ini gunung yang tinggi) VS هَذِهِ حَدِيْقَةٌ مُزْهِرَةٌ (Ini taman yang berbunga).',
  ],
  examples: [
    {
      manut: 'جَبَلٌ (Jabalun)',
      naat: 'عَالٍ (Aalin)',
      combined: 'جَبَلٌ عَالٍ',
      translation: 'Gunung yang tinggi',
      type: 'Mudzakkar',
      explanation: 'Keduanya mudzakkar dan nakirah (bertanwin).',
    },
    {
      manut: 'حَدِيْقَةٌ (Hadīqatun)',
      naat: 'جَمِيْلَةٌ (Jamīlatun)',
      combined: 'حَدِيْقَةٌ جَمِيْلَةٌ',
      translation: 'Taman yang indah',
      type: 'Mu\'annats',
      explanation: 'Keduanya mu\'annats karena memiliki tā\' marbūthah (ة).',
    },
    {
      manut: 'الْبَحْرُ (Al-Bahru)',
      naat: 'الْوَاسِعُ (Al-Wāsi\'u)',
      combined: 'الْبَحْرُ الْوَاسِعُ',
      translation: 'Laut yang luas itu',
      type: 'Mudzakkar',
      explanation: 'Keduanya ma\'rifah karena diawali alif-lām (ال).',
    },
    {
      manut: 'سَمَاءٌ (Samā\'un)',
      naat: 'صَافِيَةٌ (Shāfiyatun)',
      combined: 'سَمَاءٌ صَافِيَةٌ',
      translation: 'Langit yang cerah',
      type: 'Mu\'annats',
      explanation: 'Kata samā\' termasuk muannats majazi (maknawi), maka na\'atnya memakai ta marbuthah.',
    },
    {
      manut: 'شَلَّالٌ (Syallālun)',
      naat: 'بَارِدٌ (Bāridun)',
      combined: 'شَلَّالٌ بَارِدٌ',
      translation: 'Air terjun yang dingin/sejuk',
      type: 'Mudzakkar',
      explanation: 'Keduanya isim mudzakkar nakirah.',
    },
  ],
};

export const QIRAAH_ITEM: QiraahItem = {
  id: 'qiraah-1',
  title: 'جَمَالُ الطَّبِيْعَةِ فِي إِنْدُوْنِيْسِيَا',
  latinTitle: 'Jamāl aṭ-Ṭabī\'ati fī Indūnīsiyā',
  paragraphs: [
    {
      arabic: 'إِنْدُوْنِيْسِيَا بَلَدٌ جَمِيْلٌ وَوَاسِعٌ. فِيْهَا مَنَاظِرُ طَبِيْعِيَّةٌ رَائِعَةٌ وَكَثِيْرَةٌ، مِثْلُ الْجِبَالِ الْعَالِيَةِ، وَالْبِحَارِ الْوَاسِعَةِ، وَالْغَابَاتِ الْخَضْرَاءِ، وَالشَّلَّالَاتِ الْعَذْبَةِ.',
      translation: 'Indonesia adalah negeri yang elok dan luas. Di dalamnya terdapat pemandangan alam yang menakjubkan dan beraneka ragam, seperti gunung-gunung yang tinggi, lautan yang luas, hutan-hutan yang hijau, serta air terjun yang segar.',
    },
    {
      arabic: 'فِي يَوْمِ الْعُطْلَةِ، يَذْهَبُ التَّلَامِيْذُ مَعَ أُسْرَتِهِمْ إِلَى شَاطِئِ الْبَحْرِ أَوْ إِلَى حَدِيْقَةِ الْأَزْهَارِ. هُمْ يَتَنَفَّسُوْنَ الْهَوَاءَ النَّقِيَّ وَيَشْكُرُوْنَ اللهَ تَعَالَى عَلَى نِعَمِهِ الْعَظِيْمَةِ.',
      translation: 'Pada hari libur, para siswa pergi bersama keluarga mereka ke pantai laut atau ke taman bunga. Mereka menghirup udara yang bersih murni dan bersyukur kepada Allah Ta\'ala atas nikmat-nikmat-Nya yang agung.',
    },
    {
      arabic: 'قَالَ اللهُ تَعَالَى: ﴿أَفَلَا يَنْظُرُوْنَ إِلَى الْإِبِلِ كَيْفَ خُلِقَتْ، وَإِلَى السَّمَاءِ كَيْفَ رُفِعَتْ، وَإِلَى الْجِبَالِ كَيْفَ نُصِبَتْ﴾. سُبْحَانَ اللهِ رَبِّ الْعَالَمِيْنَ.',
      translation: 'Allah Ta\'ala berfirman: "Maka tidakkah mereka memperhatikan unta bagaimana ia diciptakan, dan langit bagaimana ia ditinggikan, dan gunung-gunung bagaimana ia ditegakkan?" Mahasuci Allah Tuhan semesta alam.',
    },
  ],
  comprehensionQuestions: [
    {
      questionArabic: 'كَيْفَ هِيَ طَبِيْعَةُ إِنْدُوْنِيْسِيَا؟',
      questionIndo: 'Bagaimana alam negara Indonesia?',
      answer: 'إِنْدُوْنِيْسِيَا بَلَدٌ جَمِيْلٌ وَوَاسِعٌ فِيْهَا مَنَاظِرُ طَبِيْعِيَّةٌ رَائِعَةٌ (Indonesia indah dan luas memiliki pemandangan menakjubkan).',
    },
    {
      questionArabic: 'أَيْنَ يَذْهَبُ التَّلَامِيْذُ فِي يَوْمِ الْعُطْلَةِ؟',
      questionIndo: 'Ke mana siswa pergi di hari libur?',
      answer: 'يَذْهَبُ التَّلَامِيْذُ إِلَى شَاطِئِ الْبَحْرِ أَوْ إِلَى حَدِيْقَةِ الْأَزْهَارِ (Ke pantai laut atau taman bunga).',
    },
    {
      questionArabic: 'مَاذَا يَتَنَفَّسُ التَّلَامِيْذُ فِي الطَّبِيْعَةِ؟',
      questionIndo: 'Apa yang dihirup oleh para siswa di alam?',
      answer: 'يَتَنَفَّسُوْنَ الْهَوَاءَ النَّقِيَّ (Mereka menghirup udara yang bersih dan segar).',
    },
  ],
};

export const QUIZ_BANK: QuizQuestionItem[] = [
  {
    id: 'q1',
    questionArabic: 'مَا مَعْنَى كَلِمَة "جَبَلٌ" بِاللُّغَةِ الْإِنْدُوْنِيْسِيَّةِ؟',
    questionIndo: 'Apa arti kata "جَبَلٌ" dalam bahasa Indonesia?',
    options: ['Gunung', 'Lautan', 'Air Terjun', 'Hutan'],
    correctAnswerIndex: 0,
    explanation: 'جَبَلٌ (Jabalun) artinya gunung. Jamaknya adalah جِبَالٌ (Jibaalun).',
    topic: 'mufrodat',
  },
  {
    id: 'q2',
    questionArabic: 'اخْتَرْ نَعْتًا مُنَاسِبًا: "هَذِهِ حَدِيْقَةٌ ..."',
    questionIndo: 'Pilihlah Na\'at yang tepat untuk menyempurnakan kalimat: "هَذِهِ حَدِيْقَةٌ ..."',
    options: ['جَمِيْلٌ', 'جَمِيْلَةٌ', 'مُرْتَفِعٌ', 'وَاسِعٌ'],
    correctAnswerIndex: 1,
    explanation: 'Kata حَدِيْقَةٌ adalah Mu\'annats (ada ta marbuthah), maka na\'atnya juga harus mu\'annats yaitu جَمِيْلَةٌ.',
    topic: 'qawaid',
  },
  {
    id: 'q3',
    questionArabic: 'كَلِمَة "بَحْرٌ" تَدُلُّ عَلَى الْمُذَكَّرِ، فَالنَّعْتُ الصَّحِيْحُ لَهَا هُوَ:',
    questionIndo: 'Kata "بَحْرٌ" adalah Mudzakkar, maka Na\'at yang benar untuknya adalah:',
    options: ['وَاسِعَةٌ', 'وَاسِعٌ', 'كَبِيْرَةٌ', 'جَمِيْلَةٌ'],
    correctAnswerIndex: 1,
    explanation: 'Karena بَحْرٌ adalah mudzakkar, maka na\'atnya juga harus mudzakkar tanpa ta marbuthah, yaitu وَاسِعٌ.',
    topic: 'qawaid',
  },
  {
    id: 'q4',
    questionArabic: 'مَا مَعْنَى "شَلَّالٌ" فِي دَرْسِ جَمَالِ الطَّبِيْعَةِ؟',
    questionIndo: 'Apakah arti kata "شَلَّالٌ" dalam tema keindahan alam?',
    options: ['Sawah', 'Danau', 'Air Terjun', 'Langit'],
    correctAnswerIndex: 2,
    explanation: 'شَلَّالٌ (Syallaalun) artinya air terjun.',
    topic: 'mufrodat',
  },
  {
    id: 'q5',
    questionArabic: 'إِذَا كَانَ الْمَنْعُوْتُ فِيهِ (ال)، مِثْلَ "الْبَحْرُ"، فَمَا هُوَ النَّعْتُ الْمُطَابِقُ؟',
    questionIndo: 'Jika Man\'ut diawali Alif-Lam seperti "الْبَحْرُ", maka Na\'at yang selaras adalah:',
    options: ['وَاسِعٌ', 'الْوَاسِعُ', 'الْوَاسِعَةُ', 'وَاسِعَةٌ'],
    correctAnswerIndex: 1,
    explanation: 'Na\'at harus mengikuti Man\'ut dalam ma\'rifah (ال). Karena mudzakkar dan ber-alif lam, maka pasangannya adalah الْوَاسِعُ.',
    topic: 'qawaid',
  },
  {
    id: 'q6',
    questionArabic: 'أَيْنَ تَجِدُ أَشْجَارَ جَوْزِ الْهِنْدِ وَالْأَمْوَاجَ؟',
    questionIndo: 'Di manakah kita biasanya menjumpai pohon kelapa dan ombak?',
    options: ['عَلَى شَاطِئِ الْبَحْرِ', 'فِي وَسَطِ السَّمَاءِ', 'فِي الْفَصْلِ', 'فِي الْمَطْبَخِ'],
    correctAnswerIndex: 0,
    explanation: 'Pohon kelapa dan deburan ombak berada di عَلَى شَاطِئِ الْبَحْرِ (di pesisir pantai).',
    topic: 'qiraah',
  },
  {
    id: 'q7',
    questionArabic: 'مَا مُفْرَدُ كَلِمَة "أَزْهَارٌ"؟',
    questionIndo: 'Apakah bentuk tunggal (mufrod) dari kata jamak "أَزْهَارٌ" (bunga-bunga)?',
    options: ['زَهْرَةٌ', 'شَجَرَةٌ', 'حَدِيْقَةٌ', 'غَابَةٌ'],
    correctAnswerIndex: 0,
    explanation: 'Tunggalnya adalah زَهْرَةٌ (zahratun = sekuntum bunga), jamaknya أَزْهَارٌ.',
    topic: 'mufrodat',
  },
  {
    id: 'q8',
    questionArabic: 'عَبَّرَ الْقُرْآنُ عَنِ التَّفَكُّرِ فِي ارْتِفَاعِ السَّمَاءِ وَنَصْبِ الْجِبَالِ فِي سُوْرَةِ:',
    questionIndo: 'Ayat tadabbur alam "Dan langit bagaimana ditinggikan, gunung ditegakkan" terdapat dalam surah:',
    options: ['سُوْرَةُ الْفَاتِحَة', 'سُوْرَةُ الْغَاشِيَة', 'سُوْرَةُ النَّاس', 'سُوْرَةُ الْإِخْلَاص'],
    correctAnswerIndex: 1,
    explanation: 'Terdapat dalam QS. Al-Ghasyiyah ayat 17-20.',
    topic: 'qiraah',
  },
  {
    id: 'q9',
    questionArabic: 'مَا مَعْنَى "مَزْرَعَةٌ خَضْرَاءُ"؟',
    questionIndo: 'Apakah terjemahan frasa "مَزْرَعَةٌ خَضْرَاءُ"?',
    options: ['Sawah yang hijau', 'Gunung yang tinggi', 'Sungai yang dalam', 'Pantai yang indah'],
    correctAnswerIndex: 0,
    explanation: 'مَزْرَعَةٌ artinya sawah/ladang, خَضْرَاءُ artinya hijau (muannats dari أَخْضَرُ).',
    topic: 'mufrodat',
  },
  {
    id: 'q10',
    questionArabic: 'اخْتَرْ تَرْكِيْبًا صَحِيْحًا لِـ (النَّعْتِ وَالْمَنْعُوْتِ):',
    questionIndo: 'Pilihlah susunan Na\'at & Man\'ut yang paling tepat kaidahnya:',
    options: [
      'جَبَلٌ عَالِيَةٌ',
      'حَدِيْقَةٌ جَمِيْلٌ',
      'الْغَابَةُ الْكَثِيْفَةُ',
      'بَحْرٌ الْوَاسِعُ',
    ],
    correctAnswerIndex: 2,
    explanation: 'الْغَابَةُ الْكَثِيْفَةُ keduanya sama-sama ber-alif lam dan sama-sama mu\'annats.',
    topic: 'qawaid',
  },
];

/**
 * Text-to-speech helper with fallback
 */
export function playArabicAudio(text: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-SA';
  utterance.rate = 0.85; // Slightly slower for language learners

  // Pick Arabic voice if available
  const voices = window.speechSynthesis.getVoices();
  const arVoice = voices.find(v => v.lang.startsWith('ar'));
  if (arVoice) {
    utterance.voice = arVoice;
  }

  window.speechSynthesis.speak(utterance);
}
