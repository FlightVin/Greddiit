import * as React from 'react';
import './SavedPosts.css'
import { useEffect } from 'react';
import Loading from '../Loading/Loading';
import Typography from '@mui/material/Typography';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';
import baseURL from "../Base"


const SavedPosts = () => {
    const user = JSON.parse(localStorage.getItem('grediit-user-details'));
    const [curPage, setCurPage] = React.useState();
    const [isLoading, setLoading] = React.useState(true);
    const [postList, setPostList] = React.useState([]);
    const [changeArray, setChangeArray] = React.useState(true);
    const [arePostsRendered, setArePostsRendered] = React.useState(false);
    const [upvoteArray, setUpvoteArray] = React.useState();
    const [downvoteArray, setDownvoteArray] = React.useState();
    const [savedByArray, setSavedByArray] = React.useState();
    const [followingArray, setFollowingArray] = React.useState();

    useEffect(() => {
        document.title = `Greddiit | Saved Posts`;
    }, []);

    useEffect(() => {
        // getting initial data
        setTimeout(() => {
            const initRender = async () => {
                fetch(`${baseURL}/access-saved-posts/${user.email}`, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                      'Content-Type': 'application/json'
                    }, 
                    body: null
                })
                .then((result) => {

                    // first getting following array
                    fetch(`${baseURL}/access-followers/${user.email}`, {
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
                                    console.log(body);

                                    setFollowingArray([]);
                                    body.following.forEach(entry => {
                                        setFollowingArray(oldArray => [...oldArray, entry.followingEmail]);
                                    });  
                                    
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                
                        } else {
                            console.log("Initial fetch failed");
                        }
                    })

                    const returnedStatus = result.status;
    
                    if (returnedStatus === 200){
            
                        result.json()
                            .then((body) => {
                                console.log(body);
                                setCurPage(body);

                                var resultArray = [];
                                var curUpvoteArray = [];
                                var curDownvoteArray = [];
                                var curSavedByArray = [];

                                body.forEach(
                                        entry =>{
                                            const postID = entry._id;

                                            fetch(`${baseURL}/access-post/${postID}`, {
                                                method: 'POST',
                                                mode: 'cors',
                                                headers: {
                                                  'Content-Type': 'application/json'
                                                }, 
                                                body: null
                                            })
                                            .then((postResult) => {
                                                const postStatus = postResult.status;

                                                if (postStatus === 200){
                                                    postResult.json()
                                                        .then(postBody => {
                                                            postBody.creationTimestamp = 
                                                                postID.toString().substring(0,8);

                                                            postBody.isUpvoted = 
                                                                postBody[0].upvotedBy.includes
                                                                    (user.email);

                                                            postBody.isSaved = 
                                                                postBody[0].savedBy.includes
                                                                    (user.email);

                                                            postBody.isDownvoted = 
                                                                postBody[0].downvotedBy.includes
                                                                    (user.email);

                                                            postBody.upvoteCount = 
                                                                postBody[0].upvotedBy.length - postBody.isUpvoted;

                                                            postBody.downvoteCount = 
                                                                postBody[0].downvotedBy.length - postBody.isDownvoted;

                                                            if (postBody.isUpvoted)
                                                            {
                                                                curUpvoteArray.push(postID)
                                                            }

                                                            if (postBody.isDownvoted)
                                                            {
                                                                curDownvoteArray.push(postID);
                                                            }

                                                            if (postBody.isSaved){
                                                                curSavedByArray.push(postID);
                                                            }

                                                            resultArray.push(
                                                                postBody
                                                            );
                                                        })
                                                }
                                            })

                                        }
                                    )
                                
                                setDownvoteArray(curDownvoteArray);
                                setSavedByArray(curSavedByArray);
                                setUpvoteArray(curUpvoteArray);
                                setPostList(resultArray);

                                console.log("Loaded page");
                                setLoading(false);
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
        }, 2000);
    }, [changeArray, user.email]);

    if (isLoading) {
        return (
            <Loading />
        );
    }

    const dateSort = (entry1, entry2) => {
        console.log('current page', curPage);
        const date1 = new Date( parseInt( 
            entry1.creationTimestamp, 16 ) * 1000 );
        const date2 = new Date( parseInt( 
            entry2.creationTimestamp, 16 ) * 1000 );

        if (date1 < date2){
            return 1;
        }

        if (date1 > date2){
            return -1;
        }

        return 0;
    }

    const toggleShowPosts = () => {
        setArePostsRendered(curState => !curState);
    }

    const upvoteFunction = (postID) => {
        return async function() {
            console.log(postID);
            if (upvoteArray.includes(postID)){
                setUpvoteArray(curArray => curArray.filter(
                    ele => ele!==postID
                ));
            } else {
                setUpvoteArray(curArray => [...curArray, postID]);
            }

            fetch(`${baseURL}/toggle-upvote/${postID}/${user.email}`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json'
                }, 
                body: null
              })
              .then((result) => {
                  console.log(result);
      
                  const returnedStatus = result.status;
            
                  console.log(returnedStatus);
      
                  if (returnedStatus === 200){
                      console.log("upvote processed");
                  } else {
                      alert("Error: Reload page and try again");
                  }
      
              })
              .catch((err) => {
                  console.log(`Couldn't sign up with error ${err}`);
              })
        }
    }

    const downvoteFunction = (postID) => {
        return async function() {
            console.log(postID);
            if (downvoteArray.includes(postID)){
                setDownvoteArray(curArray => curArray.filter(
                    ele => ele!==postID
                ));
            } else {
                setDownvoteArray(curArray => [...curArray, postID]);
            }

            fetch(`${baseURL}/toggle-downvote/${postID}/${user.email}`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json'
                }, 
                body: null
              })
              .then((result) => {
                  console.log(result);
      
                  const returnedStatus = result.status;
            
                  console.log(returnedStatus);
      
                  if (returnedStatus === 200){
                      console.log("downvote processed");
                  } else {
                      alert("Error: Reload page and try again");
                  }
      
              })
              .catch((err) => {
                  console.log(`Couldn't sign up with error ${err}`);
              })
        }
    }

    const saveFunction = (postID) => {
        return async function() {
            console.log(postID);
            if (savedByArray.includes(postID)){
                setSavedByArray(curArray => curArray.filter(
                    ele => ele!==postID
                ));
            } else {
                setSavedByArray(curArray => [...curArray, postID]);
            }

            fetch(`${baseURL}/toggle-save/${postID}/${user.email}`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json'
                }, 
                body: null
              })
              .then((result) => {
                  console.log(result);
      
                  const returnedStatus = result.status;
            
                  console.log(returnedStatus);
      
                  if (returnedStatus === 200){
                      console.log("save processed");
                  } else {
                      alert("Error: Reload page and try again");
                  }
      
                  setChangeArray(curState => !curState);
              })
              .catch((err) => {
                  console.log(`Couldn't sign up with error ${err}`);
              })
        }
    }

    const followFunction = (curEmail) => {
        return async function() {
            console.log(curEmail);

            if (followingArray.includes(curEmail)){
                setFollowingArray(curArray => curArray.filter(
                    ele => ele!==curEmail
                ));
            } else {
                setFollowingArray(curArray => [...curArray, curEmail]);                
            }

            fetch(`${baseURL}/toggle-follower/${user.email}/${curEmail}`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json'
                }, 
                body: null
              })
              .then((result) => {
                  console.log(result);
      
                  const returnedStatus = result.status;
            
                  console.log(returnedStatus);
      
                  if (returnedStatus === 200){
                      console.log("follow processed");
                  } else {
                      alert("Error: Reload page and try again");
                  }
      
              })
              .catch((err) => {
                  console.log(`Couldn't sign up with error ${err}`);
              })
        }
    }

    const renderPosts = () => {
        console.log("Rendering posts");

        if (postList?.length > 0){

            postList.sort((entry1, entry2) => dateSort(entry1, entry2));

            var returnval = [];
            postList?.forEach(entry => {

                const renderUpvoteIcon = () => {
                    if (upvoteArray?.includes(entry[0]._id)) {
                        return <ThumbUpIcon onClick={upvoteFunction(entry[0]._id)}></ThumbUpIcon>
                    } else {
                        return <ThumbUpOffAltIcon onClick={upvoteFunction(entry[0]._id)}></ThumbUpOffAltIcon>
                    }
                }

                const renderDownvoteIcon = () => {
                    if (downvoteArray?.includes(entry[0]._id)) {
                        return <ThumbDownIcon onClick={downvoteFunction(entry[0]._id)}></ThumbDownIcon>
                    } else {
                        return <ThumbDownOffAltIcon onClick={downvoteFunction(entry[0]._id)}></ThumbDownOffAltIcon>
                    }
                }

                const renderSaveIcon = () => {
                    if (savedByArray?.includes(entry[0]._id)) {
                        return <BookmarkIcon onClick={saveFunction(entry[0]._id)}></BookmarkIcon>
                    } else {
                        return <BookmarkBorderIcon onClick={saveFunction(entry[0]._id)}></BookmarkBorderIcon>
                    }
                }

                const renderFollow = () => {
                    if (entry[0].posterEmail === user.email)
                        return "";

                    if (!followingArray?.includes(entry[0].posterEmail)) {
                        return <PersonAddIcon onClick={followFunction(entry[0].posterEmail)}></PersonAddIcon>
                    } else {
                        return <PersonAddDisabledIcon onClick={followFunction(entry[0].posterEmail)}></PersonAddDisabledIcon>
                    }
                }

                returnval.push(
                    <div className="saved-single-post-pane">

                        <p>
                            {entry[0].text}
                        </p>

                        <div className="saved-horizontal-line-divider">

                        </div>

                        <div className="saved-posted-by-pane">
                            <div>Posted by: {entry[0].posterEmail}</div>
                            <div>Posted in: {entry[0].subgreddiitName}</div>
                            <div>Upvotes: {entry.upvoteCount + upvoteArray?.includes(entry[0]._id)} </div>
                            <div>Downvotes: {entry.downvoteCount + downvoteArray?.includes(entry[0]._id)}</div>
                        </div>

                        <div className="saved-horizontal-line-divider">

                        </div>

                        <div className="saved-icons-pane">
                            {
                                renderUpvoteIcon()
                            }
                            {
                                renderDownvoteIcon()
                            }
                            {
                                renderSaveIcon()
                            }
                            {
                                renderFollow()
                            }
                        </div>

                    </div>
                )
            })

            return returnval;
        } else {
            return "No posts";
        }
    }

    return (
        <div className="saved-page">

            <div className="saved-post-pane">
                    <div className="saved-list-posts">
                        <div className="saved-list-header">
                        <Typography component="h1" variant="h5" onClick={toggleShowPosts}
                            id="createPageToggling">
                            Show Saved Posts
                        </Typography>
                        </div>
                        <div className="saved-post-div">
                            {arePostsRendered ? renderPosts() : ""}
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default SavedPosts;