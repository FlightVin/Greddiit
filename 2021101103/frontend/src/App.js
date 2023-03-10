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
import SubgreddiitPage from './pages/SubgreddiitPage/SubgreddiitPage';
import SavedPosts from './pages/SavedPosts/SavedPosts';
import Reported from './pages/Reported/Reported';
import Stats from './pages/Stats/Stats';


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

      <Route path="/savedposts" element={
        <Protected>
          <Dashboard />
          <SavedPosts />
        </Protected>
      } />

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

      <Route path="/mysubgreddiit/:name/reported" element={
        <Protected>
          <MySubgreddiitCheck>
            <Dashboard />
            <Reported />
          </MySubgreddiitCheck>
        </Protected>
      } />

      <Route path="/mysubgreddiit/:name/stats" element={
        <Protected>
          <MySubgreddiitCheck>
            <Dashboard />
            <Stats />
          </MySubgreddiitCheck>
        </Protected>
      } />

      <Route path="/mysubgreddiit/:name" element={
        <Navigate to='./users' />
      } />


      <Route path="/subgreddiit/:name" element={
        <Protected>
          <SubgreddiitCheck>
            <Dashboard />
            <SubgreddiitPage />
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
