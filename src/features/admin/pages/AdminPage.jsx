import React, { useEffect, useState } from 'react';
import { usersService } from '../../../core/services/usersService';
import { invitationsService } from '../../../core/services/invitationsService';
import './AdminPage.css';

/** Administración: habilitar usuarios e invitaciones, y asignar cada invitación a un usuario. */
export const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [invitations, setInvitations] = useState([]);

  const load = async () => {
    setUsers(await usersService.list());
    setInvitations(await invitationsService.listForUser({ role: 'admin' }));
  };
  useEffect(() => { load(); }, []);

  const patchUser = async (uid, patch) => { await usersService.update(uid, patch); load(); };
  const patchInv = async (id, patch) => { await invitationsService.update(id, patch); load(); };

  return (
    <div className="admin-container">
      <h1>Administración</h1>

      <h2>Usuarios</h2>
      <table className="admin-table">
        <thead><tr><th>Usuario</th><th>Rol</th><th>Habilitado</th></tr></thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.uid}>
              <td>{u.displayName || u.email}<br /><small>{u.email}</small></td>
              <td>
                <select value={u.role} onChange={(e) => patchUser(u.uid, { role: e.target.value })}>
                  <option value="cliente">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
              </td>
              <td>
                <input type="checkbox" checked={Boolean(u.enabled)} onChange={(e) => patchUser(u.uid, { enabled: e.target.checked })} />
              </td>
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
