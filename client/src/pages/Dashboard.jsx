import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader';
import StatsCards from '../components/dashboard/StatsCards';
import RecentActivity from '../components/dashboard/RecentActivity';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ticketsRes] = await Promise.all([
          ticketsAPI.getStats(),
          ticketsAPI.getAll({ limit: 5, sort: '-createdAt' })
        ]);
        setStats(statsRes.data.stats);
        setRecent(ticketsRes.data.tickets);
      } catch (error) {
        console.error('Dashboard data error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="page-subtitle">Here's what's happening with your tickets today</p>
        </div>
        <button className="btn btn-primary" id="dash-new-ticket" onClick={() => navigate('/tickets/new')}>
          ➕ New Ticket
        </button>
      </div>

      <StatsCards stats={stats} />

      <div className="charts-grid">
        <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
          <div className="chart-title">🕐 Recent Tickets</div>
          <RecentActivity tickets={recent} onNewTicket={() => navigate('/tickets/new')} />
        </div>
      </div>
    </div>
  );
}
