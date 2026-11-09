import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import TemplateRenderer from '../TemplateRenderer';
import ImageUploader from '../components/ImageUploader';
import { MOCK_INVITATIONS } from '../../../core/services/mockData';
import { TemplatePickerModal, PlaceModal, ItineraryModal, DressCodeModal, PhotosModal } from '../components/EditorModals/EditorModals';
import { SECTIONS, EVENT_TYPES } from '../../../core/sections';
import { invitationsService } from '../../../core/services/invitationsService';
import { useAuth } from '../../../core/contexts/AuthContext';
import { Smartphone, Monitor, Save, Sparkles, Link as LinkIcon } from 'lucide-react';
import './BuilderPage.css';

// URL pública por defecto que siempre se publica desde el simulador
export const DEFAULT_PUBLISH_SLUG = 'j-m-2024';

/**
 * Editor de invitaciones. Con `simulator` es el Simulador: sin sesión,
 * sin guardado (cambios e imágenes temporales) y publica siempre la URL por defecto.
 */
export const BuilderPage = ({ simulator = false }) => {
  const { profile } = useAuth();
  const [myInvitations, setMyInvitations] = useState([]);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [modal, setModal] = useState(null); // 'templates' | clave de sección
  const [catalog, setCatalog] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTemplate = searchParams.get('template');
  const urlService = searchParams.get('service');
  const initialTemplate = urlTemplate || 'elegante';
  const [eventFilter, setEventFilter] = useState('all');

  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate);
  const [previewDevice, setPreviewDevice] = useState('mobile'); // 'mobile' | 'desktop'

  // Datos base clonados del mock
  const [formData, setFormData] = useState({
    ...MOCK_INVITATIONS['j-m-2024'],
    templateId: selectedTemplate,
    ...(urlService && { serviceId: urlService })
  });

  useEffect(() => {
    invitationsService.getCatalogServices().then((list) => {
      setCatalog(list);
      const s = list.find((x) => x.id === urlService);
      if (s) setEventFilter(s.eventType);
    });
  }, []);

  // Editor (con sesión): carga las invitaciones habilitadas para el usuario
  useEffect(() => {
    if (simulator || !profile) return;
    invitationsService.listForUser(profile).then((list) => {
      setMyInvitations(list);
      if (list[0]) selectInvitation(list[0]);
    });
  }, [simulator, profile]);

  const selectInvitation = (inv) => {
    // Una plantilla elegida desde el catálogo (?template=) tiene prioridad sobre la guardada
    const merged = urlTemplate ? { ...inv, templateId: urlTemplate, ...(urlService && { serviceId: urlService }) } : inv;
    setFormData(merged);
    setSelectedTemplate(merged.templateId || 'elegante');
    setSaved(false);
  };

  const handleSave = async () => {
    setSaveError(null);
    try {
      await invitationsService.save({ ...formData, ownerId: formData.ownerId || profile?.uid });
      setSaved(true);
    } catch (e) {
      setSaveError(e.code === 'permission-denied'
        ? 'Sin permisos en Firestore: publica las reglas de firestore.rules y verifica que la invitación esté asignada a tu usuario.'
        : e.message);
    }
  };

  const publishUrl = `${window.location.origin}${import.meta.env.BASE_URL.replace(/\/$/, '')}/invitacion/${
    simulator ? DEFAULT_PUBLISH_SLUG : formData.slug
  }`;

  const handleTemplateChange = (tplId, serviceId) => {
    setSelectedTemplate(tplId);
    setFormData((prev) => ({ ...prev, templateId: tplId, serviceId }));
    setSearchParams({ template: tplId, ...(serviceId && { service: serviceId }) });
  };
  const filteredCatalog = catalog.filter((s) => eventFilter === 'all' || s.eventType === eventFilter);

  const toggleSection = (key, on) => setFormData((p) => ({ ...p, sections: { ...p.sections, [key]: on } }));
  const patchLocation = (key) => (val) => setFormData((p) => ({ ...p, locations: { ...p.locations, [key]: val } }));
  const sectionModal = {
    ceremony: () => <PlaceModal title="Ceremonia Religiosa" value={formData.locations?.ceremony} onSave={patchLocation('ceremony')} onClose={() => setModal(null)} />,
    reception: () => <PlaceModal title="Recepción & Fiesta" value={formData.locations?.reception} onSave={patchLocation('reception')} onClose={() => setModal(null)} />,
    itinerary: () => <ItineraryModal value={formData.itinerary} onSave={(v) => setFormData((p) => ({ ...p, itinerary: v }))} onClose={() => setModal(null)} />,
    dressCode: () => <DressCodeModal value={formData.dressCode} onSave={(v) => setFormData((p) => ({ ...p, dressCode: v }))} onClose={() => setModal(null)} />,
    gallery: () => <PhotosModal value={formData.gallery} temporary={simulator} onSave={(v) => setFormData((p) => ({ ...p, gallery: v }))} onClose={() => setModal(null)} />
  };

  const handleCoupleChange = (field, val) => {
    setFormData((prev) => ({
      ...prev,
      couple: {
        ...prev.couple,
        [field]: val,
        initials: `${prev.couple.bride?.[0] || 'N'} & ${prev.couple.groom?.[0] || 'N'}`
      }
    }));
  };

  const handleHeroImageUploaded = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      heroImage: imageUrl
    }));
  };

  const handleGalleryImageUploaded = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      gallery: [
        { url: imageUrl, caption: 'Nuevo momento especial' },
        ...(prev.gallery || [])
      ]
    }));
  };

  return (
    <div className="builder-layout">
      {/* Panel lateral de controles del Builder */}
      <aside className="builder-sidebar">
        <div className="builder-sidebar-header">
          <select className="filter-select" value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} title="Tipo de plantilla">
            {EVENT_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
          {!simulator && (
            <select
              className="filter-select"
              value={formData.id || ''}
              onChange={(e) => selectInvitation(myInvitations.find((i) => i.id === e.target.value))}
              title="Invitación habilitada"
            >
              {myInvitations.length === 0 && <option value="">Sin invitaciones habilitadas</option>}
              {myInvitations.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.couple?.bride} & {i.couple?.groom} ({i.slug})
                </option>
              ))}
            </select>
          )}
          <div className="builder-title-badge">
            <Sparkles size={16} />
            <span>{simulator ? 'Simulador' : 'Editor SaaS'}</span>
          </div>
          <h2>Personalizador de Invitación</h2>
          <p>Edita los datos y observa los cambios en vivo en la plantilla seleccionada.</p>
        </div>

        <div className="builder-section">
          <label className="builder-label">Elige la Plantilla Dinámica</label>
          <div className="templates-selector-grid">
            {filteredCatalog.slice(0, 3).map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                className={`template-select-card ${formData.serviceId === tpl.id ? 'active' : ''}`}
                onClick={() => handleTemplateChange(tpl.templateId, tpl.id)}
              >
                <img src={tpl.image} alt={tpl.title} />
                <span className="template-card-name">{tpl.title}</span>
              </button>
            ))}
          </div>
          <button type="button" className="em-more" onClick={() => setModal('templates')}>Ver más</button>
        </div>

        <div className="builder-section">
          <label className="builder-label">Secciones (opcionales)</label>
          {SECTIONS.map((s) => (
            <div key={s.key} className="em-section-row">
              <label>
                <input type="checkbox" checked={formData.sections?.[s.key] === true} onChange={(e) => toggleSection(s.key, e.target.checked)} />
                {s.label}
              </label>
              <button type="button" onClick={() => setModal(s.key)}>Registrar / editar</button>
            </div>
          ))}
        </div>

        <div className="builder-section">
          <label className="builder-label">Datos Principales</label>
          <div className="builder-field">
            <span className="field-label">Nombre de la Novia / Festejado</span>
            <input
              type="text"
              value={formData.couple?.bride || ''}
              onChange={(e) => handleCoupleChange('bride', e.target.value)}
            />
          </div>

          <div className="builder-field">
            <span className="field-label">Nombre del Novio / Pareja</span>
            <input
              type="text"
              value={formData.couple?.groom || ''}
              onChange={(e) => handleCoupleChange('groom', e.target.value)}
            />
          </div>

          <div className="builder-field">
            <span className="field-label">Frase o Cita de Amor</span>
            <input
              type="text"
              value={formData.couple?.quote || ''}
              onChange={(e) => handleCoupleChange('quote', e.target.value)}
            />
          </div>

          <div className="builder-field">
            <span className="field-label">Número de confirmación (pases máximos por invitado)</span>
            <input
              type="number"
              min="1"
              max="20"
              value={formData.maxPasses ?? 4}
              onChange={(e) => setFormData({ ...formData, maxPasses: Math.max(1, Number(e.target.value) || 1) })}
            />
          </div>

          <div className="builder-field">
            <span className="field-label">Fecha y Hora del Evento</span>
            <input
              type="datetime-local"
              value={formData.eventDate ? formData.eventDate.slice(0, 16) : ''}
              onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
            />
          </div>
        </div>

        {/* Sección de Imágenes */}
        <div className="builder-section">
          <label className="builder-label">Administración de Imágenes</label>
          <div className="builder-field">
            <span className="field-label">Foto de Portada / Hero</span>
            <ImageUploader
              temporary={simulator}
              label="Cambiar foto de portada"
              onImageUploaded={handleHeroImageUploaded}
            />
          </div>

          <div className="builder-field">
            <span className="field-label">Agregar a Galería de Recuerdos</span>
            <ImageUploader
              temporary={simulator}
              label="Subir foto para la galería"
              onImageUploaded={handleGalleryImageUploaded}
            />
          </div>
        </div>

        <div className="builder-actions">
          {simulator ? (
            <p className="field-label">Modo simulador: los cambios son temporales y no se guardan.</p>
          ) : (
            <button type="button" className="btn-builder-save" onClick={handleSave}>
              <Save size={18} />
              <span>{saved ? '¡Guardado!' : 'Guardar'}</span>
            </button>
          )}
          {saveError && <p className="save-error">{saveError}</p>}
          <p className="publish-url">
            <LinkIcon size={14} /> Publicada en: <a href={publishUrl} target="_blank" rel="noreferrer">{publishUrl}</a>
          </p>
        </div>
      </aside>

      {/* Área de Visualización en Tiempo Real */}
      <section className="builder-preview-stage">
        <header className="builder-preview-toolbar">
          <div className="device-toggle">
            <button
              type="button"
              className={`device-btn ${previewDevice === 'mobile' ? 'active' : ''}`}
              onClick={() => setPreviewDevice('mobile')}
              title="Vista Móvil (390px)"
            >
              <Smartphone size={16} />
              <span>Mobile-First</span>
            </button>
            <button
              type="button"
              className={`device-btn ${previewDevice === 'desktop' ? 'active' : ''}`}
              onClick={() => setPreviewDevice('desktop')}
              title="Vista de Escritorio"
            >
              <Monitor size={16} />
              <span>Escritorio</span>
            </button>
          </div>
        </header>

        <div className={`preview-viewport-wrapper ${previewDevice}`}>
          <div className="preview-viewport-screen">
            <TemplateRenderer
              data={formData}
              previewMode={true}
              customTemplateId={selectedTemplate}
            />
          </div>
        </div>
      </section>
      {modal === 'templates' && (
        <TemplatePickerModal
          services={filteredCatalog}
          selectedId={formData.serviceId}
          onSelect={(s) => handleTemplateChange(s.templateId, s.id)}
          onClose={() => setModal(null)}
        />
      )}
      {sectionModal[modal]?.()}
    </div>
  );
};

export default BuilderPage;
