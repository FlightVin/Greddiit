import './SubgreddiitUsers.css'
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useCallback } from 'react';
import * as React from 'react';


const SubGreddiitUsers = () => {
    // for page
    const {name} = useParams();
    const [userList, setUserList] = React.useState([]);
    const [blockedList, setBlockedList] = React.useState([]);
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
        document.title = `Greddiit | ${name} | Users`;
    }, [name]);

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
                            setUserList(body.userEmails);
                            setBlockedList(body.blockedUserEmails);
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
    }, [user.email, name]);

    const renderJoinRequests = () => {
        var returnval = [];

        userList.forEach(entry => {

            returnval.push(
                <div className="userlist-pane">
                    <p className='userlist-para'>
                        <span style={{fontWeight:'bold'}}>User: </span>
                        {entry}
                    </p>
                </div>
            )
        })

        blockedList.forEach(entry => {

            returnval.push(
                <div className="blockedList-pane">
                    <p className='userlist-para'>
                        <span style={{fontWeight:'bold'}}>User: </span>
                        <span style={{}}>{entry}</span>
                    </p>
                </div>
            )
        })

        return returnval;
    }

    return (
        <div className="mypage">
            <div className="list-subgreddiit">
                <div className="list-header">
                    <h2>Existing Users</h2>
                </div>
                <div className="subgreddiit-panes">
                    {renderJoinRequests()}
                </div>
            </div>
        </div>
    );
}

export default SubGreddiitUsers;