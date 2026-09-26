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

        {/* Desktop Nav Links */}
        <nav className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <a
            href="#beranda"
            className="nav-link active"
            onClick={(e) => { e.preventDefault(); handleScrollTo('beranda'); }}
          >
            Beranda
          </a>
          <a
            href="#konsultasi"
            className="nav-link"
            onClick={(e) => { e.preventDefault(); handleScrollTo('konsultasi'); }}
          >
            Tanya Ahli
          </a>
        </nav>

        {/* Nav Actions */}
        <div className="nav-actions">
          {/* Supabase Status Indicator Pill */}
          <button
            type="button"
            className={`db-status-pill ${isConnected ? 'connected' : 'demo'}`}
            onClick={onOpenSupabaseModal}
            title="Klik untuk konfigurasi database Supabase"
          >
            <span className={`status-dot ${isConnected ? 'green' : 'yellow'}`}></span>
            <Database size={13} />
            <span>{isConnected ? 'Supabase' : 'Lokal/Demo'}</span>
          </button>

          {/* CTA Buat yang Ingin Menjawab Pertanyaan (Bukan Eksklusif Pakar Saja) */}
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

          {/* Mulai Bertanya Button (Untuk Petani - Langsung Tanya) */}
          <button
            type="button"
            className="btn-primary"
            onClick={onOpenAskForm}
            id="btn-mulai-bertanya"
          >
            <MessageSquarePlus size={18} />
            <span>Mulai Bertanya</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};
