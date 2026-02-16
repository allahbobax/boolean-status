import type { ServiceStatus } from '../App'
import { BiCodeAlt, BiLock, BiGlobe, BiDesktop } from 'react-icons/bi'

interface ServicesListProps {
  services: ServiceStatus[]
  loading: boolean
}

const STATUS_LABELS = {
  operational: 'Operational',
  degraded: 'Degraded',
  partial: 'Partial Outage',
  major: 'Major Outage',
}

const ServiceIcon = ({ name }: { name: string }) => {
  switch (name) {
    case 'Auth':
      return <BiLock />
    case 'API':
      return <BiCodeAlt />
    case 'Site':
      return <BiGlobe />
    default:
      return <BiDesktop />
  }
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit'
  })
}

const formatUptimeDuration = (historyLength: number) => {
  const totalSeconds = historyLength * 10
  const minutes = Math.floor(totalSeconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }
  return `${minutes}m`
}

const getBadgeClass = (status: string) => {
  if (status === 'operational') {
    return 'text-text-primary border-[rgba(255,255,255,0.2)]'
  }
  return 'text-text-secondary border-[rgba(255,255,255,0.15)]'
}

const getBarClass = (status: string) => {
  if (status === 'operational') {
    return 'bg-white/50 hover:bg-white/80'
  }
  return 'bg-white/30 hover:bg-white/50'
}

export default function ServicesList({ services, loading }: ServicesListProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-text-primary">Services</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 max-md:grid-cols-1">
        {services.map(service => {
          const historySlice = service.history.slice(-30)
          const firstPoint = historySlice[0]
          const lastPoint = historySlice[historySlice.length - 1]
          
          return (
            <div 
              key={service.name} 
              className="bg-card-bg border border-border-color rounded-xl p-5 transition-all duration-300 hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.2)]"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 text-text-secondary [&>svg]:w-full [&>svg]:h-full">
                    <ServiceIcon name={service.name} />
                  </span>
                  <span className="text-[1.1rem] font-semibold text-text-primary">{service.name}</span>
                </div>
                <span className={`py-1 px-3 rounded-[20px] text-xs font-semibold uppercase tracking-wide bg-[rgba(255,255,255,0.05)] border ${getBadgeClass(service.status)}`}>
                  {loading ? 'Checking...' : STATUS_LABELS[service.status]}
                </span>
              </div>
              <div className="flex gap-8 mb-4 max-md:gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-text-tertiary uppercase tracking-wide">Response Time</span>
                  <span className="text-base font-semibold text-text-primary font-mono">{loading ? '—' : `${service.responseTime}ms`}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-text-tertiary uppercase tracking-wide">Uptime</span>
                  <span className="text-base font-semibold text-text-primary font-mono">{loading ? '—' : `${service.uptime.toFixed(1)}%`}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-border-color">
                <div className="text-[0.7rem] text-text-tertiary uppercase tracking-wide mb-2 text-center">
                  {historySlice.length > 0 ? (
                    <>Last {formatUptimeDuration(historySlice.length)}</>
                  ) : (
                    <>Last 5m</>
                  )}
                </div>
                <div className="flex items-end gap-0.5 h-10">
                  {historySlice.length === 0 ? (
                    // Show placeholder bars when no data
                    Array.from({ length: 30 }, (_, i) => (
                      <div 
                        key={i}
                        className="flex-1 min-h-[2px] rounded-sm bg-white/20"
                        style={{ 
                          height: '20%',
                          opacity: 0.2 + (i / 30) * 0.3
                        }}
                      />
                    ))
                  ) : (
                    historySlice.map((point, i) => (
                      <div 
                        key={i}
                        className={`flex-1 min-h-[2px] rounded-sm transition-[height] duration-300 cursor-pointer ${getBarClass(point.status)}`}
                        style={{ 
                          height: `${Math.max(4, Math.min(100, (point.responseTime / 500) * 100))}%`,
                          opacity: 0.3 + (i / 30) * 0.7
                        }}
                        title={`${point.responseTime}ms — ${point.time.toLocaleTimeString('ru-RU')}`}
                      />
                    ))
                  )}
                </div>
                <div className="flex justify-between items-center mt-1.5">
                  {firstPoint && <span className="text-[0.65rem] text-text-tertiary font-mono">{formatTime(firstPoint.time)}</span>}
                  <span className="flex-1" />
                  {lastPoint && <span className="text-[0.65rem] text-text-tertiary font-mono">{formatTime(lastPoint.time)}</span>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
