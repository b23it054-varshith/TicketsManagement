import { useState } from 'react';

const articles = [
  {
    id: 1, category: 'Getting Started', icon: '🚀',
    title: 'How to create a support ticket',
    content: 'Navigate to Tickets → New Ticket. Fill in the subject, description, category, and priority. Click Submit — our system will assign a support agent to handle your request.'
  },
  {
    id: 2, category: 'Getting Started', icon: '🔍',
    title: 'How to track your ticket status',
    content: 'Visit the Tickets page to see all your submitted tickets. Each ticket shows its current status: Open, In Progress, Resolved, or Closed. Status updates are visible whenever you refresh the page.'
  },
  {
    id: 3, category: 'Account', icon: '👤',
    title: 'How to update your profile',
    content: 'Click your avatar in the top-right corner or navigate to Profile from the sidebar. You can update your name, phone, and department information.'
  },
  {
    id: 4, category: 'Tickets', icon: '⏱️',
    title: 'Ticket Priorities',
    content: 'Tickets are categorized by priority to help agents focus on urgent issues: Critical, High, Medium, and Low. Agents aim to resolve Critical issues as quickly as possible.'
  },
  {
    id: 5, category: 'Tickets', icon: '🏷️',
    title: 'Ticket Categories',
    content: 'When creating a ticket, choose the category that best fits your issue: Hardware, Software, Network, Account, etc. This helps the correct department find your ticket faster.'
  },
  {
    id: 6, category: 'Tickets', icon: '✅',
    title: 'Closing resolved tickets',
    content: 'Once an agent has resolved your issue, they will mark the ticket as Resolved. You can view the resolution details in the ticket thread. Tickets are eventually marked as Closed.'
  },
  {
    id: 7, category: 'Agents', icon: '👨‍🔧',
    title: 'Agent Responsibilities',
    content: 'Agents are responsible for picking up open tickets, communicating with the users via comments, and setting the ticket status to Resolved once the issue is fixed.'
  },
  {
    id: 8, category: 'Agents', icon: '🔁',
    title: 'Assignment System',
    content: 'When a new ticket is created, it is assigned to an available agent. Managers or Admins can also manually reassign tickets to different agents from the management panel.'
  }
];

const CATEGORIES = ['All', 'Getting Started', 'Tickets', 'Account', 'Agents'];

export default function KnowledgeBase() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [expanded, setExpanded] = useState(null);

  const filtered = articles.filter(a => {
    const matchCat = category === 'All' || a.category === category;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">📚 Knowledge Base</h1>
          <p className="page-subtitle">Find answers to common questions and learn how to use the Ticket Management System</p>
        </div>
      </div>

      {/* Search */}
      <div style={{
        background: 'linear-gradient(135deg, var(--accent-dim), rgba(139,92,246,0.08))',
        border: '1px solid var(--accent)',
        borderRadius: 16, padding: '28px 32px', marginBottom: 28, textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: 6, fontSize: '1.3rem' }}>How can we help you?</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 18 }}>Search {articles.length} articles</p>
        <div style={{ maxWidth: 500, margin: '0 auto', display: 'flex', gap: 10 }}>
          <div className="navbar-search" style={{ flex: 1, width: 'auto' }}>
            <span style={{ color: 'var(--text-muted)' }}>🔍</span>
            <input
              id="kb-search"
              placeholder="Search articles…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 14, width: '100%' }}
            />
          </div>
          {search && (
            <button className="btn btn-ghost btn-sm" onClick={() => setSearch('')}>✕ Clear</button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="filter-bar" style={{ marginBottom: 20 }}>
        {CATEGORIES.map(c => (
          <button key={c} id={`kb-cat-${c.toLowerCase().replace(' ', '-')}`}
            className={`filter-chip ${category === c ? 'active' : ''}`}
            onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
        {filtered.length} article{filtered.length !== 1 ? 's' : ''} found
        {search && <> for "<strong style={{ color: 'var(--text-primary)' }}>{search}</strong>"</>}
      </p>

      {/* Articles */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <div className="empty-state-title">No articles found</div>
          <div className="empty-state-desc">Try different keywords or browse all categories</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(article => (
            <div key={article.id}
              style={{
                background: 'var(--bg-card)',
                border: `1px solid ${expanded === article.id ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 12, overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}>
              <button
                id={`kb-article-${article.id}`}
                onClick={() => setExpanded(expanded === article.id ? null : article.id)}
                style={{
                  width: '100%', padding: '16px 20px', background: 'none', border: 'none',
                  display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
                  textAlign: 'left',
                }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{article.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 2 }}>{article.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{article.category}</div>
                </div>
                <span style={{
                  fontSize: 18, color: 'var(--text-muted)', transform: expanded === article.id ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s', flexShrink: 0
                }}>⌄</span>
              </button>
              {expanded === article.id && (
                <div style={{ padding: '0 20px 20px 56px', borderTop: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, paddingTop: 14 }}>
                    {article.content}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Help CTA */}
      <div style={{
        marginTop: 32, padding: '20px 24px',
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16
      }}>
        <div>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Still need help?</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Can't find what you're looking for? Submit a support ticket and our team will assist you.</div>
        </div>
        <a href="/tickets/new" className="btn btn-primary" style={{ flexShrink: 0 }}>🎫 Create Ticket</a>
      </div>
    </div>
  );
}
