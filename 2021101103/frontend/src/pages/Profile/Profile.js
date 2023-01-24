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

const Profile = (event) => {

    event.preventDefault();
    useEffect(() => {
        document.title = 'Grediit | Profile';
      }, []);

    const handleEditSubmit = () => {
        console.log('ok');
    }

    const theme = createTheme();
    const user = JSON.parse(localStorage.getItem('grediit-user-details'));

    return(
        <div className="profile-page">
            <div className="mutable-details">
                {/******/}
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
                        // required
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
                        />

                        <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="editUsername"
                        label="Username"
                        name="editUsername"
                        />

                        <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="editEmail"
                        label="Email"
                        name="editEmail"
                        />

                        <TextField
                        margin="normal"
                        fullWidth
                        id="editAge"
                        label="Age"
                        type="number"
                        name="editAge"
                        />

                        <TextField
                        margin="normal"
                        fullWidth
                        id="editContactNumber"
                        label="Contact Number"
                        name="editContactNumber"
                        />

                        <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="editPassword"
                        label="Password"
                        type="password"
                        id="editPassword"
                        />

                        <Button
                        type="submit"
                        fullWidth
                        variant="fullwidth"
                        id = "signupButton"
                        sx={{ mt: 3, mb: 2 }}
                        >
                        Register
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
               
            </div>
        </div>
    );
}
 
export default Profile;