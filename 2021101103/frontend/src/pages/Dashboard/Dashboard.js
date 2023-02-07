import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Logout from '../../functionality/Logout'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { useNavigate } from 'react-router-dom';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import AddBoxIcon from '@mui/icons-material/AddBox';
import LayersIcon from '@mui/icons-material/Layers';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import './Dashboard.css'

const Dashboard = () => {
    const navigate = useNavigate();
    const gotoProfile = () => {
        console.log('Profile Page');
        navigate('/profile');
    }

    const gotoSaved = () => {
        console.log('Saved pages');
    }

    const gotoMyPages = () => {
        console.log('My Pages');
        navigate('/mypages');
    }

    const gotoAllPages = () => {
        console.log('All Pages');
    }

    return (
        <AppBar position='static' style={{ background: '#336699' }}>
            <Toolbar>
                <Typography variant="h5">
                    Grediit
                </Typography>
                <ChevronRightIcon sx={{marginLeft: '5px',  fontSize: '30px'}} />

                <AccountCircleRoundedIcon className='dashIconClass' id='dashProfileIcon' onClick={gotoProfile} sx={{marginLeft: '10px',  fontSize: '35px'}} />
                <AddBoxIcon className='dashIconClass' id='dashMypagesIcon' onClick={gotoMyPages} sx={{marginLeft: '20px',  fontSize: '35px'}} />
                <LayersIcon className='dashIconClass' id='dashAllpagesIcon' onClick={gotoAllPages} sx={{marginLeft: '20px',  fontSize: '35px'}} />
                <BookmarksIcon className='dashIconClass' id='dashSavedpostsIcon' onClick={gotoSaved} sx={{marginLeft: '20px',  fontSize: '35px'}} />

                <LogoutRoundedIcon id='dashLogoutIcon' onClick={Logout} sx={{marginLeft: 'auto',  fontSize: '35px'}} />

             </Toolbar>
        </AppBar>
      );
}
 
export default Dashboard;