import './AllPages.css'
import { useEffect } from 'react';
import * as React from 'react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';

const AllPages = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('grediit-user-details'));
    const theme = createTheme();

    useEffect(() => {
        document.title = 'Greddiit | All Pages';
    }, []);

    const [subgreddiitList, setSubgreddiitList] = React.useState([]);
    const [currentSUbgreddiitList, setCurrentSubgreddiitList] = React.useState([]);
    const [changeArray, setChangeArray] = React.useState(false);

    useEffect(() => {
        // getting initial data
        const initRender = async () => {
            fetch(`http://localhost:5000/access-subgreddiits/`, {
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
                                        __id: entry.__id,
                                        name: entry.name,
                                        moderatorEmail: entry.moderatorEmail,
                                        userEmails: entry.userEmails,
                                        blockedUserEmails: entry.blockedUserEmails,
                                        postObjectIDs: entry.postObjectIDs,
                                        bannedWords:
                                            entry.bannedWords.join(', '),
                                        description: entry.description,
                                        joinRequestEmails: entry.joinRequestEmails,
                                        reportedPostObjectIDs: entry.reportedPostObjectIDs
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

    // rendering subgreddiits
    const renderPages = () => {
        if (currentSUbgreddiitList.length > 0){
            var returnval = [];

        
            currentSUbgreddiitList.forEach(entry => {
                returnval.push(
                    <div className="subgreddiit-pane">
                        <p>
                            <span style={{fontWeight:'bold', fontSize:'24px', fontStyle:'italic'}}>{entry.name}</span>
                        </p>

                        <h3>Description</h3>
                        <p className='para'>{entry.description}</p>

                        <h3>Banned Words</h3>
                        <p className='para'>{entry.bannedWords.length > 0 ? entry.bannedWords : "No restricted words"}</p>

                        <p className='para'>
                            <span style={{fontWeight:'bold'}}>Number of posts: </span>
                            {entry.postObjectIDs.length}
                        </p>

                        <p className='para'>
                            <span style={{fontWeight:'bold'}}>Number of users: </span>
                            {entry.userEmails.length}
                        </p>

                        <p className='para'>
                            <span style={{fontWeight:'bold'}}>Moderator Email: </span>
                            {entry.moderatorEmail}
                        </p>
                        
                        <p>                            
                            <Tooltip title="Open SubGreddiit"> 
                                <OpenInNewIcon className='openIcon' 
                                    sx={{fontSize: 30, mx: '100px'}}
                                    onClick={openPage(entry.name)}/>
                            </Tooltip>

                            <Tooltip title="Join Subgreddiit"> 
                                <AddIcon className='openIcon' 
                                    sx={{fontSize: 30, mx: '100px'}}
                                    onClick={user.email === entry.moderatorEmail ? null: joinPage(entry.name)}
                                    />
                            </Tooltip>
                        </p>
                    </div>
                )
            })

            return returnval;
        } else {
            return( <div style={{textAlign:'center'}}>
                <p>
                    No SubGreddiits Found
                </p>
                <p style={{fontSize:'14px'}}> 
                    (Search for empty string for all SubGreddiits)
                </p>
            </div>
            );
        }
    }

    // opening a new page
    const openPage = (name) => {
        return async function(){
            navigate(`/subgreddiit/${name}`);
        };
    };

    // joining a page
    const joinPage = (name) =>{
        return async function(){
            console.log(name);

            fetch(`http://localhost:5000/join-subgreddiit/${name}/${user.email}`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                'Content-Type': 'application/json'
                }, 
                body: null
            })
            .then((result) => {
                const returnedStatus = result.status;
            
                console.log(`Returned status for joining: ${returnedStatus}`);

                setChangeArray(curState => !curState);
            })
            .catch((err) => {
                console.log(err);
            })
        };
    }

    const [searchButtonDisabled, setSetSearchButtonDisabled] = React.useState(false);

    const handleSearch = (event) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const submittedKeyword = data.get('searchKeyword').toLowerCase();
        console.log(`Search on ${submittedKeyword}`);

        setCurrentSubgreddiitList(subgreddiitList.filter(
            entry => entry.name.toLowerCase().includes(submittedKeyword)
        ));

        setChangeArray(curState => !curState);
    }

    return (
        <div className="allpages">

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
                            Search SubGreddiits
                        </Typography>

                        <Box component="form" onSubmit={handleSearch} noValidate sx={{ mt: 1 }}>

                            <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="searchKeyword"
                            label="Keyword"
                            name="searchKeyword"
                            />

                            <Button
                            type="submit"
                            fullWidth
                            variant="outlined"
                            id = "searchButton"
                            disabled={searchButtonDisabled}
                            sx={{ mt: 3, mb: 2 }}
                            >
                                Search
                            </Button>
                        </Box>
                        </Box>
                    </Container>
                    </ThemeProvider>
                    {/******/}  


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
                            Filter SubGreddiits
                        </Typography>

                        <Box component="form" onSubmit={handleSearch} noValidate sx={{ mt: 1 }}>

                            <Button
                            type="submit"
                            fullWidth
                            variant="outlined"
                            id = "filterButton"
                            sx={{ mt: 3, mb: 2 }}
                            >
                                Filter
                            </Button>
                        </Box>
                        </Box>
                    </Container>
                    </ThemeProvider>
                    {/******/} 

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
                            Sort SubGreddiits
                        </Typography>

                        <Box component="form" onSubmit={handleSearch} noValidate sx={{ mt: 1 }}>

                            <Button
                            type="submit"
                            fullWidth
                            variant="outlined"
                            id = "searchButton"
                            sx={{ mt: 3, mb: 2 }}
                            >
                                Sort
                            </Button>
                        </Box>
                        </Box>
                    </Container>
                    </ThemeProvider>
                    {/******/} 

            <div className="horizontal-line">
                
            </div>

            <div className="list-subgreddiit">
                <div className="list-header">
                    <h2>All Subgreddiits</h2>
                </div>
                <div className="subgreddiit-panes">
                    {renderPages()}
                </div>
            </div>
        </div>
    );
}

export default AllPages;