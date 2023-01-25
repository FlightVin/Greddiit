import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';
import NotFound404 from './pages/404/404';
import Protected from './pages/Protected/Protected';
import LoginBypass from './pages/LoginBypass/LoginBypass'

function App() {
  return (
    <>

    <Routes>
      <Route path='/' element={
        <LoginBypass>
        <Dashboard />
        <Login />
      </LoginBypass>
      } />

      <Route path="/login" element={ 
        <LoginBypass>
          <Dashboard />
          <Login />
        </LoginBypass>
      } />

      <Route path="/profile" element={
        <Protected>
          <Dashboard />
          <Profile />
        </Protected>
      } />
      <Route path="/*" element={<NotFound404 />} />
    </Routes>

    </>
  );
}

export default App;
