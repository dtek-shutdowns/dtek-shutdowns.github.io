import { Link } from 'react-router-dom'
import data from './data.json'
import ScheduleTable from './ScheduleTable'

function GroupPage({ groupKey }: { groupKey: string }) {
  const group = data.groups[groupKey as keyof typeof data.groups]

  return (
    <div>
      <h1>{data.group_schedule} {group.name}</h1>
      <ScheduleTable groupKey={groupKey} />
      <Link to="/">
        <button>{data.go_back}</button>
      </Link>
    </div>
  )
}

export default GroupPage
