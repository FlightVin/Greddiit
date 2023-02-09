import './AllPages.css'
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
import AddIcon from '@mui/icons-material/Add';

const AllPages = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('grediit-user-details'));
    const theme = createTheme();

    useEffect(() => {
        document.title = 'Greddiit | All Pages';
    }, []);

    const [subgreddiitList, setSubgreddiitList] = React.useState([]);
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
            return "No Subgreddiits";
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

    return (
        <div className="allpages">

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