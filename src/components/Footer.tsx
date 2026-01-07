import { BiGlobe, BiGridAlt } from 'react-icons/bi'
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
            <BiGlobe />
            Main Site
          </a>
          <a href="https://booleanclient.ru/dashboard" target="_blank" rel="noopener noreferrer">
            <BiGridAlt />
            Dashboard
          </a>
        </div>
        <p className="footer-copyright">© 2026 Boolean. All rights reserved.</p>
      </div>
    </footer>
  )
}
