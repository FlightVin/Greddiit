import './JoinRequests.css'
import { useParams } from "react-router-dom";
import { useEffect } from 'react';
import * as React from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import { Tooltip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';


const JoinRequests = () => {
    const {name} = useParams();
    const [joinList, setJoinList] = React.useState([]);
    const [changeArray, setChangeArray] = React.useState(false);
    const user = JSON.parse(localStorage.getItem('grediit-user-details'));

    useEffect(() => {
        document.title = `Greddiit | ${name} | Join Requests`;
    }, []);

    useEffect(() => {
        // getting initial data
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
    }, [changeArray, user.email]);

    const rejectJoin = (joineeEmail) => {
        return async function() {
            fetch(`http://localhost:5000/reject-user-subgreddiit/${name}/${joineeEmail}`, {
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

            fetch(`http://localhost:5000/accept-user-subgreddiit/${name}/${joineeEmail}`, {
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
                    </p>
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