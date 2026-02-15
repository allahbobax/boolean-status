import { BiGlobe, BiGridAlt } from 'react-icons/bi'

export default function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-border-color p-8 mt-auto max-md:p-6">
      <div className="max-w-container mx-auto flex flex-col items-center gap-6">
        <div className="flex items-center gap-1">
          <img 
            src="/lol1.svg" 
            alt="XiSe" 
            className="w-7 h-7   rounded-lg [image-rendering:pixelated] pointer-events-none no-select no-drag"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            onCopy={(e) => e.preventDefault()}
          />
          <span className="text-xl font-bold text-text-primary">XiSeDLC</span>
        </div>
        <div className="flex gap-8 max-md:gap-6 max-md:flex-wrap max-md:justify-center">
          <a href="https://xisedlc.lol" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-text-secondary no-underline text-sm transition-colors duration-200 hover:text-text-primary">
            <BiGlobe className="w-4 h-4" />
            Main Site
          </a>
          <a href="https://xisedlc.lol/dashboard" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-text-secondary no-underline text-sm transition-colors duration-200 hover:text-text-primary">
            <BiGridAlt className="w-4 h-4" />
            Dashboard
          </a>
        </div>
        <p className="text-text-tertiary text-xs">©2025-2026 XiSeDLC. All rights reserved.</p>
      </div>
    </footer>
  )
}
