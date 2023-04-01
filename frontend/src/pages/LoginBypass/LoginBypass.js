import { Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import baseURL from "../Base"

const Protected = ({children}) => {

    const [isLoading, setLoading] = useState(true);
    const [isValid, setIsValid] = useState(false);

    const userToken = localStorage.getItem('grediit-user-token');
    console.log(userToken);

    useEffect(() => {
        setTimeout(() => {
            if (!userToken){
                setLoading(false);
                setIsValid(false);
            } else {

                const tokenObject = {
                    token: userToken
                }
                
                const JSONData = JSON.stringify(tokenObject);
                console.log(JSONData);

                fetch(`${baseURL}/auth`, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                      'Content-Type': 'application/json'
                    }, 
                    body: JSONData
                  })
                  .then((result) => {
                    const returnedStatus = result.status;

                    console.log(`Returned status: ${returnedStatus}`);

                    if (returnedStatus === 200){
                        setIsValid(true);
                        setLoading(false);
                    } else {
                        setIsValid(false);
                        setLoading(false); 
                    }
                  });
            }
        }, 1000);
    }, [userToken]);


    if (isLoading) {
        return (
            <Loading />
        );
    }

    if (isValid){
        return <Navigate to="/profile" replace />;
    } else {
        return children;
    }

}
 
export default Protected;