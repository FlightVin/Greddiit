import './Profile.css'
import { useEffect } from 'react';
import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Logout from '../../functionality/Logout';

const Profile = () => {
    
    /***Hardcoding followers***/

    const followersArray = ["admin1", "admin2"];
    const followingArray = ["admin1", "admin3", "admin5"];

    /*** ***/
    
    useEffect(() => {
        document.title = 'Grediit | Profile';
      }, []);

    const [editButtonDisabled, setEditButtonDisabled] = React.useState(true);

    const checkEditFields = () => {
        const signupUsernameLength = document.getElementById('editUsername').value.length;
        const signupPasswordLength = document.getElementById('editPassword').value.length;
        const signupEmailLength = document.getElementById('editEmail').value.length;
        const signupLastnameLength = document.getElementById('editLastname').value.length;
        
        if (signupUsernameLength > 0 && signupPasswordLength > 0 && signupEmailLength > 0
            && signupLastnameLength > 0){
            setEditButtonDisabled(false);
        } else {
            setEditButtonDisabled(true);
        }
    }
      
    const handleEditSubmit = (event) => {
        event.preventDefault();
        console.log('Command initiated to edit profile');

        const data = new FormData(event.currentTarget);
        const submittedData = {
          firstname: data.get('editFirstname'),
          lastname: data.get('editLastname'),
          username: data.get('editUsername'),
          email: user.email,
          age: data.get('editAge'),
          contact_number: data.get('editContactNumber'),
          password: data.get('editPassword'),
        };
    
        const JSONData = JSON.stringify(submittedData);
    
        fetch('http://localhost:5000/edit', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          }, 
          body: JSONData
        })
        .then((result) => {
            console.log(result);

            const returnedStatus = result.status;
      
            console.log(returnedStatus);
      
            if (returnedStatus === 204){
              console.log("Credentials Updated");
      
                console.log(result);
                alert('Details updated. Please login again.');

                Logout();
            }else {
                console.log("Couldn't edit data");
                Logout();
            }
        })
        .catch((err) => {
            console.log(`Couldn't sign up with error ${err}`);
        })
    }

    const [areFollowersDisplayed, setAreFollowersDisplayed] = React.useState(false);
    const displayFollowers = () => {
        setAreFollowersDisplayed(!areFollowersDisplayed);
    }
    const renderFollowers = () => {
        if (areFollowersDisplayed){
            if (followersArray.length > 0){
                var returnVal = [];

                followersArray.forEach(follower => {
                    returnVal.push(<div><p className='display-text'>{follower}</p></div>)
                })

                return returnVal;
            } else {
                return 'No Followers!';
            }
        } else {
            return '';
        }
    }

    const [areFollowingDisplayed, setAreFollowingDisplayed] = React.useState(false);
    const displayFollowing = () => {
        setAreFollowingDisplayed(!areFollowingDisplayed);
    }
    const renderFollowing = () => {
        if (areFollowingDisplayed){
            if (followingArray.length > 0){
                var returnVal = [];

                followingArray.forEach(follower => {
                    returnVal.push(<div><p className='display-text'>{follower}</p></div>)
                })

                return returnVal;
            } else {
                return 'No Followers!';
            }
        } else {
            return '';
        }
    }

    const theme = createTheme();
    const user = JSON.parse(localStorage.getItem('grediit-user-details'));

    return(
        <div className="profile-page">
            <div className="mutable-details">
                {/*** MUI Template ***/}
                <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />

                    <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                    >


                    <Typography component="h1" variant="h5">
                        Edit Profile
                    </Typography>

                    <Box component="form" onSubmit={handleEditSubmit} noValidate sx={{ mt: 1 }}>

                        <TextField
                        margin="normal"
                        fullWidth
                        id="editFirstname"
                        label="First Name"
                        name="editFirstname"
                        defaultValue={user.firstname}
                        />

                        <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="editLastname"
                        label="Last Name"
                        name="editLastname"
                        defaultValue={user.lastname}
                        onKeyUp={checkEditFields}
                        />

                        <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="editUsername"
                        label="Username"
                        name="editUsername"
                        defaultValue={user.username}
                        onKeyUp={checkEditFields}
                        />

                        <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="editEmail"
                        label="Email"
                        name="editEmail"
                        defaultValue={user.email}
                        onKeyUp={checkEditFields}
                        disabled
                        />

                        <TextField
                        margin="normal"
                        fullWidth
                        id="editAge"
                        label="Age"
                        type="number"
                        name="editAge"
                        defaultValue={user.age}
                        />

                        <TextField
                        margin="normal"
                        fullWidth
                        id="editContactNumber"
                        label="Contact Number"
                        name="editContactNumber"
                        defaultValue={user.contact_number}
                        />

                        <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="editPassword"
                        label="Password"
                        type="password"
                        id="editPassword"
                        onKeyUp={checkEditFields}
                        />

                        <Button
                        type="submit"
                        fullWidth
                        variant="fullwidth"
                        id = "editButton"
                        disabled={editButtonDisabled}
                        sx={{ mt: 3, mb: 2 }}
                        >
                        Edit Profile
                        </Button>
                    </Box>
                    </Box>
                </Container>
                </ThemeProvider>
                {/******/}
            </div>

            <div className="separating-line">
            </div>

            <div className="follow-pane">
                <div className="follower-pane">
                    <h2 id="follower-heading" onClick={displayFollowers}>Followers: {followersArray.length}</h2>
                    <div id="followers-display">
                        {renderFollowers()}
                    </div>
                </div>

                <div className="following-pane">
                    <h2 id="following-heading" onClick={displayFollowing}>Following: {followingArray.length}</h2>
                    <div id="following-display">
                        {renderFollowing()}
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default Profile;