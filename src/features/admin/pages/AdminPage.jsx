import React, { useEffect, useState } from 'react';
import { usersService } from '../../../core/services/usersService';
import { invitationsService } from '../../../core/services/invitationsService';
import './AdminPage.css';

/** Administración: habilitar usuarios e invitaciones, y asignar cada invitación a un usuario. */
export const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [newUser, setNewUser] = useState({ email: '', role: 'user' });

  const load = async () => {
    setUsers(await usersService.list());
    setInvitations(await invitationsService.listForUser({ role: 'admin' }));
  };
  useEffect(() => { load(); }, []);

  const patchUser = async (uid, patch) => { await usersService.update(uid, patch); load(); };
  const addUser = async (e) => {
    e.preventDefault();
    await usersService.create(newUser);
    setNewUser({ email: '', role: 'user' });
    load();
  };
  const removeUser = async (uid) => { if (window.confirm('¿Eliminar este usuario?')) { await usersService.remove(uid); load(); } };
  const patchInv = async (id, patch) => { await invitationsService.update(id, patch); load(); };

  return (
    <div className="admin-container">
      <h1>Administración</h1>

      <h2>Usuarios</h2>
      <form onSubmit={addUser} className="admin-user-form">
        <input type="email" required placeholder="correo@ejemplo.com" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
        <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
          <option value="user">USER</option>
          <option value="admin">ADMIN</option>
        </select>
        <button type="submit">Agregar</button>
      </form>
      <table className="admin-table">
        <thead><tr><th>Usuario</th><th>Rol</th><th>Habilitado</th><th></th></tr></thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.uid}>
              <td>{u.displayName || u.email}<br /><small>{u.email}</small></td>
              <td>
                <select value={u.role} onChange={(e) => patchUser(u.uid, { role: e.target.value })}>
                  <option value="user">USER</option>
                  <option value="admin">ADMIN</option>
                </select>
              </td>
              <td>
                <input type="checkbox" checked={Boolean(u.enabled)} onChange={(e) => patchUser(u.uid, { enabled: e.target.checked })} />
              </td>
              <td><button type="button" onClick={() => removeUser(u.uid)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Invitaciones</h2>
      <table className="admin-table">
        <thead><tr><th>Invitación</th><th>Usuario asignado</th><th>Habilitada</th></tr></thead>
        <tbody>
          {invitations.map((i) => (
            <tr key={i.id}>
              <td>{i.slug}</td>
              <td>
                <select value={i.ownerId || ''} onChange={(e) => patchInv(i.id, { ownerId: e.target.value })}>
                  <option value="">Sin asignar</option>
                  {users.map((u) => <option key={u.uid} value={u.uid}>{u.email}</option>)}
                </select>
              </td>
              <td>
                <input type="checkbox" checked={i.enabled !== false} onChange={(e) => patchInv(i.id, { enabled: e.target.checked })} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
