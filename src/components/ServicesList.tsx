import type { ServiceStatus } from '../App'
import { BiCodeAlt, BiLock, BiGlobe, BiPlay, BiDesktop } from 'react-icons/bi'
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
