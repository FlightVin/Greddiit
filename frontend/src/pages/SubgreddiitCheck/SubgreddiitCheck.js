import { Navigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import baseURL from "../Base"


const MySubgreddiitCheck = ({children}) => {
    const { name } = useParams();
    console.log(`currently at ${name}`);

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
                
                fetch(`${baseURL}/subgreddiit-auth/${name}/${user.email}`, {
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
        }, 2000);
    }, [userToken, name, user]);


    if (isLoading) {
        return (
            <Loading />
        );
    }

    if (isValid){
        let returnVal = [];
        React.Children.forEach(children, child => {
            returnVal.push(React.cloneElement(child, { state: {mypageValidation: user.email} }));
        })
        return returnVal;
    } else {
        return <Navigate to="/404" replace />;
    }

}

const SubgreddiitCheck = ({children}) => {
    const { name } = useParams();
    console.log(`currently at ${name}`);

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

                fetch(`${baseURL}/subgreddiit-exists/${name}`, {
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
        }, 2000);
    }, [userToken, name, user]);


    if (isLoading) {
        return (
            <Loading />
        );
    }

    if (isValid){
        return children;
    } else {
        return <Navigate to="/404" replace />;
    }

}
 
export {MySubgreddiitCheck, SubgreddiitCheck};