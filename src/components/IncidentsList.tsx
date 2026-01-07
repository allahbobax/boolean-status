import { BiCheckCircle } from 'react-icons/bi'
import type { Incident } from '../App'

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

const getSeverityClass = (severity: string) => {
  switch (severity) {
    case 'minor': return 'bg-yellow-500/15 text-yellow-500'
    case 'major': return 'bg-orange-500/15 text-orange-500'
    case 'critical': return 'bg-red-500/15 text-red-500'
    default: return 'bg-white/10 text-white'
  }
}

const getDotClass = (status: string) => {
  switch (status) {
    case 'investigating': return 'bg-orange-500 shadow-[0_0_0_2px_rgba(249,115,22,0.3)]'
    case 'identified': return 'bg-yellow-500 shadow-[0_0_0_2px_rgba(234,179,8,0.3)]'
    case 'monitoring': return 'bg-blue-500 shadow-[0_0_0_2px_rgba(59,130,246,0.3)]'
    case 'resolved': return 'bg-green-500 shadow-[0_0_0_2px_rgba(34,197,94,0.3)]'
    default: return 'bg-text-tertiary shadow-[0_0_0_2px_rgba(255,255,255,0.1)]'
  }
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
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-text-primary">Active Incidents</h2>
      {incidents.length === 0 ? (
        <div className="bg-card-bg border border-border-color rounded-xl py-12 px-8 text-center">
          <BiCheckCircle className="w-12 h-12 mx-auto mb-4 text-text-secondary opacity-70" />
          <p className="text-[1.1rem] font-semibold text-text-primary mb-1">No active incidents</p>
          <span className="text-sm text-text-tertiary">All systems are operating normally</span>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {incidents.map(incident => {
            const sortedUpdates = [...(incident.updates || [])].sort(
              (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            )

            return (
              <div key={incident.id} className="bg-card-bg border border-border-color rounded-xl p-5">
                <div className="flex justify-between items-start mb-5 pb-4 border-b border-border-color gap-4 max-md:flex-col max-md:gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`py-0.5 px-2.5 rounded text-[0.7rem] font-bold uppercase tracking-wide ${getSeverityClass(incident.severity)}`}>
                      {SEVERITY_LABELS[incident.severity]}
                    </span>
                    <h3 className="text-base font-semibold text-text-primary m-0">{incident.title}</h3>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {incident.affectedServices.map(service => (
                      <span key={service} className="py-0.5 px-2 bg-[rgba(255,255,255,0.05)] border border-border-color rounded text-xs text-text-secondary">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col">
                  {sortedUpdates.length === 0 ? (
                    <div className="flex gap-4 relative">
                      <div className="flex flex-col items-center w-5 shrink-0">
                        <div className={`w-3 h-3 rounded-full border-2 border-card-bg z-[1] shrink-0 ${getDotClass(incident.status)}`}></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2 gap-4 max-md:flex-col max-md:items-start max-md:gap-1">
                          <span className="text-[0.85rem] font-semibold text-text-primary">{STATUS_LABELS[incident.status]}</span>
                          <span className="text-xs text-text-tertiary">{formatDate(incident.createdAt)}</span>
                        </div>
                        <p className="text-text-secondary text-sm leading-relaxed m-0">{incident.description}</p>
                      </div>
                    </div>
                  ) : (
                    sortedUpdates.map((update, index) => (
                      <div key={update.id} className="flex gap-4 relative">
                        <div className="flex flex-col items-center w-5 shrink-0">
                          <div className={`w-3 h-3 rounded-full border-2 border-card-bg z-[1] shrink-0 ${getDotClass(update.status)}`}></div>
                          {index < sortedUpdates.length - 1 && <div className="w-0.5 grow bg-border-color min-h-[40px]"></div>}
                        </div>
                        <div className={`flex-1 ${index < sortedUpdates.length - 1 ? 'pb-5' : ''}`}>
                          <div className="flex justify-between items-center mb-2 gap-4 max-md:flex-col max-md:items-start max-md:gap-1">
                            <span className="text-[0.85rem] font-semibold text-text-primary">{STATUS_LABELS[update.status] || update.status}</span>
                            <span className="text-xs text-text-tertiary">{formatDate(update.createdAt)}</span>
                          </div>
                          <p className="text-text-secondary text-sm leading-relaxed m-0">
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
