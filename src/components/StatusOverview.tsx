import { useState, useEffect } from 'react'
import { BiCheckCircle, BiTime, BiError, BiXCircle, BiLoaderAlt } from 'react-icons/bi'

interface StatusOverviewProps {
  status: 'operational' | 'degraded' | 'partial' | 'major'
  lastUpdated: Date
  loading: boolean
  refreshInterval?: number
}

const STATUS_LABELS = {
  operational: 'All Systems Operational',
  degraded: 'Degraded Performance',
  partial: 'Partial System Outage',
  major: 'Major System Outage',
}

const StatusIcon = ({ status }: { status: string }) => {
  const iconClass = "w-8 h-8 text-text-primary max-md:w-7 max-md:h-7"
  
  if (status === 'operational') {
    return <BiCheckCircle className={iconClass} />
  }
  if (status === 'degraded') {
    return <BiTime className={iconClass} />
  }
  if (status === 'partial') {
    return <BiError className={iconClass} />
  }
  return <BiXCircle className={iconClass} />
}

const getBorderClass = (status: string) => {
  if (status === 'operational') return 'border-[rgba(255,255,255,0.2)]'
  return 'border-[rgba(255,255,255,0.3)]'
}

export default function StatusOverview({ 
  status, 
  lastUpdated, 
  loading, 
  refreshInterval = 60000
}: StatusOverviewProps) {
  const [progress, setProgress] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(refreshInterval / 1000)

  useEffect(() => {
    // Reset progress when lastUpdated changes
    setProgress(0)
    setSecondsLeft(refreshInterval / 1000)

    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / refreshInterval) * 100, 100)
      const remaining = Math.max(Math.ceil((refreshInterval - elapsed) / 1000), 0)
      
      setProgress(newProgress)
      setSecondsLeft(remaining)
    }, 100)

    return () => clearInterval(interval)
  }, [lastUpdated, refreshInterval])

  if (loading) {
    return (
      <div className="bg-card-bg border border-border-color rounded-2xl p-8 text-center transition-all duration-300 max-md:p-6">
        <div className="flex items-center justify-center gap-3 text-text-secondary">
          <BiLoaderAlt className="w-6 h-6 animate-spin" />
          <span>Checking systems...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-card-bg border rounded-2xl p-8 text-center transition-all duration-300 max-md:p-6 ${getBorderClass(status)}`}>
      <div className="flex items-center justify-center gap-4 mb-4">
        <StatusIcon status={status} />
        <span className="text-[1.75rem] font-bold text-text-primary max-md:text-xl">{STATUS_LABELS[status]}</span>
      </div>
      
      {/* Update indicator */}
      <div className="mt-4 flex items-center justify-center gap-2 text-text-tertiary text-sm">
        <span>Updated {lastUpdated.toLocaleTimeString()}</span>
        <span className="text-text-tertiary/50">•</span>
        <span className="tabular-nums">{secondsLeft}s</span>
      </div>
      
      {/* Progress bar */}
      <div className="mt-3 mx-auto max-w-xs">
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-white/20 to-white/40 rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
