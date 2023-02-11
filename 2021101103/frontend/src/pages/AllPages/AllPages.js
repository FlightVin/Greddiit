import './AllPages.css'
import { useEffect } from 'react';
import * as React from 'react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
import { Icon, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import FuzzySearch from 'fuzzy-search';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';

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
                                        creationTimestamp: entry._id.toString().substring(0,8),
                                        name: entry.name,
                                        moderatorEmail: entry.moderatorEmail,
                                        userEmails: entry.userEmails,
                                        blockedUserEmails: entry.blockedUserEmails,
                                        postObjectIDs: entry.postObjectIDs,
                                        bannedWords:
                                            entry.bannedWords,
                                        description: entry.description,
                                        joinRequestEmails: entry.joinRequestEmails,
                                        reportedPostObjectIDs: entry.reportedPostObjectIDs,
                                        subgreddiitTags: entry.subgreddiitTags
                                    }
                                ]) 
                            })
                            console.log('Rendering');
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
    }, [currentSUbgreddiitList, changeArray, user.email]);

    // rendering subgreddiits
    const renderPages = () => {
        console.log("Called renderPages()");
        if (currentSUbgreddiitList.length > 0){
            var returnval = [];
        
            currentSUbgreddiitList.forEach(entry => {

                const isLeaveDisabled = 
                    entry.moderatorEmail === user.email
                    || !entry.userEmails.includes(user.email)
                ;

                const isJoinDisabled =
                    user.email === entry.moderatorEmail
                    || entry.userEmails.includes(user.email)
                    || entry.blockedUserEmails.includes(user.email)
                ; 

                returnval.push(
                    <div className="subgreddiit-pane">
                        <p>
                            <span style={{fontWeight:'bold', fontSize:'24px', fontStyle:'italic'}}>{entry.name}</span>
                        </p>

                        <h3>Description</h3>
                        <p className='para'>{entry.description}</p>

                        <h3>Banned Words</h3>
                        <p className='para'>{entry.bannedWords.join(', ').length > 0 ? entry.bannedWords.join(', ') : "No restricted words"}</p>

                        <h3>Tags</h3>
                        <p className='para'>{entry.subgreddiitTags.join(', ').length > 0 ? entry.subgreddiitTags.join(', ') : "No tags"}</p>

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

                        {entry.blockedUserEmails.includes(user.email) ? 
                         "Sorry, you have been banned from this SubGreddit"
                         :""}
                        
                        <p>                            
                            <Tooltip title="Open SubGreddiit"> 
                            <IconButton 
                                disabled={entry.blockedUserEmails.includes(user.email)}
                                style={{borderRadius: 0}}
                                onClick={openPage(entry.name)}
                            >
                                <OpenInNewIcon className='openIcon' 
                                    sx={{fontSize: 30, mx: '100px'}}
                                    />
                            </IconButton>
                            </Tooltip>

                            <Tooltip title="Leave SubGreddiit"> 
                            <IconButton 
                                disabled={isLeaveDisabled}
                                style={{borderRadius: 0}}
                                onClick={leavePage(entry.name)}
                            >
                                <CancelIcon className='deleteIcon' 
                                    sx={{fontSize: 30, mx: '100px'}}
                                    />
                            </IconButton>
                            </Tooltip>

                            <Tooltip title="Join Subgreddiit"> 
                            <IconButton 
                                disabled={isJoinDisabled}
                                style={{borderRadius: 0}}
                                onClick={joinPage(entry.name)}
                            >
                                <AddIcon className='openIcon' 
                                    sx={{fontSize: 30, mx: '100px'}}
                                    />
                            </IconButton>
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

    const leavePage = (name) => {
        return async function() {
            if (!window.confirm("Are you sure you want to leave? You won't be able to join again")){
                return;
            }
            console.log(name);

            fetch(`http://localhost:5000/block-user-subgreddiit/${name}/${user.email}`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                'Content-Type': 'application/json'
                }, 
                body: null
            })
            .then((result) => {
                const returnedStatus = result.status;
            
                console.log(`Returned status for leaving: ${returnedStatus}`);

                setChangeArray(curState => !curState);
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }

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

    const handleSearch = (event) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const submittedKeyword = data.get('searchKeyword').toLowerCase();

        if (submittedKeyword.length > 0 && submittedKeyword.charAt(0) === '~'){
            const fuzzyKeyword = submittedKeyword.slice(1);
            console.log(`Fuzzy Search on ${fuzzyKeyword}`);

            const searcher = new FuzzySearch(subgreddiitList, ['name'], {
                caseSensitive: false,
            });

            const result = searcher.search(fuzzyKeyword).sort(
                (entry1, entry2) => {
                    const in1 = entry1.userEmails.includes(user.email);
                    const in2 = entry2.userEmails.includes(user.email);

                    if (in1 && !in2){
                        return -1;
                    }

                    if (!in1 && in2){
                        return 1;
                    }

                    return 0;
                }
            );
            setCurrentSubgreddiitList(result);
        } else {
            console.log(`Normal Search on ${submittedKeyword}`);

            setCurrentSubgreddiitList(subgreddiitList.filter(
                entry => entry.name.toLowerCase().includes(submittedKeyword)
            ).sort(
                (entry1, entry2) => {
                    const in1 = entry1.userEmails.includes(user.email);
                    const in2 = entry2.userEmails.includes(user.email);

                    if (in1 && !in2){
                        return -1;
                    }

                    if (!in1 && in2){
                        return 1;
                    }

                    return 0;
                }
            ));
        }

        setChangeArray(curState => !curState);
    }

    const handleFilter = (event) => {
        event.preventDefault();

        console.log("Filter called");  
        
        const data = new FormData(event.currentTarget);
        const submittedFilters = {
            filterMinPostNumber: data.get('filterMinimumPosts'),
            filterMaxPostNumber: data.get('filterMaximumPosts'),
            filterMinUserNumber: data.get('filterMinimumUsers'),
            filterMaxUserNumber: data.get('filterMaximumUsers'),
            filterTags: data.get('filterTags').toLowerCase().length > 0 ? 
                data.get('filterTags').toLowerCase().split(',') : []
        }

        if (submittedFilters.filterMinPostNumber === ''){
            submittedFilters.filterMinPostNumber = 0;
        } else {
            submittedFilters.filterMinPostNumber = 
                Number(submittedFilters.filterMinPostNumber);
        }

        if (submittedFilters.filterMaxPostNumber === ''){
            submittedFilters.filterMaxPostNumber = Infinity;
        } else {
            submittedFilters.filterMaxPostNumber = 
                Number(submittedFilters.filterMaxPostNumber);
        }

        if (submittedFilters.filterMinUserNumber === ''){
            submittedFilters.filterMinUserNumber = 0;
        } else {
            submittedFilters.filterMinUserNumber = 
                Number(submittedFilters.filterMinUserNumber);
        }

        if (submittedFilters.filterMaxUserNumber === ''){
            submittedFilters.filterMaxUserNumber = Infinity;
        } else {
            submittedFilters.filterMaxUserNumber = 
                Number(submittedFilters.filterMaxUserNumber);
        }

        console.log(submittedFilters.filterTags);

        setCurrentSubgreddiitList(currentSUbgreddiitList.filter(
            entry => {
                const taggedWordResult = 
                    submittedFilters.filterTags.every(
                        val => 
                            entry.subgreddiitTags.includes(val)
                    );

                return entry.userEmails.length >= submittedFilters.filterMinUserNumber
                && entry.userEmails.length <= submittedFilters.filterMaxUserNumber
                && entry.postObjectIDs.length >= submittedFilters.filterMinPostNumber
                && entry.postObjectIDs.length <= submittedFilters.filterMaxPostNumber
                && (taggedWordResult);
            }
        ));

        setChangeArray(curState => !curState)
    }

    const [curSortingCriteria, setCurSortingCriteria] = React.useState([]);
    const handleSortingCriteria = (event, newCriteria) => {
        setCurSortingCriteria(newCriteria);
    }

    const handleSort = (event) => {
        event.preventDefault();

        console.log('Sorting called with criteria', curSortingCriteria);

        const alphaAscSort = (entry1, entry2) => {
            const name1 = entry1.name.toLowerCase();
            const name2 = entry2.name.toLowerCase();

            if (name1 < name2){
                return -1;
            }

            if (name1 > name2){
                return 1;
            }

            return 0;
        }


        const alphaDescSort = (entry1, entry2) => {
            const name1 = entry1.name.toLowerCase();
            const name2 = entry2.name.toLowerCase();

            if (name1 < name2){
                return 1;
            }

            if (name1 > name2){
                return -1;
            }

            return 0;
        }

        const followerSort = (entry1, entry2) => {
            const userNum1 = entry1.userEmails.length;
            const userNum2 = entry2.userEmails.length;

            if (userNum1 < userNum2){
                return 1;
            }

            if (userNum1 > userNum2){
                return -1;
            }

            return 0;
        }

        const dateSort = (entry1, entry2) => {
            const date1 = new Date( parseInt( 
                entry1.creationTimestamp, 16 ) * 1000 );
            const date2 = new Date( parseInt( 
                entry2.creationTimestamp, 16 ) * 1000 );

            if (date1 < date2){
                return 1;
            }

            if (date1 > date2){
                return -1;
            }

            return 0;
        }

        setCurrentSubgreddiitList(currentSUbgreddiitList.sort(
            (entry1, entry2) => {
                let cur_val = 0;

                for (const criteria of curSortingCriteria) {

                    if (criteria === 'alphaAscSort'){
                        cur_val = alphaAscSort(entry1, entry2);
                    } else if (criteria === 'alphaDescSort'){
                        cur_val = alphaDescSort(entry1, entry2);
                    } else if (criteria === 'followerSort'){
                        cur_val = followerSort(entry1, entry2);
                    } else if (criteria === 'dateSort'){
                        cur_val = dateSort(entry1, entry2);
                    }

                    if (cur_val != 0)
                        break;
                }

                return cur_val;
            }
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


                        <Box component="form" onSubmit={handleSearch} noValidate sx={{ mt: 1 }}>
                            <Typography component="h1" variant="h5"
                            sx={{
                                display:"flex",
                                justifyContent:'center'
                            }}>
                            Search and Filter
                            </Typography>

                            <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="searchKeyword"
                            label="Keyword"
                            name="searchKeyword"
                            helperText="Start with ~ for fuzzy search"
                            />

                            <Button
                            type="submit"
                            fullWidth
                            variant="outlined"
                            id = "searchButton"
                            sx={{ mt: 3, mb: 2 }}
                            >
                                Search
                            </Button>

                            </Box>
                            <Box component="form" onSubmit={handleFilter} noValidate sx={{ mt: 1 }}>
                            
                            <div className="filter-pane">
                            <TextField
                            margin="normal"
                            fullWidth
                            id="filterMinimumPosts"
                            label="Minimum Number of Posts"
                            name="filterMinimumPosts"
                            type="number"
                            />

                            <TextField
                            margin="normal"
                            fullWidth
                            id="filterMaximumPosts"
                            label="Maximum Number of Posts"
                            name="filterMaximumPosts"
                            type="number"
                            />

                            <TextField
                            margin="normal"
                            fullWidth
                            id="filterMinimumUsers"
                            label="Minimum Number of Users"
                            name="filterMinimumUsers"
                            type="number"
                            />

                            <TextField
                            margin="normal"
                            fullWidth
                            id="filterMaximumUsers"
                            label="Maximum Number of Users"
                            name="filterMaximumUsers"
                            type="number"
                            />
                            </div>

                            
                            <TextField
                            margin="normal"
                            fullWidth
                            id="filterTags"
                            label="SubGreddiit Tags"
                            name="filterTags"
                            helperText="Without spaces"
                            />

                            <Typography component="h1"
                            sx={{
                                display:"flex",
                                justifyContent:'center'
                            }}>
                            (Leave field blank if not used - input blank for all SubGreddiits)
                            </Typography>

                            <Button
                            type="submit"
                            fullWidth
                            variant="outlined"
                            id = "filterButton"
                            sx={{ mt: 3, mb: 2 }}
                            >
                                Filter searched data
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

                        <Box component="form" onSubmit={handleSort} noValidate sx={{ mt: 1 }}>

                            <ToggleButtonGroup
                                color="primary"
                                value={curSortingCriteria}
                                onChange={handleSortingCriteria}
                            >
                                <ToggleButton value="alphaAscSort">Alphabetical (ascending)</ToggleButton>
                                <ToggleButton value="alphaDescSort">Alphabetical (descending)</ToggleButton>
                                <ToggleButton value="followerSort">Follower Count</ToggleButton>
                                <ToggleButton value="dateSort">Creation Date</ToggleButton>
                            </ToggleButtonGroup>


                            <Button
                            type="submit"
                            fullWidth
                            variant="outlined"
                            id = "sortButton"
                            sx={{ mt: 3, mb: 2 }}
                            >
                                Sort filtered data
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