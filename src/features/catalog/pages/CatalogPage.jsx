import React, { useState, useEffect, useMemo } from 'react';
import FilterBar from '../components/FilterBar';
import GridServicios from '../components/GridServicios';
import { invitationsService } from '../../../core/services/invitationsService';
import { Sparkles, Smartphone, CheckCircle, ShieldCheck } from 'lucide-react';
import './CatalogPage.css';

export const CatalogPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventType, setSelectedEventType] = useState('all');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await invitationsService.getCatalogServices();
        setServices(data);
      } catch (err) {
        console.error('Error al cargar catálogo:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filtrado y ordenamiento de servicios
  const filteredServices = useMemo(() => {
    let result = [...services];

    if (selectedEventType !== 'all') {
      result = result.filter((s) => s.eventType === selectedEventType);
    }

    if (selectedStyle !== 'all') {
      result = result.filter((s) => s.style === selectedStyle);
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [services, selectedEventType, selectedStyle, sortBy]);

  return (
    <div className="catalog-page-container">
      {/* Hero del Catálogo (Estética Canva Minimalista) */}
      <header className="catalog-hero">
        <div className="catalog-hero-inner">
          <span className="catalog-hero-badge">
            <Sparkles size={14} />
            <span>Colección 2026</span>
          </span>
          <h1 className="catalog-hero-title">
            Invitaciones Digitales <br />
            <span className="text-highlight">Interactivas & Memorables</span>
          </h1>
          <p className="catalog-hero-desc">
            Diseños responsivos de alta gama inspirados en la estética limpia de Canva. Con cuenta
            regresiva, confirmación de asistencia en tiempo real, mapas y galerías.
          </p>

          <div className="catalog-features-badges">
            <div className="feat-chip">
              <Smartphone size={16} />
              <span>100% Mobile First</span>
            </div>
            <div className="feat-chip">
              <CheckCircle size={16} />
              <span>RSVP en Vivo</span>
            </div>
            <div className="feat-chip">
              <ShieldCheck size={16} />
              <span>Despliegue Instantáneo</span>
            </div>
          </div>
        </div>
      </header>

      {/* Sección Principal con Filtros y Grid */}
      <main className="catalog-main-content">
        <div className="catalog-toolbar-header">
          <div>
            <h2 className="catalog-section-title">Nuestras Plantillas & Servicios</h2>
            <p className="catalog-section-subtitle">
              Mostrando {filteredServices.length} diseños disponibles
            </p>
          </div>
        </div>

        <FilterBar
          selectedEventType={selectedEventType}
          onSelectEventType={setSelectedEventType}
          selectedStyle={selectedStyle}
          onSelectStyle={setSelectedStyle}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <GridServicios services={filteredServices} loading={loading} />
      </main>
    </div>
  );
};

export default CatalogPage;
