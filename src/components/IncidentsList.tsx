import type { Incident } from '../App'
import './IncidentsList.css'

interface IncidentsListProps {
  incidents: Incident[]
}

const SEVERITY_LABELS = {
  minor: 'Minor',
  major: 'Major',
  critical: 'Critical',
}

const STATUS_LABELS = {
  investigating: 'Investigating',
  identified: 'Identified',
  monitoring: 'Monitoring',
  resolved: 'Resolved',
}

export default function IncidentsList({ incidents }: IncidentsListProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="incidents-section">
      <h2 className="incidents-title">Active Incidents</h2>
      {incidents.length === 0 ? (
        <div className="no-incidents">
          <svg className="no-incidents-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <p>No active incidents</p>
          <span>All systems are operating normally</span>
        </div>
      ) : (
        <div className="incidents-list">
          {incidents.map(incident => (
            <div key={incident.id} className="incident-card">
              <div className="incident-header">
                <div className="incident-title-row">
                  <span className="incident-severity">
                    {SEVERITY_LABELS[incident.severity]}
                  </span>
                  <h3 className="incident-title">{incident.title}</h3>
                </div>
                <span className="incident-status">
                  {STATUS_LABELS[incident.status]}
                </span>
              </div>
              <p className="incident-description">{incident.description}</p>
              <div className="incident-footer">
                <div className="incident-services">
                  {incident.affectedServices.map(service => (
                    <span key={service} className="affected-service">{service}</span>
                  ))}
                </div>
                <span className="incident-time">
                  Updated: {formatDate(incident.updatedAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
