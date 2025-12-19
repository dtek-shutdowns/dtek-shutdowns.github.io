import { useState, useEffect } from 'react'

/**
 * Returns a Date object representing the current time in the Europe/Kyiv timezone.
 * Updates every minute by default.
 * @param refreshMs How often to update the time (ms)
 */
export function useKyivTime(refreshMs: number = 60000): Date {
  const getKyivTime = () => {
    const now = new Date()
    const kyivParts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Kyiv',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).formatToParts(now)
    const hour = Number(kyivParts.find(p => p.type === 'hour')?.value || '0')
    const minute = Number(kyivParts.find(p => p.type === 'minute')?.value || '0')
    const second = Number(kyivParts.find(p => p.type === 'second')?.value || '0')
    const kyivDate = new Date(now)
    kyivDate.setHours(hour, minute, second, 0)
    return kyivDate
  }

  const [kyivTime, setKyivTime] = useState<Date>(getKyivTime())

  useEffect(() => {
    const interval = setInterval(() => {
      setKyivTime(getKyivTime())
    }, refreshMs)
    return () => clearInterval(interval)
  }, [refreshMs])

  return kyivTime
}
