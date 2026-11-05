import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import ImageUploader from '../ImageUploader';
import { DRESS_CODES, PHOTO_CAPTIONS } from '../../../../core/sections';
import './EditorModals.css';

export const Modal = ({ title, onClose, children }) => (
  <div className="em-overlay" onClick={onClose}>
    <div className="em-modal" onClick={(e) => e.stopPropagation()}>
      <button type="button" className="em-close" onClick={onClose} aria-label="Cerrar"><X size={18} /></button>
      <h3>{title}</h3>
      {children}
    </div>
  </div>
);

const Field = ({ label, children }) => (
  <label className="em-field"><span>{label}</span>{children}</label>
);

/** Modal "Ver más": todas las plantillas del catálogo. */
export const TemplatePickerModal = ({ services, selectedId, onSelect, onClose }) => (
  <Modal title="Elige una plantilla del catálogo" onClose={onClose}>
    <div className="em-grid">
      {services.map((s) => (
        <button key={s.id} type="button" className={`em-card ${selectedId === s.id ? 'active' : ''}`} onClick={() => { onSelect(s); onClose(); }}>
          <img src={s.image} alt={s.title} />
          <span>{s.title}</span>
        </button>
      ))}
    </div>
  </Modal>
);

/** Ceremonia o recepción: nombre, descripción (opcional), link de Google Maps y hora. */
export const PlaceModal = ({ title, value = {}, onSave, onClose }) => {
  const [f, setF] = useState({ place: value.place || '', description: value.address || '', googleMapsUrl: value.googleMapsUrl || '', time: value.time || '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    onSave({ ...value, title, place: f.place, address: f.description, googleMapsUrl: f.googleMapsUrl, time: f.time });
    onClose();
  };
  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={submit} className="em-form">
        <Field label="Nombre"><input required value={f.place} onChange={set('place')} /></Field>
        <Field label="Descripción (opcional)"><textarea rows={2} value={f.description} onChange={set('description')} /></Field>
        <Field label="Link de Google Maps"><input type="url" placeholder="https://maps.google.com/..." value={f.googleMapsUrl} onChange={set('googleMapsUrl')} /></Field>
        <Field label="Hora"><input type="time" required value={/^\d{2}:\d{2}$/.test(f.time) ? f.time : ''} onChange={set('time')} /></Field>
        <button type="submit" className="em-primary">Aceptar</button>
      </form>
    </Modal>
  );
};

export const ItineraryModal = ({ value = [], onSave, onClose }) => {
  const [rows, setRows] = useState(value.length ? value : [{ time: '', title: '' }]);
  const setRow = (i, k, v) => setRows(rows.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  return (
    <Modal title="Cronograma" onClose={onClose}>
      <div className="em-form">
        {rows.map((r, i) => (
          <div key={i} className="em-row">
            <input type="time" value={r.time} onChange={(e) => setRow(i, 'time', e.target.value)} />
            <input placeholder="Actividad" value={r.title} onChange={(e) => setRow(i, 'title', e.target.value)} />
            <button type="button" onClick={() => setRows(rows.filter((_, j) => j !== i))} aria-label="Quitar"><Trash2 size={14} /></button>
          </div>
        ))}
        <button type="button" className="em-secondary" onClick={() => setRows([...rows, { time: '', title: '' }])}><Plus size={14} /> Agregar actividad</button>
        <button type="button" className="em-primary" onClick={() => { onSave(rows.filter((r) => r.time && r.title)); onClose(); }}>Aceptar</button>
      </div>
    </Modal>
  );
};

export const DressCodeModal = ({ value = {}, onSave, onClose }) => {
  const [type, setType] = useState(value.type || DRESS_CODES[0]);
  const [description, setDescription] = useState(value.description || '');
  return (
    <Modal title="Código de vestimenta" onClose={onClose}>
      <div className="em-form">
        <Field label="Vestimenta">
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {DRESS_CODES.map((d) => <option key={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Detalle (opcional)"><textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
        <button type="button" className="em-primary" onClick={() => { onSave({ title: 'Código de Vestimenta', type, description }); onClose(); }}>Aceptar</button>
      </div>
    </Modal>
  );
};

/** Registro y edición de fotos con su leyenda. */
export const PhotosModal = ({ value = [], temporary, onSave, onClose }) => {
  const [photos, setPhotos] = useState(value);
  const setCaption = (i, caption) => setPhotos(photos.map((p, j) => (j === i ? { ...p, caption } : p)));
  return (
    <Modal title="Fotos de la invitación" onClose={onClose}>
      <div className="em-form">
        <datalist id="em-captions">{PHOTO_CAPTIONS.map((c) => <option key={c} value={c} />)}</datalist>
        {photos.map((p, i) => (
          <div key={i} className="em-row">
            <img className="em-thumb" src={p.url} alt={p.caption} />
            <input list="em-captions" placeholder="Leyenda" value={p.caption || ''} onChange={(e) => setCaption(i, e.target.value)} />
            <button type="button" onClick={() => setPhotos(photos.filter((_, j) => j !== i))} aria-label="Quitar"><Trash2 size={14} /></button>
          </div>
        ))}
        <ImageUploader temporary={temporary} label="Agregar foto" onImageUploaded={(url) => setPhotos([...photos, { url, caption: PHOTO_CAPTIONS[photos.length % PHOTO_CAPTIONS.length] }])} />
        <button type="button" className="em-primary" onClick={() => { onSave(photos); onClose(); }}>Aceptar</button>
      </div>
    </Modal>
  );
};
