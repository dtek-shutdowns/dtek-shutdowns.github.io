import { HashRouter, Navigate, Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import data from './data.json'
import { setCookie } from './cookieUtils'
import GroupPage from './GroupPage'
import AllGroupsPage from './AllGroupsPage'
import { DataProvider } from './DataContext'
import { version } from '../package.json'
import { legacyGroupMigration, useSelectGroup } from './useSelectGroup'

const groupKeys = Object.keys(data.groups)
const legacyRoutes = {
  ...Object.fromEntries(groupKeys.map((key) => [key, key])),
  ...legacyGroupMigration,
}

function Home() {
  const navigate = useNavigate();
  useSelectGroup(groupKeys);

  const handleGroupClick = (key: string) => {
    setCookie('selectedGroup18', key);
    navigate(`/${data.groups[key as keyof typeof data.groups].name}`);
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
  return (
    <DataProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          {groupKeys.map((key) => (
            <Route
              key={key}
              path={`/${data.groups[key as keyof typeof data.groups].name}`}
              element={<GroupPage groupKey={key} />}
            />
          ))}
          {Object.entries(legacyRoutes).map(([oldKey, newKey]) => (
            <Route
              key={`legacy-${oldKey}`}
              path={`/${oldKey}`}
              element={
                <Navigate
                  replace
                  to={`/${data.groups[newKey as keyof typeof data.groups].name}`}
                />
              }
            />
          ))}
          <Route path="/all-groups" element={<AllGroupsPage />} />
        </Routes>
      </HashRouter>
    </DataProvider>
  )
}

export default App
