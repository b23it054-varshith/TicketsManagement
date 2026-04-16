import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard', roles: ['user', 'agent', 'admin'] },
  { to: '/tickets', icon: '🎫', label: 'Tickets', roles: ['user', 'agent', 'admin'] },
  { to: '/tickets/new', icon: '➕', label: 'New Ticket', roles: ['user', 'admin'] },
  { to: '/knowledge-base', icon: '📚', label: 'Knowledge Base', roles: ['user', 'agent', 'admin'] },
];

const adminItems = [
  { to: '/admin', icon: '⚙️', label: 'Admin Panel', roles: ['admin'] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const visible = (roles) => roles.includes(user?.role);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="sidebar" id="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🎯</div>
        <span className="sidebar-logo-text">TicketFlow</span>
      </div>

      <div className="sidebar-nav">
        <div className="sidebar-section-label">Main</div>
        {navItems.filter(i => visible(i.roles)).map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <>
            <div className="sidebar-section-label" style={{ marginTop: 8 }}>Management</div>
            {adminItems.filter(i => visible(i.roles)).map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </>
        )}

        <div className="sidebar-section-label" style={{ marginTop: 8 }}>Account</div>
        <NavLink to="/profile" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
          <span className="icon">👤</span> Profile
        </NavLink>

        <button
          onClick={handleLogout}
          className="sidebar-link"
          style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', color: 'var(--danger)', marginTop: 4 }}
        >
          <span className="icon">🚪</span> Logout
        </button>
      </div>

      <div className="sidebar-user">
        <div className="sidebar-avatar">{initials}</div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{user?.name}</div>
          <div className="sidebar-user-role">{user?.role}</div>
        </div>
      </div>
    </nav>
  );
}
