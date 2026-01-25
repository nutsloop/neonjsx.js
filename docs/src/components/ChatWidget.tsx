import { css } from '@nutsloop/neonjsx';

// Simulate module load delay (1 second)
await new Promise( resolve => setTimeout( resolve, 1000 ) );

const ChatWidget = () => {
  css( `
    .chat-widget {
      background: rgba(150, 50, 255, 0.1);
      border: 1px solid rgba(150, 50, 255, 0.3);
      border-radius: 12px;
      padding: 1.5rem;
      margin-top: 1rem;
    }

    .chat-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .chat-status {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #32ff96;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .chat-header h3 {
      color: #9632ff;
      margin: 0;
    }

    .chat-body {
      color: #8aa0b8;
      line-height: 1.6;
    }

    .chat-input {
      margin-top: 1rem;
      display: flex;
      gap: 0.5rem;
    }

    .chat-input input {
      flex: 1;
      padding: 0.5rem;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      background: rgba(255, 255, 255, 0.05);
      color: #e8ecf1;
    }

    .chat-input button {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      border: none;
      background: #9632ff;
      color: white;
      cursor: pointer;
    }
  `, { inline: true } );

  return (
    <div className="chat-widget">
      <div className="chat-header">
        <div className="chat-status"></div>
        <h3>Live Chat Support</h3>
      </div>
      <div className="chat-body">
        <p>Loaded when browser is idle using requestIdleCallback.</p>
        <p>Chat with our support team in real-time.</p>
      </div>
      <div className="chat-input">
        <input type="text" placeholder="Type a message..." />
        <button>Send</button>
      </div>
    </div>
  );
};

export default ChatWidget;
