import React, { useState } from 'react';
import { Calendar, Clock, Heart, Flower2 } from 'lucide-react';
import CountdownTimer from '../../features/builder/components/CountdownTimer/CountdownTimer';
import InteractiveMap from '../../features/builder/components/InteractiveMap/InteractiveMap';
import PhotoGallery from '../../features/builder/components/PhotoGallery/PhotoGallery';
import GiftTable from '../../features/builder/components/GiftTable/GiftTable';
import RsvpModal from '../../features/builder/components/RsvpModal/RsvpModal';
import './VintageTemplate.css';

export const VintageTemplate = ({ data = {} }) => {
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);

  const {
    id,
    couple = { bride: 'María', groom: 'Juan', initials: 'M & J' },
    eventDate = '2026-10-15T17:00:00',
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
    <div className="tpl-vintage-wrapper">
      {/* Botanical Header Banner */}
      <header
        className="tpl-vintage-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(44, 53, 47, 0.45), rgba(44, 53, 47, 0.7)), url(${heroImage || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80'})`
        }}
      >
        <div className="vintage-hero-content">
          <div className="vintage-wreath-icon">
            <Flower2 size={32} />
          </div>
          <span className="vintage-pre-title">Nuestra Boda Campestre</span>
          <h1 className="vintage-names">
            {couple.bride} <span className="vintage-and">&</span> {couple.groom}
          </h1>

          {couple.quote && <p className="vintage-quote">{couple.quote}</p>}

          <div className="vintage-date-tag">
            <Calendar size={18} />
            <span>{formattedDate}</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="tpl-vintage-body">
        {/* Countdown */}
        <section className="vintage-card">
          <CountdownTimer targetDate={eventDate} label="La cuenta regresiva ha comenzado" />
        </section>

        {/* Locations */}
        <section className="vintage-section">
          <div className="vintage-header-group">
            <span className="vintage-badge">Lugar y Fecha</span>
            <h2 className="vintage-title">Dónde nos reuniremos</h2>
          </div>

          {locations.ceremony && (
            <InteractiveMap
              title={locations.ceremony.title || "Ceremonia Campestre"}
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
              title={locations.reception.title || "Celebración"}
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
          <section className="vintage-card">
            <div className="vintage-header-group">
              <span className="vintage-badge">Momentos</span>
              <h2 className="vintage-title">El Itinerario</h2>
            </div>
            <div className="vintage-itinerary">
              {itinerary.map((step, idx) => (
                <div key={idx} className="vintage-timeline-row">
                  <div className="vintage-time-badge">
                    <Clock size={14} />
                    <span>{step.time}</span>
                  </div>
                  <div className="vintage-timeline-desc">
                    <strong>{step.title}</strong>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Dress Code */}
        {dressCode && (
          <section className="vintage-card">
            <div className="vintage-header-group">
              <span className="vintage-badge">Detalles</span>
              <h2 className="vintage-title">{dressCode.title || 'Código de Vestimenta'}</h2>
            </div>
            <p className="vintage-dress-type">{dressCode.type}</p>
            {dressCode.description && (
              <p className="vintage-dress-desc">{dressCode.description}</p>
            )}
          </section>
        )}

        {/* Gallery */}
        {gallery && gallery.length > 0 && (
          <PhotoGallery
            photos={gallery}
            title="Momentos Inolvidables"
            subtitle="Recuerdos del camino juntos"
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

        {/* RSVP Callout */}
        <section className="vintage-card vintage-rsvp-cta">
          <Heart size={32} className="vintage-heart" />
          <h2 className="vintage-title">¡Confirma tu Lugar!</h2>
          <p className="vintage-cta-text">
            Queremos que seas parte fundamental de nuestra historia de amor.
          </p>
          <button className="vintage-btn-rsvp" onClick={() => setIsRsvpOpen(true)}>
            Confirmar Asistencia
          </button>
        </section>
      </main>

      {/* Floating Bottom Bar */}
      <div className="vintage-floating-bar">
        <span>{couple.bride} & {couple.groom}</span>
        <button onClick={() => setIsRsvpOpen(true)}>RSVP</button>
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

export default VintageTemplate;
