import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { LogoutButton } from '../components/LogoutButton';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found -- please log in');
      const headers = { headers: { Authorization: 'Bearer ' + token } };
      const [uRes, rRes] = await Promise.all([
        axios.get('/api/admin/users', headers),
        axios.get('/api/admin/routes', headers)
      ]);
      setUsers(uRes.data || []);
      setRoutes(rRes.data || []);
    } catch (err) {
      console.error('Admin fetch error', err);
      const msg = err?.response?.data?.error || err.message || 'Impossible de récupérer les données admin';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteUser = async (id) => {
  if(!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found -- please log in');
      await axios.delete(`/api/admin/users/${id}`, { headers: { Authorization: 'Bearer ' + token } });
      toast.success('Utilisateur supprimé');
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      console.error('Delete user error', err);
      const msg = err?.response?.data?.error || err.message || 'Erreur lors de la suppression';
      toast.error(msg);
      setError(msg);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Admin</h2>
        <LogoutButton />
      </div>
      {loading && <div>Chargement...</div>}
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

      <section>
        <h3>Utilisateurs</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>_id</th>
              <th>username</th>
              <th>email</th>
              <th>isAdmin</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u._id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.isAdmin ? 'yes' : 'no'}</td>
                <td>
                  <button onClick={() => handleDeleteUser(u._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ marginTop: 20 }}>
        <h3>Trajets</h3>
        <div style={{ maxHeight: 300, overflow: 'auto' }}>
          {routes.map(r => (
            <div key={r._id} style={{ padding: 6, borderBottom: '1px solid #ddd' }}>
              <div><strong>{r.name || r._id}</strong></div>
              <div>Propriétaire: {r.owner || r.username || 'unknown'}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
