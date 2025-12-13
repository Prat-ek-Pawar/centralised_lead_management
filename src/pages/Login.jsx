import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, ShieldCheck, Lock, ArrowRight, Loader2, LayoutDashboard } from 'lucide-react';

export default function Login() {
  const [isClient, setIsClient] = useState(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const { loginAdmin, loginClient, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success = false;
    if (isClient) {
      success = await loginClient(userName, password);
    } else {
      success = await loginAdmin(userName, password);
    }
    if (success) {
      navigate(isClient ? '/client' : '/admin');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-secondary)',
      padding: '1rem'
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-6">
          <div style={{
            width: '48px', height: '48px',
            background: 'var(--accent)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white',
            margin: '0 auto 1rem auto'
          }}>
            <LayoutDashboard size={24} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>Welcome back</h1>
          <p className="text-muted">Sign in to access your dashboard</p>
        </div>

        <div className="card">
          <div style={{
            display: 'flex',
            background: 'var(--bg-tertiary)',
            padding: '4px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem'
          }}>
            <button
              type="button"
              onClick={() => setIsClient(false)}
              style={{
                flex: 1,
                padding: '0.625rem',
                borderRadius: '4px',
                border: 'none',
                background: !isClient ? 'var(--bg-primary)' : 'transparent',
                color: !isClient ? 'var(--accent-text)' : 'var(--text-muted)',
                fontWeight: 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
              }}
            >
              <ShieldCheck size={16} /> Admin
            </button>
            <button
              type="button"
              onClick={() => setIsClient(true)}
              style={{
                flex: 1,
                padding: '0.625rem',
                borderRadius: '4px',
                border: 'none',
                background: isClient ? 'var(--bg-primary)' : 'transparent',
                color: isClient ? 'var(--accent-text)' : 'var(--text-muted)',
                fontWeight: 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
              }}
            >
              <User size={16} /> Client
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                className="input"
                type="text"
                placeholder="Enter your username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Password</label>
              <input
                className="input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="text-danger mb-4" style={{
                padding: '0.75rem',
                background: 'var(--danger-bg)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.875rem'
              }}>
                {error}
              </div>
            )}

            <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>
        </div>

        <div className="text-center text-muted" style={{ marginTop: '1.5rem', fontSize: '0.875rem' }}>
          <Link to="/register-admin" style={{ color: 'var(--accent)' }}>
            First time? Register Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
