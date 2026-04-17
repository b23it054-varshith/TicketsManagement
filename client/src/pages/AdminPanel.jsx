import { useEffect, useState } from 'react';
import { ticketsAPI, usersAPI } from '../services/api';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const TABS = ['Overview', 'Users', 'Tickets'];

export default function AdminPanel() {
  const [tab, setTab] = useState('Overview');
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [editTicket, setEditTicket] = useState(null);
  const [search, setSearch] = useState('');
  const [agents, setAgents] = useState([]);
  const [userUpdate, setUserUpdate] = useState({});
  const [ticketUpdate, setTicketUpdate] = useState({});

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [ur, tr, sr, ar] = await Promise.all([
        usersAPI.getAll({ limit: 100 }),
        ticketsAPI.getAll({ limit: 100 }),
        ticketsAPI.getStats(),
        usersAPI.getAgents()
      ]);
      setUsers(ur.data.users);
      setTickets(tr.data.tickets);
      setStats(sr.data.stats);
      setAgents(ar.data.agents);
    } catch (err) {
      toast.error('Failed to fetch data');
    }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleUserUpdate = async () => {
    if (!editUser) return;
    try {
      await usersAPI.update(editUser._id, { 
        role: userUpdate.role || editUser.role, 
        isActive: userUpdate.isActive !== undefined ? userUpdate.isActive : editUser.isActive 
      });
      toast.success('User updated successfully');
      setEditUser(null);
      setUserUpdate({});
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleTicketUpdate = async () => {
    if (!editTicket) return;
    try {
      await ticketsAPI.update(editTicket._id, { 
        status: ticketUpdate.status || editTicket.status, 
        priority: ticketUpdate.priority || editTicket.priority,
        assignedTo: ticketUpdate.assignedTo !== undefined ? ticketUpdate.assignedTo : editTicket.assignedTo?._id
      });
      toast.success('Ticket updated successfully');
      setEditTicket(null);
      setTicketUpdate({});
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update ticket');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );
  const filteredTickets = tickets.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.ticketId?.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">⚙️ Admin Panel</h1>
          <p className="page-subtitle">Manage users, tickets, and system settings</p>
        </div>
      </div>

      {/* Overview Stats */}
      {tab === 'Overview' && (
        <div className="stats-grid" style={{ marginBottom: 24 }}>
          {[
            { label: 'Total Users', value: users.length, icon: '👥', color: 'blue' },
            { label: 'Active Users', value: users.filter(u => u.isActive).length, icon: '✅', color: 'green' },
            { label: 'Agents', value: users.filter(u => u.role === 'agent').length, icon: '🧑‍💼', color: 'purple' },
            { label: 'Total Tickets', value: tickets.length, icon: '🎫', color: 'blue' },
            { label: 'Open Tickets', value: stats?.open || 0, icon: '🔴', color: 'red' },
            { label: 'In Progress', value: stats?.inProgress || 0, icon: '🟡', color: 'orange' },
            { label: 'Resolved', value: stats?.resolved || 0, icon: '✅', color: 'green' },
          ].map(s => (
            <div key={s.label} className={`stat-card ${s.color}`}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="tabs">
        {TABS.map(t => (
          <div key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => { setTab(t); setSearch(''); }}>
            {t}
          </div>
        ))}
      </div>

      {(tab === 'Users' || tab === 'Tickets') && (
        <div style={{ marginBottom: 16 }}>
          <input 
            className="form-control" 
            style={{ maxWidth: 400 }}
            placeholder={`🔍 Search ${tab.toLowerCase()}…`}
            value={search} 
            onChange={e => setSearch(e.target.value)}
            id={`admin-search-${tab}`}
          />
        </div>
      )}

      {/* Users Tab */}
      {tab === 'Users' && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="mini-avatar" style={{ width: 32, height: 32, fontSize: 13, minWidth: 32 }}>
                        {u.avatar ? <img src={u.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : u.name?.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{u.email}</td>
                  <td><Badge status={u.role} type="role" /></td>
                  <td style={{ fontSize: 13 }}>{u.department || '-'}</td>
                  <td>
                    <span style={{
                      padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                      background: u.isActive ? 'var(--success-dim)' : 'var(--danger-dim)',
                      color: u.isActive ? 'var(--success)' : 'var(--danger)'
                    }}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {u.lastLogin ? formatDistanceToNow(new Date(u.lastLogin), { addSuffix: true }) : 'Never'}
                  </td>
                  <td>
                    <button 
                      className="btn btn-ghost btn-sm" 
                      id={`edit-user-${u._id}`}
                      onClick={() => { setEditUser({ ...u }); setUserUpdate({}); }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              No users found
            </div>
          )}
        </div>
      )}

      {/* Tickets Tab */}
      {tab === 'Tickets' && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Title</th>
                <th>Requester</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map(t => (
                <tr key={t._id}>
                  <td style={{ fontWeight: 600, fontSize: 12, fontFamily: 'monospace' }}>{t.ticketId}</td>
                  <td style={{ fontSize: 13, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.title}
                  </td>
                  <td style={{ fontSize: 12 }}>{t.createdBy?.name}</td>
                  <td style={{ fontSize: 12 }}>
                    {t.assignedTo ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div className="mini-avatar" style={{ width: 24, height: 24, fontSize: 10, minWidth: 24 }}>
                          {t.assignedTo.name?.charAt(0)}
                        </div>
                        {t.assignedTo.name}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>-</span>
                    )}
                  </td>
                  <td><Badge status={t.status} type="status" /></td>
                  <td><Badge status={t.priority} type="priority" /></td>
                  <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {formatDistanceToNow(new Date(t.createdAt), { addSuffix: true })}
                  </td>
                  <td>
                    <button 
                      className="btn btn-ghost btn-sm" 
                      id={`edit-ticket-${t._id}`}
                      onClick={() => { setEditTicket({ ...t }); setTicketUpdate({}); }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTickets.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              No tickets found
            </div>
          )}
        </div>
      )}

      {/* User Edit Modal */}
      <Modal 
        isOpen={!!editUser} 
        onClose={() => { setEditUser(null); setUserUpdate({}); }}
        title="Edit User"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => { setEditUser(null); setUserUpdate({}); }}>Cancel</button>
            <button className="btn btn-primary" onClick={handleUserUpdate}>Save Changes</button>
          </>
        }
      >
        {editUser && (
          <div>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" value={editUser.name} disabled />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={editUser.email} disabled />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select 
                className="form-control"
                value={userUpdate.role || editUser.role}
                onChange={e => setUserUpdate(prev => ({ ...prev, role: e.target.value }))}
                id={`user-role-${editUser._id}`}
              >
                <option value="user">User</option>
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                <input 
                  type="checkbox" 
                  checked={userUpdate.isActive !== undefined ? userUpdate.isActive : editUser.isActive}
                  onChange={e => setUserUpdate(prev => ({ ...prev, isActive: e.target.checked }))}
                  id={`user-active-${editUser._id}`}
                />
                <span>Account Active</span>
              </label>
            </div>
          </div>
        )}
      </Modal>

      {/* Ticket Edit Modal */}
      <Modal 
        isOpen={!!editTicket} 
        onClose={() => { setEditTicket(null); setTicketUpdate({}); }}
        title="Edit Ticket"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => { setEditTicket(null); setTicketUpdate({}); }}>Cancel</button>
            <button className="btn btn-primary" onClick={handleTicketUpdate}>Save Changes</button>
          </>
        }
      >
        {editTicket && (
          <div>
            <div className="form-group">
              <label className="form-label">Ticket ID (Read-only)</label>
              <input type="text" className="form-control" value={editTicket.ticketId || ''} disabled />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select 
                className="form-control"
                value={ticketUpdate.status || editTicket.status}
                onChange={e => setTicketUpdate(prev => ({ ...prev, status: e.target.value }))}
                id={`ticket-status-${editTicket._id}`}
              >
                {['Open', 'In Progress', 'Resolved', 'Closed'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select 
                className="form-control"
                value={ticketUpdate.priority || editTicket.priority}
                onChange={e => setTicketUpdate(prev => ({ ...prev, priority: e.target.value }))}
                id={`ticket-priority-${editTicket._id}`}
              >
                {['Low', 'Medium', 'High', 'Critical'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Assign To</label>
              <select 
                className="form-control"
                value={ticketUpdate.assignedTo !== undefined ? ticketUpdate.assignedTo : (editTicket.assignedTo?._id || '')}
                onChange={e => setTicketUpdate(prev => ({ ...prev, assignedTo: e.target.value }))}
                id={`ticket-assign-${editTicket._id}`}
              >
                <option value="">Unassigned</option>
                {agents.map(a => (
                  <option key={a._id} value={a._id}>{a.name} ({a.email})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Requester</label>
              <input type="text" className="form-control" value={editTicket.createdBy?.name || ''} disabled />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <input type="text" className="form-control" value={editTicket.category || ''} disabled />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
