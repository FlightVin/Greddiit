import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';

import './Login.css'

const theme = createTheme();

export default function Login() {
  // for login button
  const handleLoginSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const submittedData = {
      username: data.get('loginUsername'),
      password: data.get('loginPassword'),
    };

    console.log(submittedData);
  };

  const [loginButtonDisabled, setLoginButtonDisabled] = React.useState(true);

  const checkLoginFields = () => {
    const loginUsernameLength = document.getElementById('loginUsername').value.length;
    const loginPasswordLength = document.getElementById('loginPassword').value.length;

    if (loginUsernameLength > 0 && loginPasswordLength > 0){
        setLoginButtonDisabled(false);
    } else {
        setLoginButtonDisabled(true);
    }
  }

  // for signup button
  const handleSignupSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const submittedData = {
      email: data.get('signupEmail'),
      username: data.get('signupUsername'),
      password: data.get('signupPassword'),
    };

    console.log(submittedData);
  };
  const [signupButtonDisabled, setSignupButtonDisabled] = React.useState(true);

  const checkSignupFields = () => {
    const signupUsernameLength = document.getElementById('signupUsername').value.length;
    const signupPasswordLength = document.getElementById('signupPassword').value.length;
    const signupEmailLength = document.getElementById('signupEmail').value.length;

    if (signupUsernameLength > 0 && signupPasswordLength > 0 && signupEmailLength > 0){
        setSignupButtonDisabled(false);
    } else {
        setSignupButtonDisabled(true);
    }
  }

  return (
    <div className="login-page">

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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LoginOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            Sign in
          </Typography>

          <Box component="form" onSubmit={handleLoginSubmit} noValidate sx={{ mt: 1 }}>

            <TextField
              margin="normal"
              required
              fullWidth
              id="loginUsername"
              label="Username"
              name="loginUsername"
              onKeyUp={checkLoginFields}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="loginPassword"
              label="Password"
              type="password"
              id="loginPassword"
              onKeyUp={checkLoginFields}
            />

            <Button
              type="submit"
              fullWidth
              variant="outlined"
              id = "loginButton"
              sx={{ mt: 3, mb: 2 }}
              disabled={loginButtonDisabled}
            >
              Sign In
            </Button>

          </Box>
        </Box>
      </Container>
    </ThemeProvider>

    <div className="middle-line">
    </div>

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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>

          <Box component="form" onSubmit={handleSignupSubmit} noValidate sx={{ mt: 1 }}>

            <TextField
              margin="normal"
              required
              fullWidth
              id="signupEmail"
              label="Email"
              name="signupEmail"
              onKeyUp={checkSignupFields}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="signupUsername"
              label="Username"
              name="signupUsername"
              onKeyUp={checkSignupFields}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="signupPassword"
              label="Password"
              type="password"
              id="signupPassword"
              onKeyUp={checkSignupFields}
            />

            <Button
              type="submit"
              fullWidth
              variant="fullwidth"
              id = "signupButton"
              sx={{ mt: 3, mb: 2 }}
              disabled={signupButtonDisabled}
            >
              Register
            </Button>

          </Box>
        </Box>
      </Container>
    </ThemeProvider>

    </div>
  );
}