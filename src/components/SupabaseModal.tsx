import React, { useState } from 'react';
import { X, Database, Check, Copy, ExternalLink, ShieldCheck, Terminal } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const isConnected = isSupabaseConfigured();

  if (!isOpen) return null;

  const copySqlInstruction = () => {
    const sqlText = `-- Jalankan file 'supabase_schema.sql' di SQL Editor Supabase
-- Tabel: questions, answers
-- Kebijakan RLS: Public Read & Insert`;
    navigator.clipboard.writeText(sqlText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: isConnected ? '#dcfce7' : '#fef3c7',
              color: isConnected ? '#15803d' : '#b45309',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Database size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                Integrasi Database Supabase
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Status: {isConnected ? 'Terhubung ke Live Database' : 'Mode Offline / Simulasi Lokal'}
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {isConnected ? (
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              padding: '14px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}>
              <ShieldCheck size={22} style={{ color: '#16a34a', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#14532d', fontSize: '0.95rem' }}>Supabase Berhasil Terhubung!</strong>
                <p style={{ color: '#166534', fontSize: '0.85rem', marginTop: '4px' }}>
                  Aplikasi Anda sedang membaca dan menyimpan data konsultasi langsung ke cloud database Supabase secara real-time.
                </p>
              </div>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              padding: '14px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}>
              <Terminal size={22} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#92400e', fontSize: '0.95rem' }}>Saat Ini Berjalan Dalam Mode Demo</strong>
                <p style={{ color: '#78350f', fontSize: '0.85rem', marginTop: '4px' }}>
                  Aplikasi tetap berfungsi 100% interaktif menggunakan penyimpanan lokal (LocalStorage). Untuk menghubungkan ke database Supabase Anda sendiri:
                </p>
              </div>
            </div>
          )}

          {/* Panduan 3 Langkah */}
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '10px', color: '#0f172a' }}>
              Cara Menghubungkan Supabase:
            </h4>
            <ol style={{ paddingLeft: '1.25rem', fontSize: '0.88rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                Buka <strong><a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: '#16a34a', textDecoration: 'underline' }}>supabase.com</a></strong> dan buat proyek baru (gratis).
              </li>
              <li>
                Buka menu <strong>SQL Editor</strong> di dashboard Supabase, lalu jalankan seluruh isi file <code>supabase_schema.sql</code> yang sudah kami sediakan di proyek ini.
              </li>
              <li>
                Salin <strong>Project URL</strong> dan <strong>Anon API Key</strong> dari <em>Project Settings &gt; API</em>.
              </li>
              <li>
                Isi ke dalam file <code>.env</code> Anda di lokal atau tambahkan ke menu <strong>Environment Variables</strong> di Vercel:
                <pre style={{
                  background: '#1e293b',
                  color: '#38bdf8',
                  padding: '10px',
                  borderRadius: '6px',
                  marginTop: '6px',
                  fontSize: '0.78rem',
                  overflowX: 'auto'
                }}>
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJh...
                </pre>
              </li>
            </ol>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              className="btn-outline"
              onClick={copySqlInstruction}
              style={{ fontSize: '0.85rem', padding: '8px 14px' }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Tersalin!' : 'Salin Info Schema SQL'}</span>
            </button>

            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
              style={{ fontSize: '0.85rem', padding: '8px 16px' }}
            >
              <span>Buka Supabase</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
