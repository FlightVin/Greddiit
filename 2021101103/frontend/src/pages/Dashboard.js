import { NavLink } from 'react-router-dom';
import './Dashboard.css'

const Dashboard = () => {
    return (  
        <div className="dashboard-page">
            <h1>Dashboard</h1>
            <p>Just made for debugging purposes - auth only implemented in login and profile pages till now</p>
            <ul>
                <li><NavLink to="/login" style={isActive => ({color: isActive ? "green" : "blue"})}>
                        Login</NavLink></li>
                <li><NavLink to="/profile" style={isActive => ({color: isActive ? "green" : "blue"})}>
                        Profile</NavLink></li>
            </ul>                
        </div>
    );
}
 
export default Dashboard;