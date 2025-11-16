import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import config from './data.json'

interface ScheduleData {
  [key: string]: any
}

interface DataContextType {
  scheduleData: ScheduleData | null
  loading: boolean
  error: string | null
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(config.fetch_url)
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const data = await response.json()
        setScheduleData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <DataContext.Provider value={{ scheduleData, loading, error }}>
      {children}
    </DataContext.Provider>
  )
}

export function useScheduleData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useScheduleData must be used within a DataProvider')
  }
  return context
}
