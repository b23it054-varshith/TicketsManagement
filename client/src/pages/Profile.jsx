import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI, ticketsAPI } from '../services/api';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', department: '' });
  const [myTickets, setMyTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('Profile');

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', phone: user.phone || '', department: user.department || '' });
    }
    const fetchTickets = async () => {
      try {
        const { data } = await ticketsAPI.getAll({ limit: 10 });
        setMyTickets(data.tickets);
      } catch (err) {
        console.error('Profile load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await usersAPI.updateProfile(form);
      updateUser(data.user);
      toast.success('Profile updated ✓');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="page-title" style={{ marginBottom: 20 }}>My Profile</h1>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar-lg">{initials}</div>
        <div className="profile-info">
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Badge status={user?.role} type="role" />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>· {user?.department}</span>
          </div>
        </div>
      </div>

      <div className="tabs">
        {['Profile', 'My Tickets'].map(t => (
          <div key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</div>
        ))}
      </div>

      {tab === 'Profile' && (
        <div style={{ maxWidth: 520 }}>
          <div className="card">
            <h3 style={{ marginBottom: 20 }}>Personal Information</h3>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label" htmlFor="profile-name">Full Name</label>
                <input
                  id="profile-name"
                  type="text"
                  className="form-control"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={user?.email}
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="profile-phone">Phone</label>
                  <input
                    id="profile-phone"
                    type="tel"
                    className="form-control"
                    placeholder="+91 0000 000000"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="profile-dept">Department</label>
                  <select
                    id="profile-dept"
                    className="form-control"
                    value={form.department}
                    onChange={e => setForm({ ...form, department: e.target.value })}
                  >
                    {['General', 'IT', 'HR', 'Finance', 'Operations', 'Sales', 'Support'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button id="save-profile" type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? '⏳ Saving…' : '💾 Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      {tab === 'My Tickets' && (
        <div>
          {myTickets.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎫</div>
              <div className="empty-state-title">No tickets yet</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {myTickets.map(t => (
                <div key={t._id} className="ticket-card" onClick={() => window.location.href = `/tickets/${t._id}`}>
                  <div className="ticket-card-header">
                    <div>
                      <div className="ticket-id">{t.ticketId}</div>
                      <div className="ticket-title">{t.title}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Badge status={t.priority} type="priority" />
                      <Badge status={t.status} type="status" />
                    </div>
                  </div>
                  <div className="ticket-meta">
                    <span className="ticket-meta-item">🏷️ {t.category}</span>
                    <span className="ticket-meta-item">🕐 {new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
