import { useState, useEffect, useCallback } from 'react'
import StatusHeader from './components/StatusHeader'
import StatusOverview from './components/StatusOverview.tsx'
import StatusChart from './components/StatusChart.tsx'
import ServicesList from './components/ServicesList.tsx'
import IncidentsList from './components/IncidentsList.tsx'
import Footer from './components/Footer.tsx'


export interface HistoryPoint {
  time: Date
  responseTime: number
  status: 'operational' | 'degraded' | 'partial' | 'major'
}

export interface ServiceStatus {
  name: string
  status: 'operational' | 'degraded' | 'partial' | 'major'
  responseTime: number
  uptime: number
  history: HistoryPoint[]
}

export interface IncidentUpdate {
  id: number
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved'
  message: string
  createdAt: string
}

export interface Incident {
  id: string
  title: string
  description: string
  severity: 'minor' | 'major' | 'critical'
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved'
  createdAt: string
  updatedAt: string
  affectedServices: string[]
  updates: IncidentUpdate[]
}

const API_URL = 'https://api.booleanclient.ru'
const API_KEY = import.meta.env.VITE_API_KEY || ''

const apiHeaders = {
  'Content-Type': 'application/json',
  ...(API_KEY && { 'x-api-key': API_KEY })
}

const defaultServices: ServiceStatus[] = [
  { name: 'Auth', status: 'operational', responseTime: 0, uptime: 100, history: [] },
  { name: 'API', status: 'operational', responseTime: 0, uptime: 100, history: [] },
  { name: 'Site', status: 'operational', responseTime: 0, uptime: 100, history: [] },
  { name: 'Launcher', status: 'operational', responseTime: 0, uptime: 100, history: [] },
]

function App() {
  const [services, setServices] = useState<ServiceStatus[]>(defaultServices)
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Fetch cached status from DB (fast, no live checks)
  const fetchCachedStatus = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/status`, { headers: apiHeaders })
      const data = await response.json()
      
      if (data.success && data.data) {
        const mappedServices: ServiceStatus[] = data.data.map((service: {
          name: string
          status: string
          responseTime: number
          uptime: number
          history: Array<{ time: string; responseTime: number; status: string }>
        }) => ({
          name: service.name,
          status: service.status as ServiceStatus['status'],
          responseTime: service.responseTime,
          uptime: service.uptime,
          history: service.history.map((h) => ({
            time: new Date(h.time),
            responseTime: h.responseTime,
            status: h.status as HistoryPoint['status']
          }))
        }))
        setServices(mappedServices)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error('Failed to fetch cached status:', error)
    }
  }, [])

  // Trigger a live check and update with results
  const triggerLiveCheck = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/status/check`, { method: 'POST', headers: apiHeaders })
      const data = await response.json()
      
      if (data.success && data.data) {
        // Update services with live check results immediately
        setServices(prev => prev.map(service => {
          const liveResult = data.data.find((r: { name: string }) => r.name === service.name)
          if (liveResult) {
            return {
              ...service,
              status: liveResult.status as ServiceStatus['status'],
              responseTime: liveResult.responseTime,
              // Add new point to history
              history: [...service.history.slice(-29), {
                time: new Date(),
                responseTime: liveResult.responseTime,
                status: liveResult.status as HistoryPoint['status']
              }]
            }
          }
          return service
        }))
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error('Failed to trigger live check:', error)
    }
  }, [])

  const fetchIncidents = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/incidents?action=active`, { headers: apiHeaders })
      const data = await response.json()
      if (data.success && data.data) {
        setIncidents(data.data)
      }
    } catch {
      console.error('Failed to fetch incidents')
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      // First load cached data instantly, then trigger live check in background
      await Promise.all([fetchCachedStatus(), fetchIncidents()])
      setLoading(false)
      // Trigger live check after initial load (non-blocking)
      triggerLiveCheck()
    }
    
    init()
    // Live checks every 5 minutes
    const statusInterval = setInterval(triggerLiveCheck, 300000)
    const incidentsInterval = setInterval(fetchIncidents, 60000)
    
    return () => {
      clearInterval(statusInterval)
      clearInterval(incidentsInterval)
    }
  }, [fetchCachedStatus, fetchIncidents, triggerLiveCheck])

  const overallStatus = services.some(s => s.status === 'major') 
    ? 'major' 
    : services.some(s => s.status === 'partial')
    ? 'partial'
    : services.some(s => s.status === 'degraded')
    ? 'degraded'
    : 'operational'

  return (
    <div className="status-page">
      <StatusHeader />
      <main className="status-main">
        <StatusOverview status={overallStatus} lastUpdated={lastUpdated} loading={loading} />
        <StatusChart services={services} />
        <ServicesList services={services} loading={loading} />
        <IncidentsList incidents={incidents} />
      </main>
      <Footer />
    </div>
  )
}

export default App
