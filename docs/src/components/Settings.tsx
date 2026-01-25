import { css } from '@nutsloop/neonjsx';

// Simulate module load delay (2 seconds)
await new Promise( resolve => setTimeout( resolve, 2000 ) );

const Settings = () => {
  css( `
    .settings {
      background: rgba(100, 100, 255, 0.1);
      border: 1px solid rgba(100, 100, 255, 0.3);
      border-radius: 12px;
      padding: 1.5rem;
      margin-top: 1rem;
    }

    .settings h3 {
      color: #6666ff;
      margin-bottom: 1rem;
    }

    .settings-grid {
      display: grid;
      gap: 1rem;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
    }

    .setting-label {
      color: #e8ecf1;
      font-weight: 500;
    }

    .setting-value {
      color: #6666ff;
    }
  `, { inline: true } );

  return (
    <div className="settings">
      <h3>Settings Panel</h3>
      <div className="settings-grid">
        <div className="setting-item">
          <span className="setting-label">Theme</span>
          <span className="setting-value">Dark</span>
        </div>
        <div className="setting-item">
          <span className="setting-label">Notifications</span>
          <span className="setting-value">Enabled</span>
        </div>
        <div className="setting-item">
          <span className="setting-label">Language</span>
          <span className="setting-value">English</span>
        </div>
      </div>
    </div>
  );
};

export default Settings;
