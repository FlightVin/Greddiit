import * as React from 'react';
import './Reported.css'
import { useEffect } from 'react';
import { useParams } from "react-router-dom";
import Loading from '../Loading/Loading';
import Button from '@mui/material/Button';

const Reported = () => {
    const {name} = useParams();
    const user = JSON.parse(localStorage.getItem('grediit-user-details'));
    // list that stores reports
    const [reportList, setReportList] = React.useState([]);
    // to wait while loading reports
    const [isLoading, setLoading] = React.useState(true);
    // basic page data
    const [curPage, setCurPage] = React.useState();
    // delay for block
    const blockDelayTime = 3;
    const [blockInterval, setBlockInterval] = React.useState();
    // timer
    const [blockCallTime, setBlockCallTime] = React.useState();
    

    useEffect(() => {
        document.title = `Greddiit | ${name} | Reported`;
    }, [name]);

    useEffect(() => {
        setTimeout(() => {
            const initRender = async () => {
                fetch(`http://localhost:5000/access-reports/${name}`, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                    'Content-Type': 'application/json'
                    }, 
                    body: null
                })
                .then((result) => {
                    // retrieving basic page details as well
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

                                if (curArray.length > 0){
                                    for (let i = 0; i<curArray.length; i++){

                                        const curPostID = curArray[i].postID;

                                        fetch(`http://localhost:5000/access-post/${curPostID}`, {
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
                                                curArray[i].goingToBeDeleted = false;
                                                curArray[i].deletedInTime = 0;

                                                if (i + 1 === curArray.length){
                                                    console.log(curArray);
                                                    setReportList(curArray);

                                                    setTimeout(() => {
                                                        setLoading(false);
                                                    }, 1000);
                                                    
                                                }
                                            })
                                        })
                                    }
                                } else {
                                    setReportList(curArray);
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
                    fetch(`http://localhost:5000/toggle-report-ignore/${reportID}`, {
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

    // block user 
    const initiateBlock = (reportID) => {
        return async function() {
            console.log(`Initiated block user for ID ${reportID}`);
        
            var curArray = [...reportList];
            for (let i = 0; i<curArray.length; i++){
                if (curArray[i]._id === reportID){
                    curArray[i].goingToBeDeleted = true;

                    curArray[i].deletedInTime = blockDelayTime;
                    setBlockCallTime(blockDelayTime);
                    console.log('Block delay time', blockCallTime);

                    const curInterval = setInterval(() => {
                        console.log(blockCallTime);
                    }, 1000);
                }
            }

            // making changes in frontend
            setReportList(curArray);
        }
    }

    // cancel block
    const cancelBlock = (reportID) => {
        return async function() {
            console.log(`Cancel block user for ID ${reportID}`);
        
            var curArray = [...reportList];
            for (let i = 0; i<curArray.length; i++){
                if (curArray[i]._id === reportID){
                    curArray[i].goingToBeDeleted = false;
                }
            }

            // making changes in frontend
            setReportList(curArray);
        }
    }

    // delete report
    const deleteReport = (reportID) => {
        return async function() {
            console.log(`Called delete for ID ${reportID}`);

            var curArray = reportList.filter(ele => {
                return ele._id !== reportID
            });

            // making changes in backend
            fetch(`http://localhost:5000/delete-report/${reportID}`, {
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
                    console.log("Deleted report");
                } else {
                    console.log("Couldn't delete ignore");
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
                                        ele.goingToBeDeleted ?
                                            <Button onClick={cancelBlock(ele._id)}>
                                                Cancel In {ele.deletedInTime} secs
                                            </Button>
                                        :
                                            <Button onClick={initiateBlock(ele._id)}>
                                                Block User
                                            </Button>
                                }
                            </div>

                            <div>
                                {ele.isIgnored ? 
                                    <Button disabled>
                                        Delete
                                    </Button>
                                :
                                    <Button onClick={deleteReport(ele._id)}>
                                        Delete
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