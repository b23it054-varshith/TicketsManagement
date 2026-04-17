import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CATEGORIES = ['Hardware', 'Software', 'Network', 'Account', 'Email', 'Printer', 'Security', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

export default function CreateTicket() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Software',
    priority: 'Medium',
    department: user?.department || 'General',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return toast.error('Title and description required');
    
    setLoading(true);
    try {
      // Switched from FormData to JSON for simplicity and compatibility
      const { data } = await ticketsAPI.create(form);
      toast.success(`Ticket ${data.ticket.ticketId} created! 🎉`);
      navigate(`/tickets/${data.ticket._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  const priorityColors = { 
    Low: 'var(--success)', 
    Medium: 'var(--warning)', 
    High: 'var(--priority-high)', 
    Critical: 'var(--danger)' 
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Create New Ticket</h1>
          <p className="page-subtitle">Describe your issue and we'll assign it to the right agent</p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Back</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="ticket-title">Subject / Title *</label>
            <input id="ticket-title" type="text" className="form-control"
              placeholder="Brief description of your issue"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="ticket-desc">Description *</label>
            <textarea id="ticket-desc" className="form-control"
              placeholder="Provide detailed information about your issue..."
              rows={6}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              required style={{ minHeight: 140 }} />
          </div>
        </div>

        <div className="card" style={{ marginBottom: 24 }}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="ticket-category">Category</label>
              <select id="ticket-category" className="form-control"
                value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="ticket-dept">Department</label>
              <select id="ticket-dept" className="form-control"
                value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
                {['General', 'IT', 'HR', 'Finance', 'Operations', 'Sales', 'Support'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: 12 }}>
            <label className="form-label">Priority</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {PRIORITIES.map(p => (
                <button key={p} type="button"
                  id={`priority-${p.toLowerCase()}`}
                  onClick={() => setForm({ ...form, priority: p })}
                  style={{
                    flex: 1, padding: '9px 8px', borderRadius: 8, border: `2px solid`,
                    borderColor: form.priority === p ? priorityColors[p] : 'var(--border)',
                    background: form.priority === p ? `${priorityColors[p]}18` : 'var(--bg-input)',
                    color: form.priority === p ? priorityColors[p] : 'var(--text-muted)',
                    fontWeight: 600, fontSize: 12, cursor: 'pointer', textTransform: 'capitalize',
                    transition: 'all 0.2s'
                  }}>
                  {p === 'Critical' ? '⚡' : p === 'High' ? '↑' : p === 'Medium' ? '→' : '↓'} {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
          <button id="create-ticket-submit" type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: 140 }}>
            {loading ? '⏳ Submitting…' : '🎫 Submit Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
}
