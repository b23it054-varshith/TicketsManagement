import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [selectedRole, setSelectedRole] = useState('user'); // Track selected demo role

  const demoAccounts = {
    user: { email: 'user@demo.com', password: 'password123', label: 'User Account', color: 'blue' },
    agent: { email: 'agent@demo.com', password: 'password123', label: 'Support Agent', color: 'purple' },
    admin: { email: 'admin@demo.com', password: 'password123', label: 'Admin', color: 'red' }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const roleLabel = user.role.charAt(0).toUpperCase() + user.role.slice(1);
      toast.success(`Welcome ${roleLabel}! 👋`);
      
      // Navigation happens automatically via App.jsx routing
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (role) => {
    const account = demoAccounts[role];
    setForm({ email: account.email, password: account.password });
    setSelectedRole(role);
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-logo">
          <div className="auth-logo-icon">🎯</div>
          <span className="auth-logo-text">TicketFlow</span>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to manage your support tickets</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                className="form-control"
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                style={{ paddingRight: 44 }}
              />
              <button type="button"
                onClick={() => setShowPass(v => !v)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16 }}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            id="login-submit"
            type="submit"
            className="btn btn-primary w-full"
            style={{ marginTop: 8, justifyContent: 'center', padding: '12px' }}
            disabled={loading}
          >
            {loading ? '⏳ Signing in…' : '→ Sign In'}
          </button>
        </form>

        <p className="auth-divider">New to TicketFlow?</p>
        <div style={{ textAlign: 'center' }}>
          <Link to="/register" className="auth-link">Create an account →</Link>
        </div>

        {/* Demo credentials with role selection */}
        <div style={{
          marginTop: 22, padding: '12px 14px',
          background: 'var(--accent-dim)', borderRadius: 8,
          border: '1px solid var(--accent)'
        }}>
          <div style={{ fontWeight: 700, color: 'var(--accent-hover)', marginBottom: 10, fontSize: 12 }}>💡 Quick Demo Access</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {['user', 'agent', 'admin'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => fillDemoAccount(role)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: selectedRole === role ? 'var(--accent-hover)' : 'transparent',
                  color: selectedRole === role ? 'white' : 'var(--text-secondary)',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {demoAccounts[role].label}
              </button>
            ))}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 11, marginTop: 10 }}>
            Click a role above to auto-fill credentials
          </div>
        </div>
      </div>
    </div>
  );
}
