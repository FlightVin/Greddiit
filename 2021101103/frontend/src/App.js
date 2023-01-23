import { Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';
import NotFound404 from './pages/404/404'

function App() {
  return (
    <>

    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path="/login" element={ <Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/*" element={<NotFound404 />} />
    </Routes>

    </>
  );
}

export default App;
