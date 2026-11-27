import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteCookie, getCookie, setCookie } from './cookieUtils'
import data from './data.json'

export const legacyGroupMigration: Record<string, string> = {
  'GPV1.1': 'GPV1.1',
  'GPV1.2': 'GPV2.1',
  'GPV2.1': 'GPV3.1',
  'GPV2.2': 'GPV4.1',
  'GPV3.1': 'GPV5.1',
  'GPV3.2': 'GPV6.1',
  'GPV4.1': 'GPV7.1',
  'GPV4.2': 'GPV8.1',
  'GPV5.1': 'GPV9.1',
  'GPV5.2': 'GPV10.1',
  'GPV6.1': 'GPV11.1',
  'GPV6.2': 'GPV12.1',
}

export function useSelectGroup(groupKeys: string[]) {
  const navigate = useNavigate()

  useEffect(() => {
    let selected = getCookie('selectedGroup18')

    if (!selected) {
      const migrated = legacyGroupMigration[getCookie('selectedGroup')]
      if (migrated) {
        setCookie('selectedGroup18', migrated)
        deleteCookie('selectedGroup')
        selected = migrated
      }
    }

    if (selected && groupKeys.includes(selected)) {
      navigate(`/${data.groups[selected as keyof typeof data.groups].name}`)
    }
  }, [groupKeys, navigate])
}
