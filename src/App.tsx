import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { QuickTags } from './components/QuickTags';
import { AskForm } from './components/AskForm';
import { QuestionCard } from './components/QuestionCard';
import { AnswerModal } from './components/AnswerModal';
import { AnswerFormModal } from './components/AnswerFormModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { SupabaseModal } from './components/SupabaseModal';
import { Question, NewQuestionInput, ExpertUser } from './types';
import {
  fetchQuestionsFromDB,
  insertQuestionToDB,
  submitExpertAnswer,
  likeAnswerInDB,
  getStoredExpertUser,
  setStoredExpertUser,
  supabase
} from './lib/supabase';
import { MessageSquare, Sparkles, FilterX } from 'lucide-react';

export const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('Semua');

  // Modal states
  const [activeModalQuestion, setActiveModalQuestion] = useState<Question | null>(null);
  const [questionToAnswer, setQuestionToAnswer] = useState<Question | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Authenticated Expert State (Khusus yang ingin menjawab pertanyaan)
  const [currentExpert, setCurrentExpert] = useState<ExpertUser | null>(() => getStoredExpertUser());

  useEffect(() => {
    let isMounted = true;
    const loadData = async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const data = await fetchQuestionsFromDB();
        if (isMounted) {
          setQuestions(data);
        }
      } catch (err) {
        console.error('Gagal mengambil pertanyaan:', err);
      } finally {
        if (isMounted && !silent) setLoading(false);
      }
    };

    loadData();

    // Auto sinkron saat layar HP dibuka kembali atau tab laptop diakses
    const handleSync = () => {
      if (document.visibilityState === 'visible') {
        loadData(true);
      }
    };
    window.addEventListener('visibilitychange', handleSync);
    window.addEventListener('focus', handleSync);

    // Polling periodik (setiap 12 detik) agar pertanyaan dari perangkat lain langsung masuk
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadData(true);
      }
    }, 12000);

    // Supabase Realtime channel subscription
    let channel: any = null;
    if (supabase) {
      try {
        channel = supabase
          .channel('schema-db-changes')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'questions' },
            () => {
              loadData(true);
            }
          )
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'answers' },
            () => {
              loadData(true);
            }
          )
          .subscribe();
      } catch (e) {
        console.warn('Realtime subscription:', e);
      }
    }

    return () => {
      isMounted = false;
      window.removeEventListener('visibilitychange', handleSync);
      window.removeEventListener('focus', handleSync);
      clearInterval(interval);
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Submit pertanyaan baru oleh Petani (Tanpa Perlu Login)
  const handleCreateQuestion = async (input: NewQuestionInput): Promise<boolean> => {
    try {
      const created = await insertQuestionToDB(input);
      setQuestions((prev) => [created, ...prev]);
      // Reset filter dan pencarian agar pertanyaan baru langsung tampak di urutan paling atas
      setSelectedTag('Semua');
      setSearchQuery('');
      showToast('Pertanyaan Anda berhasil tersimpan di database dan tampil di daftar!');

      // Scroll halus ke daftar pertanyaan agar user langsung melihat hasilnya
      setTimeout(() => {
        const listElem = document.getElementById('daftar-pertanyaan');
        if (listElem) {
          listElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 250);

      return true;
    } catch (err: any) {
      console.error('Error insert question:', err);
      throw err;
    }
  };

  // Handle request menjawab kasus oleh Pakar
  const handleRequestAnswer = (question: Question) => {
    if (!currentExpert) {
      // Jika belum login sebagai pakar, buka modal autentikasi
      setQuestionToAnswer(question);
      setIsAuthModalOpen(true);
    } else {
      // Buka modal pengisian jawaban
      setQuestionToAnswer(question);
    }
  };

  // Submit jawaban resmi pakar
  const handleSubmitAnswer = async (questionId: string, content: string, actionSteps: string[]) => {
    if (!currentExpert) return;
    try {
      const savedAnswer = await submitExpertAnswer(questionId, currentExpert, content, actionSteps);
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id === questionId) {
            return {
              ...q,
              status: 'answered',
              answer: savedAnswer
            };
          }
          return q;
        })
      );
      showToast('Jawaban resmi pakar berhasil diterbitkan!');
      setQuestionToAnswer(null);
    } catch (err: any) {
      alert(err.message || 'Gagal menerbitkan jawaban');
    }
  };

  // Like jawaban pakar
  const handleLikeAnswer = async (answerId: string, currentLikes: number) => {
    try {
      const newCount = await likeAnswerInDB(answerId, currentLikes);
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.answer && q.answer.id === answerId) {
            return {
              ...q,
              answer: { ...q.answer, likes: newCount }
            };
          }
          return q;
        })
      );
      if (activeModalQuestion && activeModalQuestion.answer?.id === answerId) {
        setActiveModalQuestion((prev) =>
          prev && prev.answer
            ? { ...prev, answer: { ...prev.answer, likes: newCount } }
            : prev
        );
      }
      showToast('Terima kasih atas apresiasinya!');
    } catch (err) {
      console.error(err);
    }
  };

  // Logout pakar
  const handleLogoutExpert = () => {
    setStoredExpertUser(null);
    setCurrentExpert(null);
    showToast('Anda telah keluar dari akun pakar.');
  };

  // Hitung jumlah pertanyaan per kategori
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = { Semua: questions.length };
    questions.forEach((q) => {
      if (q.category) {
        counts[q.category] = (counts[q.category] || 0) + 1;
      }
    });
    return counts;
  }, [questions]);

  // Filter pertanyaan (mencakup judul, konten, tanaman, petani, daerah, serta konten & langkah jawaban)
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchTag =
        selectedTag === 'Semua' || q.category.toLowerCase() === selectedTag.toLowerCase();

      if (!searchQuery.trim()) return matchTag;

      const qTerm = searchQuery.toLowerCase().trim();
      const matchQuery =
        (q.title && q.title.toLowerCase().includes(qTerm)) ||
        (q.content && q.content.toLowerCase().includes(qTerm)) ||
        (q.crop_type && q.crop_type.toLowerCase().includes(qTerm)) ||
        (q.farmer_name && q.farmer_name.toLowerCase().includes(qTerm)) ||
        (q.farmer_region && q.farmer_region.toLowerCase().includes(qTerm)) ||
        (q.category && q.category.toLowerCase().includes(qTerm)) ||
        Boolean(
          q.answer && (
            (q.answer.content && q.answer.content.toLowerCase().includes(qTerm)) ||
            (q.answer.expert_name && q.answer.expert_name.toLowerCase().includes(qTerm)) ||
            (q.answer.expert_title && q.answer.expert_title.toLowerCase().includes(qTerm)) ||
            (Array.isArray(q.answer.action_steps) && q.answer.action_steps.some(step => step.toLowerCase().includes(qTerm)))
          )
        );

      return matchTag && matchQuery;
    });
  }, [questions, selectedTag, searchQuery]);

  const scrollToAskForm = () => {
    const formElem = document.getElementById('konsultasi');
    if (formElem) {
      formElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (term: string) => {
    setSearchQuery(term);
    setSelectedTag('Semua'); // Tampilkan hasil dari seluruh kategori saat mencari
    const target = document.getElementById('daftar-pertanyaan');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-root">
      {/* 1. Header / Navbar */}
      <Navbar
        currentExpert={currentExpert}
        onOpenAskForm={scrollToAskForm}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogoutExpert={handleLogoutExpert}
      />

      <main>
        {/* 2. Hero Section dengan Search Bar */}
        <Hero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
          onSuggestionClick={(suggestion) => {
            setSearchQuery(suggestion);
            setSelectedTag('Semua');
            const target = document.getElementById('daftar-pertanyaan');
            if (target) target.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 3. Kategori Cepat (Quick Tags tanpa # dan berspasi) */}
        <QuickTags
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
          tagCounts={tagCounts}
        />

        {/* 4. Fitur Utama: Kolom Konsultasi Petani & Daftar Tanya Jawab (SS1 dihapus, layout fokus & bersih) */}
        <section className="main-section">
          <div className="container">
            <div className="main-content-streamlined">
              {/* Form Input Petani (Tanpa Perlu Login) */}
              <AskForm
                onSubmitQuestion={handleCreateQuestion}
                defaultCategory={selectedTag !== 'Semua' ? selectedTag : 'Hama Tanaman'}
              />

              {/* Header Daftar Pertanyaan (Target scroll pencarian dan hasil) */}
              <div className="section-header-row" id="daftar-pertanyaan" style={{ scrollMarginTop: '85px' }}>
                <div>
                  <h2 className="section-title">
                    <MessageSquare size={22} className="text-emerald-600" />
                    <span>Daftar Konsultasi & Riwayat Kasus Tani</span>
                  </h2>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '2px' }}>
                    Petani bertanya gratis tanpa login. Jawaban tervalidasi langsung oleh pakar agronomi terdaftar.
                  </p>
                </div>
                <span className="section-count">
                  {filteredQuestions.length} Kasus Ditampilkan
                </span>
              </div>

              {/* Filter Info jika sedang melakukan pencarian / filter tag */}
              {(searchQuery || selectedTag !== 'Semua') && (
                <div className="filter-active-bar">
                  <span>
                    Menampilkan hasil untuk:{' '}
                    {selectedTag !== 'Semua' && <strong>Kategori: {selectedTag} </strong>}
                    {searchQuery && <strong>Kata kunci: "{searchQuery}"</strong>}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTag('Semua');
                      setSearchQuery('');
                    }}
                    className="btn-reset-filter"
                  >
                    <FilterX size={14} />
                    <span>Reset Filter</span>
                  </button>
                </div>
              )}

              {/* List of Questions */}
              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  <div className="loading-spinner"></div>
                  <p>Memuat database konsultasi tani...</p>
                </div>
              ) : filteredQuestions.length === 0 ? (
                <div className="empty-state-card">
                  <Sparkles size={40} style={{ color: '#16a34a', margin: '0 auto 12px auto' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                    Belum Ada Pertanyaan yang Cocok
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.92rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                    Jadilah yang pertama menanyakan kasus ini! Tim pakar tani kami siap memberikan solusi langsung.
                  </p>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={scrollToAskForm}
                  >
                    Tulis Pertanyaan Baru
                  </button>
                </div>
              ) : (
                <div className="question-list">
                  {filteredQuestions.map((q) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      currentExpert={currentExpert}
                      searchQuery={searchQuery}
                      onOpenAnswer={(item) => setActiveModalQuestion(item)}
                      onRequestAnswer={(item) => handleRequestAnswer(item)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* 6. Footer */}
      <Footer />

      {/* 7. Modal Lihat Jawaban Pakar */}
      <AnswerModal
        question={activeModalQuestion}
        currentExpert={currentExpert}
        searchQuery={searchQuery}
        onClose={() => setActiveModalQuestion(null)}
        onLikeAnswer={handleLikeAnswer}
        onRequestAnswer={(q) => handleRequestAnswer(q)}
      />

      {/* 8. Modal Menulis Jawaban Pakar (Khusus Expert) */}
      <AnswerFormModal
        question={questionToAnswer}
        currentExpert={currentExpert}
        isOpen={Boolean(questionToAnswer && currentExpert)}
        onClose={() => setQuestionToAnswer(null)}
        onSubmitAnswer={handleSubmitAnswer}
      />

      {/* 9. Modal Login/Registrasi Pakar Tani */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(expert) => {
          setCurrentExpert(expert);
          showToast(`Selamat datang, ${expert.name}!`);
          setIsAuthModalOpen(false);
        }}
      />

      {/* 10. Modal Konfigurasi Supabase */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

      {/* 11. Floating Toast Notification */}
      {toastMessage && (
        <div className="toast-notice">
          <Sparkles size={18} className="text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
