import { useState } from 'react'
import data from './data.json'
import { useScheduleData } from './DataContext'
import './ScheduleTable.css'

interface ScheduleTableProps {
  groupKey: string
}

function ScheduleTable({ groupKey }: ScheduleTableProps) {
  const { scheduleData, loading, error } = useScheduleData()
  const [showTomorrow, setShowTomorrow] = useState(false)
  
  const hours = Array.from({ length: 24 }, (_, i) => {
    const start = String(i).padStart(2, '0')
    const end = String(i + 1).padStart(2, '0')
    return `${start}-${end}`
  })

  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentTimePercent = (currentMinute / 60) * 100

  if (loading) {
    return (
      <div className="schedule-loading">
        <div className="spinner"></div>
        <p>{data.loading}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="schedule-error">
        <p>{data.error_loading}: {error}</p>
      </div>
    )
  }

  const today = scheduleData?.today
  
  // Find tomorrow by getting the first key that's different from today
  const getTomorrow = () => {
    if (!scheduleData?.data || !today) return null
    const keys = Object.keys(scheduleData.data)
    return keys.find(key => key !== String(today)) || null
  }
  
  const tomorrow = getTomorrow()
  
  // Determine if we should auto-show tomorrow based on current time vs data timestamp
  const shouldAutoShowTomorrow = () => {
    if (!today) return false
    const currentTimestamp = Math.floor(now.getTime() / 1000)
    const todayTimestamp = Number(today)
    // If current time is more than 24 hours past the "today" timestamp, auto-show tomorrow
    return currentTimestamp - todayTimestamp >= 86400 // 86400 seconds = 24 hours
  }
  
  const autoShowTomorrow = shouldAutoShowTomorrow()
  const selectedDay = (showTomorrow || autoShowTomorrow) ? tomorrow : today
  const groupSchedule = selectedDay && scheduleData?.data?.[selectedDay]?.[groupKey]

  const getCellClass = (hourIndex: number) => {
    if (!groupSchedule) return 'cell-has-power'
    
    const status = groupSchedule[String(hourIndex + 1)]
    switch (status) {
      case 'yes':
        return 'cell-has-power'
      case 'no':
        return 'cell-no-power'
      case 'first':
        return 'cell-first-half'
      case 'second':
        return 'cell-second-half'
      default:
        return 'cell-has-power'
    }
  }

  return (
    <div className="schedule-table">
      {!autoShowTomorrow && (
        <div className="schedule-controls">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showTomorrow}
              onChange={(e) => setShowTomorrow(e.target.checked)}
              disabled={!tomorrow}
            />
            {data.show_tomorrow}
          </label>
        </div>
      )}
      
      <table className="desktop-table">
        <thead>
          <tr>
            <th colSpan={2}>{data.time_intervals}</th>
            {hours.map((hour) => (
              <th key={hour} scope="col">
                <div>{hour}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={2}>&nbsp;</td>
            {hours.map((hour, index) => (
              <td key={hour} className={getCellClass(index)}>
                {index === currentHour && !showTomorrow && (
                  <div 
                    className="current-time-marker" 
                    style={{ left: `${currentTimePercent}%` }}
                  ></div>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <table className="mobile-table">
        <thead>
          <tr>
            <th>{data.time_intervals}</th>
            <th>{data.status}</th>
          </tr>
        </thead>
        <tbody>
          {hours.map((hour, index) => (
            <tr key={hour}>
              <td>{hour}</td>
              <td className={getCellClass(index)}>
                {index === currentHour && !showTomorrow && !autoShowTomorrow && (
                  <div 
                    className="current-time-marker" 
                    style={{ top: `${currentTimePercent}%` }}
                  ></div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="schedule-legend">
        <div className="legend-item">
          <div className="cell-has-power"></div>
          <span>{data.legend.has_power}</span>
        </div>
        <div className="legend-item">
          <div className="cell-no-power"></div>
          <span>{data.legend.no_power}</span>
        </div>
        <div className="legend-item">
          <div className="cell-first-half"></div>
          <span>{data.legend.no_power_first_half}</span>
        </div>
        <div className="legend-item">
          <div className="cell-second-half"></div>
          <span>{data.legend.no_power_second_half}</span>
        </div>
        <div className="legend-item">
          <div className="legend-time-marker"></div>
          <span>{data.legend.current_time}</span>
        </div>
      </div>
      
      {scheduleData?.update && (
        <div className="last-updated">
          {data.last_updated}: {scheduleData.update}
        </div>
      )}
    </div>
  )
}

export default ScheduleTable
