import { css } from '@nutsloop/neonjsx';

// Simulate module load delay (1 second)
await new Promise( resolve => setTimeout( resolve, 1000 ) );

const Footer = () => {
  css( `
    .footer {
      background: rgba(50, 255, 150, 0.1);
      border: 1px solid rgba(50, 255, 150, 0.3);
      border-radius: 12px;
      padding: 2rem;
      margin-top: 2rem;
      text-align: center;
    }

    .footer h3 {
      color: #32ff96;
      margin-bottom: 1rem;
    }

    .footer-links {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-top: 1rem;
      flex-wrap: wrap;
    }

    .footer-link {
      color: #8aa0b8;
      text-decoration: none;
      transition: color 0.2s;
    }

    .footer-link:hover {
      color: #32ff96;
    }

    .footer-copy {
      margin-top: 1.5rem;
      color: #6b7c93;
      font-size: 0.9rem;
    }
  `, { inline: true } );

  return (
    <div className="footer">
      <h3>Footer Section</h3>
      <p>Loaded when scrolled into view with IntersectionObserver</p>
      <div className="footer-links">
        <a href="#about" className="footer-link">About</a>
        <a href="#contact" className="footer-link">Contact</a>
        <a href="#privacy" className="footer-link">Privacy</a>
        <a href="#terms" className="footer-link">Terms</a>
      </div>
      <p className="footer-copy">© 2026 NeonJSX. All rights reserved.</p>
    </div>
  );
};

export default Footer;
