import { useState, useRef } from 'react'
import { BiLock, BiCodeAlt, BiGlobe, BiPlay, BiDesktop } from 'react-icons/bi'
import type { ServiceStatus, HistoryPoint } from '../App'

interface StatusChartProps {
  services: ServiceStatus[]
}

interface TooltipData {
  service: ServiceStatus
  point: HistoryPoint
  x: number
  y: number
}

// Maximum number of history bars to display
const MAX_HISTORY_BARS = 60

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

const getStatusColor = (status: HistoryPoint['status'], responseTime: number) => {
  if (status === 'major') return '#ef4444'
  if (status === 'partial') return '#f97316'
  if (status === 'degraded' || responseTime > 2500) return '#eab308' // Увеличен порог для serverless cold start
  if (responseTime > 1200) return '#84cc16'
  return '#22c55e'
}

const getStatusLabel = (status: HistoryPoint['status']) => {
  switch (status) {
    case 'operational': return 'Operational'
    case 'degraded': return 'Degraded'
    case 'partial': return 'Partial Outage'
    case 'major': return 'Major Outage'
    default: return 'Unknown'
  }
}

export default function StatusChart({ services }: StatusChartProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const formatTime = (date: Date) => {
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleCellHover = (
    e: React.MouseEvent,
    service: ServiceStatus,
    point: HistoryPoint
  ) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const containerRect = containerRef.current?.getBoundingClientRect()
    if (!containerRect) return

    setTooltip({
      service,
      point,
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top
    })
  }

  const handleMouseLeave = () => {
    setTooltip(null)
  }

  return (
    <div className="relative bg-card-bg border border-border-color rounded-2xl p-6 max-md:p-4" ref={containerRef}>
      <h2 className="text-xl font-semibold mb-6 text-text-primary">Uptime History</h2>
      
      <div className="flex flex-col gap-3">
        {services.map(service => (
          <div key={service.name} className="flex items-center gap-4 max-md:flex-col max-md:items-start max-md:gap-2">
            <div className="flex items-center gap-2 min-w-[140px] shrink-0 max-md:min-w-0 max-md:w-full">
              <span className="w-[18px] h-[18px] text-text-secondary flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
                <ServiceIcon name={service.name} />
              </span>
              <span className="font-medium text-text-primary text-sm">{service.name}</span>
              <span className="font-mono text-xs text-text-tertiary ml-auto">{service.uptime.toFixed(1)}%</span>
            </div>
            <div className="flex gap-0.5 flex-1 min-h-[24px] items-center max-md:w-full" onMouseLeave={handleMouseLeave}>
              {service.history.length === 0 ? (
                <div className="flex gap-0.5 flex-1">
                  {/* Show placeholder bars when no data */}
                  {Array.from({ length: 30 }, (_, i) => (
                    <div
                      key={i}
                      className="flex-1 max-w-2 h-6 rounded-sm bg-white/20 max-md:h-5"
                      style={{ opacity: 0.3 + (i / 30) * 0.4 }}
                    />
                  ))}
                </div>
              ) : (
                service.history.slice(-MAX_HISTORY_BARS).map((point, idx) => (
                  <div
                    key={idx}
                    className="flex-1 max-w-2 h-6 rounded-sm cursor-pointer transition-all duration-150 opacity-85 hover:scale-y-[1.3] hover:opacity-100 hover:z-[1] max-md:h-5"
                    style={{ backgroundColor: getStatusColor(point.status, point.responseTime) }}
                    onMouseEnter={(e) => handleCellHover(e, service, point)}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>



      {tooltip && (
        <div
          className="absolute py-3 px-4 bg-[rgba(15,15,20,0.98)] border border-border-color rounded-lg text-[0.85rem] text-text-primary pointer-events-none z-[100] min-w-[160px] backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          style={{
            left: tooltip.x,
            top: tooltip.y - 10,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="font-semibold mb-1">{tooltip.service.name}</div>
          <div className="font-mono text-xs text-text-tertiary mb-2">{formatTime(tooltip.point.time)}</div>
          <div className="flex items-center gap-1.5 mb-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getStatusColor(tooltip.point.status, tooltip.point.responseTime) }}
            />
            {getStatusLabel(tooltip.point.status)}
          </div>
          <div className="text-xs text-text-secondary">
            Response: <strong className="text-text-primary font-mono">{tooltip.point.responseTime}ms</strong>
          </div>
        </div>
      )}
    </div>
  )
}
