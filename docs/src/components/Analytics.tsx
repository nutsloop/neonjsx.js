import { css } from '@nutsloop/neonjsx';

// Simulate module load delay (1 second)
await new Promise( resolve => setTimeout( resolve, 1000 ) );

const Analytics = () => {
  css( `
    .analytics {
      background: rgba(255, 50, 150, 0.1);
      border: 1px solid rgba(255, 50, 150, 0.3);
      border-radius: 12px;
      padding: 1.5rem;
      margin-top: 1rem;
    }

    .analytics h3 {
      color: #ff3296;
      margin-bottom: 1rem;
    }

    .analytics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .analytics-card {
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      text-align: center;
    }

    .analytics-value {
      font-size: 2rem;
      font-weight: 700;
      color: #ff3296;
      margin-bottom: 0.5rem;
    }

    .analytics-label {
      color: #8aa0b8;
      font-size: 0.9rem;
    }
  `, { inline: true } );

  return (
    <div className="analytics">
      <h3>Analytics Dashboard</h3>
      <p style="color: #8aa0b8; margin-bottom: 1rem;">Loaded after 5 second delay</p>
      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="analytics-value">12.5K</div>
          <div className="analytics-label">Page Views</div>
        </div>
        <div className="analytics-card">
          <div className="analytics-value">3.2K</div>
          <div className="analytics-label">Unique Visitors</div>
        </div>
        <div className="analytics-card">
          <div className="analytics-value">8.7</div>
          <div className="analytics-label">Avg. Session (min)</div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
