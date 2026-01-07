import { useState, useRef } from 'react'
import { BiLock, BiCodeAlt, BiGlobe, BiPlay, BiDesktop } from 'react-icons/bi'
import type { ServiceStatus, HistoryPoint } from '../App'
import './StatusChart.css'

interface StatusChartProps {
  services: ServiceStatus[]
}

interface TooltipData {
  service: ServiceStatus
  point: HistoryPoint
  x: number
  y: number
}

const ServiceIcon = ({ name }: { name: string }) => {
  switch (name) {
    case 'Auth':
      return <BiLock />
    case 'API':
      return <BiCodeAlt />
    case 'Site':
      return <BiGlobe />
    case 'Launcher':
      return <BiPlay />
    default:
      return <BiDesktop />
  }
}

const getStatusColor = (status: HistoryPoint['status'], responseTime: number) => {
  if (status === 'major') return '#ef4444'
  if (status === 'partial') return '#f97316'
  if (status === 'degraded' || responseTime > 1500) return '#eab308'
  if (responseTime > 800) return '#84cc16'
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

  // Показываем последние 90 точек или меньше
  const maxPoints = 90

  return (
    <div className="status-chart-section" ref={containerRef}>
      <h2 className="chart-title">Uptime History</h2>
      <p className="chart-subtitle">Last {maxPoints} checks • Updated every 10 seconds</p>
      
      <div className="heatmap-container">
        {services.map(service => (
          <div key={service.name} className="heatmap-row">
            <div className="heatmap-label">
              <span className="heatmap-icon">
                <ServiceIcon name={service.name} />
              </span>
              <span className="heatmap-name">{service.name}</span>
              <span className="heatmap-uptime">{service.uptime.toFixed(1)}%</span>
            </div>
            <div className="heatmap-cells" onMouseLeave={handleMouseLeave}>
              {service.history.length === 0 ? (
                <div className="heatmap-empty">No data yet</div>
              ) : (
                service.history.map((point, idx) => (
                  <div
                    key={idx}
                    className="heatmap-cell"
                    style={{ backgroundColor: getStatusColor(point.status, point.responseTime) }}
                    onMouseEnter={(e) => handleCellHover(e, service, point)}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="heatmap-legend">
        <span className="legend-label">Status:</span>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#22c55e' }} />
            <span>Good</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#84cc16' }} />
            <span>Slow</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#eab308' }} />
            <span>Degraded</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#f97316' }} />
            <span>Partial</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#ef4444' }} />
            <span>Outage</span>
          </div>
        </div>
      </div>

      {tooltip && (
        <div
          className="heatmap-tooltip"
          style={{
            left: tooltip.x,
            top: tooltip.y - 10,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="tooltip-header">{tooltip.service.name}</div>
          <div className="tooltip-time">{formatTime(tooltip.point.time)}</div>
          <div className="tooltip-status">
            <span
              className="tooltip-dot"
              style={{ backgroundColor: getStatusColor(tooltip.point.status, tooltip.point.responseTime) }}
            />
            {getStatusLabel(tooltip.point.status)}
          </div>
          <div className="tooltip-response">
            Response: <strong>{tooltip.point.responseTime}ms</strong>
          </div>
        </div>
      )}
    </div>
  )
}
