import './SubgreddiitPage.css'
import * as React from 'react';
import { useParams } from "react-router-dom";
import { useEffect } from 'react';
import Loading from '../Loading/Loading';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';

const SubgreddiitPage = () => {
    const {name} = useParams();
    const user = JSON.parse(localStorage.getItem('grediit-user-details'));
    const [curPage, setCurPage] = React.useState();
    const [isLoading, setLoading] = React.useState(true);
    const theme = createTheme();

    useEffect(() => {
        document.title = `Greddiit | ${name}`;
    }, []);

    useEffect(() => {
        // getting initial data
        setTimeout(() => {
            const initRender = async () => {
                fetch(`http://localhost:5000/subgreddiit-exists/${name}`, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                      'Content-Type': 'application/json'
                    }, 
                    body: null
                })
                .then((result) => {
                    const returnedStatus = result.status;
    
                    if (returnedStatus === 200){
            
                        result.json()
                            .then((body) => {
                                console.log(body);
                                setCurPage(body);
                                setLoading(false);
                            })
                            .catch((err) => {
                                console.log(err);
                            });
            
                    } else {
                        console.log("Initial fetch failed");
                    }
                })
            }

            initRender();
        }, 1000);
    }, [user.email, name]);

    const [renderPostForm, setRenderPostForm] = React.useState(false);
    const [postCreationButtonDisabled, setPostCreationButtonDisabled]
        = React.useState(true);

    if (isLoading) {
        return (
            <Loading />
        );
    }

    const toggleCreatePost = () => {
        if (!curPage.userEmails.includes(user.email)){
            alert("You must be a member to do this!");
            return;
        }

        setRenderPostForm(curState => !curState);
    }

    const handlePostCreation = (event) => {
        event.preventDefault();

        console.log("Creating post");
    }

    const renderPostFormHTML = () => {
        return (
            <Box component="form" onSubmit={handlePostCreation} noValidate sx={{ mt: 1 }}>

                

                <Button
                type="submit"
                fullWidth
                variant="fullwidth"
                id = "postCreationButton"
                disabled={postCreationButtonDisabled}
                sx={{ mt: 3, mb: 2 }}
                >
                Create
                </Button>
            </Box>
        );
    }

    return (
        <div className="subgreddiit-page">

            <div className="subgreddiit-info-pane">
                <img src="https://reactjs.org/logo-og.png" alt="subgreddiit Image"></img>

                <h2 style={{
                    textAlign:'center',
                    marginTop:'30px'
                }}>
                    {curPage.name}
                </h2>

                <p style={{
                    textAlign:'center',
                    marginTop:'10px'
                }}>
                    {curPage.description}
                </p>

                <p style={{
                    textAlign:'center',
                    marginTop:'10px',
                    fontStyle:'italic'
                }}>
                    Moderator: {curPage.moderatorEmail}
                </p>
            </div>

            <div className="middle-line">
            </div>

            <div className="post-pane">
                <div className="post-creation">
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

                        <Typography component="h1" variant="h5" onClick={toggleCreatePost}
                            id="createPageToggling">
                            Create Post
                        </Typography>

                        {renderPostForm ? renderPostFormHTML() : ""}

                        </Box>
                    </Container>
                    </ThemeProvider>
                    {/******/}
                </div>
            </div>
        </div>
    )
}

export default SubgreddiitPage;