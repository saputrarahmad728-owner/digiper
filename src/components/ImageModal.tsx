import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Download, Maximize2 } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  imageAlt?: string;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  imageUrl,
  imageAlt = 'Foto Gejala Tanaman',
  onClose
}) => {
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialTouchDistRef = useRef<number | null>(null);
  const initialScaleRef = useRef<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset posisi dan zoom setiap kali modal dibuka / gambar berubah
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setIsDragging(false);
      // Cegah scrolling pada body saat modal terbuka
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, imageUrl]);

  // Tombol keyboard (Esc untuk tutup, +/- untuk zoom, 0 untuk reset)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, scale]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(Number((prev + 0.35).toFixed(2)), 4));
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const next = Math.max(Number((prev - 0.35).toFixed(2)), 0.6);
      if (next <= 1) {
        setPosition({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Double click / tap untuk toggle zoom cepat
  const handleDoubleClick = () => {
    if (scale > 1.2) {
      handleReset();
    } else {
      setScale(2);
    }
  };

  // Zoom dengan roda mouse (scroll wheel)
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY < 0 ? 0.2 : -0.2;
    setScale((prev) => {
      const next = Math.min(Math.max(Number((prev + delta).toFixed(2)), 0.6), 4);
      if (next <= 1) {
        setPosition({ x: 0, y: 0 });
      }
      return next;
    });
  };

  // Dragging / panning dengan mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Hanya klik kiri
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch gesture untuk layar HP (Pinch-to-zoom & Swipe pan)
  const getTouchDistance = (touches: React.TouchList): number => {
    return Math.hypot(
      touches[0].clientX - touches[1].clientX,
      touches[0].clientY - touches[1].clientY
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      };
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      initialTouchDistRef.current = getTouchDistance(e.touches);
      initialScaleRef.current = scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      setPosition({
        x: e.touches[0].clientX - dragStartRef.current.x,
        y: e.touches[0].clientY - dragStartRef.current.y
      });
    } else if (e.touches.length === 2 && initialTouchDistRef.current !== null) {
      const currentDist = getTouchDistance(e.touches);
      const ratio = currentDist / initialTouchDistRef.current;
      const next = Math.min(Math.max(Number((initialScaleRef.current * ratio).toFixed(2)), 0.6), 4);
      setScale(next);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    initialTouchDistRef.current = null;
  };

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="image-lightbox-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Penampil Foto Gejala"
    >
      {/* Floating Header Toolbar */}
      <div className="lightbox-toolbar" onClick={(e) => e.stopPropagation()}>
        <div className="lightbox-zoom-controls">
          <button
            type="button"
            className="lightbox-btn"
            onClick={handleZoomOut}
            title="Perkecil (-)"
            aria-label="Zoom out"
          >
            <ZoomOut size={18} />
          </button>

          <span className="lightbox-zoom-level" onClick={handleReset} title="Klik untuk reset">
            {Math.round(scale * 100)}%
          </span>

          <button
            type="button"
            className="lightbox-btn"
            onClick={handleZoomIn}
            title="Perbesar (+)"
            aria-label="Zoom in"
          >
            <ZoomIn size={18} />
          </button>

          <button
            type="button"
            className="lightbox-btn"
            onClick={handleReset}
            title="Reset Ukuran (0)"
            aria-label="Reset zoom"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        <button
          type="button"
          className="lightbox-btn lightbox-close-btn"
          onClick={onClose}
          title="Tutup (Esc)"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Image Stage */}
      <div
        ref={containerRef}
        className="lightbox-stage"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
        style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in' }}
      >
        <img
          src={imageUrl}
          alt={imageAlt}
          className="lightbox-image"
          onDoubleClick={handleDoubleClick}
          draggable={false}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.18s ease-out'
          }}
        />
      </div>

      {/* Footer Caption */}
      <div className="lightbox-caption" onClick={(e) => e.stopPropagation()}>
        <span className="lightbox-caption-text">{imageAlt}</span>
        <span className="lightbox-hint">
          Gunakan scroll / cubit layar untuk zoom, geser untuk menggeser foto
        </span>
      </div>
    </div>
  );
};
