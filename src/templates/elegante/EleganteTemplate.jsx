import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Heart, Sparkles } from 'lucide-react';
import CountdownTimer from '../../features/builder/components/CountdownTimer/CountdownTimer';
import InteractiveMap from '../../features/builder/components/InteractiveMap/InteractiveMap';
import PhotoGallery from '../../features/builder/components/PhotoGallery/PhotoGallery';
import GiftTable from '../../features/builder/components/GiftTable/GiftTable';
import RsvpModal from '../../features/builder/components/RsvpModal/RsvpModal';
import './EleganteTemplate.css';

export const EleganteTemplate = ({ data = {} }) => {
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);

  const {
    id,
    couple = { bride: 'Novia', groom: 'Novio', initials: 'N & N' },
    eventDate = '2026-12-31T20:00:00',
    locations = {},
    itinerary = [],
    dressCode = {},
    gallery = [],
    gifts = {},
    rsvpDeadline,
    heroImage
  } = data;

  const formattedDate = new Date(eventDate).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="tpl-elegante-wrapper">
      {/* Hero Section */}
      <header
        className="tpl-elegante-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(18, 18, 18, 0.45), rgba(18, 18, 18, 0.7)), url(${heroImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'})`
        }}
      >
        <div className="hero-content">
          <div className="hero-monogram">
            <span className="monogram-text">{couple.initials || 'J & M'}</span>
          </div>
          <span className="hero-subtitle">¡Nos Casamos!</span>
          <h1 className="hero-names">
            {couple.bride} <span className="ampersand">&</span> {couple.groom}
          </h1>

          {couple.quote && <p className="hero-quote">{couple.quote}</p>}

          <div className="hero-date-badge">
            <Calendar size={18} />
            <span className="date-text">{formattedDate}</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="tpl-elegante-body">
        {/* Countdown Timer */}
        <section className="section-card timer-section">
          <Sparkles className="section-decor-icon" size={24} />
          <CountdownTimer targetDate={eventDate} label="Tiempo restante para nuestra unión" />
        </section>

        {/* Locations: Ceremony & Reception */}
        <section className="locations-section">
          <div className="section-header">
            <span className="section-badge">Dónde & Cuándo</span>
            <h2 className="section-title">Nuestra Celebración</h2>
          </div>

          {locations.ceremony && (
            <InteractiveMap
              title={locations.ceremony.title || "Ceremonia Religiosa"}
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
              title={locations.reception.title || "Recepción"}
              placeName={locations.reception.place}
              time={locations.reception.time}
              address={locations.reception.address}
              city={locations.reception.city}
              googleMapsUrl={locations.reception.googleMapsUrl}
              wazeUrl={locations.reception.wazeUrl}
            />
          )}
        </section>

        {/* Itinerary */}
        {itinerary && itinerary.length > 0 && (
          <section className="section-card itinerary-section">
            <div className="section-header">
              <span className="section-badge">Cronograma</span>
              <h2 className="section-title">Itinerario del Día</h2>
            </div>
            <div className="itinerary-timeline">
              {itinerary.map((step, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-time">
                    <Clock size={16} />
                    <span>{step.time}</span>
                  </div>
                  <div className="timeline-dot" />
                  <div className="timeline-info">
                    <span className="timeline-title">{step.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Dress Code */}
        {dressCode && (
          <section className="section-card dresscode-section">
            <div className="section-header">
              <span className="section-badge">Etiqueta</span>
              <h2 className="section-title">{dressCode.title || 'Código de Vestimenta'}</h2>
            </div>
            <p className="dresscode-type">{dressCode.type}</p>
            {dressCode.description && (
              <p className="dresscode-desc">{dressCode.description}</p>
            )}
          </section>
        )}

        {/* Photo Gallery */}
        {gallery && gallery.length > 0 && (
          <PhotoGallery photos={gallery} />
        )}

        {/* Gift Table */}
        {gifts && (
          <GiftTable
            message={gifts.message}
            stores={gifts.stores}
            bankDetails={gifts.bankDetails}
          />
        )}

        {/* Bottom Call to Action */}
        <section className="section-card rsvp-cta-card">
          <Heart size={36} className="heart-cta-icon" />
          <h2 className="cta-title">¿Nos acompañas en este día inolvidable?</h2>
          <p className="cta-subtitle">
            Tu presencia es indispensable para nosotros. Confirma tu asistencia lo antes posible.
          </p>
          <button className="cta-rsvp-btn" onClick={() => setIsRsvpOpen(true)}>
            Confirmar Asistencia (RSVP)
          </button>
        </section>
      </main>

      {/* Floating Sticky Mobile RSVP Bar */}
      <div className="floating-rsvp-bar">
        <div className="bar-info">
          <span className="bar-names">{couple.bride} & {couple.groom}</span>
          <span className="bar-date">{new Date(eventDate).toLocaleDateString()}</span>
        </div>
        <button className="bar-rsvp-btn" onClick={() => setIsRsvpOpen(true)}>
          Confirmar RSVP
        </button>
      </div>

      {/* RSVP Modal */}
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

export default EleganteTemplate;
