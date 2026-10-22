import React, { useState } from 'react';
import { Calendar, Clock, Heart, Zap } from 'lucide-react';
import CountdownTimer from '../../features/builder/components/CountdownTimer/CountdownTimer';
import InteractiveMap from '../../features/builder/components/InteractiveMap/InteractiveMap';
import PhotoGallery from '../../features/builder/components/PhotoGallery/PhotoGallery';
import GiftTable from '../../features/builder/components/GiftTable/GiftTable';
import RsvpModal from '../../features/builder/components/RsvpModal/RsvpModal';
import './ModernaTemplate.css';

export const ModernaTemplate = ({ data = {} }) => {
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);

  const {
    id,
    couple = { bride: 'Valeria', groom: 'Mateo', initials: 'V + M' },
    eventDate = '2026-11-20T19:00:00',
    locations = {},
    itinerary = [],
    dressCode = {},
    gallery = [],
    gifts = {},
    rsvpDeadline,
    heroImage
  } = data;

  const formattedDate = new Date(eventDate).toLocaleDateString('es-ES', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="tpl-moderna-wrapper">
      {/* Sleek Minimalist Hero */}
      <header
        className="tpl-moderna-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.85)), url(${heroImage || 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80'})`
        }}
      >
        <div className="moderna-hero-container">
          <div className="moderna-badge-top">
            <Zap size={14} />
            <span>SAVE THE DATE</span>
          </div>

          <h1 className="moderna-title">
            <span>{couple.bride}</span>
            <span className="moderna-plus">+</span>
            <span>{couple.groom}</span>
          </h1>

          {couple.quote && <p className="moderna-quote">{couple.quote}</p>}

          <div className="moderna-date-pill">
            <Calendar size={16} />
            <span>{formattedDate}</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="tpl-moderna-body">
        {/* Countdown */}
        <div className="moderna-card">
          <CountdownTimer targetDate={eventDate} label="Tiempo para el evento" />
        </div>

        {/* Locations */}
        <div className="moderna-section">
          <div className="moderna-header-box">
            <span className="moderna-tag">COORDENADAS</span>
            <h2>Ubicación del Evento</h2>
          </div>

          {locations.ceremony && (
            <InteractiveMap
              title={locations.ceremony.title || "Lugar del Evento"}
              placeName={locations.ceremony.place}
              time={locations.ceremony.time}
              address={locations.ceremony.address}
              city={locations.ceremony.city}
              googleMapsUrl={locations.ceremony.googleMapsUrl}
              wazeUrl={locations.ceremony.wazeUrl}
            />
          )}

          {locations.reception && (
            <InteractiveMap
              title={locations.reception.title || "After & Fiesta"}
              placeName={locations.reception.place}
              time={locations.reception.time}
              address={locations.reception.address}
              city={locations.reception.city}
              googleMapsUrl={locations.reception.googleMapsUrl}
              wazeUrl={locations.reception.wazeUrl}
            />
          )}
        </div>

        {/* Itinerary */}
        {itinerary && itinerary.length > 0 && (
          <div className="moderna-card">
            <div className="moderna-header-box">
              <span className="moderna-tag">TIMELINE</span>
              <h2>Programa</h2>
            </div>
            <div className="moderna-grid-timeline">
              {itinerary.map((step, idx) => (
                <div key={idx} className="moderna-timeline-card">
                  <div className="moderna-step-time">
                    <Clock size={14} />
                    <span>{step.time}</span>
                  </div>
                  <span className="moderna-step-title">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dress Code */}
        {dressCode && (
          <div className="moderna-card">
            <div className="moderna-header-box">
              <span className="moderna-tag">DRESS CODE</span>
              <h2>{dressCode.title || 'Código de Vestimenta'}</h2>
            </div>
            <p className="moderna-code-type">{dressCode.type}</p>
            {dressCode.description && (
              <p className="moderna-code-desc">{dressCode.description}</p>
            )}
          </div>
        )}

        {/* Gallery */}
        {gallery && gallery.length > 0 && (
          <PhotoGallery
            photos={gallery}
            title="Galería Fotográfica"
            subtitle="Recorriendo nuestro camino"
          />
        )}

        {/* Gift Table */}
        {gifts && (
          <GiftTable
            message={gifts.message}
            stores={gifts.stores}
            bankDetails={gifts.bankDetails}
          />
        )}

        {/* RSVP Section */}
        <div className="moderna-card moderna-rsvp-box">
          <Heart size={32} className="moderna-heart-icon" />
          <h2>Confirma tu Asistencia</h2>
          <p>Te esperamos para celebrar juntos este momento único.</p>
          <button className="moderna-btn-rsvp" onClick={() => setIsRsvpOpen(true)}>
            Confirmar RSVP
          </button>
        </div>
      </main>

      {/* Floating Bottom Bar */}
      <div className="moderna-floating-bar">
        <span>{couple.bride} + {couple.groom}</span>
        <button onClick={() => setIsRsvpOpen(true)}>RSVP Ahora</button>
      </div>

      <RsvpModal
        isOpen={isRsvpOpen}
        onClose={() => setIsRsvpOpen(false)}
        invitationId={id}
        coupleNames={`${couple.bride} y ${couple.groom}`}
        deadlineDate={rsvpDeadline}
      />
    </div>
  );
};

export default ModernaTemplate;
