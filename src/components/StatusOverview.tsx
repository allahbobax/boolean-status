import './StatusOverview.css'

interface StatusOverviewProps {
  status: 'operational' | 'degraded' | 'partial' | 'major'
  lastUpdated: Date
  loading: boolean
}

const STATUS_LABELS = {
  operational: 'All Systems Operational',
  degraded: 'Degraded Performance',
  partial: 'Partial System Outage',
  major: 'Major System Outage',
}

const StatusIcon = ({ status }: { status: string }) => {
  // Operational - галочка в круге
  if (status === 'operational') {
    return (
      <svg className="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    )
  }
  // Degraded - часы/замедление
  if (status === 'degraded') {
    return (
      <svg className="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    )
  }
  // Partial - предупреждение (треугольник)
  if (status === 'partial') {
    return (
      <svg className="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    )
  }
  // Major - крестик в круге (критическая ошибка)
  return (
    <svg className="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
}

export default function StatusOverview({ status, lastUpdated, loading }: StatusOverviewProps) {
  if (loading) {
    return (
      <div className="status-overview">
        <div className="status-loading">
          <svg className="loading-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" opacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" />
          </svg>
          <span>Checking systems...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`status-overview ${status}`}>
      <div className="status-indicator-large">
        <StatusIcon status={status} />
        <span className="status-text">{STATUS_LABELS[status]}</span>
      </div>
      <p className="status-updated">
        Last updated: {lastUpdated.toLocaleTimeString()}
      </p>
    </div>
  )
}
