import './Stats.css'
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useCallback } from 'react';
import * as React from 'react';

const Stats = () => {
    // for page
    const {name} = useParams();
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

    return (
        <div>
            {user.email}
        </div>
    );
}
 
export default Stats;