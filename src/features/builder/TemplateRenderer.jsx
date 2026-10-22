import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TEMPLATES_REGISTRY, getTemplateById } from '../../templates';
import { invitationsService } from '../../core/services/invitationsService';
import { Loader2, AlertCircle, ArrowLeft, Eye } from 'lucide-react';
import './TemplateRenderer.css';

/**
 * TemplateRenderer - Motor Renderizador de Plantillas Dinámicas
 * 
 * Responsabilidades:
 * 1. Resuelve los datos de la invitación desde Firestore (o prop 'data' directa para modo Builder/Preview).
 * 2. Identifica la plantilla seleccionada ('elegante', 'vintage', 'moderna', etc.) según el templateId del documento.
 * 3. Renderiza dinámicamente el componente de la plantilla inyectando el JSON de datos.
 * 4. Gestiona estados de carga (Loading Skeleton), error (Not Found) y barra de navegación de retorno.
 */
export const TemplateRenderer = ({ 
  data: propData = null, 
  previewMode = false, 
  customTemplateId = null 
}) => {
  const { slug } = useParams();
  const [invitationData, setInvitationData] = useState(propData);
  const [loading, setLoading] = useState(!propData);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Si los datos se pasan por props (modo editor o previsualización inmediata), no consultar Firestore
    if (propData) {
      setInvitationData(propData);
      setLoading(false);
      return;
    }

    // Consulta reactiva a Firestore por el slug de la ruta
    const fetchInvitation = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await invitationsService.getBySlug(slug);

        if (!data) {
          setError(`No encontramos ninguna invitación con el identificador: "${slug}"`);
        } else {
          setInvitationData(data);
        }
      } catch (err) {
        console.error('Error al cargar la invitación desde Firestore:', err);
        setError('Ocurrió un error al obtener la información de la invitación.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchInvitation();
    }
  }, [slug, propData]);

  // Estado de Carga
  if (loading) {
    return (
      <div className="renderer-loading-state">
        <div className="loading-card">
          <Loader2 className="spinner-icon" size={42} />
          <h2>Preparando tu Invitación</h2>
          <p>Cargando detalles, itinerario y galería multimedia...</p>
        </div>
      </div>
    );
  }

  // Estado de Error / 404
  if (error || !invitationData) {
    return (
      <div className="renderer-error-state">
        <div className="error-card">
          <AlertCircle size={48} className="error-icon" />
          <h2>Invitación no encontrada</h2>
          <p>{error || 'Verifica que el enlace ingresado sea el correcto.'}</p>
          <div className="error-actions">
            <Link to="/catalogo" className="btn-back">
              <ArrowLeft size={16} />
              <span>Explorar Catálogo</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Selección dinámica de la plantilla según el documento de Firestore o override de previsualización
  const activeTemplateId = customTemplateId || invitationData.templateId || 'elegante';
  const templateConfig = getTemplateById(activeTemplateId);
  const SelectedTemplateComponent = templateConfig.component;

  return (
    <div className="template-renderer-root">
      {/* Barra de ayuda cuando se encuentra en modo previsualización / builder */}
      {previewMode && (
        <aside className="preview-top-banner">
          <div className="preview-banner-content">
            <div className="preview-badge">
              <Eye size={14} />
              <span>Modo Vista Previa</span>
            </div>
            <span className="preview-info">
              Plantilla activa: <strong>{templateConfig.name}</strong>
            </span>
          </div>
        </aside>
      )}

      {/* Renderizado de la plantilla HTML/React responsiva con los datos inyectados */}
      <SelectedTemplateComponent data={invitationData} />
    </div>
  );
};

export default TemplateRenderer;
