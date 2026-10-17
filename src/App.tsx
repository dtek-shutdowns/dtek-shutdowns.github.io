import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import data from './data.json'
import { setCookie, getCookie } from './cookieUtils'
import { useEffect } from 'react';
import GroupPage from './GroupPage'
import AllGroupsPage from './AllGroupsPage'
import { DataProvider } from './DataContext'
import { version } from '../package.json'

function Home() {
  const groupKeys = Object.keys(data.groups)
  const navigate = useNavigate();

  useEffect(() => {
    const selected = getCookie('selectedGroup');
    if (selected && groupKeys.includes(selected)) {
      navigate(`/${selected}`);
    }
  }, []);

  const handleGroupClick = (key: string) => {
    setCookie('selectedGroup', key);
    navigate(`/${key}`);
  };

  const handleAllGroupsClick = () => {
    navigate('/all-groups');
  };

  return (
    <div>
      <h1>{data.home_title}</h1>
      <div className="group-selection">
        {groupKeys.map((key) => (
          <button key={key} onClick={() => handleGroupClick(key)}>
            {data.group} {data.groups[key as keyof typeof data.groups].name}
          </button>
        ))}
        <button className="all-groups-button" onClick={handleAllGroupsClick}>
          {data.all_groups}
        </button>
      </div>
      <div className="app-version">{data.version} {version}</div>
    </div>
  )
}

function App() {
  const groupKeys = Object.keys(data.groups)
  
  return (
    <DataProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          {groupKeys.map((key) => (
            <Route key={key} path={`/${key}`} element={<GroupPage groupKey={key} />} />
          ))}
          <Route path="/all-groups" element={<AllGroupsPage />} />
        </Routes>
      </HashRouter>
    </DataProvider>
  )
}

export default App
