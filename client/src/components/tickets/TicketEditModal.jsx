import { useState, useEffect } from 'react';
import { ticketsAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function TicketEditModal({ ticket, agents, isOpen, onClose, onSuccess }) {
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    status: '',
    assignedTo: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ticket) {
      setEditForm({
        title: ticket.title,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        assignedTo: ticket.assignedTo?._id || ''
      });
    }
  }, [ticket, isOpen]);

  const handleStatusChange = (newStatus) => {
    setEditForm(prev => ({ ...prev, status: newStatus }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await ticketsAPI.update(ticket._id, {
        title: editForm.title,
        description: editForm.description,
        category: editForm.category,
        priority: editForm.priority,
        status: editForm.status,
        assignedTo: editForm.assignedTo || undefined
      });
      toast.success('Ticket updated successfully');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update ticket');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !ticket) return null;

  const statusFlow = ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'];
  const currentStatusIdx = statusFlow.findIndex(s => s.toLowerCase() === ticket.status.toLowerCase());

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 16
    }}>
      <div style={{
        background: 'var(--bg-primary)',
        borderRadius: 12,
        border: '1px solid var(--border)',
        width: '100%',
        maxWidth: 600,
        maxHeight: '90vh',
        overflow: 'auto',
        padding: 0,
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Edit Ticket</h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: 0,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div className="form-group">
            <label className="form-label">Ticket ID (Read-only)</label>
            <input
              type="text"
              className="form-control"
              value={ticket.ticketId || ''}
              disabled
              style={{ opacity: 0.6 }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={editForm.title}
              onChange={e => setEditForm(prev => ({ ...prev, title: e.target.value }))}
              required
              placeholder="Ticket title"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              value={editForm.description}
              onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
              required
              placeholder="Describe the issue"
              style={{ minHeight: 100, resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={editForm.category}
                onChange={e => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                required
              >
                <option value="">Select category</option>
                {['Hardware', 'Software', 'Network', 'Account', 'Email', 'Printer', 'Security', 'Other'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-control"
                value={editForm.priority}
                onChange={e => setEditForm(prev => ({ ...prev, priority: e.target.value }))}
                required
              >
                <option value="">Select priority</option>
                {['Low', 'Medium', 'High', 'Critical'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Update Section */}
          <div className="form-group">
            <label className="form-label">Status</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 12 }}>
              {statusFlow.map((status, idx) => {
                const isActive = editForm.status.toLowerCase() === status.toLowerCase();
                const isDisabled = idx > (currentStatusIdx + 2) && currentStatusIdx !== -1; // Can only move forward 2 steps or to Open
                return (
                  <button
                    key={status}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleStatusChange(status)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: isActive ? '2px solid var(--accent)' : '1px solid var(--border)',
                      background: isActive ? 'var(--accent-dim)' : 'var(--bg-hover)',
                      color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      opacity: isDisabled ? 0.5 : 1,
                      transition: 'all 0.2s'
                    }}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Assign To */}
          {agents.length > 0 && (
            <div className="form-group">
              <label className="form-label">Assign To Agent</label>
              <select
                className="form-control"
                value={editForm.assignedTo}
                onChange={e => setEditForm(prev => ({ ...prev, assignedTo: e.target.value }))}
              >
                <option value="">Unassigned</option>
                {agents.map(agent => (
                  <option key={agent._id} value={agent._id}>
                    {agent.name} ({agent.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Buttons */}
          <div style={{
            display: 'flex',
            gap: 12,
            marginTop: 24,
            paddingTop: 16,
            borderTop: '1px solid var(--border)'
          }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              style={{ flex: 1 }}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={submitting}
            >
              {submitting ? '⏳ Saving…' : '✓ Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
