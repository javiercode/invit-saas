import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import './PhotoGallery.css';

export const PhotoGallery = ({
  photos = [],
  title = "Nuestra Historia de Amor",
  subtitle = "Momentos especiales capturados en el tiempo"
}) => {
  const [selectedIdx, setSelectedIdx] = useState(null);

  if (!photos || photos.length === 0) return null;

  const openLightbox = (index) => setSelectedIdx(index);
  const closeLightbox = () => setSelectedIdx(null);

  const prevPhoto = (e) => {
    e.stopPropagation();
    setSelectedIdx((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    setSelectedIdx((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="gallery-section">
      {title && <h3 className="gallery-title">{title}</h3>}
      {subtitle && <p className="gallery-subtitle">{subtitle}</p>}

      <div className="gallery-grid">
        {photos.map((item, index) => {
          const url = typeof item === 'string' ? item : item.url;
          const caption = typeof item === 'string' ? '' : item.caption;

          return (
            <div
              key={index}
              className={`gallery-item ${index === 0 ? 'gallery-item-featured' : ''}`}
              onClick={() => openLightbox(index)}
            >
              <img src={url} alt={caption || `Foto ${index + 1}`} loading="lazy" />
              <div className="gallery-overlay">
                <Maximize2 size={24} className="gallery-zoom-icon" />
                {caption && <span className="gallery-caption">{caption}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedIdx !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close-btn" onClick={closeLightbox} aria-label="Cerrar foto">
            <X size={26} />
          </button>

          <button className="lightbox-nav-btn lightbox-prev" onClick={prevPhoto} aria-label="Foto anterior">
            <ChevronLeft size={36} />
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={typeof photos[selectedIdx] === 'string' ? photos[selectedIdx] : photos[selectedIdx].url}
              alt="Detalle"
            />
            {photos[selectedIdx]?.caption && (
              <p className="lightbox-caption">{photos[selectedIdx].caption}</p>
            )}
          </div>

          <button className="lightbox-nav-btn lightbox-next" onClick={nextPhoto} aria-label="Siguiente foto">
            <ChevronRight size={36} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
