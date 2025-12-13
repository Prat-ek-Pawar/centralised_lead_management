import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogOut, LayoutDashboard, Users, FileText, Menu, Sun, Moon, UserPlus } from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children, title }) {
  const { user, role, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const NavLink = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname.startsWith(to);
    return (
      <Link
        to={to}
        className={`sidebar-link ${isActive ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      >
        <Icon size={18} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="app-layout">
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />


      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <LayoutDashboard size={20} />
          </div>
          <div className="sidebar-brand-text">
            <h2>Digitech</h2>
            <span>{role === 'admin' ? 'Administration' : 'Client Portal'}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {role === 'admin' && (
            <>
              <div className="sidebar-section-title">Overview</div>
              <NavLink to="/admin/clients" icon={Users} label="Clients" />
              <NavLink to="/admin/clients/new" icon={UserPlus} label="Create Client" />
              <NavLink to="/admin/submissions" icon={FileText} label="Submissions" />
            </>
          )}
          {role === 'client' && (
            <>
              <div className="sidebar-section-title">Dashboard</div>
              <NavLink to="/client/my-submissions" icon={FileText} label="My Submissions" />
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <button onClick={toggleTheme} className="sidebar-link">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {user?.userName?.charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.userName}</div>
              <div className="sidebar-user-role">{role}</div>
            </div>
            <button onClick={handleLogout} className="btn btn-ghost btn-icon" title="Sign Out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="mobile-header">
          <button className="btn btn-secondary btn-icon" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <span className="mobile-header-title">Digitech</span>
        </div>

        <div className="main-inner">
          <h1 className="page-title">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  );
}
