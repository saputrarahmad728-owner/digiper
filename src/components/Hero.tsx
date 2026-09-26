import React from 'react';
import { Search, Sparkles } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit?: (query: string) => void;
  onSuggestionClick: (suggestion: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onSuggestionClick
}) => {
  const suggestions = [
    'Daun cabai keriting',
    'Pupuk kohe kambing',
    'Tip burn selada',
    'Kadar air jagung',
    'Hama ulat grayak'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchQuery);
    }
    const target = document.getElementById('daftar-pertanyaan');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="beranda" className="hero-section">
      <div className="hero-backdrop-glow"></div>
      <div className="container">
        <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge">
            <Sparkles size={16} className="text-amber-500" />
            <span>Platform Tanya Jawab Pertanian Terpercaya #1 di Indonesia</span>
          </div>

          {/* Title */}
          <h1 className="hero-title">
            Solusi Cepat untuk Masalah <span>Pertanian Anda</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-desc">
            Temukan jawaban akurat seputar hama tanaman, pupuk organik, bibit unggul,
            hingga teknik hidroponik langsung dari praktisi dan pakar agronomi berpengalaman.
          </p>

          {/* Search Bar */}
          <div className="hero-search-wrapper">
            <form onSubmit={handleSubmit} className="hero-search-box">
              <div className="search-icon-slot">
                <Search size={22} />
              </div>
              <input
                type="text"
                className="hero-search-input"
                id="search-input-pertanian"
                placeholder="Cari solusi: hama padi, pupuk organik, bibit cabai, klaten, wereng..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit(e);
                  }
                }}
              />
              <button type="submit" className="hero-search-btn" id="btn-cari-solusi">
                Cari Solusi
              </button>
            </form>

            {/* Quick Suggestions Chips */}
            <div className="hero-suggestions">
              <span>Populer dicari:</span>
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="suggestion-chip"
                  onClick={() => onSuggestionClick(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
