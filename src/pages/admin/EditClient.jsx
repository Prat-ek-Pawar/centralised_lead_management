import { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';

export default function EditClient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ userName: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadClient();
  }, [id]);

  const loadClient = async () => {
    try {
      const clients = await adminApi.getClients();
      const client = clients.find(c => c._id === id);
      if (client) {
        setFormData({ userName: client.userName, password: '' });
      } else {
        setError('Client not found');
      }
    } catch (err) {
      setError('Failed to load client');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const updateData = {};
      if (formData.userName) updateData.userName = formData.userName;
      if (formData.password) updateData.password = formData.password;
      await adminApi.updateClient(id, updateData);
      navigate('/admin/clients');
    } catch (err) {
      setError(err.message || 'Failed to update client');
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="text-center text-muted" style={{ padding: '3rem' }}>Loading...</div>;
  if (error && !formData.userName) return <div className="card text-danger">{error}</div>;

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <Link to="/admin/clients" className="btn btn-ghost" style={{ marginBottom: '1rem' }}>
        <ArrowLeft size={16} /> Back to Clients
      </Link>

      <div className="card">
        <h2 className="font-semibold mb-4" style={{ fontSize: '1.125rem' }}>Edit Client</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="input" name="userName" value={formData.userName} onChange={handleChange} placeholder="Client Username" />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">
              New Password <span className="text-muted" style={{ fontWeight: 'normal' }}>(Leave blank to keep current)</span>
            </label>
            <input className="input" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Set new password" />
          </div>

          {error && (
            <div className="text-danger mb-4" style={{ padding: '0.75rem', background: 'var(--danger-bg)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <div className="flex justify-between">
            <div></div>
            <button className="btn btn-primary" disabled={loading}>
              {loading ? <Loader2 size={16} /> : <><Save size={16} /> Update Client</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
