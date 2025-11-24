import { useNavigate } from 'react-router-dom'
import data from './data.json'
import { deleteCookie } from './cookieUtils'
import ScheduleTable from './ScheduleTable'

function GroupPage({ groupKey }: { groupKey: string }) {
  const group = data.groups[groupKey as keyof typeof data.groups]
  const navigate = useNavigate();

  const handleGoBack = () => {
    deleteCookie('selectedGroup');
    navigate('/');
  };

  return (
    <div>
      <h1>{data.group_schedule} {group.name}</h1>
      <ScheduleTable groupKey={groupKey} />
      <button onClick={handleGoBack}>{data.go_back}</button>
    </div>
  )
}

export default GroupPage
