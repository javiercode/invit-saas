import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle, XCircle, Send, Heart, X, Loader2 } from 'lucide-react';
import { invitationsService } from '../../../../core/services/invitationsService';
import './RsvpModal.css';

export const RsvpModal = ({
  isOpen,
  onClose,
  invitationId,
  coupleNames = "los novios",
  deadlineDate
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    attending: 'yes',
    companionsCount: 1,
    dietaryRestrictions: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await invitationsService.submitRsvp(invitationId, {
        name: formData.name,
        phone: formData.phone,
        attending: formData.attending === 'yes',
        companionsCount: Number(formData.companionsCount),
        dietaryRestrictions: formData.dietaryRestrictions,
        message: formData.message
      });

      setSubmitted(true);
      if (formData.attending === 'yes') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error(err);
      setError('Hubo un error al registrar tu confirmación. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rsvp-overlay" onClick={onClose}>
      <div className="rsvp-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="rsvp-close-btn" onClick={onClose} aria-label="Cerrar modal">
          <X size={20} />
        </button>

        {submitted ? (
          <div className="rsvp-success-view">
            <div className="rsvp-success-icon">
              {formData.attending === 'yes' ? (
                <CheckCircle size={48} className="text-success" />
              ) : (
                <Heart size={48} className="text-heart" />
              )}
            </div>
            <h3>¡Gracias por responder!</h3>
            <p>
              {formData.attending === 'yes'
                ? `Tu asistencia ha sido confirmada con éxito. ¡${coupleNames} están felices de compartir este día contigo!`
                : `Agradecemos que nos hayas avisado. Te tendremos en el corazón durante este día tan especial.`}
            </p>
            <button className="rsvp-primary-btn" onClick={onClose}>
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rsvp-form">
            <div className="rsvp-header">
              <span className="rsvp-badge">Confirmar Asistencia</span>
              <h2 className="rsvp-title">¿Nos acompañas?</h2>
              {deadlineDate && (
                <p className="rsvp-deadline">Favor de confirmar antes del {deadlineDate}</p>
              )}
            </div>

            {error && <div className="rsvp-error-banner">{error}</div>}

            <div className="rsvp-attendance-selector">
              <label className={`attendance-option ${formData.attending === 'yes' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="attending"
                  value="yes"
                  checked={formData.attending === 'yes'}
                  onChange={() => setFormData({ ...formData, attending: 'yes' })}
                />
                <CheckCircle size={18} />
                <span>Sí, asistiré con gusto</span>
              </label>

              <label className={`attendance-option ${formData.attending === 'no' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="attending"
                  value="no"
                  checked={formData.attending === 'no'}
                  onChange={() => setFormData({ ...formData, attending: 'no' })}
                />
                <XCircle size={18} />
                <span>No podré asistir</span>
              </label>
            </div>

            <div className="form-group">
              <label>Nombre y Apellido *</label>
              <input
                type="text"
                required
                placeholder="Ej. Carlos Mendoza"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Teléfono de Contacto (WhatsApp)</label>
              <input
                type="tel"
                placeholder="Ej. +52 33 1234 5678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            {formData.attending === 'yes' && (
              <>
                <div className="form-group">
                  <label>Número de pases / personas confirmadas</label>
                  <select
                    value={formData.companionsCount}
                    onChange={(e) => setFormData({ ...formData, companionsCount: e.target.value })}
                  >
                    <option value="1">1 Persona</option>
                    <option value="2">2 Personas</option>
                    <option value="3">3 Personas</option>
                    <option value="4">4 Personas</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Restricciones Alimentarias o Alergias</label>
                  <input
                    type="text"
                    placeholder="Ej. Vegetariano, intolerancia al gluten, etc."
                    value={formData.dietaryRestrictions}
                    onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label>Mensaje o buenos deseos para la pareja</label>
              <textarea
                rows="3"
                placeholder="Escribe unas palabras de felicitación..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button type="submit" className="rsvp-submit-btn" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 size={18} className="spin-icon" />
                  <span>Enviando confirmación...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Enviar Confirmación</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RsvpModal;
