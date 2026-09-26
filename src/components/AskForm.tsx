import React, { useState, useRef } from 'react';
import { Send, MessageSquareQuote, AlertCircle, CheckCircle, ImagePlus, X, Upload } from 'lucide-react';
import { NewQuestionInput, UrgencyLevel } from '../types';

interface AskFormProps {
  onSubmitQuestion: (data: NewQuestionInput) => Promise<boolean>;
  defaultCategory?: string;
}

export const AskForm: React.FC<AskFormProps> = ({ onSubmitQuestion, defaultCategory = 'Hama Tanaman' }) => {
  const [farmerName, setFarmerName] = useState('');
  const [farmerRegion, setFarmerRegion] = useState('');
  const [cropType, setCropType] = useState('');
  const [category, setCategory] = useState(defaultCategory);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('sedang');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle upload foto gejala tanaman
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Batasi ukuran maksimal 3MB
    if (file.size > 3 * 1024 * 1024) {
      setErrorMsg('Ukuran foto terlalu besar (maksimal 3MB).');
      return;
    }

    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageBase64(null);
    setImageFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!farmerName.trim()) {
      setErrorMsg('Mohon isi nama Anda atau kelompok tani.');
      return;
    }
    if (!title.trim() || title.trim().length < 4) {
      setErrorMsg('Mohon isi inti pertanyaan Anda (minimal 4 karakter).');
      return;
    }
    if (!content.trim() || content.trim().length < 5) {
      setErrorMsg('Mohon jelaskan detail masalah atau gejala tanaman (minimal 5 karakter).');
      return;
    }

    setLoading(true);
    try {
      const ok = await onSubmitQuestion({
        farmer_name: farmerName.trim(),
        farmer_region: farmerRegion.trim() || 'Indonesia',
        crop_type: cropType.trim() || 'Tanaman Umum',
        category,
        title: title.trim(),
        content: content.trim(),
        image_url: imageBase64 || undefined,
        urgency
      });

      if (ok) {
        setSuccessMsg('Pertanyaan dan foto Anda berhasil dikirim langsung ke Database! Pertanyaan kini tampil di daftar konsultasi.');
        setTitle('');
        setContent('');
        setCropType('');
        handleRemoveImage();
        setTimeout(() => setSuccessMsg(''), 7000);
      }
    } catch (err: any) {
      console.error('Submit question error:', err);
      setErrorMsg(err.message || 'Gagal mengirim pertanyaan ke database. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="konsultasi" className="ask-box-card">
      <div className="ask-box-header">
        <div>
          <h2 className="ask-box-title">
            <MessageSquareQuote size={22} className="text-emerald-600" />
            <span>Formulir Tanya Masalah Pertanian</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
            🌾 Khusus petani: <strong>Langsung tulis pertanyaan tanpa perlu login</strong>.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="form-alert error">
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="form-alert success">
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="ask-form">
        {/* Identitas Petani */}
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Nama Petani / Kelompok Tani *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Contoh: Pak Joko Widodo"
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Wilayah / Daerah (Opsional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Contoh: Boyolali, Jawa Tengah"
              value={farmerRegion}
              onChange={(e) => setFarmerRegion(e.target.value)}
            />
          </div>
        </div>

        {/* Jenis Tanaman & Kategori (SS2 Fix: Tanpa tanda # dan diberi spasi) */}
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Komoditas / Tanaman *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Contoh: Cabai Rawit, Padi, Selada"
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Kategori *</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Hama Tanaman">Hama Tanaman</option>
              <option value="Pupuk Organik">Pupuk Organik</option>
              <option value="Hidroponik">Hidroponik</option>
              <option value="Pascapanen">Pascapanen</option>
              <option value="Bibit Unggul">Bibit Unggul</option>
            </select>
          </div>
        </div>

        {/* Judul Pertanyaan */}
        <div className="form-group">
          <label className="form-label">Inti Pertanyaan *</label>
          <input
            type="text"
            className="form-input"
            placeholder="Misal: Bagaimana cara mengatasi daun cabai keriting dan menguning?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Rincian Gejala */}
        <div className="form-group">
          <label className="form-label">Detail Gejala Lapangan *</label>
          <textarea
            className="form-textarea"
            placeholder="Jelaskan kondisi tanaman, umur tanam, luas lahan, dan upaya/obat yang sudah pernah dicoba..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Fitur Upload Gambar Gejala Tanaman */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ImagePlus size={16} className="text-emerald-600" />
            <span>Unggah Foto Tanaman / Hama (Opsional tapi Sangat Disarankan)</span>
          </label>

          {!imageBase64 ? (
            <div
              className="image-upload-dropzone"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={24} style={{ color: '#16a34a', marginBottom: '6px' }} />
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#15803d' }}>
                Klik untuk memilih foto daun, hama, atau buah
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Format JPG, PNG, atau WEBP (Maksimal 3MB)
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </div>
          ) : (
            <div className="image-preview-card">
              <img src={imageBase64} alt="Pratinjau tanaman" className="image-preview-thumb" />
              <div className="image-preview-info">
                <span className="image-preview-name">{imageFileName}</span>
                <span className="image-preview-status">Foto siap dilampirkan</span>
              </div>
              <button
                type="button"
                className="btn-remove-image"
                onClick={handleRemoveImage}
                title="Hapus foto"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Tingkat Urgensi */}
        <div className="form-group">
          <label className="form-label">Tingkat Urgensi Masalah:</label>
          <div className="urgency-options">
            <label className="urgency-label">
              <input
                type="radio"
                name="urgency"
                value="rendah"
                checked={urgency === 'rendah'}
                onChange={() => setUrgency('rendah')}
              />
              <span>Rendah (Pencegahan)</span>
            </label>
            <label className="urgency-label">
              <input
                type="radio"
                name="urgency"
                value="sedang"
                checked={urgency === 'sedang'}
                onChange={() => setUrgency('sedang')}
              />
              <span>Sedang (Gejala Awal)</span>
            </label>
            <label className="urgency-label urgent">
              <input
                type="radio"
                name="urgency"
                value="mendesak"
                checked={urgency === 'mendesak'}
                onChange={() => setUrgency('mendesak')}
              />
              <span>Mendesak (Serangan Masif)</span>
            </label>
          </div>
        </div>

        {/* Pesan Error / Validasi di dekat tombol kirim */}
        {errorMsg && (
          <div className="form-alert error" style={{ margin: '10px 0' }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="form-alert success" style={{ margin: '10px 0' }}>
            <CheckCircle size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tombol Kirim */}
        <div className="form-actions">
          <span className="form-helper">
            🌾 Pertanyaan langsung tersimpan ke Supabase dan tampil di daftar konsultasi.
          </span>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            id="btn-kirim-pertanyaan"
            style={{ minWidth: '220px', display: 'flex', justifyContent: 'center' }}
          >
            <Send size={16} className={loading ? 'animate-pulse' : ''} />
            <span>{loading ? 'Menyimpan ke Database...' : 'Kirim Pertanyaan Petani'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
