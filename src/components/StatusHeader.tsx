import { BiArrowBack } from 'react-icons/bi'
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
          <BiArrowBack className="back-icon" />
          Back to Boolean
        </a>
      </div>
    </header>
  )
}
