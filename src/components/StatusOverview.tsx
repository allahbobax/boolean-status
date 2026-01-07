import { BiCheckCircle, BiTime, BiError, BiXCircle, BiLoaderAlt } from 'react-icons/bi'

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
  const iconClass = "w-8 h-8 text-text-primary max-md:w-7 max-md:h-7"
  
  if (status === 'operational') {
    return <BiCheckCircle className={iconClass} />
  }
  if (status === 'degraded') {
    return <BiTime className={iconClass} />
  }
  if (status === 'partial') {
    return <BiError className={iconClass} />
  }
  return <BiXCircle className={iconClass} />
}

const getBorderClass = (status: string) => {
  if (status === 'operational') return 'border-[rgba(255,255,255,0.2)]'
  return 'border-[rgba(255,255,255,0.3)]'
}

export default function StatusOverview({ status, lastUpdated, loading }: StatusOverviewProps) {
  if (loading) {
    return (
      <div className="bg-card-bg border border-border-color rounded-2xl p-8 text-center transition-all duration-300 max-md:p-6">
        <div className="flex items-center justify-center gap-3 text-text-secondary">
          <BiLoaderAlt className="w-6 h-6 animate-spin" />
          <span>Checking systems...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-card-bg border rounded-2xl p-8 text-center transition-all duration-300 max-md:p-6 ${getBorderClass(status)}`}>
      <div className="flex items-center justify-center gap-4 mb-4">
        <StatusIcon status={status} />
        <span className="text-[1.75rem] font-bold text-text-primary max-md:text-xl">{STATUS_LABELS[status]}</span>
      </div>
      <p className="text-text-tertiary text-sm mt-2">
        Last updated: {lastUpdated.toLocaleTimeString()}
      </p>
    </div>
  )
}
