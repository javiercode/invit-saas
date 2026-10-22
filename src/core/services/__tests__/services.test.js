import { describe, it, expect, vi, beforeEach } from 'vitest';

// --- Mocks de Firebase (Auth + Firestore) y Supabase Storage ---
const fb = vi.hoisted(() => ({
  configured: true,
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  signIn: vi.fn()
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
  addDoc: vi.fn(),
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
    for (const type of ['bodas', 'xv_anos', 'bautizos', 'graduaciones']) {
      expect(MOCK_SERVICES.filter((s) => s.eventType === type).length).toBeGreaterThanOrEqual(11);
    }
    expect(new Set(MOCK_SERVICES.map((s) => s.id)).size).toBe(MOCK_SERVICES.length);
  });
});

describe('usersService (Firebase Auth + Firestore)', () => {
  it('crea perfil cliente deshabilitado en el primer ingreso', async () => {
    fb.getDoc.mockResolvedValue({ exists: () => false });
    const p = await usersService.ensureProfile({ uid: 'u1', email: 'a@x.com' });
    expect(p).toMatchObject({ uid: 'u1', role: 'cliente', enabled: false });
    expect(fb.setDoc).toHaveBeenCalledOnce();
  });

  it('devuelve el perfil existente con su rol', async () => {
    fb.getDoc.mockResolvedValue({ exists: () => true, data: () => ({ role: 'admin', enabled: true }) });
    expect(await usersService.ensureProfile({ uid: 'u2' })).toEqual({ uid: 'u2', role: 'admin', enabled: true });
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
