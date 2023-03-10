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
import { useNavigate } from 'react-router-dom';
import baseURL from "../Base"

const theme = createTheme();

export default function Login() {
  React.useEffect(() => {
    document.title = 'Greddiit | Login';
  }, []);

  const authSuccessColor = 'white';
  const afterLogin = '/profile';

  const [loginButtonDisabled, setLoginButtonDisabled] = React.useState(true);
  const [signupButtonDisabled, setSignupButtonDisabled] = React.useState(true);
  const [loginEmailHelper, setLoginEmailHelper] = React.useState("");
  const [signupEmailValid, setSignupEmailValid] = React.useState(true);
  const [signupUsernameValid, setSignupUsernameValid] = React.useState(true);
  const [signupContactValid, setSignupContactValid] = React.useState(true);

  const navigate = useNavigate();

  // for login button
  const handleLoginSubmit = (event) => {

    event.preventDefault();
    setLoginButtonDisabled(curState => !curState);
    const data = new FormData(event.currentTarget);
    const submittedData = {
      email: data.get('loginEmail').toLowerCase(),
      password: data.get('loginPassword'),
    };
    const JSONData = JSON.stringify(submittedData);

    console.log(JSONData);

    fetch(`${baseURL}/login`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSONData
    })
    .then((result) => {
      console.log(result);
      const returned_status = result.status;
      console.log(returned_status);

      if (returned_status === 200){
        console.log("Credentials Accepted");
        setLoginFaliure(authSuccessColor);

        result.json()
          .then((body) => {
            console.log(body);
            
            localStorage.setItem('grediit-user-details', JSON.stringify(body));
            localStorage.setItem('grediit-user-token', body.token);
            navigate(afterLogin);
          })
          .catch((err) => {
            console.log(`Acquired error in reading result data: ${err}`);
          })

      } else {
        console.log("Invalid Credentials");
        setLoginFaliure('crimson');
      }
      setLoginButtonDisabled(curState => !curState);
    })
    .catch((err) => {
      console.log(`Couldn't send data with error ${err}`);
    });
  };

  const [loginFaliure, setLoginFaliure] = React.useState(authSuccessColor);

  const checkLoginFields = () => {
    const loginEmailLength = document.getElementById('loginEmail').value.length;
    const loginPasswordLength = document.getElementById('loginPassword').value.length;

    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    const emailAddress = document.getElementById('loginEmail').value;
    const emailValid = validateEmail(emailAddress) || emailAddress === 'admin';

    if (!emailValid){
      setLoginEmailHelper("Not an email");
    } else {
      setLoginEmailHelper("");
    }

    if (loginEmailLength > 0 && loginPasswordLength > 0 && emailValid){
        setLoginButtonDisabled(false);
    } else {
        setLoginButtonDisabled(true);
    }
  }

  const [emailInUse, setEmailInUse] = React.useState(false);

  // for signup button
  const handleSignupSubmit = (event) => {
    event.preventDefault();
    setSignupButtonDisabled(curState => !curState);
    const data = new FormData(event.currentTarget);
    const submittedData = {
      firstname: data.get('signupFirstname'),
      lastname: data.get('signupLastname'),
      username: data.get('signupUsername'),
      email: data.get('signupEmail').toLowerCase(),
      age: data.get('signupAge'),
      contact_number: data.get('signupContactNumber'),
      password: data.get('signupPassword'),
    };

    const JSONData = JSON.stringify(submittedData);

    fetch(`${baseURL}/register`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSONData
    })
    .then((result) => {
      const returnedStatus = result.status;
      
      console.log(returnedStatus);

      if (returnedStatus === 201){
        console.log("Credentials Created");
        setEmailInUse(false);

        result.json()
          .then((body) => {
            console.log(body);
            
            localStorage.setItem('grediit-user-details', JSON.stringify(body));
            localStorage.setItem('grediit-user-token', body.token);
            navigate(afterLogin);
          })
          .catch((err) => {
            console.log(`Acquired error in reading result data: ${err}`);
          })
      } else if (returnedStatus === 409){
        setEmailInUse(true);
      }
      setSignupButtonDisabled(curState => !curState);
    })
    .catch((err) => {
      console.log(`Couldn't sign up with error ${err}`);
    })
  };

  const checkSignupFields = () => {
    const signupUsernameLength = document.getElementById('signupUsername').value.length;
    const signupPasswordLength = document.getElementById('signupPassword').value.length;
    const signupEmailLength = document.getElementById('signupEmail').value.length;
    const signupLastnameLength = document.getElementById('signupLastname').value.length;

    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    const emailAddress = document.getElementById('signupEmail').value;
    const emailValid = validateEmail(emailAddress);
    setSignupEmailValid(emailValid);

    const username = document.getElementById('signupUsername').value;
    const usernameValid = username.indexOf(' ')<0;
    setSignupUsernameValid(usernameValid);  
    
    const contact = document.getElementById('signupContactNumber').value;
    const contactValid = contact.length === 0 || (contact.length === 10 && /\d{10}/.test(contact));
    setSignupContactValid(contactValid);
    
    if (signupUsernameLength > 0 && signupPasswordLength > 0 && signupEmailLength > 0
        && signupLastnameLength > 0 && emailValid && usernameValid && contactValid){
        setSignupButtonDisabled(false);
    } else {
        setSignupButtonDisabled(true);
    }
  }

  /********* Frontend **********/

  return (
    <div className="inner-pane">
    <div className="login-page">

    <ThemeProvider theme={theme} >
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
              id="loginEmail"
              label="Email"
              name="loginEmail"
              onKeyUp={checkLoginFields}
              helperText={loginEmailHelper}
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

          <Typography variant='h7' color={loginFaliure}>
              Incorrect Credentials
          </Typography>

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
              // required
              fullWidth
              id="signupFirstname"
              label="First Name"
              name="signupFirstname"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="signupLastname"
              label="Last Name"
              name="signupLastname"
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
              helperText={signupUsernameValid ? "" : "No spaces are allowed"}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="signupEmail"
              label="Email"
              name="signupEmail"
              onKeyUp={checkSignupFields}
              helperText={emailInUse ? "Email already in use!": signupEmailValid ? "" : "Not a valid email"}
            />

            <TextField
              margin="normal"
              fullWidth
              id="signupAge"
              label="Age"
              type="number"
              name="signupAge"
            />

            <TextField
              margin="normal"
              fullWidth
              id="signupContactNumber"
              label="Contact Number"
              name="signupContactNumber"
              helperText={signupContactValid ? "" : "Expecting 10 digit number"}
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
    </div>
  );
}