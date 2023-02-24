import * as React from 'react';
import './Reported.css'
import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Loading from '../Loading/Loading';
import Button from '@mui/material/Button';
import baseURL from "../Base"

const Reported = () => {
    const {name} = useParams();
    const user = JSON.parse(localStorage.getItem('grediit-user-details'));
    // list that stores reports
    const [reportList, setReportList] = React.useState([]);
    // to wait while loading reports
    const [isLoading, setLoading] = React.useState(true);
    // basic page data
    const [curPage, setCurPage] = React.useState();
    // timer
    const [blockTimers, setBlockTimers] = React.useState();
    const [timeLeft, setTimeLeft] = React.useState();

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
        document.title = `Greddiit | ${name} | Reported`;
    }, [name]);

    useEffect(() => {
        setTimeout(() => {
            const initRender = async () => {
                fetch(`${baseURL}/access-reports/${name}`, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                    'Content-Type': 'application/json'
                    }, 
                    body: null
                })
                .then((result) => {
                    // retrieving basic page details as well
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
    
                                setCurPage(body);
                            });
                        }
                    });

                    // accessing the reports
                    const returnedStatus = result.status;
                    if (returnedStatus === 200){
                        result.json()
                            .then( body => {
                                var curArray = [...body];
                                var curCountdowns = [];
                                var curTimes = [];

                                if (curArray.length > 0){
                                    for (let i = 0; i<curArray.length; i++){

                                        const curPostID = curArray[i].postID;

                                        fetch(`${baseURL}/access-post/${curPostID}`, {
                                            method: 'POST',
                                            mode: 'cors',
                                            headers: {
                                            'Content-Type': 'application/json'
                                            }, 
                                            body: null
                                        })
                                        .then(result => {
                                            result.json()
                                            .then(body => {
                                                // attaching post body
                                                curArray[i].postBody = body[0];
                                                
                                                // attaching timer for deletion
                                                curCountdowns.push(
                                                    {
                                                        '_id': curArray[i]._id,
                                                        'timer': null,
                                                    },
                                                );

                                                curTimes.push(
                                                    {
                                                        '_id': curArray[i]._id,
                                                        'timeLeft': null,
                                                    },
                                                );

                                                if (i + 1 === curArray.length){
                                                    console.log(curArray);
                                                    setReportList(curArray);
                                                    setBlockTimers(curCountdowns);
                                                    setTimeLeft(curTimes);
                                                    setTimeout(() => {
                                                        setLoading(false);
                                                    }, 1000);                                                    
                                                }
                                            })
                                        })
                                    }
                                } else {
                                    setReportList(curArray);
                                    setBlockTimers(curCountdowns);
                                    setTimeLeft(curTimes);
                                    setLoading(false);
                                }
                            });
                    } else {
                        alert("Something went wrong :(")
                        console.log(`Got ${returnedStatus} for retrieving reports`);
                    }
                });
            }

            initRender();



        }, 2000);
    }, [name, user.email]);

    if (isLoading) {
        return (
            <Loading />
        );
    }

    // ignore functionality
    const ignoreReport = (reportID) => {
        return async function() {
            console.log(`Called ignore for ID ${reportID}`);

            var curArray = [...reportList];
            for (let i = 0; i<curArray.length; i++){
                if (curArray[i]._id === reportID){
                    curArray[i].isIgnored = !curArray[i].isIgnored;

                    // making changes to backend
                    fetch(`${baseURL}/toggle-report-ignore/${reportID}`, {
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                        'Content-Type': 'application/json'
                        }, 
                        body: null
                    })
                    .then(result => {
                        const returnedStatus = result.status;

                        if (returnedStatus === 200){
                            console.log("Toggled ignore");
                        } else {
                            console.log("Could't toggle ignore");
                            alert("Something went wrong");
                        }
                    })
                }
            }

            // making changes in frontend
            setReportList(curArray);
        }
    }

    const blockUser = (reportID) => {
        for (let i = 0; i<reportList.length; i++){
            if (reportList[i]._id === reportID){
                console.log(`Blocking user ${reportList[i].postBody.posterEmail}`);

                // making changes in frontend
                var currentPage = curPage;
                currentPage.blockedUserEmails.push(reportList[i].postBody.posterEmail);
                setCurPage(currentPage);

                // making changes in backend
                fetch(`${baseURL}/block-user-subgreddiit/${name}/${reportList[i].postBody.posterEmail}`, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                    'Content-Type': 'application/json'
                    }, 
                    body: null
                })
                .then(result => {
                    const returnedStatus = result.status;

                    if (returnedStatus === 200){
                        console.log("User blocked");
                    } else {
                        console.log("Could't toggle ignore");
                        alert("Something went wrong");
                    }
                })
            }
        }
    }

    // block user 
    function RenderBlock(reportID) {

        var ele = null;
        for (let i = 0; i<reportList.length; i++){
            if (reportList[i]._id === reportID){
                ele = reportList[i];
            }
        }

        if (!ele){
            alert("Something went wrong");
            console.log(`Couldn't access data for report ${reportID} while rendering block button`);
            return;
        }

        const getTimer = (reportID) => {
            for (let i = 0; i<blockTimers.length; i++){
                if (blockTimers[i]._id === reportID){
                    return blockTimers[i].timer;
                }
            }
        }

        const setTimer = (reportID, val) => {
            var curTimers = [...blockTimers];
            for (let i = 0; i<curTimers.length; i++){
                if (curTimers[i]._id === reportID){
                    curTimers[i].timer = val;
                }
            }
            setBlockTimers(curTimers);
        }

        const removeTimer = (reportID, val) => {
            var curTimers = [...blockTimers];
            for (let i = 0; i<curTimers.length; i++){
                if (curTimers[i]._id === reportID){
                    clearInterval(curTimers[i].timer);
                    curTimers[i].timer = null;
                }
            }
            setBlockTimers(curTimers);
        }

        const getTimeLeft = (reportID) => {
            for (let i = 0; i<timeLeft.length; i++){
                if (timeLeft[i]._id === reportID){
                    return timeLeft[i].timeLeft;
                }
            }
        }

        const funcSetTimeLeft = (reportID, val) => {
            var curTimeLeft = [...timeLeft];
            for (let i = 0; i<curTimeLeft.length; i++){
                if (curTimeLeft[i]._id === reportID){
                    curTimeLeft[i].timeLeft = val;
                }
            }
            setTimeLeft(curTimeLeft);
        }

        const decrementTimer = () => {
            if (getTimeLeft(reportID) > 1){
                funcSetTimeLeft(reportID, 
                    getTimeLeft(reportID) - 1)
            } else {
                blockUser(reportID);
                removeTimer(reportID);
            }
        }

        const initiateBlock = () => {
            console.log(`Initiate block for ${reportID}`);

            // updating timers
            setTimer(reportID, window.setInterval(decrementTimer, 1000));

            // updating time left
            funcSetTimeLeft(reportID, 3);
        }

        const cancelBlock = () => {
            console.log(`Cancelled block for ${reportID}`);

            // updating timers
            removeTimer(reportID);
        }

        return (
            curPage.blockedUserEmails.includes(ele.postBody.posterEmail)?
            <Button disabled>
                User is blocked
            </Button>
        :
            ele.isIgnored ? 
                <Button disabled>
                    Block User
                </Button>
            :
                getTimer(reportID) ?
                    <Button onClick={cancelBlock}>
                        Cancel In {getTimeLeft(reportID)} secs
                    </Button>
                :
                    <Button onClick={initiateBlock}>
                        Block User
                    </Button>
        )
    }

    // delete post
    const deleteReport = (reportID) => {
        return async function() {
            console.log(`Called delete for ID ${reportID}`);

            var postID = null;
            for (let i = 0; i<reportList.length; i++){
                if (reportList[i]._id === reportID){
                    postID = reportList[i].postBody._id;
                }
            }
    
            if (!postID){
                alert("Something went wrong");
                console.log(`Couldn't access data for report ${reportID} while rendering block button`);
                return;
            }

            var curArray = reportList.filter(ele => {
                return ele.postBody._id !== postID
            });

            // making changes in backend
            fetch(`${baseURL}/delete-post/${postID}`, {
                method: 'DELETE',
                mode: 'cors',
                headers: {
                'Content-Type': 'application/json'
                }, 
                body: null
            })
            .then(result => {
                const returnedStatus = result.status;

                if (returnedStatus === 200){
                    console.log("Deleted post");
                } else {
                    console.log("Couldn't delete post");
                    alert("Something went wrong");
                }
            })

            // making changes in frontend
            setReportList(curArray);
        }
    }

    // rendering reports
    const renderReports = () => {
        if(reportList.length > 0){
            
            var returnVal = [];

            reportList.forEach(ele => {
                
                returnVal.push(
                    <div className="saved-single-post-pane">

                        <p>
                            {ele.postBody.text}
                        </p>

                        <div className="saved-horizontal-line-divider">

                        </div>

                        <div className="saved-posted-by-pane">
                            <div>Posted by: {ele.postBody.posterEmail}</div>
                            <div>Posted in: {ele.postBody.subgreddiitName}</div>
                            <div>Reported by: {ele.reporterEmail}</div>
                        </div>

                        <div className="saved-horizontal-line-divider">

                        </div>

                        <p>
                            Concern: {ele.text}
                        </p>

                        <div className="saved-horizontal-line-divider">

                        </div>

                        <div className="saved-posted-by-pane">
                            <div>
                                {ele.isIgnored ? 
                                    <Button onClick={ignoreReport(ele._id)}>
                                        Consider
                                    </Button>
                                :
                                    <Button onClick={ignoreReport(ele._id)}>
                                        Ignore
                                    </Button>
                                }

                            </div>

                            <div>
                                {
                                    RenderBlock(ele._id)
                                }
                            </div>

                            <div>
                                {ele.isIgnored ? 
                                    <Button disabled>
                                        Delete Post
                                    </Button>
                                :
                                    <Button onClick={deleteReport(ele._id)}>
                                        Delete Post
                                    </Button>
                                }
                            </div>
                        </div>                        
                    </div>
                )

            });

            return returnVal;

        } else {
            return "No reports"
        }
    }

    return (
        <div className="reported-page">
            {renderReports()}
        </div>
    )
}

export default Reported;