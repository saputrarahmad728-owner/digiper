import React from 'react';
import { BookOpen, Clock, Calendar, ArrowRight } from 'lucide-react';
import { ArticleItem } from '../types';

export const ARTICLES_DATA: ArticleItem[] = [
  {
    id: 'art-1',
    title: 'Panduan Lengkap Pengendalian Hama Thrips pada Cabai Berkelanjutan',
    category: 'Hama Tanaman',
    readTime: '5 mnt baca',
    author: 'Ir. Bambang Trihatmojo',
    date: '24 Sep 2026',
    snippet: 'Kombinasi musuh alami, perangkap warna kuning, serta rotasi bahan aktif untuk mencegah resistensi thrips pada daun cabai muda.',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'art-2',
    title: 'Formula Fermentasi POC Kaya Kalium untuk Pembesaran Buah & Umbi',
    category: 'Pupuk Organik',
    readTime: '6 mnt baca',
    author: 'Dr. Ir. Sri Mulyani',
    date: '20 Sep 2026',
    snippet: 'Memanfaatkan sabut kelapa dan batang pisang yang difermentasi dengan mikroorganisme lokal (MOL) untuk menggenjot bobot hasil panen.',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'art-3',
    title: 'Manajemen Nutrisi Hidroponik NFT Saat Cuaca Panas Ekstrem',
    category: 'Hidroponik',
    readTime: '4 mnt baca',
    author: 'Hendra Wijaya, S.P.',
    date: '15 Sep 2026',
    snippet: 'Strategi menjaga dissolved oxygen (DO), kestabilan pH 5.5-6.5, serta teknik pencegahan busuk akar (pythium) di instalasi komersial.',
    imageUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80'
  }
];

export const ArticlesSection: React.FC = () => {
  return (
    <section id="artikel" className="articles-section">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#16a34a',
            fontWeight: 700,
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '6px'
          }}>
            <BookOpen size={16} />
            <span>Pustaka Petani Modern</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
            Artikel & Panduan Budidaya Terbaru
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.98rem', marginTop: '8px' }}>
            Pelajari teknik bercocok tanam yang terbukti meningkatkan produktivitas dan meminimalisir kegagalan panen.
          </p>
        </div>

        <div className="articles-grid">
          {ARTICLES_DATA.map((art) => (
            <article key={art.id} className="article-card">
              <img
                src={art.imageUrl}
                alt={art.title}
                className="article-thumb"
                loading="lazy"
              />
              <div className="article-content">
                <span className="article-tag">{art.category}</span>
                <h3 className="article-title">{art.title}</h3>
                <p className="article-snippet">{art.snippet}</p>
                <div className="article-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} /> {art.date}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} /> {art.readTime}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
