import { useEffect, useState } from 'react';
import { adminApi } from '../../api';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Copy, Check, Pencil, Lock, Unlock, AlertTriangle, ArrowUpDown } from 'lucide-react';

export default function ClientsList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const navigate = useNavigate();


  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await adminApi.getClients();
      setClients(data);
    } catch (err) {
      setError("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAccess = async (e, id) => {
    e.stopPropagation();
    try {
      const response = await adminApi.toggleClientAccess(id);
      setClients(clients.map(c => c._id === id ? { ...c, isLocked: response.isLocked } : c));
    } catch (err) {
      alert("Failed to toggle access");
    }
  };

  const handleRowClick = (clientId) => {
    navigate(`/admin/submissions/client/${clientId}`);
  };

  const promptDelete = (e, client) => {
    e.stopPropagation();
    setClientToDelete(client);
    setAdminPassword('');
    setDeleteError('');
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    if (!adminPassword) return setDeleteError("Password is required");
    setIsDeleting(true);
    setDeleteError('');
    try {
      await adminApi.deleteClient(clientToDelete._id, adminPassword);
      setClients(clients.filter(c => c._id !== clientToDelete._id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      setDeleteError(err.message || "Incorrect password");
    } finally {
      setIsDeleting(false);
    }
  };

  const copyToClipboard = (e, text) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };


  const sortedClients = [...clients].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0);
    const dateB = new Date(b.createdAt || 0);
    return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <h2 className="font-semibold" style={{ fontSize: '1.125rem' }}>All Clients</h2>

        <div className="flex gap-3">
          <div className="flex items-center gap-2" style={{ background: 'var(--bg-tertiary)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
            <ArrowUpDown size={14} className="text-muted" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ background: 'transparent', border: 'none', fontSize: '0.875rem', color: 'var(--text-secondary)', cursor: 'pointer', outline: 'none' }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          <Link to="/admin/clients/new" className="btn btn-primary">
            <Plus size={16} /> New Client
          </Link>
        </div>
      </div>

      {loading && <div className="text-center text-muted" style={{ padding: '3rem' }}>Loading...</div>}

      {error && <div className="card text-danger">{error}</div>}

      {!loading && !error && (
        <div className="table-wrap">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th className="col-actions" style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedClients.map(client => (
                  <tr
                    key={client._id}
                    onClick={() => handleRowClick(client.clientID)}
                    style={{ cursor: 'pointer', opacity: client.isLocked ? 0.6 : 1 }}
                  >
                    <td>
                      <div className="font-semibold">{client.userName}</div>
                      <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                        Created: {new Date(client.createdAt || Date.now()).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="text-muted">{client.email}</td>
                    <td>
                      {client.isLocked ? (
                        <span className="badge badge-danger"><Lock size={10} /> Locked</span>
                      ) : (
                        <span className="badge badge-success"><Unlock size={10} /> Active</span>
                      )}
                    </td>
                    <td className="col-actions">
                      <div className="action-group justify-center">
                        <button
                          onClick={(e) => copyToClipboard(e, client.clientID)}
                          className="btn btn-secondary btn-sm"
                          title="Copy Client ID"
                        >
                          {copiedId === client.clientID ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                        <button
                          onClick={(e) => handleToggleAccess(e, client._id)}
                          className="btn btn-secondary btn-sm"
                          title={client.isLocked ? "Unlock" : "Lock"}
                        >
                          {client.isLocked ? <Unlock size={14} /> : <Lock size={14} />}
                        </button>
                        <Link
                          to={`/admin/clients/edit/${client._id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="btn btn-secondary btn-sm"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={(e) => promptDelete(e, client)}
                          className="btn btn-danger btn-sm"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {sortedClients.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-muted" style={{ padding: '3rem' }}>
                      No clients found. Create one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title text-danger flex items-center gap-2">
              <AlertTriangle size={20} /> Confirm Deletion
            </h3>
            <p className="text-muted mb-4">
              Deleting <strong>{clientToDelete?.userName}</strong> is permanent and cannot be undone.
            </p>
            <form onSubmit={handleConfirmDelete}>
              <div className="form-group">
                <label className="form-label">Admin Password</label>
                <input
                  type="password"
                  className="input"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  autoFocus
                />
              </div>
              {deleteError && <div className="text-danger mb-4" style={{ fontSize: '0.875rem' }}>{deleteError}</div>}
              <div className="flex justify-between gap-2">
                <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-danger" disabled={isDeleting}>
                  {isDeleting ? 'Deleting...' : 'Delete Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
