import React, { useState, useEffect } from 'react';
import { X, UserPlus, Link2, MessageCircle, Check } from 'lucide-react';
import { invitationsService } from '../../../core/services/invitationsService';
import './GuestListModal.css';

/** Link de confirmación con el invitado pre-registrado (?g=<id>) */
export const guestLink = (slug, guestId) =>
  `${window.location.origin}${import.meta.env.BASE_URL}invitacion/${slug}?g=${guestId}`;

/** Link de WhatsApp (wa.me) con el mensaje y el link de confirmación del invitado */
export const whatsappUrl = (g, slug) => {
  const text = encodeURIComponent(`Hola ${g.name}, confirma tu asistencia aquí: ${guestLink(slug, g.id)}`);
  return `https://wa.me/${(g.phone || '').replace(/\D/g, '')}?text=${text}`;
};

export const GuestListModal = ({ invitation, onClose }) => {
  const [rsvps, setRsvps] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [copied, setCopied] = useState(null);

  const load = () => invitationsService.listRsvps(invitation.id).then(setRsvps).catch(() => setRsvps([]));
  useEffect(() => { load(); }, [invitation.id]);

  const add = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    await invitationsService.addGuest(invitation.id, form);
    setForm({ name: '', phone: '' });
    load();
  };

  const copy = (g) => {
    navigator.clipboard.writeText(guestLink(invitation.slug, g.id));
    setCopied(g.id);
    setTimeout(() => setCopied(null), 2000);
  };

  const whatsapp = (g) => {
    window.open(whatsappUrl(g, invitation.slug), '_blank');
  };

  const statusLabel = (g) =>
    g.status === 'pending' ? 'Pendiente' : g.attending ? `Asiste (${g.companionsCount || 1})` : 'No asiste';

  return (
    <div className="guest-overlay" onClick={onClose}>
      <div className="guest-modal" onClick={(e) => e.stopPropagation()}>
        <button className="guest-close" onClick={onClose} aria-label="Cerrar"><X size={20} /></button>
        <h2>Confirmaciones — {invitation.title}</h2>

        <form className="guest-add" onSubmit={add}>
          <input required placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input type="tel" placeholder="Teléfono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <button type="submit"><UserPlus size={16} /> Agregar</button>
        </form>

        {rsvps.length === 0 ? (
          <p className="guest-empty">Aún no hay invitados ni confirmaciones.</p>
        ) : (
          <ul className="guest-list">
            {rsvps.map((g) => (
              <li key={g.id}>
                <div>
                  <strong>{g.name}</strong>
                  <small>{g.phone || 'Sin teléfono'}</small>
                </div>
                <span className={`guest-status ${g.status === 'pending' ? 'pending' : g.attending ? 'yes' : 'no'}`}>{statusLabel(g)}</span>
                {(
                  <div className="guest-actions">
                    <button type="button" onClick={() => copy(g)} title="Copiar link">
                      {copied === g.id ? <Check size={16} /> : <Link2 size={16} />}
                    </button>
                    <button type="button" onClick={() => whatsapp(g)} title="Link de WhatsApp"><MessageCircle size={16} /><span>WhatsApp</span></button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GuestListModal;
