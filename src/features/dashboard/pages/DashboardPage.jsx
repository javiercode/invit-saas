import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, ExternalLink, Edit3, Share2, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../../../core/contexts/AuthContext';
import { invitationsService } from '../../../core/services/invitationsService';
import { getTemplateById } from '../../../templates';
import './DashboardPage.css';

export const DashboardPage = () => {
  const [copiedId, setCopiedId] = useState(null);

  const { profile } = useAuth();
  const [all, setAll] = useState([]);
  const [filterId, setFilterId] = useState('all');

  useEffect(() => {
    if (profile) invitationsService.listForUser(profile).then(setAll);
  }, [profile]);

  // Filtra el panel por la invitación elegida
  const invitations = (filterId === 'all' ? all : all.filter((i) => i.id === filterId)).map((i) => ({
    id: i.id,
    slug: i.slug,
    title: `${i.couple?.bride || ''} & ${i.couple?.groom || ''}`,
    eventDate: i.eventDate ? new Date(i.eventDate).toLocaleDateString('es', { dateStyle: 'long' }) : '',
    templateName: getTemplateById(i.templateId).name,
    templateId: i.templateId,
    confirmedGuests: i.confirmedGuests || 0,
    totalPases: i.totalPases || 0
  }));
  const totalConfirmed = invitations.reduce((n, i) => n + i.confirmedGuests, 0);
  const totalPases = invitations.reduce((n, i) => n + i.totalPases, 0);

  const handleShare = (slug, id) => {
    const fullUrl = `${window.location.origin}/invitacion/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <span className="dashboard-badge">Panel de Administración</span>
          <h1>Mis Invitaciones</h1>
          <p>Gestiona tus invitaciones digitales y visualiza las confirmaciones en tiempo real.</p>
        </div>

        <select className="filter-select" value={filterId} onChange={(e) => setFilterId(e.target.value)}>
          <option value="all">Todas las invitaciones</option>
          {all.map((i) => (
            <option key={i.id} value={i.id}>{i.slug}</option>
          ))}
        </select>
      </header>

      <div className="dashboard-stats-grid">
        <div className="stat-card">
          <span className="stat-label">Invitaciones Activas</span>
          <span className="stat-num">{invitations.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Confirmados (RSVP)</span>
          <span className="stat-num">{totalConfirmed}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Tasa de Asistencia</span>
          <span className="stat-num">{totalPases ? Math.round((totalConfirmed / totalPases) * 100) : 0}%</span>
        </div>
      </div>

      <section className="dashboard-list-section">
        <h2>Invitaciones Publicadas</h2>
        <div className="invitations-cards-grid">
          {invitations.map((inv) => (
            <div key={inv.id} className="invitation-admin-card">
              <div className="inv-admin-header">
                <div>
                  <h3 className="inv-title">{inv.title}</h3>
                  <span className="inv-template-tag">{inv.templateName}</span>
                </div>
                <span className="inv-status-pill">En línea</span>
              </div>

              <div className="inv-details">
                <div className="detail-row">
                  <Calendar size={16} className="detail-icon" />
                  <span>{inv.eventDate}</span>
                </div>
                <div className="detail-row">
                  <Users size={16} className="detail-icon" />
                  <span>
                    <strong>{inv.confirmedGuests}</strong> confirmados de {inv.totalPases} invitados
                  </span>
                </div>
              </div>

              <div className="inv-admin-actions">
                <Link to={`/invitacion/${inv.slug}`} className="btn-action btn-view" target="_blank">
                  <ExternalLink size={16} />
                  <span>Ver en vivo</span>
                </Link>
                <Link to={`/builder?template=${inv.templateId}`} className="btn-action btn-edit">
                  <Edit3 size={16} />
                  <span>Editar</span>
                </Link>
                <button
                  type="button"
                  className="btn-action btn-share"
                  onClick={() => handleShare(inv.slug, inv.id)}
                >
                  {copiedId === inv.id ? (
                    <>
                      <Check size={16} className="text-green" />
                      <span>¡Link Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Share2 size={16} />
                      <span>Compartir</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
