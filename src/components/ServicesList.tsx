import type { ServiceStatus } from '../App'
import './ServicesList.css'

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
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      )
    case 'API':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      )
    case 'Site':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )
    case 'Launcher':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      )
  }
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit'
  })
}

const formatUptimeDuration = (historyLength: number) => {
  // Каждая точка = 10 секунд (интервал обновления)
  const totalSeconds = historyLength * 10
  const minutes = Math.floor(totalSeconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }
  return `${minutes}m`
}

export default function ServicesList({ services, loading }: ServicesListProps) {
  return (
    <div className="services-section">
      <h2 className="services-title">Services</h2>
      <div className="services-list">
        {services.map(service => {
          const historySlice = service.history.slice(-30)
          const firstPoint = historySlice[0]
          const lastPoint = historySlice[historySlice.length - 1]
          
          return (
            <div key={service.name} className={`service-card ${service.status}`}>
              <div className="service-header">
                <div className="service-name-row">
                  <span className="service-icon">
                    <ServiceIcon name={service.name} />
                  </span>
                  <span className="service-name">{service.name}</span>
                </div>
                <span className={`service-status-badge ${service.status}`}>
                  {loading ? 'Checking...' : STATUS_LABELS[service.status]}
                </span>
              </div>
              <div className="service-metrics">
                <div className="metric">
                  <span className="metric-label">Response Time</span>
                  <span className="metric-value">{loading ? '—' : `${service.responseTime}ms`}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Uptime</span>
                  <span className="metric-value">{loading ? '—' : `${service.uptime.toFixed(1)}%`}</span>
                </div>
              </div>
              <div className="service-history-container">
                <div className="history-period-label">
                  {historySlice.length > 0 && (
                    <>Last {formatUptimeDuration(historySlice.length)}</>
                  )}
                </div>
                <div className="service-history">
                  {historySlice.map((point, i) => (
                    <div 
                      key={i}
                      className={`history-bar ${point.status}`}
                      style={{ 
                        height: `${Math.max(4, Math.min(100, (point.responseTime / 500) * 100))}%`,
                        opacity: 0.3 + (i / 30) * 0.7
                      }}
                      title={`${point.responseTime}ms — ${point.time.toLocaleTimeString('ru-RU')}`}
                    />
                  ))}
                </div>
                <div className="history-time-labels">
                  {firstPoint && <span className="time-label">{formatTime(firstPoint.time)}</span>}
                  <span className="time-label-spacer" />
                  {lastPoint && <span className="time-label">{formatTime(lastPoint.time)}</span>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
