import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Question, NewQuestionInput, ExpertUser, Answer } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-id')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Mock data awal (kategori menggunakan spasi tanpa tanda #)
export const INITIAL_QUESTIONS: Question[] = [
  {
    id: '1',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    farmer_name: 'Pak Joko Widodo',
    farmer_region: 'Boyolali, Jawa Tengah',
    crop_type: 'Cabai Rawit Merah',
    category: 'Hama Tanaman',
    title: 'Bagaimana cara mengatasi daun cabai keriting dan menggulung ke atas?',
    content: 'Tanaman cabai rawit saya umur 45 HST daun pucuknya keriting, kaku, dan menggulung ke atas. Tulang daun menguning. Apakah ini kena kutu kebul atau thrips? Bagaimana penanganannya tanpa bahan kimia berlebih?',
    image_url: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=600&q=80',
    urgency: 'mendesak',
    status: 'answered',
    views: 342,
    likes: 48,
    answer: {
      id: 'ans-1',
      expert_name: 'Ir. Bambang Trihatmojo, M.Sc.',
      expert_title: 'Agronom & Pakar Proteksi Tanaman (IPB)',
      expert_avatar: '',
      content: 'Salam Pak Joko. Gejala daun keriting menggulung ke atas disertai warna kekuningan umumnya disebabkan oleh serangan Thrips sp. dan tungau (mites). Hama ini mengisap cairan sel daun muda sehingga pertumbuhan sel tidak merata.',
      action_steps: [
        'Pasang perangkap lekat kuning (yellow sticky trap) 40 buah per hektar.',
        'Semprot pestisida nabati rebusan daun mimba + tembakau + sedikit deterjen cair di sore hari (fokus di balik daun).',
        'Jika populasi parah, gunakan insektisida berbahan aktif Abamektin secara bergantian dengan Imidakloprid dengan dosis tepat.',
        'Berikan pupuk daun tinggi kalsium dan boron untuk memperkuat sel daun baru.'
      ],
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      likes: 37
    }
  },
  {
    id: '2',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    farmer_name: 'Ibu Siti Rahmawati',
    farmer_region: 'Malang, Jawa Timur',
    crop_type: 'Sayuran Daun & Buah',
    category: 'Pupuk Organik',
    title: 'Cara fermentasi Pupuk Organik Cair (POC) dari kohe kambing agar tidak panas?',
    content: 'Saya punya banyak kotoran kambing kering. Bagaimana cara memfermentasi menjadi pupuk organik cair yang aman dan kaya hara nitrogen untuk fase vegetatif?',
    image_url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80',
    urgency: 'sedang',
    status: 'answered',
    views: 215,
    likes: 29,
    answer: {
      id: 'ans-2',
      expert_name: 'Dr. Ir. Sri Mulyani, M.P.',
      expert_title: 'Peneliti Mikrobiologi & Kesuburan Tanah',
      expert_avatar: '',
      content: 'Halo Ibu Siti. Kohe kambing memiliki kandungan hara yang sangat seimbang. Kunci agar tidak "panas" dan tidak membakar akar adalah proses dekomposisi anaerob menggunakan bakteri starter (EM4) dan molase secara tuntas minimal 14–21 hari.',
      action_steps: [
        'Siapkan drum 100 liter, masukkan 20 kg kohe kambing halus ke dalam karung goni.',
        'Campurkan 200 ml EM4 pertanian + 200 ml molase (tetes tebu) ke dalam 80 liter air bersih.',
        'Masukkan karung goni ke dalam drum air larutan starter (metode celup teh).',
        'Tutup rapat drum dan pasang selang aerasi ke botol air (sistem anaerob airlock). Tunggu 21 hari hingga aroma harum tape.'
      ],
      created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
      likes: 24
    }
  },
  {
    id: '3',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    farmer_name: 'Dimas Prasetyo',
    farmer_region: 'Bogor, Jawa Barat',
    crop_type: 'Selada Romaine',
    category: 'Hidroponik',
    title: 'Ujung daun selada gosong (tip burn) di musim panas, bagaimana mengatasinya?',
    content: 'Sistem NFT hidroponik saya mengalami tip burn pada daun bagian dalam selada saat siang hari terik, padahal PPM nutrisi sudah diatur 600. Apakah karena kalsium atau suhu air?',
    image_url: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80',
    urgency: 'sedang',
    status: 'answered',
    views: 189,
    likes: 31,
    answer: {
      id: 'ans-3',
      expert_name: 'Hendra Wijaya, S.P.',
      expert_title: 'Konsultan Hidroponik Komersial & Smart Greenhouse',
      expert_avatar: '',
      content: 'Halo Mas Dimas. Tip burn adalah masalah klasik pada selada saat suhu greenhouse tinggi. Kalsium tidak dapat bergerak ke ujung daun muda karena laju transpirasi tinggi dan defisiensi sirkulasi udara mikro.',
      action_steps: [
        'Pasang exhaust fan atau oscillating fan untuk menggerakkan udara mikro tepat di atas tajuk tanaman.',
        'Tingkatkan kandungan Kalsium Nitrat (part A) atau semprot foliar pupuk kalsium cair pagi hari.',
        'Pantau suhu tandon air; jika di atas 28°C, gunakan insulasi tandon atau chiller sederhana.',
        'Gunakan shading net 40-50% untuk mengurangi radiasi matahari ekstrem pada jam 11.00–14.00.'
      ],
      created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
      likes: 19
    }
  },
  {
    id: '4',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    farmer_name: 'Ahmad Fauzi',
    farmer_region: 'Lampung Selatan',
    crop_type: 'Jagung Hibrida',
    category: 'Pascapanen',
    title: 'Berapa standar kadar air jagung pipil agar tidak berjamur saat disimpan di gudang?',
    content: 'Kami baru panen 5 hektar jagung. Berapa lama penjemuran dan standar kadar air yang aman untuk disimpan selama 3 bulan tanpa terkena aflatoksin?',
    urgency: 'rendah',
    status: 'answered',
    views: 143,
    likes: 15,
    answer: {
      id: 'ans-4',
      expert_name: 'Ir. Agus Sudrajat',
      expert_title: 'Spesialis Teknologi Pascapanen & Logistik Pangan',
      expert_avatar: '',
      content: 'Salam Pak Ahmad. Standar aman kadar air (KA) jagung pipil untuk penyimpanan gudang lebih dari 1 bulan adalah maksimal 13%–14%. Di atas 15%, jamur Aspergillus flavus penghasil racun aflatoksin akan tumbuh pesat.',
      action_steps: [
        'Jemur di atas terpal bersih minimal 3-4 hari terik penuh hingga KA mencapai 13.5%.',
        'Gunakan moisture meter digital untuk memastikan kadar air seragam sebelum pengarungan.',
        'Gunakan karung laminasi atau karung hermetik jika ingin menyimpan lebih dari 3 bulan.',
        'Gudang harus beralaskan palet kayu minimal 15 cm dari lantai dan berjarak 50 cm dari dinding.'
      ],
      created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
      likes: 12
    }
  }
];

const LOCAL_STORAGE_KEY = 'tanya_tani_questions_v2';
const AUTH_STORAGE_KEY = 'tanya_tani_expert_auth_v2';

export const getLocalQuestions = (): Question[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_QUESTIONS));
      return INITIAL_QUESTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_QUESTIONS;
  }
};

export const saveLocalQuestions = (questions: Question[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(questions));
  } catch (err) {
    console.error('Gagal menyimpan ke localStorage:', err);
  }
};

// Ambil status login Pakar
export const getStoredExpertUser = (): ExpertUser | null => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredExpertUser = (expert: ExpertUser | null): void => {
  try {
    if (expert) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(expert));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (err) {
    console.error('Auth storage error:', err);
  }
};

// Ambil daftar pertanyaan dari Supabase (atau fallback)
export const fetchQuestionsFromDB = async (): Promise<Question[]> => {
  if (!isSupabaseConfigured() || !supabase) {
    return getLocalQuestions();
  }

  try {
    const { data: questionsData, error: qError } = await supabase
      .from('questions')
      .select('*, answers(*)')
      .order('created_at', { ascending: false });

    if (qError) {
      console.warn('Supabase query error, fallback ke data lokal:', qError.message);
      return getLocalQuestions();
    }

    if (!questionsData || questionsData.length === 0) {
      return getLocalQuestions();
    }

    return questionsData.map((item: any) => {
      const ans = Array.isArray(item.answers) && item.answers.length > 0 ? item.answers[0] : null;
      return {
        id: item.id,
        created_at: item.created_at,
        farmer_name: item.farmer_name,
        farmer_region: item.farmer_region,
        crop_type: item.crop_type,
        category: item.category,
        title: item.title,
        content: item.content,
        image_url: item.image_url,
        urgency: item.urgency,
        status: item.status,
        views: item.views || 0,
        likes: item.likes || 0,
        answer: ans ? {
          id: ans.id,
          question_id: ans.question_id,
          expert_name: ans.expert_name,
          expert_title: ans.expert_title,
          expert_avatar: ans.expert_avatar,
          content: ans.content,
          action_steps: ans.action_steps || [],
          created_at: ans.created_at,
          likes: ans.likes || 0
        } : undefined
      };
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return getLocalQuestions();
  }
};

// Kirim pertanyaan baru oleh Petani (Tanpa Perlu Login!)
export const insertQuestionToDB = async (input: NewQuestionInput): Promise<Question> => {
  if (!isSupabaseConfigured() || !supabase) {
    const current = getLocalQuestions();
    const newQ: Question = {
      id: 'local-' + Date.now(),
      created_at: new Date().toISOString(),
      farmer_name: input.farmer_name,
      farmer_region: input.farmer_region || 'Indonesia',
      crop_type: input.crop_type || 'Umum',
      category: input.category,
      title: input.title,
      content: input.content,
      image_url: input.image_url,
      urgency: input.urgency,
      status: 'pending',
      views: 1,
      likes: 0
    };
    const updated = [newQ, ...current];
    saveLocalQuestions(updated);
    return newQ;
  }

  const { data, error } = await supabase
    .from('questions')
    .insert([
      {
        farmer_name: input.farmer_name,
        farmer_region: input.farmer_region || 'Indonesia',
        crop_type: input.crop_type || 'Umum',
        category: input.category,
        title: input.title,
        content: input.content,
        image_url: input.image_url || null,
        urgency: input.urgency,
        status: 'pending',
        views: 1,
        likes: 0
      }
    ])
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Gagal menyimpan pertanyaan ke Supabase');
  }

  return {
    id: data.id,
    created_at: data.created_at,
    farmer_name: data.farmer_name,
    farmer_region: data.farmer_region,
    crop_type: data.crop_type,
    category: data.category,
    title: data.title,
    content: data.content,
    image_url: data.image_url,
    urgency: data.urgency,
    status: data.status,
    views: data.views || 0,
    likes: data.likes || 0
  };
};

// Kirim Jawaban oleh Pakar Terotentikasi
export const submitExpertAnswer = async (
  questionId: string,
  expert: ExpertUser,
  content: string,
  actionSteps: string[]
): Promise<Answer> => {
  const newAnswer: Answer = {
    id: 'ans-' + Date.now(),
    question_id: questionId,
    expert_name: expert.name,
    expert_title: expert.title,
    expert_avatar: expert.avatar,
    content: content,
    action_steps: actionSteps,
    created_at: new Date().toISOString(),
    likes: 0
  };

  if (!isSupabaseConfigured() || !supabase) {
    const list = getLocalQuestions();
    const updated = list.map((q) => {
      if (q.id === questionId) {
        return {
          ...q,
          status: 'answered' as const,
          answer: newAnswer
        };
      }
      return q;
    });
    saveLocalQuestions(updated);
    return newAnswer;
  }

  // 1. Simpan ke tabel answers
  const { data: ansData, error: ansError } = await supabase
    .from('answers')
    .insert([
      {
        question_id: questionId,
        expert_name: expert.name,
        expert_title: expert.title,
        expert_avatar: expert.avatar,
        content: content,
        action_steps: actionSteps,
        likes: 0
      }
    ])
    .select()
    .single();

  if (ansError) {
    throw new Error(ansError.message || 'Gagal mengirim jawaban pakar');
  }

  // 2. Update status pertanyaan menjadi 'answered'
  await supabase
    .from('questions')
    .update({ status: 'answered' })
    .eq('id', questionId);

  return {
    id: ansData.id,
    question_id: ansData.question_id,
    expert_name: ansData.expert_name,
    expert_title: ansData.expert_title,
    expert_avatar: ansData.expert_avatar,
    content: ansData.content,
    action_steps: ansData.action_steps || [],
    created_at: ansData.created_at,
    likes: ansData.likes || 0
  };
};

// Tambah like pada jawaban
export const likeAnswerInDB = async (answerId: string, currentLikes: number): Promise<number> => {
  const newLikes = currentLikes + 1;
  if (!isSupabaseConfigured() || !supabase) {
    const list = getLocalQuestions();
    const updated = list.map(q => {
      if (q.answer && q.answer.id === answerId) {
        return {
          ...q,
          answer: { ...q.answer, likes: newLikes }
        };
      }
      return q;
    });
    saveLocalQuestions(updated);
    return newLikes;
  }

  try {
    await supabase
      .from('answers')
      .update({ likes: newLikes })
      .eq('id', answerId);
    return newLikes;
  } catch (err) {
    console.error('Like error:', err);
    return newLikes;
  }
};
