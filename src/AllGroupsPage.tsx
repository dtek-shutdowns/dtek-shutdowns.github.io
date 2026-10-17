import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import data from './data.json'
import { deleteCookie } from './cookieUtils'
import { useScheduleData } from './DataContext'
import { useKyivTime } from './useKyivTime'
import './ScheduleTable.css'
import './AllGroupsPage.css'

const hours = Array.from({ length: 24 }, (_, index) => {
  const start = String(index).padStart(2, '0')
  const end = String(index + 1).padStart(2, '0')
  return `${start}-${end}`
})

function AllGroupsPage() {
  const { scheduleData, loading, error } = useScheduleData()
  const [showTomorrow, setShowTomorrow] = useState(false)
  const navigate = useNavigate()
  const now = useKyivTime()
  const currentHour = now.getHours()
  const currentTimePercent = (now.getMinutes() / 60) * 100

  const today = scheduleData?.today
  const tomorrow = scheduleData?.data
    ? Object.keys(scheduleData.data).find(key => key !== String(today)) || null
    : null

  const currentTimestamp = Math.floor(now.getTime() / 1000)
  const autoShowTomorrow = Boolean(today) && currentTimestamp - Number(today) >= 86400
  const selectedDay = (showTomorrow || autoShowTomorrow) ? tomorrow : today
  const selectedDayData = selectedDay !== null && selectedDay !== undefined
    ? scheduleData?.data?.[String(selectedDay)]
    : undefined
  const isTodaySelected = selectedDay !== null && selectedDay !== undefined
    && String(selectedDay) === String(today)

  const getCellClass = (groupKey: string, hourIndex: number) => {
    const status = selectedDayData?.[groupKey]?.[String(hourIndex + 1)]

    switch (status) {
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

  const handleGoBack = () => {
    deleteCookie('selectedGroup')
    navigate('/')
  }

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

  const groupEntries = Object.entries(data.groups)
  const mobileGroupRows = ['.1', '.2'].map((suffix) =>
    groupEntries.filter(([, group]) => group.name.endsWith(suffix))
  )

  return (
    <div className="all-groups-page">
      <h1>{data.all_groups_schedule}</h1>

      {!autoShowTomorrow && (
        <div className="schedule-controls">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showTomorrow}
              onChange={(event) => setShowTomorrow(event.target.checked)}
              disabled={!tomorrow}
            />
            {data.show_tomorrow}
          </label>
        </div>
      )}

      <div className="all-groups-table-wrap">
        <table className="all-groups-table">
          <thead>
            <tr>
              <th scope="col">{data.group}</th>
              {hours.map((hour) => (
                <th key={hour} scope="col">
                  <span>{hour}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groupEntries.map(([groupKey, group]) => (
              <tr key={groupKey}>
                <th scope="row">{group.name}</th>
                {hours.map((hour, hourIndex) => (
                  <td key={hour} className={getCellClass(groupKey, hourIndex)}>
                    {isTodaySelected && hourIndex === currentHour && (
                      <div
                        className="all-groups-current-time-marker"
                        style={{ left: `${currentTimePercent}%` }}
                      ></div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="all-groups-mobile-list">
        {mobileGroupRows.map((groups, rowIndex) => (
          <section className="all-groups-mobile-grid" key={rowIndex}>
            <div className="all-groups-mobile-header">
              <span className="all-groups-mobile-time-heading" aria-hidden="true"></span>
              {groups.map(([groupKey, group]) => (
                <span key={groupKey}>{group.name}</span>
              ))}
            </div>
            <div className="all-groups-mobile-matrix">
              {hours.map((hour, hourIndex) => (
                <div className="all-groups-mobile-hour-row" key={hour}>
                  <span className="all-groups-mobile-time-label">{hour}</span>
                  {groups.map(([groupKey, group]) => (
                    <div
                      className={`all-groups-mobile-cell ${getCellClass(groupKey, hourIndex)}`}
                      key={groupKey}
                      title={`${data.group} ${group.name}: ${hour}`}
                    >
                      {isTodaySelected && hourIndex === currentHour && (
                        <div
                          className="all-groups-mobile-current-time-marker"
                          style={{ top: `${currentTimePercent}%` }}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

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

      <button onClick={handleGoBack}>{data.go_back}</button>
    </div>
  )
}

export default AllGroupsPage