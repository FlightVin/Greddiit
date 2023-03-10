import { Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import baseURL from "../Base"


const Protected = ({children}) => {

    const [isLoading, setLoading] = useState(true);
    const [isValid, setIsValid] = useState(false);

    const user = JSON.parse(localStorage.getItem('grediit-user-details'));
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

                try{
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

                        let emailValid = false;

                        if (returnedStatus === 200){
                            result.json()
                                .then((body) => {
                                    if (user && user.email && body.email === user.email)
                                        emailValid = true;

                                    if (returnedStatus === 200 && emailValid){
                                        setIsValid(true);
                                        setLoading(false);
                                    } else {
                                        setIsValid(false);
                                        setLoading(false); 
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        } else {
                            setIsValid(false);
                            setLoading(false); 
                        }
                    });
                } catch {
                    setIsValid(false);
                    setLoading(false);
                }
            }
        }, 1000);
    }, [userToken, user]);


    if (isLoading) {
        return (
            <Loading />
        );
    }

    if (isValid){
        return children;
    } else {
        return <Navigate to="/login" replace />;
    }

}
 
export default Protected;