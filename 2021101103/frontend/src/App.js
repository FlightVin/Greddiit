import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';
import NotFound404 from './pages/404/404';
import Protected from './pages/Protected/Protected';
import LoginBypass from './pages/LoginBypass/LoginBypass'
import MyPages from './pages/MyPages/MyPages';
import AllPages from './pages/AllPages/AllPages';
import JoinRequests from './pages/JoinRequests/JoinRequests';
import { SubgreddiitCheck, MySubgreddiitCheck} from './pages/SubgreddiitCheck/SubgreddiitCheck';
import SubGreddiitUsers from './pages/SubgreddiitUsers/SubgreddiitUsers';

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

      <Route path="/allpages" element={
        <Protected>
          <Dashboard />
          <AllPages />
        </Protected>
      } />

      {/* moderator access */}

      <Route path="/mysubgreddiit/:name/users" element={
        <Protected>
          <MySubgreddiitCheck>
            <Dashboard />
            <SubGreddiitUsers />
          </MySubgreddiitCheck>
        </Protected>
      } />

      <Route path="/mysubgreddiit/:name/join-requests" element={
        <Protected>
          <MySubgreddiitCheck>
            <Dashboard />
            <JoinRequests />
          </MySubgreddiitCheck>
        </Protected>
      } />

      <Route path="/mysubgreddiit/:name" element={
        <Navigate to='./users' />
      } />

      {/* global access */}
      <Route path="/subgreddiit/:name" element={
        <Protected>
          <SubgreddiitCheck>
            <Dashboard />
          </SubgreddiitCheck>
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
