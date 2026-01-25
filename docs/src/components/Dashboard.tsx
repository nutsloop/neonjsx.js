import { css } from '@nutsloop/neonjsx';

interface DashboardProps {
  userId: number;
}

// Simulate a heavy module load (3 second delay)
await new Promise( resolve => setTimeout( resolve, 3000 ) );

const Dashboard = ( props: DashboardProps ) => {
  css( `
    .dashboard {
      background: linear-gradient(135deg, #1e3a5f 0%, #0f1f33 100%);
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .dashboard-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #00d4ff;
    }
    .user-badge {
      background: rgba(0, 212, 255, 0.15);
      color: #00d4ff;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }
    .stat-card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .stat-label {
      font-size: 0.875rem;
      color: #8899aa;
      margin-bottom: 0.5rem;
    }
    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #fff;
    }
    .stat-value.highlight {
      color: #00ff88;
    }
  `, { inline: true } );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Dashboard</h2>
        <span className="user-badge">User #{ props.userId }</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Active Sessions</div>
          <div className="stat-value">1,247</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Revenue</div>
          <div className="stat-value highlight">$48,290</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Conversion Rate</div>
          <div className="stat-value">3.2%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg. Load Time</div>
          <div className="stat-value">142ms</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
