import './MyPages.css'
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
import DeleteIcon from '@mui/icons-material/Delete';

const MyPages = () => {
    const user = JSON.parse(localStorage.getItem('grediit-user-details'));
    const theme = createTheme();

    useEffect(() => {
        document.title = 'Greddiit | My Pages';
    }, []);

    // creating new subgreddit
    const [renderPageForm, setRenderPageForm] = React.useState(false);
    const [pageCreationButtonDisabled, setPageCreationButtonDisabled] = React.useState(true);

    const toggleCreatePage = () => {
        setRenderPageForm(curState => !curState);
    }

    const handlePageCreation = (event) => {
        event.preventDefault();
        console.log('Called page creation');
    }

    const checkPageCreationFields = () => {
        const pageNameLength = document.getElementById('pageCreationName').value.length;
    
        if (pageNameLength > 0){
            setPageCreationButtonDisabled(false);
        } else {
            setPageCreationButtonDisabled(true);
        }
    }

    const renderPageFormHTML = () => {
        return (
            <Box component="form" onSubmit={handlePageCreation} noValidate sx={{ mt: 1 }}>
                <TextField
                margin="normal"
                fullWidth
                id="pageCreationName"
                label="Page Name"
                name="pageCreationName"
                onKeyUp={checkPageCreationFields}
                required
                />

                <Button
                type="submit"
                fullWidth
                variant="fullwidth"
                id = "editButton"
                disabled={pageCreationButtonDisabled}
                sx={{ mt: 3, mb: 2 }}
                >
                Create
                </Button>
            </Box>
        );
    }

    return (
        <div className="mypage">
            <div className="page-creation">
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


                    <Typography component="h1" variant="h5" onClick={toggleCreatePage}
                        id="createPageToggling">
                        Create Page
                    </Typography>

                    {renderPageForm ? renderPageFormHTML() : ""}

                    </Box>
                </Container>
                </ThemeProvider>
                {/******/}
            </div>

            <div className="horizontal-line">
                
            </div>
        </div>
    );
}

export default MyPages;