import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Eye, Sparkles } from 'lucide-react';
import './CardCatalogo.css';

export const CardCatalogo = ({ service }) => {
  const {
    id,
    title,
    eventType,
    style,
    price,
    description,
    image,
    tags = [],
    templateId = 'elegante',
    rating = 4.9,
    reviewsCount = 50
  } = service;

  // Enlace de demo directo a la plantilla correspondiente
  const demoSlug = templateId === 'vintage' ? 'boda-juan-y-maria' : 'j-m-2024';

  return (
    <article className="catalog-card">
      <div className="card-media-wrapper">
        <img src={image} alt={title} className="card-image" loading="lazy" />
        <div className="card-badge-row">
          {tags[0] && <span className="card-tag tag-primary">{tags[0]}</span>}
          {style && <span className="card-tag tag-style">{style}</span>}
        </div>
        <Link 
          to={`/invitacion/${demoSlug}`} 
          className="card-quick-preview-btn"
          title="Ver invitación interactiva en vivo"
        >
          <Eye size={16} />
          <span>Ver Demo</span>
        </Link>
      </div>

      <div className="card-content">
        <div className="card-meta">
          <div className="card-rating">
            <Star size={14} className="star-icon" />
            <span className="rating-val">{rating}</span>
            <span className="reviews-val">({reviewsCount})</span>
          </div>
          <span className="card-price">${price.toFixed(2)} USD</span>
        </div>

        <h3 className="card-title">{title}</h3>
        <p className="card-desc">{description}</p>

        <div className="card-actions">
          <Link to={`/simulador?template=${templateId}`} className="card-btn-customize">
            <Sparkles size={16} />
            <span>Personalizar</span>
          </Link>
          <Link to={`/invitacion/${demoSlug}`} className="card-btn-demo">
            Demo
          </Link>
        </div>
      </div>
    </article>
  );
};

export default CardCatalogo;
