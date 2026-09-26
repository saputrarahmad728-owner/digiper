import React, { useState } from 'react';
import { Sprout, MessageSquarePlus, Menu, X, Database, LogOut, CheckCircle2, MessageSquareHeart } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import { ExpertUser } from '../types';
import { getInitials } from '../lib/avatar';

interface NavbarProps {
  currentExpert: ExpertUser | null;
  onOpenAskForm: () => void;
  onOpenSupabaseModal: () => void;
  onOpenAuthModal: () => void;
  onLogoutExpert: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentExpert,
  onOpenAskForm,
  onOpenSupabaseModal,
  onOpenAuthModal,
  onLogoutExpert
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isConnected = isSupabaseConfigured();

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <a href="#" className="brand-logo">
          <div className="logo-icon-wrap">
            <Sprout size={24} strokeWidth={2.5} />
          </div>
          <span>Tanya Tani</span>
        </a>

        {/* Nav Links + Mobile Drawer */}
        <nav className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <a
            href="#beranda"
            className="nav-link active"
            onClick={(e) => { e.preventDefault(); handleScrollTo('beranda'); }}
          >
            Beranda
          </a>
          <a
            href="#daftar-pertanyaan"
            className="nav-link"
            onClick={(e) => { e.preventDefault(); handleScrollTo('daftar-pertanyaan'); }}
          >
            Daftar Kasus
          </a>
          <a
            href="#konsultasi"
            className="nav-link"
            onClick={(e) => { e.preventDefault(); handleScrollTo('konsultasi'); }}
          >
            Tanya Ahli
          </a>

          {/* Menu Tambahan Khusus di Tampilan Mobile Drawer */}
          <div className="mobile-drawer-footer">
            {currentExpert ? (
              <div className="mobile-expert-profile">
                <div className="expert-avatar-initials-sm" title={currentExpert.name}>
                  {getInitials(currentExpert.name)}
                </div>
                <div className="expert-nav-info" style={{ flex: 1 }}>
                  <span className="expert-nav-name">{currentExpert.name}</span>
                  <span className="expert-nav-badge">
                    <CheckCircle2 size={12} /> Penjawab Aktif
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-logout"
                  onClick={() => { setMobileMenuOpen(false); onLogoutExpert(); }}
                  title="Keluar akun"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn-bantu-jawab mobile-drawer-btn"
                onClick={() => { setMobileMenuOpen(false); onOpenAuthModal(); }}
              >
                <MessageSquareHeart size={16} />
                <span>Masuk / Bantu Jawab Kasus</span>
              </button>
            )}

            <button
              type="button"
              className={`db-status-pill mobile-drawer-pill ${isConnected ? 'connected' : 'demo'}`}
              onClick={() => { setMobileMenuOpen(false); onOpenSupabaseModal(); }}
            >
              <span className={`status-dot ${isConnected ? 'green' : 'yellow'}`}></span>
              <Database size={13} />
              <span>{isConnected ? 'Database Cloud: Terhubung' : 'Mode Offline / Lokal'}</span>
            </button>
          </div>
        </nav>

        {/* Nav Actions (Top Header Bar) */}
        <div className="nav-actions">
          {/* Supabase Status Indicator Pill (Desktop Only) */}
          <button
            type="button"
            className={`db-status-pill desktop-only ${isConnected ? 'connected' : 'demo'}`}
            onClick={onOpenSupabaseModal}
            title="Klik untuk konfigurasi database Supabase"
          >
            <span className={`status-dot ${isConnected ? 'green' : 'yellow'}`}></span>
            <Database size={13} />
          </button>

          {/* CTA Bantu Jawab / Profil Pakar (Desktop Only) */}
          <div className="desktop-only">
            {currentExpert ? (
              <div className="expert-nav-profile">
                <div className="expert-avatar-initials-sm" title={currentExpert.name}>
                  {getInitials(currentExpert.name)}
                </div>
                <div className="expert-nav-info">
                  <span className="expert-nav-name">{currentExpert.name.split(',')[0]}</span>
                  <span className="expert-nav-badge">
                    <CheckCircle2 size={11} /> Penjawab
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-logout"
                  onClick={onLogoutExpert}
                  title="Keluar akun"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn-bantu-jawab"
                onClick={onOpenAuthModal}
                title="Masuk atau daftar untuk ikut menjawab pertanyaan petani"
              >
                <MessageSquareHeart size={16} />
                <span>Bantu Jawab</span>
              </button>
            )}
          </div>

          {/* Mulai Bertanya Button (Responsive: 'Tanya' di HP, 'Mulai Bertanya' di Laptop) */}
          <button
            type="button"
            className="btn-primary btn-navbar-ask"
            onClick={onOpenAskForm}
            id="btn-mulai-bertanya"
          >
            <MessageSquarePlus size={17} />
            <span className="btn-label-desktop">Mulai Bertanya</span>
            <span className="btn-label-mobile">Tanya</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
};
