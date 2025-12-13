import { useState } from 'react';
import { adminApi } from '../../api';
import { useNavigate, Link } from 'react-router-dom';
import { Save, ArrowLeft, CheckCircle } from 'lucide-react';

export default function CreateClient() {
  const [formData, setFormData] = useState({ userName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const uniqueId = crypto.randomUUID();
      const payload = {
        ...formData,
        publicKey: uniqueId,
        clientID: uniqueId,
        clientId: uniqueId
      };
      const data = await adminApi.createClient(payload);
      setSuccessData(data);
    } catch (err) {
      setError(err.message || 'Failed to create client');
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="card text-center" style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem' }}>
        <div style={{
          width: '64px', height: '64px',
          borderRadius: '50%',
          background: 'var(--success-bg)',
          color: 'var(--success)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <CheckCircle size={32} />
        </div>
        <h2 className="font-semibold" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Client Created!</h2>
        <p className="text-muted mb-6">Share these credentials with the client.</p>

        <div style={{
          background: 'var(--bg-tertiary)',
          padding: '1rem',
          borderRadius: 'var(--radius-sm)',
          textAlign: 'left',
          marginBottom: '1.5rem'
        }}>
          <div className="form-group">
            <label className="form-label">Client Name</label>
            <div className="font-semibold">{successData.userName}</div>
          </div>
          <div>
            <label className="form-label">Client ID</label>
            <code style={{
              display: 'block',
              background: 'var(--accent-light)',
              color: 'var(--accent-text)',
              padding: '0.5rem',
              borderRadius: '4px',
              fontSize: '0.875rem',
              wordBreak: 'break-all'
            }}>
              {successData.clientID}
            </code>
          </div>
        </div>

        <div className="flex justify-center gap-2">
          <Link to="/admin/clients" className="btn btn-secondary">Back to List</Link>
          <button onClick={() => { setSuccessData(null); setFormData({ userName: '', email: '', password: '' }); }} className="btn btn-primary">
            Create Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <Link to="/admin/clients" className="btn btn-ghost" style={{ marginBottom: '1rem' }}>
        <ArrowLeft size={16} /> Back to Clients
      </Link>

      <div className="card">
        <h2 className="font-semibold mb-4" style={{ fontSize: '1.125rem' }}>New Client</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="input" name="userName" value={formData.userName} onChange={handleChange} required placeholder="e.g. AcmeCorp" />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="input" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="email@example.com" />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Password</label>
            <input className="input" name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="Secure password" />
          </div>

          {error && (
            <div className="text-danger mb-4" style={{ padding: '0.75rem', background: 'var(--danger-bg)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <div className="flex justify-between">
            <div></div>
            <button className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : <><Save size={16} /> Create Client</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
