import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import TemplateRenderer from '../TemplateRenderer';
import ImageUploader from '../components/ImageUploader';
import { TEMPLATES_REGISTRY } from '../../../templates';
import { MOCK_INVITATIONS } from '../../../core/services/mockData';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTemplate = searchParams.get('template') || 'elegante';

  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate);
  const [previewDevice, setPreviewDevice] = useState('mobile'); // 'mobile' | 'desktop'

  // Datos base clonados del mock
  const [formData, setFormData] = useState({
    ...MOCK_INVITATIONS['j-m-2024'],
    templateId: selectedTemplate
  });

  // Editor (con sesión): carga las invitaciones habilitadas para el usuario
  useEffect(() => {
    if (simulator || !profile) return;
    invitationsService.listForUser(profile).then((list) => {
      setMyInvitations(list);
      if (list[0]) selectInvitation(list[0]);
    });
  }, [simulator, profile]);

  const selectInvitation = (inv) => {
    setFormData(inv);
    setSelectedTemplate(inv.templateId || 'elegante');
    setSaved(false);
  };

  const handleSave = async () => {
    await invitationsService.save(formData);
    setSaved(true);
  };

  const publishUrl = `${window.location.origin}${import.meta.env.BASE_URL.replace(/\/$/, '')}/invitacion/${
    simulator ? DEFAULT_PUBLISH_SLUG : formData.slug
  }`;

  const handleTemplateChange = (tplId) => {
    setSelectedTemplate(tplId);
    setFormData((prev) => ({ ...prev, templateId: tplId }));
    setSearchParams({ template: tplId });
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
            {Object.values(TEMPLATES_REGISTRY).map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                className={`template-select-card ${selectedTemplate === tpl.id ? 'active' : ''}`}
                onClick={() => handleTemplateChange(tpl.id)}
              >
                <img src={tpl.previewImage} alt={tpl.name} />
                <span className="template-card-name">{tpl.name}</span>
              </button>
            ))}
          </div>
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
          <p className="field-label">
            <LinkIcon size={12} /> Publicada en: <a href={publishUrl} target="_blank" rel="noreferrer">{publishUrl}</a>
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
    </div>
  );
};

export default BuilderPage;
