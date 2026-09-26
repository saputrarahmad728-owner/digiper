import React from 'react';

/**
 * Mengambil inisial nama pakar atau petani secara rapi
 * Menghilangkan gelar akademis umum agar inisial fokus pada nama inti
 * Contoh: "Rahmad, S.Pt" -> "R" atau "RS", "Ir. Bambang Trihatmojo" -> "BT"
 */
export const getInitials = (name?: string): string => {
  if (!name) return 'P';

  // Hapus gelar formal yang umum di Indonesia
  const clean = name
    .replace(/\b(ir|dr|drs|prof|s\.pt|s\.p|m\.sc|m\.p|m\.si|ph\.d|s\.t|m\.t|s\.si)\b/gi, '')
    .replace(/[^a-zA-Z\s]/g, '')
    .trim();

  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return name.charAt(0).toUpperCase() || 'P';
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Komponen untuk menyorot (highlight) huruf/kata yang dicari di konten
 */
interface HighlightTextProps {
  text: string;
  query?: string;
  className?: string;
}

export const HighlightText: React.FC<HighlightTextProps> = ({ text, query, className = '' }) => {
  if (!query || !query.trim() || !text) {
    return <span className={className}>{text}</span>;
  }

  const cleanQuery = query.trim();
  const escaped = cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="search-highlight">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};
