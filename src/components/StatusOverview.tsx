import { BiCheckCircle, BiTime, BiError, BiXCircle, BiLoaderAlt } from 'react-icons/bi'
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
  if (status === 'operational') {
    return <BiCheckCircle className="status-icon" />
  }
  if (status === 'degraded') {
    return <BiTime className="status-icon" />
  }
  if (status === 'partial') {
    return <BiError className="status-icon" />
  }
  return <BiXCircle className="status-icon" />
}

export default function StatusOverview({ status, lastUpdated, loading }: StatusOverviewProps) {
  if (loading) {
    return (
      <div className="status-overview">
        <div className="status-loading">
          <BiLoaderAlt className="loading-spinner" />
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
