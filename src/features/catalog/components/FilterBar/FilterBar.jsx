import React from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import './FilterBar.css';

export const FilterBar = ({
  selectedEventType,
  onSelectEventType,
  selectedStyle,
  onSelectStyle,
  sortBy,
  onSortChange
}) => {
  const eventTypes = [
    { id: 'all', label: 'Todos los Eventos' },
    { id: 'bodas', label: 'Bodas' },
    { id: 'xv_anos', label: 'XV Años' },
    { id: 'bautizos', label: 'Bautizos' },
    { id: 'graduaciones', label: 'Graduaciones' }
  ];

  const styles = [
    { id: 'all', label: 'Todos los Estilos' },
    { id: 'elegante', label: 'Elegante & Oro' },
    { id: 'vintage', label: 'Boho & Vintage' },
    { id: 'moderna', label: 'Moderna & Minimal' }
  ];

  return (
    <div className="filter-bar-container">
      {/* Pills de tipo de evento - Horizontal scroll en mobile */}
      <div className="filter-pills-row">
        {eventTypes.map((type) => (
          <button
            key={type.id}
            type="button"
            className={`filter-pill ${selectedEventType === type.id ? 'active' : ''}`}
            onClick={() => onSelectEventType(type.id)}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Selector secundario de estilo y orden */}
      <div className="filter-controls-row">
        <div className="filter-group">
          <SlidersHorizontal size={15} className="filter-icon" />
          <span className="control-label">Estilo:</span>
          <select
            value={selectedStyle}
            onChange={(e) => onSelectStyle(e.target.value)}
            className="filter-select"
          >
            {styles.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <Filter size={15} className="filter-icon" />
          <span className="control-label">Ordenar:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="filter-select"
          >
            <option value="featured">Destacados</option>
            <option value="price-asc">Menor Precio</option>
            <option value="price-desc">Mayor Precio</option>
            <option value="rating">Mejor Calificados</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
