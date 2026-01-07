import './Footer.css'

export default function Footer() {
  return (
    <footer className="status-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <img 
            src="/icon.png" 
            alt="Boolean" 
            className="footer-logo no-select no-drag"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            onCopy={(e) => e.preventDefault()}
          />
          <span className="footer-name">Boolean</span>
        </div>
        <div className="footer-links">
          <a href="https://booleanclient.ru" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            Main Site
          </a>
          <a href="https://booleanclient.ru/dashboard" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </a>
        </div>
        <p className="footer-copyright">© 2026 Boolean. All rights reserved.</p>
      </div>
    </footer>
  )
}
