import React from 'react';
import { Sprout, Heart, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-brand">
            <h3>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#16a34a',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sprout size={20} color="#fff" />
              </div>
              <span>Tanya Tani</span>
            </h3>
            <p>
              Platform konsultasi dan tanya-jawab pertanian modern berbasis teknologi.
              Menghubungkan petani nusantara dengan pakar agronomi, peneliti proteksi tanaman,
              dan praktisi pertanian presisi.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Navigasi</h4>
            <ul className="footer-links">
              <li><a href="#beranda">Beranda</a></li>
              <li><a href="#konsultasi">Tanya Ahli</a></li>
              <li><a href="#daftar-pertanyaan">Daftar Kasus & Solusi</a></li>
            </ul>
          </div>

          {/* Topik Populer */}
          <div className="footer-col">
            <h4>Topik Unggulan</h4>
            <ul className="footer-links">
              <li><a href="#daftar-pertanyaan">Hama Tanaman Cabai & Padi</a></li>
              <li><a href="#daftar-pertanyaan">Pupuk Organik Cair & Padat</a></li>
              <li><a href="#daftar-pertanyaan">Hidroponik & NFT Modern</a></li>
              <li><a href="#daftar-pertanyaan">Pascapanen & Penggudangan</a></li>
              <li><a href="#daftar-pertanyaan">Bibit Unggul Bersertifikat</a></li>
            </ul>
          </div>

          {/* Kontak & Dukungan */}
          <div className="footer-col">
            <h4>Hubungi Kami</h4>
            <ul className="footer-links" style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={15} color="#22c55e" />
                <a href="mailto:saputrarahmad728@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>
                  saputrarahmad728@gmail.com
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={15} color="#22c55e" />
                <a href="tel:+628588905020" style={{ color: 'inherit', textDecoration: 'none' }}>
                  +62 858 8905 020
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={15} color="#22c55e" style={{ marginTop: '3px', flexShrink: 0 }} />
                <span>Sentra Inovasi Agribisnis Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} Tanya Tani Indonesia. Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Dibuat dengan</span>
            <Heart size={14} color="#ef4444" fill="#ef4444" />
            <span>untuk kemajuan Petani Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
