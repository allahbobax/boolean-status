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

const CACHE_KEY = 'boolean_status_data'
const CACHE_TTL = 30000 // 30 seconds - don't use stale cache
const REFRESH_INTERVAL = 60000 // 60 seconds

function App() {
  // Try to load initial state from localStorage for "instant" feel
  // But only if cache is fresh (less than 30 seconds old)
  const [services, setServices] = useState<ServiceStatus[]>(() => {
    const cached = localStorage.getItem(CACHE_KEY + '_services')
    const cacheTime = localStorage.getItem(CACHE_KEY + '_timestamp')
    
    if (cached && cacheTime) {
      const age = Date.now() - parseInt(cacheTime, 10)
      if (age < CACHE_TTL) {
        try {
          const parsed = JSON.parse(cached)
          return parsed.map((s: any) => ({
            ...s,
            history: s.history.map((h: any) => ({ ...h, time: new Date(h.time) }))
          }))
        } catch (e) {
          return defaultServices
        }
      }
    }
    return defaultServices
  })
  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const cached = localStorage.getItem(CACHE_KEY + '_incidents')
    return cached ? JSON.parse(cached) : []
  })
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Fetch cached status from DB (fast, no live checks)
  const fetchCachedStatus = useCallback(async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout

      const response = await fetch(`${API_URL}/status`, {
        headers: apiHeaders,
        signal: controller.signal
      })
      clearTimeout(timeoutId)

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
        // Save to cache with timestamp
        localStorage.setItem(CACHE_KEY + '_services', JSON.stringify(mappedServices))
        localStorage.setItem(CACHE_KEY + '_timestamp', Date.now().toString())
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to fetch cached status:', error)
      return false
    }
  }, [])

  // Trigger a live check - DON'T add to local history, just update current status
  // History comes from DB via fetchCachedStatus
  const triggerLiveCheck = useCallback(async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 12000) // 12 second timeout

      const response = await fetch(`${API_URL}/status/check`, {
        method: 'POST',
        headers: apiHeaders,
        signal: controller.signal
      })
      clearTimeout(timeoutId)

      const data = await response.json()

      if (data.success && data.data) {
        // Only update current status and responseTime, NOT history
        // History will be updated on next fetchCachedStatus call
        setServices(prev => prev.map(service => {
          const liveResult = data.data.find((r: { name: string }) => r.name === service.name)
          if (liveResult) {
            return {
              ...service,
              status: liveResult.status as ServiceStatus['status'],
              responseTime: liveResult.responseTime,
              // Keep existing history - don't add new points here
            }
          }
          return service
        }))
        setLastUpdated(new Date())
        
        // Refresh full data from DB after live check (in background)
        // This ensures history stays in sync with DB
        setTimeout(() => fetchCachedStatus(), 2000)
      }
    } catch (error) {
      console.error('Failed to trigger live check:', error)
    }
  }, [fetchCachedStatus])

  const fetchIncidents = useCallback(async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch(`${API_URL}/incidents?action=active`, {
        headers: apiHeaders,
        signal: controller.signal
      })
      clearTimeout(timeoutId)

      const data = await response.json()
      if (data.success && data.data) {
        setIncidents(data.data)
        localStorage.setItem(CACHE_KEY + '_incidents', JSON.stringify(data.data))
      }
    } catch (error) {
      console.error('Failed to fetch incidents:', error)
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      // Загружаем данные из БД - это основной источник истории
      const success = await fetchCachedStatus()
      await fetchIncidents()
      setLoading(false)

      // Live check в фоне только если данные загрузились
      // Не делаем live check при каждом refresh - это создаёт нагрузку
      if (success) {
        // Задержка чтобы не перегружать API при быстрых refresh
        setTimeout(() => triggerLiveCheck(), 5000)
      }
    }

    init()
    
    // Refresh data every 60 seconds (increased from 40s to reduce load)
    // Live check triggers DB refresh, so history stays in sync
    const statusInterval = setInterval(triggerLiveCheck, REFRESH_INTERVAL)
    const incidentsInterval = setInterval(fetchIncidents, REFRESH_INTERVAL)

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
        <StatusOverview 
          status={overallStatus} 
          lastUpdated={lastUpdated} 
          loading={loading}
          refreshInterval={REFRESH_INTERVAL}
        />
        <StatusChart services={services} />
        <ServicesList services={services} loading={loading} />
        <IncidentsList incidents={incidents} />
      </main>
      <Footer />
    </div>
  )
}

export default App
