import React, { useState } from 'react';
import { X, Send, Plus, Trash2, ShieldCheck, CheckCircle } from 'lucide-react';
import { Question, ExpertUser } from '../types';
import { getInitials } from '../lib/avatar';

interface AnswerFormModalProps {
  question: Question | null;
  currentExpert: ExpertUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitAnswer: (questionId: string, content: string, actionSteps: string[]) => Promise<void>;
}

export const AnswerFormModal: React.FC<AnswerFormModalProps> = ({
  question,
  currentExpert,
  isOpen,
  onClose,
  onSubmitAnswer
}) => {
  const [content, setContent] = useState('');
  const [steps, setSteps] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !question || !currentExpert) return null;

  const handleAddStep = () => {
    setSteps([...steps, '']);
  };

  const handleStepChange = (index: number, val: string) => {
    const updated = [...steps];
    updated[index] = val;
    setSteps(updated);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length <= 1) return;
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || content.trim().length < 5) {
      setErrorMsg('Mohon tuliskan penjelasan diagnosa / solusi minimal 5 karakter.');
      return;
    }

    const filteredSteps = steps.map(s => s.trim()).filter(Boolean);

    setLoading(true);
    try {
      await onSubmitAnswer(question.id, content.trim(), filteredSteps);
      setContent('');
      setSteps(['']);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan jawaban.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} className="text-emerald-600" />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#15803d' }}>
                Panel Jawaban Pakar Tani
              </span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
              Beri Tanggapan Pakar
            </h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Ringkasan Kasus Petani */}
          <div className="modal-question-block" style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>
              Kasus dari <strong>{question.farmer_name}</strong> • {question.crop_type} ({question.category})
            </div>
            <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              {question.title}
            </div>
            <div style={{ fontSize: '0.88rem', color: '#475569' }}>
              "{question.content}"
            </div>
            {question.image_url && (
              <div style={{ marginTop: '8px' }}>
                <img
                  src={question.image_url}
                  alt="Foto gejala"
                  style={{ maxHeight: '140px', borderRadius: '8px', objectFit: 'cover' }}
                />
              </div>
            )}
          </div>

          {/* Info Pakar yang sedang login */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            backgroundColor: '#f0fdf4',
            borderRadius: '10px',
            marginBottom: '1.25rem',
            border: '1px solid #bbf7d0'
          }}>
            <div className="expert-avatar-initials-md" title={currentExpert.name}>
              {getInitials(currentExpert.name)}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#14532d' }}>
                {currentExpert.name}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#166534' }}>
                {currentExpert.title}
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="form-alert error" style={{ marginBottom: '1rem' }}>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Diagnosa & Uraian Solusi Teknis *</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Tuliskan analisis penyebab (misal: serangan Thrips, defisiensi kalsium, dll) dan mekanisme pengendaliannya..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></textarea>
            </div>

            {/* Langkah Tindakan Lapangan */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Langkah Penanganan Praktis Lapangan (Poin Bertahap):</span>
                <button
                  type="button"
                  onClick={handleAddStep}
                  style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Plus size={14} /> Tambah Langkah
                </button>
              </label>

              {steps.map((st, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                  <span style={{
                    minWidth: '24px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    color: '#15803d',
                    fontSize: '0.85rem'
                  }}>
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={`Langkah ke-${idx + 1}: misal gunakan perangkap kuning...`}
                    value={st}
                    onChange={(e) => handleStepChange(idx, e.target.value)}
                  />
                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(idx)}
                      style={{ color: '#ef4444', padding: '0 8px' }}
                      title="Hapus baris"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="button" className="btn-outline" onClick={onClose}>
                Batal
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                <Send size={16} />
                <span>{loading ? 'Menerbitkan...' : 'Terbitkan Jawaban Resmi'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
