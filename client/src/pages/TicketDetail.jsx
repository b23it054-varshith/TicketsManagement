import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketsAPI, usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import TicketEditModal from '../components/tickets/TicketEditModal';
import toast from 'react-hot-toast';
import { formatDistanceToNow, format } from 'date-fns';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState([]);
  const [commentBody, setCommentBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchTicket = async () => {
    try {
      const { data } = await ticketsAPI.getOne(id);
      setTicket(data.ticket);
      setComments(data.comments);
    } catch {
      navigate('/tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
    if (user?.role !== 'user') {
      usersAPI.getAgents().then(({ data }) => setAgents(data.agents)).catch(() => {});
    }
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentBody.trim()) return;
    setSubmitting(true);
    try {
      await ticketsAPI.addComment(id, { body: commentBody });
      setCommentBody('');
      toast.success('Reply added');
      fetchTicket();
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (!ticket) return null;

  const canEdit = user?.role === 'admin' || user?.role === 'agent';
  const isOwner = ticket.createdBy?._id === user?._id ||
    ticket.createdBy?._id?.toString() === user?._id?.toString();

  return (
    <div>
      <div className="page-header">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/tickets')} style={{ marginBottom: 8 }}>
            ← Back to Tickets
          </button>
          <h1 className="page-title" style={{ fontSize: '1.3rem' }}>{ticket.title}</h1>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{ticket.ticketId}</span>
            <Badge status={ticket.status} type="status" />
            <Badge status={ticket.priority} type="priority" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {canEdit && (
            <button className="btn btn-secondary btn-sm" onClick={() => setShowEditModal(true)} id="edit-ticket-btn">
              ✏️ Edit
            </button>
          )}
        </div>
      </div>

      <div className="ticket-detail-grid">
        {/* Left: Description + Comments */}
        <div>
          {/* Description */}
          <div className="detail-section" style={{ marginBottom: 16 }}>
            <div className="detail-section-title">Description</div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
              {ticket.description}
            </p>
          </div>

          {/* Comments */}
          <div className="detail-section">
            <div className="detail-section-title">Comments ({comments.length})</div>
            <div className="comment-list">
              {comments.map(c => (
                <div key={c._id} className="comment-item">
                  <div className="comment-header">
                    <div className="mini-avatar">{c.author?.name?.charAt(0)}</div>
                    <span className="comment-author">{c.author?.name}</span>
                    <Badge status={c.author?.role} type="role" />
                    <span className="comment-time">
                      {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="comment-body">{c.content}</div>
                </div>
              ))}
            </div>

            {/* Comment Form */}
            {ticket.status !== 'Closed' && (
              <form className="comment-form" onSubmit={handleComment} style={{ marginTop: 16 }}>
                <textarea
                  className="form-control"
                  placeholder="Write a reply…"
                  rows={3}
                  value={commentBody}
                  onChange={e => setCommentBody(e.target.value)}
                  id="comment-input"
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                  <button
                    id="comment-submit"
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={submitting || !commentBody.trim()}
                  >
                    {submitting ? '⏳' : '💬 Reply'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="ticket-detail-sidebar">
          {/* Quick Actions */}
          {canEdit && ticket.status !== 'Closed' && (
            <div className="detail-section">
              <div className="detail-section-title">Quick Actions</div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowEditModal(true)}
                id="sidebar-edit-btn"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                ✏️ Edit Ticket
              </button>
            </div>
          )}

          {/* Ticket Info */}
          <div className="detail-section">
            <div className="detail-section-title">Ticket Info</div>
            {[
              { label: 'Category', value: ticket.category },
              { label: 'Department', value: ticket.department || '-' },
              { label: 'Created By', value: ticket.createdBy?.name },
              { label: 'Created', value: ticket.createdAt ? format(new Date(ticket.createdAt), 'MMM d, yyyy HH:mm') : '-' },
              { label: 'Last Updated', value: ticket.updatedAt ? formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true }) : '-' },
            ].map(f => (
              <div key={f.label} className="detail-field">
                <div className="detail-field-label">{f.label}</div>
                <div className="detail-field-value">{f.value}</div>
              </div>
            ))}
          </div>

          {/* Assigned Agent Info */}
          {ticket.assignedTo && (
            <div className="detail-section">
              <div className="detail-section-title">Assigned Agent</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="mini-avatar" style={{ width: 36, height: 36, fontSize: 14 }}>
                  {ticket.assignedTo.name?.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{ticket.assignedTo.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{ticket.assignedTo.email}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Edit Modal */}
      <TicketEditModal
        ticket={ticket}
        agents={agents}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => fetchTicket()}
      />
    </div>
  );
}
