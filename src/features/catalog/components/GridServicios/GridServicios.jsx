import React from 'react';
import CardCatalogo from '../CardCatalogo';
import { Sparkles } from 'lucide-react';
import './GridServicios.css';

export const GridServicios = ({ services = [], loading = false }) => {
  if (loading) {
    return (
      <div className="services-grid-skeleton">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-img" />
            <div className="skeleton-text" />
            <div className="skeleton-title" />
          </div>
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="services-empty-state">
        <Sparkles size={40} className="empty-icon" />
        <h3>No encontramos servicios con esos filtros</h3>
        <p>Prueba cambiando los criterios de búsqueda o estilo seleccionado.</p>
      </div>
    );
  }

  return (
    <div className="services-grid">
      {services.map((service) => (
        <CardCatalogo key={service.id} service={service} />
      ))}
    </div>
  );
};

export default GridServicios;
