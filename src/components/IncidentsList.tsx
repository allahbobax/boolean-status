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

const STATUS_LABELS: Record<string, string> = {
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

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'investigating': return 'status-investigating'
      case 'identified': return 'status-identified'
      case 'monitoring': return 'status-monitoring'
      case 'resolved': return 'status-resolved'
      default: return ''
    }
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
          {incidents.map(incident => {
            // Сортируем updates от старых к новым (старые сверху, новые снизу)
            const sortedUpdates = [...(incident.updates || [])].sort(
              (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            )

            return (
              <div key={incident.id} className="incident-card">
                <div className="incident-card-header">
                  <div className="incident-title-row">
                    <span className={`incident-severity severity-${incident.severity}`}>
                      {SEVERITY_LABELS[incident.severity]}
                    </span>
                    <h3 className="incident-title">{incident.title}</h3>
                  </div>
                  <div className="incident-services">
                    {incident.affectedServices.map(service => (
                      <span key={service} className="affected-service">{service}</span>
                    ))}
                  </div>
                </div>
                
                <div className="incident-timeline">
                  {sortedUpdates.length === 0 ? (
                    /* Если нет updates - показываем описание инцидента */
                    <div className={`timeline-item ${getStatusClass(incident.status)}`}>
                      <div className="timeline-marker">
                        <div className="timeline-dot"></div>
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <span className="timeline-status">{STATUS_LABELS[incident.status]}</span>
                          <span className="timeline-time">{formatDate(incident.createdAt)}</span>
                        </div>
                        <p className="timeline-description">{incident.description}</p>
                      </div>
                    </div>
                  ) : (
                    /* Если есть updates - показываем их, первый с описанием инцидента */
                    sortedUpdates.map((update, index) => (
                      <div 
                        key={update.id} 
                        className={`timeline-item ${getStatusClass(update.status)}`}
                      >
                        <div className="timeline-marker">
                          <div className="timeline-dot"></div>
                          {index < sortedUpdates.length - 1 && <div className="timeline-line"></div>}
                        </div>
                        <div className="timeline-content">
                          <div className="timeline-header">
                            <span className="timeline-status">{STATUS_LABELS[update.status] || update.status}</span>
                            <span className="timeline-time">{formatDate(update.createdAt)}</span>
                          </div>
                          <p className="timeline-description">
                            {index === 0 ? incident.description : update.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
