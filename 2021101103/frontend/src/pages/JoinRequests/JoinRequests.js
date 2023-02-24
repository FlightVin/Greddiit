import './JoinRequests.css'
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useCallback } from 'react';
import * as React from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import { Tooltip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import baseURL from "../Base"


const JoinRequests = () => {
    const {name} = useParams();
    const [joinList, setJoinList] = React.useState([]);
    const [changeArray, setChangeArray] = React.useState(false);
    const user = JSON.parse(localStorage.getItem('grediit-user-details'));

    // short cut keys
    const navigate = useNavigate();

    const handleKeyPress = useCallback((event) => {
        if (event.altKey === true){
            console.log(`Alt + ${event.key}`);

            if (event.key === 'u'){
                navigate(`/mysubgreddiit/${name}/users`);
            } else if (event.key === 'j'){
                navigate(`/mysubgreddiit/${name}/join-requests`);
            } else if (event.key === 's'){
                navigate(`/mysubgreddiit/${name}/stats`);
            } else if (event.key === 'r'){
                navigate(`/mysubgreddiit/${name}/reported`);
            }
        }
    }, [name, navigate]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    useEffect(() => {
        document.title = `Greddiit | ${name} | Join Requests`;
    }, [name]);

    useEffect(() => {
        // getting initial data
        const initRender = async () => {
            fetch(`${baseURL}/subgreddiit-exists/${name}`, {
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
                            setJoinList(body.joinRequestEmails)
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
    }, [changeArray, user.email, name]);

    const rejectJoin = (joineeEmail) => {
        return async function() {
            fetch(`${baseURL}/reject-user-subgreddiit/${name}/${joineeEmail}`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json'
                }, 
                body: null
            })
            .then((result) => {
                const returnedStatus = result.status;

                console.log(`Rejecting user return status: ${returnedStatus}`);

                if (returnedStatus === 200){
        
                    console.log("Added");
        
                } else {
                    console.log("Error");
                }

                setChangeArray(curState => !curState);
            })
        }
    }

    const acceptJoin = (joineeEmail) => {
        return async function() {

            fetch(`${baseURL}/accept-user-subgreddiit/${name}/${joineeEmail}`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json'
                }, 
                body: null
            })
            .then((result) => {
                const returnedStatus = result.status;

                console.log(`Accepting user return status: ${returnedStatus}`);

                if (returnedStatus === 200){
        
                    console.log("Added");
        
                } else {
                    console.log("Error");
                }

                setChangeArray(curState => !curState);
            })
        }
    }


    const renderJoinRequests = () => {
       if (joinList.length > 0){
        var returnval = [];

        joinList.forEach(entry => {

            returnval.push(
                <div className="joinlist-pane">
                    <p className='joinlist-para'>
                        <span style={{fontWeight:'bold'}}>User: </span>
                        {entry}
                    </p>
                    
                    <div>
                    <Tooltip title="Reject"> 
                                <ClearIcon className='deleteIcon' 
                                    sx={{fontSize: 20}}
                                    onClick={rejectJoin(entry)}/>
                    </Tooltip>

                    <Tooltip title="Accept"> 
                                <CheckIcon className='openIcon' 
                                    sx={{fontSize: 20}}
                                    onClick={acceptJoin(entry)}/>
                    </Tooltip>
                    </div>
                </div>
            )
        })

        return returnval;
       } else {
            return "No requests";
       }
    }

    return (
        <div className="mypage">
            <div className="list-subgreddiit">
                <div className="list-header">
                    <h2>Join Requests</h2>
                </div>
                <div className="subgreddiit-panes">
                    {renderJoinRequests()}
                </div>
            </div>
        </div>
    );
}

export default JoinRequests;