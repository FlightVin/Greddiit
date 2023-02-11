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
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';

const MyPages = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('grediit-user-details'));
    const theme = createTheme();

    useEffect(() => {
        document.title = 'Greddiit | My Pages';
    }, []);

    const [renderPageForm, setRenderPageForm] = React.useState(false);
    const [pageCreationButtonDisabled, setPageCreationButtonDisabled] = React.useState(true);
    const [createPageHelperText, setCreatePageHelperText] = React.useState("");
    const [subgreddiitList, setSubgreddiitList] = React.useState([]);
    const [changeArray, setChangeArray] = React.useState(false);

    useEffect(() => {
        // getting initial data
        const initRender = async () => {
            fetch(`http://localhost:5000/access-subgreddiits/${user.email}`, {
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
                            setSubgreddiitList([]);
                            body.forEach(entry => {
                            setSubgreddiitList(oldArray => [
                                ...oldArray,
                                {
                                    name: entry.name,
                                    moderatorEmail: entry.moderatorEmail,
                                    userEmails: entry.userEmails,
                                    blockedUserEmails: entry.blockedUserEmails,
                                    postObjectIDs: entry.postObjectIDs,
                                    bannedWords:
                                        entry.bannedWords.join(', '),
                                    description: entry.description,
                                    joinRequestEmails: entry.joinRequestEmails,
                                    reportedPostObjectIDs: entry.reportedPostObjectIDs,
                                    subgreddiitTags: entry.subgreddiitTags.join(', ')
                                }
                            ])  
                            })
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
    }, [changeArray, user.email]);

    const toggleCreatePage = () => {
        setRenderPageForm(curState => !curState);
    }

    // page Creation
    const handlePageCreation = (event) => {
        event.preventDefault();

        setPageCreationButtonDisabled(true);
        setCreatePageHelperText("Creation in progress");

        const data = new FormData(event.currentTarget);
        const submittedData = {
          name: data.get('pageCreationName'),
          moderatorEmail: user.email,
          description: data.get('pageCreationDescription'),
          bannedWords: data.get('pageCreationBannedKeywords').toLowerCase(),
          subgreddiitTags: data.get('pageCreationTags').toLocaleLowerCase()
        };

        const JSONData = JSON.stringify(submittedData);
        
        fetch('http://localhost:5000/create-subgreddiit', {
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

            if (returnedStatus === 201){
                setCreatePageHelperText("Subgreddiit created!");
            } else if (returnedStatus === 409){
                setCreatePageHelperText("Subgreddiit already exists!");
            } else {
                setCreatePageHelperText("Error: Reload page and try again");
            }

            setPageCreationButtonDisabled(false);
            setChangeArray(curState => !curState);
        })
        .catch((err) => {
            console.log(`Couldn't sign up with error ${err}`);
        })
    }

    // page deletion
    const deletePage = (name) => {
        return async function(){
            console.log(name);

            fetch(`http://localhost:5000/delete-subgreddiit/${name}`, {
                method: 'DELETE',
                mode: 'cors',
                headers: {
                'Content-Type': 'application/json'
                }, 
                body: null
            })
            .then((result) => {
                const returnedStatus = result.status;
            
                console.log(`Returned status for deletion: ${returnedStatus}`);

                setChangeArray(curState => !curState);
            })
            .catch((err) => {
                console.log(err);
            })
        };
    };

    // rendering subgreddiits
    const renderPages = () => {
        if (subgreddiitList.length > 0){
            var returnval = [];

            subgreddiitList.forEach(entry => {
                let currentDeleteIconID = `deletePage${entry.name}`;

                returnval.push(
                    <div className="subgreddiit-pane">
                        <p>
                            <span style={{fontWeight:'bold', fontSize:'24px', fontStyle:'italic'}}>{entry.name}</span>
                        </p>

                        <h3>Description</h3>
                        <p className='para'>{entry.description}</p>

                        <h3>Banned Words</h3>
                        <p className='para'>{entry.bannedWords.length > 0 ? entry.bannedWords : "No restricted words"}</p>

                        <h3>Tags</h3>
                        <p className='para'>{entry.subgreddiitTags.length > 0 ? entry.subgreddiitTags : "No restricted words"}</p>

                        <p className='para'>
                            <span style={{fontWeight:'bold'}}>Number of posts: </span>
                            {entry.postObjectIDs.length}
                        </p>

                        <p className='para'>
                            <span style={{fontWeight:'bold'}}>Number of users: </span>
                            {entry.userEmails.length}
                        </p>
                        
                        <p>
                             <Tooltip title="Delete SubGreddiit"> 
                                <DeleteIcon className='deleteIcon' id={currentDeleteIconID} 
                                    sx={{fontSize: 30, mx: '100px'}}
                                    onClick={deletePage(entry.name)}/>
                                </Tooltip>
                            
                            <Tooltip title="Open SubGreddiit"> 
                                <OpenInNewIcon className='openIcon' 
                                    sx={{fontSize: 30, mx: '100px'}}
                                    onClick={openPage(entry.name)}/>
                            </Tooltip>
                        </p>
                    </div>
                )
            })

            return returnval;
        } else {
            return "No Subgreddiits";
        }
    }

    // opening a new page
    const openPage = (name) => {
        return async function(){
            navigate(`/mysubgreddiit/${name}`, {state: {email: user.email}});
        };
    };

    const checkPageCreationFields = () => {
        const pageNameLength = document.getElementById('pageCreationName').value.length;
        const descriptionLength = document.getElementById('pageCreationDescription').value.length;

        if (pageNameLength > 0 && descriptionLength > 0){
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
                helperText={createPageHelperText}
                />

                <TextField
                margin="normal"
                fullWidth
                id="pageCreationDescription"
                label="Page Description"
                name="pageCreationDescription"
                onKeyUp={checkPageCreationFields}
                required
                />

                <TextField
                margin="normal"
                fullWidth
                id="pageCreationBannedKeywords"
                label="Banned Keywords"
                name="pageCreationBannedKeywords"
                onKeyUp={checkPageCreationFields}
                helperText="Without spaces around commas"
                inputProps={{
                    style: {
                      height: "50px"                    },
                  }}
                />

                <TextField
                margin="normal"
                fullWidth
                id="pageCreationTags"
                label="Tags"
                name="pageCreationTags"
                onKeyUp={checkPageCreationFields}
                helperText="Without spaces around commas"
                inputProps={{
                    style: {
                      height: "50px"                    },
                  }}
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

            <div className="list-subgreddiit">
                <div className="list-header">
                    <h2>My Subgreddiits</h2>
                </div>
                <div className="subgreddiit-panes">
                    {renderPages()}
                </div>
            </div>
        </div>
    );
}

export default MyPages;