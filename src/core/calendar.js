const pad = (n) => String(n).padStart(2, '0');
const fmt = (d) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
const esc = (t = '') => String(t).replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

/** Datos del evento a partir de la invitación (la fecha dura `hours` horas). */
export const getCalendarEvent = (inv = {}, hours = 5) => {
  const start = new Date(inv.eventDate);
  const place = inv.locations?.ceremony || inv.locations?.reception || {};
  const names = [inv.couple?.bride, inv.couple?.groom].filter(Boolean).join(' y ');
  return {
    title: names ? `Invitación: ${names}` : 'Invitación',
    start,
    end: new Date(start.getTime() + hours * 3600 * 1000),
    location: [place.place, place.address].filter(Boolean).join(', '),
    description: place.googleMapsUrl ? `Ubicación: ${place.googleMapsUrl}` : ''
  };
};

/** Archivo .ics (iOS, Android, Outlook, Google Calendar) con recordatorio 1 día antes. */
export const buildIcs = (ev, uid = `${Date.now()}@invitaciones`) => [
  'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//InvitaSaaS//ES', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
  'BEGIN:VEVENT', `UID:${uid}`, `DTSTAMP:${fmt(new Date())}`, `DTSTART:${fmt(ev.start)}`, `DTEND:${fmt(ev.end)}`,
  `SUMMARY:${esc(ev.title)}`, `LOCATION:${esc(ev.location)}`, `DESCRIPTION:${esc(ev.description)}`,
  'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${esc(ev.title)}`, 'END:VALARM',
  'END:VEVENT', 'END:VCALENDAR'
].join('\r\n');

export const googleCalendarUrl = (ev) =>
  `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ev.title)}&dates=${fmt(ev.start)}/${fmt(ev.end)}&location=${encodeURIComponent(ev.location)}&details=${encodeURIComponent(ev.description)}`;

export const downloadIcs = (ev) => {
  const url = URL.createObjectURL(new Blob([buildIcs(ev)], { type: 'text/calendar;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: 'invitacion.ics' });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
