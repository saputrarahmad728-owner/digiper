import React, { useState } from 'react';
import { X, Mail, Lock, AlertCircle, UserPlus, LogIn, HeartHandshake, User, Briefcase } from 'lucide-react';
import { ExpertUser } from '../types';
import { supabase, isSupabaseConfigured, setStoredExpertUser } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (expert: ExpertUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [profession, setProfession] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (activeTab === 'register') {
        if (!name.trim()) {
          setErrorMsg('Mohon isi nama lengkap Anda.');
          setLoading(false);
          return;
        }

        if (isSupabaseConfigured() && supabase) {
          const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              data: {
                full_name: name.trim(),
                title: profession.trim() || 'Penyuluh & Praktisi Pertanian'
              }
            }
          });
          if (error) throw error;

          if (data.user) {
            // Simpan profil ke public.profiles
            try {
              await supabase.from('profiles').upsert({
                id: data.user.id,
                email: data.user.email || email.trim(),
                full_name: name.trim(),
                title: profession.trim() || 'Penyuluh & Praktisi Pertanian'
              });
            } catch (profErr) {
              console.warn('Upsert profile error:', profErr);
            }

            const userObj: ExpertUser = {
              id: data.user.id,
              email: data.user.email || email.trim(),
              name: name.trim(),
              title: profession.trim() || 'Penyuluh & Praktisi Pertanian',
              avatar: ''
            };
            setStoredExpertUser(userObj);
            onLoginSuccess(userObj);
            onClose();
          }
        } else {
          // Local/demo registration
          const userObj: ExpertUser = {
            id: 'user-' + Date.now(),
            email: email.trim(),
            name: name.trim(),
            title: profession.trim() || 'Penyuluh & Praktisi Pertanian',
            avatar: ''
          };
          setStoredExpertUser(userObj);
          onLoginSuccess(userObj);
          onClose();
        }
      } else {
        // Login Flow
        if (isSupabaseConfigured() && supabase) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password
          });
          if (error) {
            if (error.message.includes('Invalid login credentials')) {
              throw new Error('Email atau kata sandi tidak sesuai. Silakan periksa kembali atau gunakan tombol Quick Login Demo di bawah.');
            }
            throw error;
          }

          if (data.user) {
            let expertName = '';
            let expertTitle = 'Penyuluh & Praktisi Pertanian';

            const meta = data.user.user_metadata || {};
            if (meta.full_name) expertName = meta.full_name;
            if (meta.title) expertTitle = meta.title;

            // Coba ambil dari public.profiles
            try {
              const { data: prof } = await supabase
                .from('profiles')
                .select('full_name, title')
                .eq('id', data.user.id)
                .single();
              if (prof?.full_name) expertName = prof.full_name;
              if (prof?.title) expertTitle = prof.title;
            } catch {
              // Abaikan jika tidak ada
            }

            if (!expertName) {
              expertName = email.split('@')[0] ? 'Pakar ' + email.split('@')[0] : 'Pakar Tani';
            }

            const userObj: ExpertUser = {
              id: data.user.id,
              email: data.user.email || email.trim(),
              name: expertName,
              title: expertTitle,
              avatar: ''
            };
            setStoredExpertUser(userObj);
            onLoginSuccess(userObj);
            onClose();
          }
        } else {
          // Local/demo login
          const userObj: ExpertUser = {
            id: 'user-' + Date.now(),
            email: email.trim(),
            name: name.trim() || (email.split('@')[0] ? 'Pakar ' + email.split('@')[0] : 'Pakar Tani'),
            title: profession.trim() || 'Penyuluh & Praktisi Pertanian',
            avatar: ''
          };
          setStoredExpertUser(userObj);
          onLoginSuccess(userObj);
          onClose();
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setErrorMsg(err.message || 'Gagal memproses autentikasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '490px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#dcfce7',
              color: '#15803d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <HeartHandshake size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                {activeTab === 'register' ? 'Daftar Sebagai Penjawab' : 'Masuk Akun Penjawab'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Bantu petani Indonesia memecahkan masalah pertanian
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Note edukatif */}
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            padding: '10px 12px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            color: '#14532d'
          }}>
            🌱 <strong>Catatan:</strong> Petani yang ingin bertanya <strong>tidak perlu membuat akun</strong>. Pendaftaran ini khusus untuk Anda (agronom, penyuluh, praktisi, atau petani berpengalaman) yang ingin <strong>menjawab pertanyaan</strong> yang masuk.
          </div>

          {/* Tab Switcher: Daftar Akun Baru vs Masuk */}
          <div className="auth-tab-bar">
            <button
              type="button"
              className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
            >
              <UserPlus size={15} />
              <span>Daftar Akun Baru</span>
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
            >
              <LogIn size={15} />
              <span>Sudah Punya Akun (Masuk)</span>
            </button>
          </div>

          {errorMsg && (
            <div className="form-alert error">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeTab === 'register' && (
              <>
                <div className="form-group">
                  <label className="form-label">Nama Lengkap & Gelar (Bila ada) *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: '38px' }}
                      placeholder="Contoh: Ir. Hendra Saputra atau Budi (Praktisi Cabai)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <User size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Profesi / Keahlian / Asal *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: '38px' }}
                      placeholder="Misal: Penyuluh Pertanian / Dosen Agronomi / Praktisi Hidroponik"
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      required
                    />
                    <Briefcase size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Alamat Email *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="email.anda@contoh.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '6px' }} disabled={loading}>
              {activeTab === 'register' ? (
                <>
                  <UserPlus size={18} />
                  <span>{loading ? 'Mendaftarkan...' : 'Daftar & Siap Menjawab'}</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>{loading ? 'Memverifikasi...' : 'Masuk untuk Menjawab'}</span>
                </>
              )}
            </button>
          </form>


        </div>
      </div>
    </div>
  );
};
