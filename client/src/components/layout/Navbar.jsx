import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/tickets': 'Support Tickets',
  '/tickets/new': 'New Ticket',
  '/admin': 'Admin Panel',
  '/profile': 'My Profile',
  '/knowledge-base': 'Knowledge Base',
};

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const title = pageTitles[location.pathname] ||
    (location.pathname.startsWith('/tickets/') ? 'Ticket Detail' : 'TicketFlow');

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/tickets?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  return (
    <header className="navbar" id="navbar">
      <div className="navbar-title">{title}</div>

      <div className="navbar-search">
        <span style={{ color: 'var(--text-muted)', fontSize: 15 }}>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Search tickets… (Enter)"
          id="global-search"
        />
      </div>

      <div className="navbar-actions">
        {/* Avatar — click to go to profile */}
        <div className="navbar-avatar" id="navbar-avatar" onClick={() => navigate('/profile')}>
          {initials}
        </div>
      </div>
    </header>
  );
}
