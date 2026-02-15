import { BiArrowBack } from 'react-icons/bi'

export default function StatusHeader() {
  return (
    <header className="bg-[rgba(10,10,10,0.8)] backdrop-blur-[20px] border-b border-border-color sticky top-0 z-[100]">
      <div className="max-w-container mx-auto px-8 py-4 flex items-center justify-between max-md:px-4">
        <a href="https://xisedlc.lol" className="flex items-center gap-1 text-text-secondary no-underline text-sm transition-colors duration-200 hover:text-text-primary max-md:text-[0.85rem]">
          <BiArrowBack className="w-[18px] h-[18px]" />
          <span className="max-md:hidden">Back to XiSeDLC</span>
        </a>
      </div>
    </header>
  )
}
