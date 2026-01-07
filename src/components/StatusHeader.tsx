import './StatusHeader.css'

export default function StatusHeader() {
  return (
    <header className="status-header">
      <div className="header-content">
        <a href="https://booleanclient.ru" className="header-logo no-select no-drag">
          <img 
            src="/icon.png" 
            alt="Boolean" 
            className="logo-image no-select no-drag"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            onCopy={(e) => e.preventDefault()}
          />
          <span className="logo-text">Boolean</span>
          <span className="logo-divider">|</span>
          <span className="logo-status">Status</span>
        </a>
        <a href="https://booleanclient.ru" className="header-back">
          <svg className="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Boolean
        </a>
      </div>
    </header>
  )
}
