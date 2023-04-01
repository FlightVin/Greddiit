import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Logout from '../../functionality/Logout'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { useNavigate, useParams } from 'react-router-dom';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import AddBoxIcon from '@mui/icons-material/AddBox';
import LayersIcon from '@mui/icons-material/Layers';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import BarChartIcon from '@mui/icons-material/BarChart';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import './Dashboard.css'
import { Tooltip } from '@mui/material';

const Dashboard = (props) => {
    const navigate = useNavigate();

    const gotoPage = (dest) => {
        return function() {
            console.log(`Redirection to ${dest}`);
            navigate(dest);
        }
    }

    let { name } = useParams();
    let state = props.state;
    var mypageValidation = false;
    if(state){
        mypageValidation = true;
    }

    const renderMyPageNav = (name) => {
        if (!name || !mypageValidation){
            return (
                <Tooltip title="My Pages">
                    <AddBoxIcon className='dashIconClass' id='dashMypagesIcon' onClick={gotoPage('/mypages')} sx={{marginLeft: '20px',  fontSize: '35px'}} />
                </Tooltip>
            )
        } else {
            return (
               <div className="dashOnMypages">
                    <Tooltip title="My Pages">
                        <AddBoxIcon className='dashIconClass' onClick={gotoPage('/mypages')} sx={{fontSize: '35px'}} />
                    </Tooltip>

                    <Tooltip title="Subgreddiit Users">
                        <GroupIcon className='myPagesIconClass' onClick={gotoPage(`/mysubgreddiit/${name}/users`)} sx={{marginLeft: '15px', fontSize: '35px'}} />
                    </Tooltip>

                    <Tooltip title="Join Requests">
                        <PersonAddAlt1Icon className='myPagesIconClass' onClick={gotoPage(`/mysubgreddiit/${name}/join-requests`)} sx={{marginLeft: '15px', fontSize: '35px'}} />
                    </Tooltip>

                    <Tooltip title="Stats">
                        <BarChartIcon className='myPagesIconClass' onClick={gotoPage(`/mysubgreddiit/${name}/stats`)} sx={{marginLeft: '15px', fontSize: '35px'}} />
                    </Tooltip>

                    <Tooltip title="Reported Posts">
                        <ReportGmailerrorredIcon className='myPagesIconClass' onClick={gotoPage(`/mysubgreddiit/${name}/reported`)} sx={{marginLeft: '15px', fontSize: '35px'}} />
                    </Tooltip>
               </div>
            )
        }
    }

    return (
        <AppBar position='static' style={{ background: '#336699' }}>
            <Toolbar>
                <Typography variant="h5">
                    Grediit
                </Typography>
                <ChevronRightIcon sx={{marginLeft: '5px',  fontSize: '30px'}} />
                <Typography variant="h5">
                    {name}
                </Typography>

                <Tooltip title="Profile">
                    <AccountCircleRoundedIcon className='dashIconClass' id='dashProfileIcon' onClick={gotoPage('/profile')} sx={{marginLeft: name ? '20px' : '10px',  fontSize: '35px'}} />
                </Tooltip>

                {renderMyPageNav(name)}
                
                <Tooltip title="All Pages">
                    <LayersIcon className='dashIconClass' id='dashAllpagesIcon' onClick={gotoPage('/allpages')} sx={{marginLeft: '20px',  fontSize: '35px'}} />
                </Tooltip>
                
                <Tooltip title="Saved Posts">
                    <BookmarksIcon className='dashIconClass' id='dashSavedpostsIcon' onClick={gotoPage('/savedposts')} sx={{marginLeft: '20px',  fontSize: '35px'}} />
                </Tooltip>

                <Tooltip> 
                    <LogoutRoundedIcon id='dashLogoutIcon' onClick={Logout} sx={{marginLeft: 'auto',  fontSize: '35px'}} />
                </Tooltip>

             </Toolbar>
        </AppBar>
      );
}
 
export default Dashboard;