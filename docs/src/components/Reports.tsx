import { css } from '@nutsloop/neonjsx';

// Simulate module load delay (1.5 seconds)
await new Promise( resolve => setTimeout( resolve, 1500 ) );

const Reports = () => {
  css( `
    .reports {
      background: rgba(255, 150, 50, 0.1);
      border: 1px solid rgba(255, 150, 50, 0.3);
      border-radius: 12px;
      padding: 1.5rem;
      margin-top: 1rem;
    }

    .reports h3 {
      color: #ff9632;
      margin-bottom: 1rem;
    }

    .report-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .report-item {
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .report-name {
      color: #e8ecf1;
      font-weight: 500;
    }

    .report-date {
      color: #8aa0b8;
      font-size: 0.9rem;
    }
  `, { inline: true } );

  return (
    <div className="reports">
      <h3>Monthly Reports</h3>
      <div className="report-list">
        <div className="report-item">
          <span className="report-name">Sales Report</span>
          <span className="report-date">Jan 2026</span>
        </div>
        <div className="report-item">
          <span className="report-name">Performance Report</span>
          <span className="report-date">Jan 2026</span>
        </div>
        <div className="report-item">
          <span className="report-name">User Analytics</span>
          <span className="report-date">Jan 2026</span>
        </div>
      </div>
    </div>
  );
};

export default Reports;
