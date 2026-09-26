import React from 'react';
import { Eye, ThumbsUp, CheckCircle, Clock, ArrowRight, MessageSquareHeart, Image as ImageIcon } from 'lucide-react';
import { Question, ExpertUser } from '../types';
import { getInitials, HighlightText } from '../lib/avatar';

interface QuestionCardProps {
  question: Question;
  currentExpert: ExpertUser | null;
  searchQuery?: string;
  onOpenAnswer: (question: Question) => void;
  onRequestAnswer: (question: Question) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentExpert,
  searchQuery = '',
  onOpenAnswer,
  onRequestAnswer
}) => {
  const isAnswered = question.status === 'answered' && Boolean(question.answer);
  const initial = question.farmer_name ? question.farmer_name.charAt(0).toUpperCase() : 'P';

  return (
    <article className="question-card">
      <div className="question-card-top">
        <div className="author-meta">
          <div className="avatar-circle">{initial}</div>
          <div className="author-info">
            <span className="author-name">
              <HighlightText text={question.farmer_name} query={searchQuery} />
            </span>
            <span className="author-sub">
              <HighlightText text={question.crop_type || 'Tanaman Umum'} query={searchQuery} /> • <HighlightText text={question.farmer_region || 'Indonesia'} query={searchQuery} />
            </span>
          </div>
        </div>

        <span className={`status-badge ${isAnswered ? 'answered' : 'pending'}`}>
          {isAnswered ? (
            <>
              <CheckCircle size={13} />
              <span>Sudah Terjawab</span>
            </>
          ) : (
            <>
              <Clock size={13} />
              <span>Menunggu Solusi</span>
            </>
          )}
        </span>
      </div>

      <h3 className="question-title">
        <HighlightText text={question.title} query={searchQuery} />
      </h3>
      <p className="question-snippet">
        <HighlightText text={question.content} query={searchQuery} />
      </p>

      {/* Tampilan Gambar Tanaman jika ada */}
      {question.image_url && (
        <div className="card-image-wrap" onClick={() => onOpenAnswer(question)}>
          <img
            src={question.image_url}
            alt={question.title}
            className="card-plant-image"
            loading="lazy"
          />
          <span className="card-image-badge">
            <ImageIcon size={12} />
            <span>Foto Gejala</span>
          </span>
        </div>
      )}

      {/* Cuplikan jawaban jika sudah dijawab */}
      {isAnswered && question.answer && (
        <div className="expert-preview-box">
          {/* Avatar Inisial Pakar */}
          <div className="expert-avatar-initials-sm" style={{ marginRight: '8px', flexShrink: 0 }} title={question.answer.expert_name}>
            {getInitials(question.answer.expert_name)}
          </div>
          <div className="expert-preview-text">
            <strong><HighlightText text={question.answer.expert_name} query={searchQuery} />: </strong>
            "<HighlightText text={question.answer.content.slice(0, 110)} query={searchQuery} />..."
          </div>
        </div>
      )}

      <div className="question-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span className="tag-badge">{question.category}</span>
          <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Eye size={13} /> {question.views}x
          </span>
          {question.likes > 0 && (
            <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ThumbsUp size={13} /> {question.likes}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Tombol aksi khusus yang ingin membantu menjawab */}
          {!isAnswered && (
            <button
              type="button"
              className="btn-expert-action"
              onClick={() => onRequestAnswer(question)}
            >
              <MessageSquareHeart size={14} />
              <span>{currentExpert ? 'Tuliskan Jawaban' : 'Bantu Jawab'}</span>
            </button>
          )}

          <button
            type="button"
            className="btn-view-answer"
            onClick={() => onOpenAnswer(question)}
            id={`btn-view-${question.id}`}
          >
            <span>{isAnswered ? 'Lihat Jawaban' : 'Detail Kasus'}</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </article>
  );
};
