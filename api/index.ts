import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION_ARABIC_TUTOR = `
Anda adalah "Ustadz Al-Bi'ah", seorang guru Bahasa Arab yang ramah, sabar, dan ahli untuk siswa kelas 7 MTsN (Madrasah Tsanawiyah Negeri).
Fokus pembelajaran adalah Tema "Keindahan Alam" (جمال الطبيعة - Jamāl aṭ-Ṭabī'ah) sesuai kurikulum Bahasa Arab MTs Kelas 7 (KMA 183 / Kurikulum Merdeka).

Topik pembelajaran utama mencakup:
1. Mufrodat Alam (جَبَلٌ gunung, بَحْرٌ laut, حَدِيْقَةٌ taman, شَلَّالٌ air terjun, شَاطِئٌ pantai, غَابَةٌ hutan, سَمَاءٌ langit, زَهْرَةٌ bunga, نَهْرٌ sungai, مَزْرَعَةٌ sawah, شَمْسٌ matahari, قَمَرٌ bulan, dsb).
2. Qawa'id / Tata Bahasa Kelas 7:
   - Na'at & Man'ut (النَّعْتُ وَالْمَنْعُوْتُ), contoh: جَبَلٌ عَالٍ / الْجَبَلُ الْعَالِي (gunung yang tinggi), حَدِيْقَةٌ جَمِيْلَةٌ (taman yang indah). Ingat kesesuaian mudzakkar/muannats dan ma'rifah/nakirah!
   - Isim Isyarah (هَذَا / هَذِهِ / ذَلِكَ / تِلْكَ) bersama mufrodat alam.
   - Mubtada' Mu'akhkhar + Khobar Muqaddam: فِي الْحَدِيْقَةِ أَزْهَارٌ مُتَنَوِّعَةٌ.
3. Percakapan (Hiwar) tentang tadabbur alam dan rekreasi (rihlah).

Pedoman Jawaban:
- Selalu berikan teks Arab DENGAN HARAKAT LENGKAP agar mudah dibaca siswa MTs pemula.
- Sertakan cara baca latin dan artinya dalam bahasa Indonesia.
- Berikan motivasi islami dan tadabbur keindahan alam sebagai ciptaan Allah SWT.
- Gunakan bahasa yang mudah dipahami anak usia 12-14 tahun.
`;

// Helper router to handle both /api/* and /* paths cleanly
const router = express.Router();

router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: "Arabiyah Al-Bi'ah Backend",
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(apiKey),
  });
});

// Admin verification endpoint for user: Ferdi, pw: Ferdi123
router.post('/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body || {};
  if (username === 'Ferdi' && password === 'Ferdi123') {
    return res.json({
      success: true,
      user: {
        uid: 'admin-ferdi-mtsn',
        email: 'ferdi@mtsn.sch.id',
        displayName: 'Ferdi (Admin Pengajar MTsN)',
        role: 'admin',
        photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=FerdiAdmin',
      },
      token: 'admin-session-ferdi-mtsn-valid',
    });
  }
  return res.status(401).json({
    success: false,
    message: 'Username atau password admin salah!',
  });
});

// AI Chat endpoint
router.post('/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Pesan tidak boleh kosong' });
    }

    if (!apiKey) {
      return res.json({
        reply: `مَرْحَبًا بِكَ! (Selamat datang!) Maaf, kunci API Gemini belum dikonfigurasi di lingkungan server. Namun silakan pelajari kosakata alam berikut: جَبَلٌ (gunung), بَحْرٌ (laut), حَدِيْقَةٌ (taman yang asri).`,
      });
    }

    // Format chat context if history is provided
    let prompt = `Pertanyaan/Pesan Siswa: ${message}`;
    if (Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-4).map((h: { sender: string; text: string }) => `${h.sender}: ${h.text}`).join('\n');
      prompt = `Riwayat percakapan sebelumnya:\n${recentHistory}\n\nPertanyaan siswa sekarang: ${message}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_ARABIC_TUTOR,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Maaf, saya tidak dapat merespons saat ini.';
    return res.json({ reply });
  } catch (error) {
    console.error('Gemini Chat Error:', error);
    return res.status(500).json({
      error: 'Gagal menghubungi asisten AI',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Check sentence endpoint (Tarkib & Qawa'id evaluation)
router.post('/gemini/check-sentence', async (req: Request, res: Response) => {
  try {
    const { sentence } = req.body || {};
    if (!sentence || typeof sentence !== 'string') {
      return res.status(400).json({ error: 'Kalimat tidak boleh kosong' });
    }

    if (!apiKey) {
      return res.json({
        original: sentence,
        corrected: sentence,
        isCorrect: true,
        analysis: 'API Gemini belum aktif. Kalimat Anda sudah disimpan.',
        feedback: 'Teruslah berlatih menulis kalimat bahasa Arab bertema alam!',
      });
    }

    const prompt = `Periksalah kalimat bahasa Arab buatan siswa kelas 7 MTsN bertema Keindahan Alam berikut:
"${sentence}"

Analisis kesesuaian tata bahasa (khususnya Na'at & Man'ut, Isim Isyarah, Mudzakkar/Mu'annats).
Formatkan jawaban dalam JSON valid dengan properti:
{
  "original": "${sentence}",
  "corrected": "Kalimat yang telah dibenahi dengan harakat lengkap",
  "transliteration": "Cara membaca latin",
  "translation": "Arti bahasa Indonesia",
  "isCorrect": boolean (true jika sudah tepat atau hampir tepat),
  "ruleExplanation": "Penjelasan kaidah tata bahasa (misal: na'at harus mengikuti man'ut dalam jenis kelamin mudzakkar/muannats)",
  "encouragement": "Pujian atau kata-kata penyemangat santun"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error) {
    console.error('Check Sentence Error:', error);
    return res.status(500).json({
      error: 'Gagal memeriksa kalimat',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Explain tashkeel & mufrodat endpoint
router.post('/gemini/explain-tashkeel', async (req: Request, res: Response) => {
  try {
    const { word } = req.body || {};
    if (!word || typeof word !== 'string') {
      return res.status(400).json({ error: 'Kata tidak boleh kosong' });
    }

    if (!apiKey) {
      return res.json({
        word,
        harakat: word,
        meaning: 'Kosakata keindahan alam',
        exampleSentence: `هَذَا ${word} جَمِيْلٌ`,
        exampleTranslation: `Ini adalah ${word} yang indah`,
      });
    }

    const prompt = `Jelaskan kata atau frasa bahasa Arab tentang keindahan alam berikut untuk siswa kelas 7 MTsN:
"${word}"

Berikan harakat lengkap, arti harfiah, bentuk jamak/mufrod jika ada, dan contoh kalimat sederhana na'at man'ut.
Formatkan dalam JSON valid:
{
  "word": "${word}",
  "withHarakat": "Kata berharakat lengkap",
  "latin": "Cara baca latin",
  "meaning": "Arti bahasa Indonesia",
  "type": "Isim Mufrod / Isim Jamak / Fi'il",
  "pluralOrSingular": "Bentuk jamak atau mufradnya bila ada",
  "exampleSentence": "Contoh kalimat berharakat lengkap",
  "exampleTranslation": "Arti contoh kalimat",
  "tip": "Tips mengingat atau tadabbur"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    console.error('Explain Tashkeel Error:', error);
    return res.status(500).json({
      error: 'Gagal menjelaskan kata',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Generate Quiz Questions endpoint
router.post('/gemini/generate-quiz', async (req: Request, res: Response) => {
  try {
    const { topic = 'Keindahan Alam (جمال الطبيعة)', count = 5 } = req.body || {};

    if (!apiKey) {
      return res.json({
        questions: [
          {
            id: 'demo-1',
            question: 'مَا مَعْنَى كَلِمَة "جَبَلٌ" ؟',
            questionIndo: 'Apa arti kata "جَبَلٌ" ?',
            options: ['Gunung', 'Laut', 'Sungai', 'Hutan'],
            correctIndex: 0,
            explanation: 'جَبَلٌ (Jabalun) artinya gunung.',
          },
          {
            id: 'demo-2',
            question: 'هَذِهِ حَدِيْقَةٌ ...',
            questionIndo: 'Lengkapilah dengan na\'at yang sesuai: "هَذِهِ حَدِيْقَةٌ ..."',
            options: ['جَمِيْلٌ', 'جَمِيْلَةٌ', 'مُرْتَفِعٌ', 'وَاسِعٌ'],
            correctIndex: 1,
            explanation: 'Karena حَدِيْقَةٌ adalah muannats (ada ta marbuthah), maka na\'atnya juga harus muannats yaitu جَمِيْلَةٌ.',
          },
        ],
      });
    }

    const prompt = `Buatkan ${count} soal kuis interaktif Bahasa Arab Kelas 7 MTsN dengan tema "${topic}".
Soal harus mencakup:
- Kosakata alam (جَبَل, بَحْر, شَلَّال, نَهْر, حَدِيْقَة, سَمَاء, زَهْرَة, dll).
- Tata bahasa Na'at & Man'ut (kesesuaian mudzakkar/muannats).
- Isim Isyarah (هَذَا / هَذِهِ / ذَلِكَ / تِلْكَ).

Format JSON:
{
  "questions": [
    {
      "id": "q1",
      "question": "Pertanyaan dalam bahasa Arab berharakat",
      "questionIndo": "Petunjuk atau terjemahan pertanyaan dalam bahasa Indonesia",
      "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
      "correctIndex": 0,
      "explanation": "Penjelasan singkat mengapa jawaban tersebut benar"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.5,
      },
    });

    const parsed = JSON.parse(response.text || '{"questions":[]}');
    return res.json(parsed);
  } catch (error) {
    console.error('Generate Quiz Error:', error);
    return res.status(500).json({
      error: 'Gagal membuat soal kuis',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Mount router on both '/' and '/api' to support Vercel serverless rewrite and local dev seamlessly
app.use('/api', router);
app.use('/', router);

// Export default app WITHOUT app.listen (as requested for Vercel and modular architecture)
export default app;
