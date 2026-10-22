import React from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import './InteractiveMap.css';

export const InteractiveMap = ({
  title = "Ubicación",
  placeName,
  time,
  address,
  city,
  googleMapsUrl,
  wazeUrl,
  embedUrl
}) => {
  return (
    <div className="location-card">
      <div className="location-header">
        <div className="location-icon-wrapper">
          <MapPin size={24} className="location-icon" />
        </div>
        <h3 className="location-title">{title}</h3>
        {placeName && <h4 className="location-place">{placeName}</h4>}
        {time && <p className="location-time">{time}</p>}
      </div>

      <div className="location-body">
        {address && <p className="location-address">{address}</p>}
        {city && <p className="location-city">{city}</p>}

        {embedUrl ? (
          <div className="location-embed-container">
            <iframe
              title={`Mapa de ${placeName || title}`}
              src={embedUrl}
              className="location-iframe"
              loading="lazy"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="location-map-placeholder">
            <MapPin size={32} className="map-placeholder-icon" />
            <span>Ver mapa en tiempo real con tu app preferida</span>
          </div>
        )}

        <div className="location-actions">
          {googleMapsUrl && (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="map-button map-button-google"
            >
              <Navigation size={18} />
              <span>Abrir Google Maps</span>
              <ExternalLink size={14} className="external-icon" />
            </a>
          )}
          {wazeUrl && (
            <a
              href={wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="map-button map-button-waze"
            >
              <Navigation size={18} />
              <span>Abrir con Waze</span>
              <ExternalLink size={14} className="external-icon" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
