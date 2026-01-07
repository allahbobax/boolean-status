import { BiArrowBack } from 'react-icons/bi'

export default function StatusHeader() {
  return (
    <header className="bg-[rgba(10,10,10,0.8)] backdrop-blur-[20px] border-b border-border-color sticky top-0 z-[100]">
      <div className="max-w-container mx-auto px-8 py-4 flex items-center justify-between max-md:px-4">
        <a href="https://booleanclient.ru" className="flex items-center gap-3 no-select no-drag text-text-primary no-underline">
          <img 
            src="/icon.png" 
            alt="Boolean" 
            className="w-8 h-8 rounded-lg [image-rendering:pixelated] pointer-events-none no-select no-drag"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            onCopy={(e) => e.preventDefault()}
          />
          <span className="text-2xl font-bold max-md:text-xl">Boolean</span>
          <span className="text-text-tertiary font-light">|</span>
          <span className="text-2xl font-bold text-text-secondary max-md:text-base">Status</span>
        </a>
        <a href="https://booleanclient.ru" className="flex items-center gap-2 text-text-secondary no-underline text-sm transition-colors duration-200 hover:text-text-primary max-md:text-[0.85rem]">
          <BiArrowBack className="w-[18px] h-[18px]" />
          <span className="max-md:hidden">Back to Boolean</span>
        </a>
      </div>
    </header>
  )
}
