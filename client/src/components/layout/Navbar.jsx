import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { notificationsAPI } from '../../services/api';
import NotificationPanel from '../notifications/NotificationPanel';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/tickets': 'Support Tickets',
  '/tickets/new': 'New Ticket',
  '/reports': 'Reports & Analytics',
  '/admin': 'Admin Panel',
  '/profile': 'My Profile',
  '/knowledge-base': 'Knowledge Base',
};

export default function Navbar() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const notifRef = useRef(null);
  const [search, setSearch] = useState('');

  const title = pageTitles[location.pathname] ||
    (location.pathname.startsWith('/tickets/') ? 'Ticket Detail' : 'TicketFlow');

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  useEffect(() => {
    notificationsAPI.getAll().then(({ data }) => {
      setNotifications(data.notifications || []);
      setUnread(data.unreadCount || 0);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handler = (notif) => {
      setNotifications(prev => [notif, ...prev].slice(0, 50));
      setUnread(prev => prev + 1);
    };
    socket.on('notification', handler);
    return () => socket.off('notification', handler);
  }, [socket]);

  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkAllRead = async () => {
    await notificationsAPI.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnread(0);
  };

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
        {/* Notification Bell */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button className="icon-btn" id="notif-btn" onClick={() => setShowNotif(v => !v)}>
            🔔
            {unread > 0 && <span className="notif-dot" />}
          </button>

          {showNotif && (
            <NotificationPanel
              notifications={notifications}
              unread={unread}
              onMarkAllRead={handleMarkAllRead}
              onMarkRead={(id) => {
                setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
                setUnread(prev => Math.max(0, prev - 1));
                setShowNotif(false);
              }}
              onDelete={(id) => setNotifications(prev => prev.filter(n => n._id !== id))}
            />
          )}
        </div>

        {/* Avatar */}
        <div className="navbar-avatar" id="navbar-avatar" onClick={() => navigate('/profile')}>
          {user?.avatar
            ? <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : initials}
        </div>
      </div>
    </header>
  );
}
