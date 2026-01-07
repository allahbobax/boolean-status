import { useState, useEffect, useCallback } from 'react'
import StatusHeader from './components/StatusHeader'
import StatusOverview from './components/StatusOverview.tsx'
import StatusChart from './components/StatusChart.tsx'
import ServicesList from './components/ServicesList.tsx'
import IncidentsList from './components/IncidentsList.tsx'
import Footer from './components/Footer.tsx'
import './styles/App.css'

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

export interface Incident {
  id: string
  title: string
  description: string
  severity: 'minor' | 'major' | 'critical'
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved'
  createdAt: string
  updatedAt: string
  affectedServices: string[]
}

const API_URL = 'https://api.booleanclient.ru'
const STORAGE_KEY = 'status-page-history'

// Загружаем историю из localStorage
const loadStoredHistory = (): ServiceStatus[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      // Восстанавливаем Date объекты из строк
      return data.map((service: ServiceStatus) => ({
        ...service,
        history: service.history.map((point: HistoryPoint) => ({
          ...point,
          time: new Date(point.time)
        }))
      }))
    }
  } catch (e) {
    console.error('Failed to load history from localStorage:', e)
  }
  return [
    { name: 'Auth', status: 'operational', responseTime: 0, uptime: 100, history: [] },
    { name: 'API', status: 'operational', responseTime: 0, uptime: 100, history: [] },
    { name: 'Site', status: 'operational', responseTime: 0, uptime: 100, history: [] },
    { name: 'Launcher', status: 'operational', responseTime: 0, uptime: 100, history: [] },
  ]
}

function App() {
  const [services, setServices] = useState<ServiceStatus[]>(loadStoredHistory)
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const checkService = async (url: string): Promise<{ status: ServiceStatus['status'], responseTime: number }> => {
    const start = performance.now()
    try {
      const response = await fetch(url, { method: 'GET' })
      const responseTime = Math.round(performance.now() - start)
      
      if (response.ok) {
        return { 
          status: responseTime > 2000 ? 'degraded' : 'operational', 
          responseTime 
        }
      }
      return { status: 'partial', responseTime }
    } catch {
      return { status: 'major', responseTime: 0 }
    }
  }

  const fetchStatus = useCallback(async () => {
    const [authStatus, apiStatus, siteStatus, launcherStatus] = await Promise.all([
      checkService(`${API_URL}/auth/check`),
      checkService(`${API_URL}/health`),
      checkService(`${API_URL}/health/site`), // Проверка через бэкенд (обход CORS)
      checkService(`${API_URL}/versions/latest`),
    ])

    const statusMap: Record<string, { status: ServiceStatus['status'], responseTime: number }> = {
      'Auth': authStatus,
      'API': apiStatus,
      'Site': siteStatus,
      'Launcher': launcherStatus,
    }

    setServices(prev => {
      const updated = prev.map(service => {
        const newStatus = statusMap[service.name]
        const now = new Date()
        
        const newPoint: HistoryPoint = {
          time: now,
          responseTime: newStatus.responseTime,
          status: newStatus.status
        }
        
        const newHistory = [...service.history, newPoint].slice(-90)
        
        // Calculate uptime from history
        const operationalCount = newHistory.filter(h => h.status === 'operational' || h.status === 'degraded').length
        const uptime = newHistory.length > 0 ? (operationalCount / newHistory.length) * 100 : 100
        
        return {
          ...service,
          status: newStatus.status,
          responseTime: newStatus.responseTime,
          uptime,
          history: newHistory,
        }
      })
      
      // Сохраняем в localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (e) {
        console.error('Failed to save history to localStorage:', e)
      }
      
      return updated
    })
    
    setLastUpdated(new Date())
  }, [])

  const fetchIncidents = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/incidents?action=active`)
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
      await Promise.all([fetchStatus(), fetchIncidents()])
      setLoading(false)
    }
    
    init()
    const statusInterval = setInterval(fetchStatus, 10000)
    const incidentsInterval = setInterval(fetchIncidents, 60000)
    
    return () => {
      clearInterval(statusInterval)
      clearInterval(incidentsInterval)
    }
  }, [fetchStatus, fetchIncidents])

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
