import React, { useState } from 'react';
import { X, CheckCircle, ThumbsUp, ShieldCheck, Share2, HelpCircle, MessageSquarePlus } from 'lucide-react';
import { Question, ExpertUser } from '../types';
import { getInitials, HighlightText } from '../lib/avatar';

interface AnswerModalProps {
  question: Question | null;
  currentExpert: ExpertUser | null;
  searchQuery?: string;
  onClose: () => void;
  onLikeAnswer: (answerId: string, currentLikes: number) => Promise<void>;
  onRequestAnswer: (question: Question) => void;
}

export const AnswerModal: React.FC<AnswerModalProps> = ({
  question,
  currentExpert,
  searchQuery = '',
  onClose,
  onLikeAnswer,
  onRequestAnswer
}) => {
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  if (!question) return null;

  const answer = question.answer;

  const handleLike = async () => {
    if (!answer || hasLiked || isLiking) return;
    setIsLiking(true);
    try {
      await onLikeAnswer(answer.id, answer.likes || 0);
      setHasLiked(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: question.title,
        text: `Solusi Kasus Pertanian: ${question.title} di Tanya Tani`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan pertanyaan berhasil disalin ke clipboard!');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="tag-badge">{question.category}</span>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Komoditas: <strong>{question.crop_type}</strong>
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>
              <HighlightText text={question.title} query={searchQuery} />
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Tutup Modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Question Details */}
          <div className="modal-question-block">
            <div className="modal-q-meta">
              Diajukan oleh <strong><HighlightText text={question.farmer_name} query={searchQuery} /></strong> • <HighlightText text={question.farmer_region || 'Indonesia'} query={searchQuery} />
              {question.urgency === 'mendesak' && (
                <span style={{ marginLeft: '8px', color: '#dc2626', fontWeight: 700 }}>
                  [Tingkat Urgensi: Mendesak]
                </span>
              )}
            </div>
            <p className="modal-q-desc" style={{ whiteSpace: 'pre-line' }}>
              <HighlightText text={question.content} query={searchQuery} />
            </p>

            {/* Foto Gejala Tanaman dari Petani */}
            {question.image_url && (
              <div style={{ marginTop: '14px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '6px' }}>
                  📸 Foto Gejala yang Diunggah Petani:
                </span>
                <img
                  src={question.image_url}
                  alt={question.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '340px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    objectFit: 'contain',
                    backgroundColor: '#0000000d'
                  }}
                />
              </div>
            )}
          </div>

          {/* Expert Answer Section */}
          {answer ? (
            <div className="expert-response-card">
              <div className="expert-badge-top">
                {/* Ganti auto foto profil dengan inisial nama pakar */}
                <div className="expert-avatar-initials-lg" title={answer.expert_name}>
                  {getInitials(answer.expert_name)}
                </div>
                <div className="expert-title-wrap">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h4><HighlightText text={answer.expert_name} query={searchQuery} /></h4>
                    <ShieldCheck size={18} style={{ color: '#16a34a' }} />
                  </div>
                  <p><HighlightText text={answer.expert_title} query={searchQuery} /></p>
                </div>
              </div>

              <div className="expert-content-text">
                <p style={{ whiteSpace: 'pre-line' }}>
                  <HighlightText text={answer.content} query={searchQuery} />
                </p>
              </div>

              {/* Action Steps */}
              {answer.action_steps && answer.action_steps.length > 0 && (
                <div className="action-steps-box">
                  <h4 className="action-steps-title">
                    <CheckCircle size={18} />
                    <span>Langkah Penanganan Praktis di Lapangan:</span>
                  </h4>
                  {answer.action_steps.map((step, idx) => (
                    <div key={idx} className="action-step-item">
                      <span className="step-num">{idx + 1}</span>
                      <span><HighlightText text={step} query={searchQuery} /></span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic', marginTop: '10px' }}>
                *Rekomendasi di atas diverifikasi oleh tenaga ahli agronomi dan proteksi tanaman berlisensi.
              </div>
            </div>
          ) : (
            <div style={{
              padding: '2rem 1.5rem',
              textAlign: 'center',
              backgroundColor: '#fffbeb',
              borderRadius: '12px',
              border: '1px solid #fef3c7'
            }}>
              <HelpCircle size={40} style={{ color: '#d97706', margin: '0 auto 12px auto' }} />
              <h4 style={{ color: '#92400e', marginBottom: '6px', fontWeight: 700 }}>
                Pertanyaan Sedang Menunggu Jawaban Pakar
              </h4>
              <p style={{ fontSize: '0.88rem', color: '#b45309', marginBottom: '1.25rem' }}>
                Kasus ini belum dijawab oleh pakar. Apakah Anda seorang pakar agronomi/penyuluh pertanian?
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  onClose();
                  onRequestAnswer(question);
                }}
              >
                <MessageSquarePlus size={16} />
                <span>{currentExpert ? 'Tuliskan Jawaban Sekarang' : 'Login & Jawab Kasus Ini'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          {answer ? (
            <button
              type="button"
              className={`like-button ${hasLiked ? 'liked' : ''}`}
              onClick={handleLike}
              disabled={hasLiked || isLiking}
            >
              <ThumbsUp size={16} />
              <span>
                {hasLiked ? 'Jawaban Terbantu' : 'Bermanfaat'} ({answer.likes + (hasLiked ? 1 : 0)})
              </span>
            </button>
          ) : (
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Status: Menunggu Pakar</span>
          )}

          <button
            type="button"
            className="btn-outline"
            onClick={handleShare}
            style={{ fontSize: '0.85rem', padding: '6px 14px' }}
          >
            <Share2 size={15} />
            <span>Bagikan Solusi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
