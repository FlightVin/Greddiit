import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';
import NotFound404 from './pages/404/404';
import Protected from './pages/Protected/Protected';
import LoginBypass from './pages/LoginBypass/LoginBypass'
import MyPages from './pages/MyPages/MyPages';

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

      <Route path="/mypages" element={
        <Protected>
          <Dashboard />
          <MyPages />
        </Protected>
      } />

      {/* 404 not found */}
      <Route path="/*" element={
        <Protected>
          <Dashboard />
          <NotFound404 />
        </Protected>
      } />

    </Routes>
    </>
  );
}

export default App;
