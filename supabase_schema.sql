-- ========================================================
-- SCHEMA DATABASE SUPABASE UNTUK "TANYA TANI"
-- Jalankan skrip ini di SQL Editor pada Dashboard Supabase
-- ========================================================

-- 1. Buat Tabel Pertanyaan (questions)
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    farmer_name VARCHAR(100) NOT NULL,
    farmer_region VARCHAR(100) DEFAULT 'Indonesia',
    crop_type VARCHAR(100) DEFAULT 'Umum',
    category VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT, -- URL atau Base64 foto gejala tanaman
    urgency VARCHAR(20) DEFAULT 'sedang' CHECK (urgency IN ('rendah', 'sedang', 'mendesak')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'answered')),
    views INT DEFAULT 0,
    likes INT DEFAULT 0
);

-- 2. Buat Tabel Jawaban Pakar (answers)
CREATE TABLE IF NOT EXISTS public.answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    expert_id UUID, -- Terhubung dengan auth.users jika menggunakan Supabase Auth
    expert_name VARCHAR(100) NOT NULL,
    expert_title VARCHAR(150) NOT NULL,
    expert_avatar TEXT,
    content TEXT NOT NULL,
    action_steps TEXT[] DEFAULT '{}',
    likes INT DEFAULT 0
);

-- 3. Aktifkan Row Level Security (RLS)
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

-- 4. Buat Kebijakan Akses (RLS Policies)
-- Petani bebas membaca & bertanya tanpa login
CREATE POLICY "Public questions read" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Public questions insert" ON public.questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public answers read" ON public.answers FOR SELECT USING (true);

-- Jawaban bisa ditambah (bisa menggunakan auth atau public key insert)
CREATE POLICY "Public answers insert" ON public.answers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public questions update status" ON public.questions FOR UPDATE USING (true);
CREATE POLICY "Public answers update likes" ON public.answers FOR UPDATE USING (true);

-- 5. Masukkan Data Sampel / Seed Data Populer (Pertanian Indonesia)
DO $$
DECLARE
    q1_id UUID;
    q2_id UUID;
    q3_id UUID;
    q4_id UUID;
BEGIN
    -- Pertanyaan 1: Cabai Keriting
    INSERT INTO public.questions (farmer_name, farmer_region, crop_type, category, title, content, image_url, urgency, status, views, likes)
    VALUES (
        'Pak Joko Widodo', 
        'Boyolali, Jawa Tengah', 
        'Cabai Rawit Merah', 
        'Hama Tanaman', 
        'Bagaimana cara mengatasi daun cabai keriting dan menggulung ke atas?', 
        'Tanaman cabai rawit saya umur 45 HST daun pucuknya keriting, kaku, dan menggulung ke atas. Tulang daun menguning. Apakah ini kena kutu kebul atau thrips? Bagaimana penanganannya tanpa bahan kimia berlebih?', 
        'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=600&q=80',
        'mendesak', 
        'answered', 
        342, 
        48
    ) RETURNING id INTO q1_id;

    INSERT INTO public.answers (question_id, expert_name, expert_title, expert_avatar, content, action_steps, likes)
    VALUES (
        q1_id,
        'Ir. Bambang Trihatmojo, M.Sc.',
        'Agronom & Pakar Proteksi Tanaman (IPB)',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        'Salam Pak Joko. Gejala daun keriting menggulung ke atas disertai warna kekuningan umumnya disebabkan oleh serangan Thrips sp. dan tungau (mites). Hama ini mengisap cairan sel daun muda sehingga pertumbuhan sel tidak merata.',
        ARRAY[
            'Pasang perangkap lekat kuning (yellow sticky trap) 40 buah per hektar.',
            'Semprot pestisida nabati rebusan daun mimba + tembakau + sedikit deterjen cair di sore hari (fokus di balik daun).',
            'Jika populasi parah, gunakan insektisida berbahan aktif Abamektin secara bergantian dengan Imidakloprid dengan dosis tepat.',
            'Berikan pupuk daun tinggi kalsium dan boron untuk memperkuat sel daun baru.'
        ],
        37
    );

    -- Pertanyaan 2: Pupuk Organik Cair
    INSERT INTO public.questions (farmer_name, farmer_region, crop_type, category, title, content, image_url, urgency, status, views, likes)
    VALUES (
        'Ibu Siti Rahmawati', 
        'Malang, Jawa Timur', 
        'Sayuran Daun & Buah', 
        'Pupuk Organik', 
        'Cara fermentasi Pupuk Organik Cair (POC) dari kohe kambing agar tidak panas?', 
        'Saya punya banyak kotoran kambing kering. Bagaimana cara memfermentasi menjadi pupuk organik cair yang aman dan kaya hara nitrogen untuk fase vegetatif?', 
        'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80',
        'sedang', 
        'answered', 
        215, 
        29
    ) RETURNING id INTO q2_id;

    INSERT INTO public.answers (question_id, expert_name, expert_title, expert_avatar, content, action_steps, likes)
    VALUES (
        q2_id,
        'Dr. Ir. Sri Mulyani, M.P.',
        'Peneliti Mikrobiologi & Kesuburan Tanah',
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
        'Halo Ibu Siti. Kohe kambing memiliki kandungan hara yang sangat seimbang. Kunci agar tidak "panas" dan tidak membakar akar adalah proses dekomposisi anaerob menggunakan bakteri starter (EM4) dan molase secara tuntas minimal 14–21 hari.',
        ARRAY[
            'Siapkan drum 100 liter, masukkan 20 kg kohe kambing halus ke dalam karung goni.',
            'Campurkan 200 ml EM4 pertanian + 200 ml tetes tebu/molase ke dalam 80 liter air bersih.',
            'Masukkan karung goni ke dalam drum air larutan starter (metode celup teh).',
            'Tutup rapat drum dan pasang selang aerasi ke botol air (sistem anaerob airlock). Tunggu 21 hari hingga aroma menyerupai tape.'
        ],
        24
    );

    -- Pertanyaan 3: Hidroponik Selada
    INSERT INTO public.questions (farmer_name, farmer_region, crop_type, category, title, content, image_url, urgency, status, views, likes)
    VALUES (
        'Dimas Prasetyo', 
        'Bogor, Jawa Barat', 
        'Selada Romaine', 
        'Hidroponik', 
        'Ujung daun selada gosong (tip burn) di musim panas, bagaimana mengatasinya?', 
        'Sistem NFT hidroponik saya mengalami tip burn pada daun bagian dalam selada saat siang hari terik, padahal PPM nutrisi sudah diatur 600. Apakah karena kalsium atau suhu air?', 
        'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80',
        'sedang', 
        'answered', 
        189, 
        31
    ) RETURNING id INTO q3_id;

    INSERT INTO public.answers (question_id, expert_name, expert_title, expert_avatar, content, action_steps, likes)
    VALUES (
        q3_id,
        'Hendra Wijaya, S.P.',
        'Konsultan Hidroponik Komersial & Smart Greenhouse',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
        'Halo Mas Dimas. Tip burn adalah masalah klasik pada selada saat suhu greenhouse tinggi. Kalsium tidak dapat bergerak ke ujung daun muda karena laju transpirasi tinggi dan defisiensi sirkulasi udara mikro.',
        ARRAY[
            'Pasang exhaust fan atau oscillating fan untuk menggerakkan udara mikro tepat di atas tajuk tanaman.',
            'Tingkatkan kandungan Kalsium Nitrat (part A) atau semprot foliar pupuk kalsium cair pagi hari.',
            'Pantau suhu tandon air; jika di atas 28°C, gunakan insulasi tandon atau chiller sederhana.',
            'Gunakan shading net 40-50% untuk mengurangi radiasi matahari ekstrem pada jam 11.00–14.00.'
        ],
        19
    );

    -- Pertanyaan 4: Pascapanen Jagung
    INSERT INTO public.questions (farmer_name, farmer_region, crop_type, category, title, content, image_url, urgency, status, views, likes)
    VALUES (
        'Ahmad Fauzi', 
        'Lampung Selatan', 
        'Jagung Hibrida', 
        'Pascapanen', 
        'Berapa standar kadar air jagung pipil agar tidak berjamur saat disimpan di gudang?', 
        'Kami baru panen 5 hektar jagung. Berapa lama penjemuran dan standar kadar air yang aman untuk disimpan selama 3 bulan tanpa terkena aflatoksin?', 
        NULL,
        'rendah', 
        'answered', 
        143, 
        15
    ) RETURNING id INTO q4_id;

    INSERT INTO public.answers (question_id, expert_name, expert_title, expert_avatar, content, action_steps, likes)
    VALUES (
        q4_id,
        'Ir. Agus Sudrajat',
        'Spesialis Teknologi Pascapanen & Logistik Pangan',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
        'Salam Pak Ahmad. Standar aman kadar air (KA) jagung pipil untuk penyimpanan gudang lebih dari 1 bulan adalah maksimal 13%–14%. Di atas 15%, jamur Aspergillus flavus penghasil racun aflatoksin akan tumbuh pesat.',
        ARRAY[
            'Jemur di atas terpal bersih minimal 3-4 hari terik penuh hingga KA mencapai 13.5%.',
            'Gunakan moisture meter digital untuk memastikan kadar air seragam sebelum pengarungan.',
            'Gunakan karung laminasi atau karung hermetik jika ingin menyimpan lebih dari 3 bulan.',
            'Gudang harus beralaskan palet kayu minimal 15 cm dari lantai dan berjarak 50 cm dari dinding.'
        ],
        12
    );
END $$;
