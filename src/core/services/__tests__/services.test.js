import { describe, it, expect, vi, beforeEach } from 'vitest';

// --- Mocks de Firebase (Auth + Firestore) y Supabase Storage ---
const fb = vi.hoisted(() => ({
  configured: true,
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  signIn: vi.fn(),
  addDoc: vi.fn()
}));

vi.mock('../../firebase', () => ({
  get isFirebaseConfigured() { return fb.configured; },
  db: {},
  COLLECTIONS: { USERS: 'usuarios', INVITATIONS: 'invitaciones', SERVICES: 'servicios', RSVPS: 'rsvp' },
  collection: (_db, name) => ({ name }),
  doc: (_db, col, id) => ({ col, id }),
  query: (col, cond) => ({ ...col, cond }),
  where: (f, op, v) => ({ f, op, v }),
  getDoc: fb.getDoc,
  getDocs: fb.getDocs,
  setDoc: fb.setDoc,
  updateDoc: fb.updateDoc,
  deleteDoc: fb.deleteDoc,
  addDoc: fb.addDoc,
  serverTimestamp: vi.fn(),
  arrayUnion: vi.fn()
}));

const sb = vi.hoisted(() => ({ upload: vi.fn(), getPublicUrl: vi.fn() }));
vi.mock('../supabaseClient', () => ({
  isSupabaseConfigured: true,
  STORAGE_BUCKET: 'invitaciones',
  supabase: { storage: { from: () => ({ upload: sb.upload, getPublicUrl: sb.getPublicUrl }) } }
}));

import { usersService } from '../usersService';
import { invitationsService } from '../invitationsService';
import { storageService } from '../storageService';
import { MOCK_SERVICES } from '../mockData';

beforeEach(() => {
  vi.clearAllMocks();
  fb.configured = true;
});

describe('catálogo', () => {
  it('tiene al menos 10 opciones adicionales por sección', () => {
    for (const type of ['bodas', 'cumpleanos', 'xv_anos', 'bautizos', 'graduaciones']) {
      expect(MOCK_SERVICES.filter((s) => s.eventType === type).length).toBeGreaterThanOrEqual(11);
    }
    expect(new Set(MOCK_SERVICES.map((s) => s.id)).size).toBe(MOCK_SERVICES.length);
  });
});

describe('usersService (Firebase Auth + Firestore)', () => {
  it('crea perfil USER habilitado en el primer ingreso', async () => {
    fb.getDoc.mockResolvedValue({ exists: () => false });
    const p = await usersService.ensureProfile({ uid: 'u1', email: 'a@x.com' });
    expect(p).toMatchObject({ uid: 'u1', role: 'user', enabled: true });
    expect(fb.setDoc).toHaveBeenCalledOnce();
  });

  it('devuelve el perfil existente con su rol', async () => {
    fb.getDoc.mockResolvedValue({ exists: () => true, data: () => ({ role: 'admin', enabled: true }) });
    expect(await usersService.ensureProfile({ uid: 'u2' })).toEqual({ uid: 'u2', role: 'admin', enabled: true });
  });

  it('un registro previo con rol ADMIN se respeta y se consume', async () => {
    fb.getDoc.mockResolvedValueOnce({ exists: () => false }).mockResolvedValueOnce({ exists: () => true, data: () => ({ role: 'admin' }) });
    const p = await usersService.ensureProfile({ uid: 'u9', email: 'Admin@X.com' });
    expect(p).toMatchObject({ role: 'admin', enabled: true });
    expect(fb.deleteDoc).toHaveBeenCalledWith({ col: 'usuarios', id: 'admin@x.com' });
  });

  it('el admin crea y elimina usuarios (CRUD)', async () => {
    await usersService.create({ email: ' Nuevo@X.com ', role: 'admin' });
    expect(fb.setDoc).toHaveBeenCalledWith({ col: 'usuarios', id: 'nuevo@x.com' }, expect.objectContaining({ role: 'admin', enabled: true }));
    await usersService.remove('u1');
    expect(fb.deleteDoc).toHaveBeenCalledWith({ col: 'usuarios', id: 'u1' });
  });

  it('el admin habilita usuarios', async () => {
    await usersService.update('u1', { enabled: true });
    expect(fb.updateDoc).toHaveBeenCalledWith({ col: 'usuarios', id: 'u1' }, { enabled: true });
  });
});

describe('invitationsService (Firestore)', () => {
  const docs = [
    { id: 'a', data: () => ({ ownerId: 'u1', enabled: true }) },
    { id: 'b', data: () => ({ ownerId: 'u1', enabled: false }) }
  ];

  it('el admin ve todas las invitaciones', async () => {
    fb.getDocs.mockResolvedValue({ docs });
    expect(await invitationsService.listForUser({ role: 'admin', uid: 'x' })).toHaveLength(2);
  });

  it('el cliente solo ve las suyas habilitadas', async () => {
    fb.getDocs.mockResolvedValue({ docs });
    const list = await invitationsService.listForUser({ role: 'cliente', uid: 'u1' });
    expect(list.map((i) => i.id)).toEqual(['a']);
  });

  it('guarda la invitación usando el slug como id', async () => {
    await invitationsService.save({ slug: 'mi-boda' });
    expect(fb.setDoc).toHaveBeenCalledWith({ col: 'invitaciones', id: 'mi-boda' }, expect.objectContaining({ id: 'mi-boda' }), { merge: true });
  });
});

describe('storageService (Supabase Storage)', () => {
  it('sube la imagen comprimida y devuelve la URL pública', async () => {
    vi.spyOn(storageService, 'compressImage').mockResolvedValue({ blob: new Blob(['x'], { type: 'image/webp' }), dataUrl: 'data:', sizeKb: 1 });
    sb.upload.mockResolvedValue({ data: { path: 'invitaciones/x.webp' }, error: null });
    sb.getPublicUrl.mockReturnValue({ data: { publicUrl: 'https://sb.co/x.webp' } });

    const res = await storageService.uploadToStorage({ name: 'f.png', size: 2048 });
    expect(res).toMatchObject({ url: 'https://sb.co/x.webp', storageType: 'supabase-storage' });
  });

  it('usa DataURL local si Supabase falla', async () => {
    vi.spyOn(storageService, 'compressImage').mockResolvedValue({ blob: new Blob(['x']), dataUrl: 'data:local', sizeKb: 1 });
    sb.upload.mockResolvedValue({ data: null, error: new Error('boom') });
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const res = await storageService.uploadToStorage({ name: 'f.png', size: 10 });
    expect(res.storageType).toBe('local-data-url');
  });
});

describe('sesión simulada', () => {
  it('solo existe en desarrollo sin Firebase; en producción no hay sesión', async () => {
    const { getDemoUser } = await import('../../demoUser');
    expect(getDemoUser(false, true)?.uid).toBe('demo-user-123');
    expect(getDemoUser(false, false)).toBeNull();
    expect(getDemoUser(true, true)).toBeNull();
  });
});

describe('errores de Firebase Auth', () => {
  it('traduce códigos de Firebase Auth a mensajes claros', async () => {
    const { authErrorMessage } = await import('../../authErrors');
    expect(authErrorMessage({ code: 'auth/invalid-credential' })).toMatch(/incorrectos/);
    expect(authErrorMessage({ code: 'auth/unauthorized-domain' })).toMatch(/Authorized domains/);
    expect(authErrorMessage({ code: 'auth/not-configured' })).toMatch(/VITE_FIREBASE/);
    expect(authErrorMessage({ message: 'otro' })).toBe('otro');
  });
});

describe('secciones opcionales', () => {
  const data = {
    locations: { ceremony: { place: 'A' }, reception: { place: 'B' } },
    itinerary: [{ time: '10:00', title: 'x' }],
    dressCode: { type: 'Formal' },
    gallery: [{ url: 'u', caption: 'c' }]
  };

  it('por defecto todas están desmarcadas y se ocultan', async () => {
    const { applySections } = await import('../../sections');
    const v = applySections(data);
    expect(v.locations).toEqual({});
    expect(v.itinerary).toEqual([]);
    expect(v.dressCode).toBeNull();
    expect(v.gallery).toEqual([]);
  });

  it('muestra solo las secciones marcadas', async () => {
    const { applySections } = await import('../../sections');
    const v = applySections({ ...data, sections: { ceremony: true, gallery: true } });
    expect(v.locations).toEqual({ ceremony: { place: 'A' } });
    expect(v.gallery).toHaveLength(1);
    expect(v.itinerary).toEqual([]);
  });
});

describe('guardado de invitación (Firestore)', () => {
  it('propaga permission-denied para mostrarlo en el editor', async () => {
    fb.setDoc.mockRejectedValueOnce(Object.assign(new Error('Missing or insufficient permissions.'), { code: 'permission-denied' }));
    await expect(invitationsService.save({ slug: 'j-m-2024' })).rejects.toMatchObject({ code: 'permission-denied' });
  });

  it('guarda las secciones y el catálogo elegido en el documento', async () => {
    await invitationsService.save({ slug: 's1', serviceId: 'x', sections: { gallery: true } });
    expect(fb.setDoc).toHaveBeenCalledWith({ col: 'invitaciones', id: 's1' }, expect.objectContaining({ serviceId: 'x', sections: { gallery: true } }), { merge: true });
  });
});

describe('guardado compatible con las reglas (userId)', () => {
  it('copia ownerId a userId al guardar', async () => {
    await invitationsService.save({ slug: 's2', ownerId: 'u7' });
    expect(fb.setDoc).toHaveBeenCalledWith({ col: 'invitaciones', id: 's2' }, expect.objectContaining({ ownerId: 'u7', userId: 'u7' }), { merge: true });
  });
});

describe('filtro por tipo de plantilla', () => {
  it('cada tipo del filtro tiene plantillas en el catálogo', async () => {
    const { EVENT_TYPES } = await import('../../sections');
    for (const t of EVENT_TYPES.filter((e) => e.id !== 'all')) {
      expect(MOCK_SERVICES.some((s) => s.eventType === t.id)).toBe(true);
    }
  });
});

describe('calendario del dispositivo (.ics)', () => {
  const inv = {
    eventDate: '2026-11-28T18:00:00',
    couple: { bride: 'Ana', groom: 'Luis' },
    locations: { ceremony: { place: 'Parroquia, Centro', address: 'Calle 1', googleMapsUrl: 'https://maps.google.com/?q=1' } },
    maxPasses: 3
  };

  it('genera un evento iCalendar válido con ubicación y recordatorio', async () => {
    const { getCalendarEvent, buildIcs } = await import('../../calendar');
    const ics = buildIcs(getCalendarEvent(inv), 'uid-1');
    expect(ics).toMatch(/^BEGIN:VCALENDAR/);
    expect(ics).toContain('SUMMARY:Invitación: Ana y Luis');
    expect(ics).toContain('LOCATION:Parroquia\\, Centro\\, Calle 1');
    expect(ics).toContain('TRIGGER:-P1D');
    expect(ics).toMatch(/DTSTART:\d{8}T\d{6}Z/);
    expect(ics.trim()).toMatch(/END:VCALENDAR$/);
  });

  it('el evento dura 5 h y el enlace de Google Calendar lo incluye', async () => {
    const { getCalendarEvent, googleCalendarUrl } = await import('../../calendar');
    const ev = getCalendarEvent(inv);
    expect(ev.end - ev.start).toBe(5 * 3600 * 1000);
    expect(googleCalendarUrl(ev)).toContain('calendar.google.com');
  });

  it('el número de confirmación (maxPasses) se guarda con la invitación', async () => {
    await invitationsService.save({ slug: 's3', maxPasses: 3 });
    expect(fb.setDoc).toHaveBeenCalledWith({ col: 'invitaciones', id: 's3' }, expect.objectContaining({ maxPasses: 3 }), { merge: true });
  });
});

describe('confirmaciones RSVP con invitado pre-registrado (Firestore)', () => {
  it('addGuest crea un invitado pendiente con nombre y teléfono', async () => {
    const addDoc = fb.addDoc;
    addDoc.mockResolvedValue({ id: 'g1' });
    const g = await invitationsService.addGuest('inv1', { name: ' Ana ', phone: '70000000' });
    expect(addDoc).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ name: 'Ana', phone: '70000000', status: 'pending', invitationId: 'inv1' }));
    expect(g.id).toBe('g1');
  });

  it('getGuest devuelve los datos para prellenar el formulario', async () => {
    fb.getDoc.mockResolvedValue({ exists: () => true, id: 'g1', data: () => ({ name: 'Ana', phone: '7' }) });
    expect(await invitationsService.getGuest('g1')).toEqual({ id: 'g1', name: 'Ana', phone: '7' });
  });

  it('submitRsvp con guestId actualiza el documento existente', async () => {
    await invitationsService.submitRsvp('inv1', { name: 'Ana', attending: true }, 'g1');
    expect(fb.setDoc).toHaveBeenCalledWith({ col: 'rsvp', id: 'g1' }, expect.objectContaining({ status: 'responded' }), { merge: true });
  });

  it('listRsvps consulta por invitationId', async () => {
    fb.getDocs.mockResolvedValue({ docs: [{ id: 'g1', data: () => ({ name: 'Ana' }) }] });
    expect(await invitationsService.listRsvps('inv1')).toEqual([{ id: 'g1', name: 'Ana' }]);
  });
});

describe('link de WhatsApp para invitados', () => {
  it('incluye teléfono y link con el id del invitado', async () => {
    vi.stubGlobal('window', { location: { origin: 'https://x.github.io' } });
    const { whatsappUrl } = await import('../../../features/dashboard/components/GuestListModal');
    const url = whatsappUrl({ id: 'g1', name: 'Ana', phone: '+591 7000-0000' }, 'boda');
    expect(url).toMatch(/^https:\/\/wa\.me\/59170000000\?text=/);
    expect(decodeURIComponent(url)).toContain('invitacion/boda?g=g1');
  });
});
