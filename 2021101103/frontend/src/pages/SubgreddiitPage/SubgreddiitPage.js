import './SubgreddiitPage.css'
import * as React from 'react';
import { useParams } from "react-router-dom";
import { useEffect } from 'react';
import Loading from '../Loading/Loading';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';
import IconButton from '@mui/material/IconButton';
import FlagIcon from '@mui/icons-material/Flag';

const SubgreddiitPage = () => {
    const {name} = useParams();
    const user = JSON.parse(localStorage.getItem('grediit-user-details'));
    const theme = createTheme();
    // for rendering post creation form
    const [renderPostForm, setRenderPostForm] = React.useState(false);
    const [postCreationButtonDisabled, setPostCreationButtonDisabled]
        = React.useState(true);
    const [createPostHelperText,setCreatePageHelperText]
        = React.useState('');
    // for loading
    const [isLoading, setLoading] = React.useState(true);
    // basic page data
    const [curPage, setCurPage] = React.useState();
    // posts
    const [postList, setPostList] = React.useState([]);
    // data needed in each post
    const [upvoteArray, setUpvoteArray] = React.useState();
    const [downvoteArray, setDownvoteArray] = React.useState();
    const [savedByArray, setSavedByArray] = React.useState();
    const [followingArray, setFollowingArray] = React.useState();
    // a change state
    const [changeState, setChangeState] = React.useState(true);
    // storing all posts loaded until now (only on demand)
    const [allPosts, setAllPosts] = React.useState([]);

    useEffect(() => {
        document.title = `Greddiit | ${name}`;
    }, [name]);

    // loading all basic data
    useEffect(() => {
        setTimeout(() => {
            const initRender = async () => {
                // getting following array
                fetch(`http://localhost:5000/access-followers/${user.email}`, {
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
                });

                // fetcing basic data
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

                            console.log(body);
                            setCurPage(body);

                            // getting posts
                            var resultArray = [];
                            var curUpvoteArray = [];
                            var curDownvoteArray = [];
                            var curSavedByArray = [];

                            if (body.postObjectIDs.length > 0){
                            body.postObjectIDs
                                .forEach(
                                    postID =>{
                                        
                                        fetch(`http://localhost:5000/access-subgreddiit-post/${postID}`, {
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
                                                        console.log(postBody);
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

                                                        postBody.loadedComments = 
                                                            [];

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
                                        
                                                        if (resultArray.length === body.postObjectIDs.length){
                                                            setDownvoteArray(curDownvoteArray);
                                                            setSavedByArray(curSavedByArray);
                                                            setUpvoteArray(curUpvoteArray);
                                                            setPostList(resultArray);    
                                                            setAllPosts(resultArray);              
                                
                                                            // loaded basic page data
                                                            console.log("Loaded page");
                                                            setLoading(false);
                                                        }
                                                    })
                                            }

                                        })
                                    }
                                )
                            } else {

                                setDownvoteArray(curDownvoteArray);
                                setSavedByArray(curSavedByArray);
                                setUpvoteArray(curUpvoteArray);
                                setPostList(resultArray);    
                                setAllPosts(resultArray);              
    
                                // loaded basic page data
                                console.log("Loaded page");
                                setLoading(false);
                            }

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
        }, 1000);
    }, [changeState, user.email, name]);

    // loading page
    if (isLoading) {
        return (
            <Loading />
        );
    }

    // creation of posts
    const toggleCreatePost = () => {
        if (!curPage.userEmails.includes(user.email)){
            alert("You must be a member to do this!");
            return;
        }

        setRenderPostForm(curState => !curState);
    }
    
    const handlePostCreation = (event) => {
        event.preventDefault();
    
        if (!curPage.userEmails.includes(user.email)){
            alert("You must be a member to do this!");
            return;
        }

        setPostCreationButtonDisabled(true);
        setCreatePageHelperText("Creation in progress");

        const data = new FormData(event.currentTarget);
        const submittedData = {
          text: data.get('postText'),
          subgreddiitName: name,
          posterEmail: user.email,
        };

        const JSONData = JSON.stringify(submittedData);

        fetch('http://localhost:5000/create-post', {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            }, 
            body: JSONData
          })
          .then((result) => {
              console.log(result);
  
              const returnedStatus = result.status;
        
              console.log(returnedStatus);
  
              if (returnedStatus === 201){
                  setCreatePageHelperText("Post created!");
              } else if (returnedStatus === 202){
                  alert("Post contained banned words which will be blurred out!");
                  setCreatePageHelperText("Post Created!");
              } else {
                  setCreatePageHelperText("Error: Reload page and try again");
              }
  
              setPostCreationButtonDisabled(false);

              setChangeState(curState => !curState);
          })
          .catch((err) => {
              console.log(`Couldn't sign up with error ${err}`);
          })

        console.log(submittedData);
    }

    const renderPostFormHTML = () => {
        return (
            <Box component="form" onSubmit={handlePostCreation} noValidate sx={{ mt: 1 }}>

                <TextField
                margin="normal"
                fullWidth
                id="postText"
                label="Post Text"
                name="postText"
                onKeyUp={checkPostCreationFields}
                required
                helperText={createPostHelperText}
                inputProps={{
                    style: {
                      height: "50px"                    },
                  }}
                />

                <Button
                type="submit"
                fullWidth
                variant="fullwidth"
                id = "postCreationButton"
                disabled={postCreationButtonDisabled}
                sx={{ mt: 3, mb: 2 }}
                >
                Create
                </Button>
            </Box>
        );
    }

    const checkPostCreationFields = () => {
        const descLength = 
            document.getElementById('postText').value.length;
        
        if (descLength > 0){
            setPostCreationButtonDisabled(false);
        } else {
            setPostCreationButtonDisabled(true);
        }
    }

    // functions used in posts
    const upvoteFunction = (postID) => {
        return async function() {
            if (!curPage.userEmails.includes(user.email)){
                alert("You must be a member to do this!");
                return;
            }

            console.log(postID);
            if (upvoteArray.includes(postID)){
                setUpvoteArray(curArray => curArray.filter(
                    ele => ele!==postID
                ));
            } else {
                setUpvoteArray(curArray => [...curArray, postID]);
            }

            fetch(`http://localhost:5000/toggle-upvote/${postID}/${user.email}`, {
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
            if (!curPage.userEmails.includes(user.email)){
                alert("You must be a member to do this!");
                return;
            }

            console.log(postID);
            if (downvoteArray.includes(postID)){
                setDownvoteArray(curArray => curArray.filter(
                    ele => ele!==postID
                ));
            } else {
                setDownvoteArray(curArray => [...curArray, postID]);
            }

            fetch(`http://localhost:5000/toggle-downvote/${postID}/${user.email}`, {
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
            if (!curPage.userEmails.includes(user.email)){
                alert("You must be a member to do this!");
                return;
            }

            console.log(postID);
            if (savedByArray.includes(postID)){
                setSavedByArray(curArray => curArray.filter(
                    ele => ele!==postID
                ));
            } else {
                setSavedByArray(curArray => [...curArray, postID]);
            }

            fetch(`http://localhost:5000/toggle-save/${postID}/${user.email}`, {
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
      
              })
              .catch((err) => {
                  console.log(`Couldn't sign up with error ${err}`);
              })
        }
    }

    const followFunction = (curEmail) => {
        return async function() {
            if (!curPage.userEmails.includes(user.email)){
                alert("You must be a member to do this!");
                return;
            }

            console.log(curEmail);

            if (followingArray.includes(curEmail)){
                setFollowingArray(curArray => curArray.filter(
                    ele => ele!==curEmail
                ));
            } else {
                setFollowingArray(curArray => [...curArray, curEmail]);                
            }

            fetch(`http://localhost:5000/toggle-follower/${user.email}/${curEmail}`, {
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

    const reportFunction = (postID) => {
        return async function() {
            if (!curPage.userEmails.includes(user.email)){
                alert("You must be a member to do this!");
                return;
            }

            console.log(`Report initiated for ${postID} by ${user.email}`);
        
            const reportText = window.prompt("Enter concern:");
            
            if (!reportText){
                console.log("Adding concern cancelled");
                return;
            } else if (reportText === ''){
                window.alert("Concern cannot be empty");
                return;
            } else {
                console.log(reportText);

                const submittedData = {
                    text: reportText,
                    subgreddiitName: name,
                    reporterEmail: user.email,
                    postID: postID
                  };
          
                  const JSONData = JSON.stringify(submittedData);
          
                  fetch('http://localhost:5000/create-report', {
                      method: 'POST',
                      mode: 'cors',
                      headers: {
                        'Content-Type': 'application/json'
                      }, 
                      body: JSONData
                    })
                    .then((result) => {
                        console.log(result);
            
                        const returnedStatus = result.status;
                  
                        console.log(returnedStatus);
            
                        if (returnedStatus === 201){
                            console.log("Report Created");
    
                        } else {
                            alert("Something went wrong");
                            console.log("Report wasn't created");
                        }
                    })
                    .catch((err) => {
                        console.log(`Couldn't sign up with error ${err}`);
                    })
            }
        }
    }

    const showReplies = (parentID) => {
        return async function() {
            console.log(`Showing Replies for ${parentID}`);

            // retrieving parent post from all posts
            let parentPost = null;
            allPosts.forEach( ele => {
                if (ele[0]._id === parentID){
                    parentPost = ele;
                }
            }); 

            if (!parentPost){
                alert("Something went wrong");
                return;
            }

            const childrenPostIDs = parentPost[0].comments;
            if (childrenPostIDs.length === 0){
                console.log("No comments");
            } else {

                console.log(`Going to render ${childrenPostIDs}`);
                var curPosts = [...allPosts];
                const initLength = allPosts.length;

                // finding initial comment length
                let initNumComments = 0;
                for (let i = 0; i<curPosts.length; i++){
                    if (curPosts[i][0]._id === parentID){
                        initNumComments = curPosts[i].loadedComments.length;
                    }
                }

                childrenPostIDs.forEach (postID => {
                    
                    fetch(`http://localhost:5000/access-post/${postID}`, {
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
                                    // adding comment ID to loaded comments of cureent post
                                    for (let i = 0; i<curPosts.length; i++){
                                        if (curPosts[i][0]._id === parentID){
                                            if (!curPosts[i].loadedComments.includes(postID)){
                                                curPosts[i].loadedComments.push(postID);
                                                
                                                // adding comment to all loaded posts
                                                postBody.loadedComments = [];
                                                curPosts.push(postBody);
                                            }
                                        }
                                    }

                                    if (curPosts.length - initLength === childrenPostIDs.length - initNumComments){
                                        console.log(curPosts);
                                        setAllPosts(curPosts);
                                    }
                                })
                            }
                    });
                });

            }
        }
    }

    const addCommentFunction = (parentID) => {
        return async function() {
            console.log(`Adding comment for ${parentID}`);

            const commentText = window.prompt("Enter comment text:");
            
            if (!commentText){
                console.log("Adding comment cancelled");
                return;
            } else if (commentText === ''){
                window.alert("Comment cannot be empty");
                return;
            } else {
                console.log(commentText);

                const submittedData = {
                    text: commentText,
                    subgreddiitName: name,
                    posterEmail: user.email,
                    parentID: parentID
                  };
          
                  const JSONData = JSON.stringify(submittedData);
          
                  fetch('http://localhost:5000/create-comment', {
                      method: 'POST',
                      mode: 'cors',
                      headers: {
                        'Content-Type': 'application/json'
                      }, 
                      body: JSONData
                    })
                    .then((result) => {
                        console.log(result);
            
                        const returnedStatus = result.status;
                  
                        console.log(returnedStatus);
            
                        if (returnedStatus === 201){
                            console.log("comment created");

                            // adding comment to frontend
                            result.json().then(commentBody => {
                                console.log(commentBody);
                                const commentID = commentBody._id;

                                var curPosts = [...allPosts];

                                for (let i = 0; i<curPosts.length; i++){
                                    if (curPosts[i][0]._id === parentID){
                                        curPosts[i][0].comments.push(commentID);
                                        console.log(curPosts[i][0].comments);
                                    }
                                }
                                setAllPosts(curPosts);
                                document.getElementById(`showRepliesButton${parentID}`).click();
                            })

                        } else {
                            console.log("COmment wasn't created");
                        }
                    })
                    .catch((err) => {
                        console.log(`Couldn't sign up with error ${err}`);
                    })
            }
        }
    }

    // rendering comments
    const renderComments = (parentID) => {
        // looking for id in all posts
        var commentList = null;

        allPosts.forEach( ele => {
            if (ele[0]._id === parentID){
                commentList = ele.loadedComments;
            }
        })

        if (!commentList){
            alert("Something went wrong");
            console.log(`Couldn't find parent ${parentID} among allPosts`);
            return;
        }

        // rendering the comments
        if (commentList.length > 0){
        
            var renderVal = [];
            commentList.forEach(
                postID => {
                    let curComment = null;
                    allPosts.forEach(ele => {
                        if (ele[0]._id === postID){
                            curComment = ele[0];
                        }
                    });

                    if (!curComment){
                        alert("Something went wrong");
                        console.log(`Couldn't find comment ${postID} in allPosts`);
                    }

                    renderVal.push(
                            <div className='comment-pane'>
                                <div><span style={{fontStyle:'italic'}}>{curComment.posterEmail} says</span>: {curComment.text}</div>
                                
                                <div className="comment-func-div">
                                    {curComment.comments.length > 0 ? 
                                        <div>
                                            <Button onClick={showReplies(curComment._id)} id={`showRepliesButton${curComment._id}`}>
                                            <span style={{fontSize:'10px'}}>Show {curComment.comments.length} Replies </span>
                                            </Button>
                                        </div>
                                        :
                                        <div>
                                            <Button disabled>
                                            <span style={{fontSize:'10px'}}>No replies yet</span>
                                            </Button>
                                        </div>
                                    }
                                    <div>
                                        <Button onClick={addCommentFunction(curComment._id)}>
                                        <span style={{fontSize:'10px'}}>Add Comment</span>
                                        </Button>
                                    </div>
                                </div>

                                {renderComments(curComment._id)}
                            </div>
                    )
                }
            )
            return renderVal;    

        } else {
            return "";
        }
    }

    // render posts
    const renderPosts = () => {
        console.log("Rendering posts");

        if (postList?.length > 0){

            const dateSort = (entry1, entry2) => {
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


            postList.sort((entry1, entry2) => dateSort(entry1, entry2));

            var returnval = [];
            postList?.forEach(entry => {

                const renderUpvoteIcon = () => {
                    if (upvoteArray?.includes(entry[0]._id)) {
                        return (
                            <IconButton onClick={upvoteFunction(entry[0]._id)}>
                            <ThumbUpIcon></ThumbUpIcon>
                            </IconButton>
                        )
                    } else {
                        return (
                            <IconButton onClick={upvoteFunction(entry[0]._id)}>
                            <ThumbUpOffAltIcon></ThumbUpOffAltIcon>
                            </IconButton>
                        )
                    }
                }

                const renderDownvoteIcon = () => {
                    if (downvoteArray?.includes(entry[0]._id)) {
                        return (
                            <IconButton onClick={downvoteFunction(entry[0]._id)}>
                            <ThumbDownIcon></ThumbDownIcon>
                            </IconButton>
                            )
                    } else {
                        return (
                            <IconButton onClick={downvoteFunction(entry[0]._id)}>
                            <ThumbDownOffAltIcon></ThumbDownOffAltIcon>
                            </IconButton>
                        )
                    }
                }

                const renderSaveIcon = () => {
                    if (savedByArray?.includes(entry[0]._id)) {
                        return (
                            <IconButton onClick={saveFunction(entry[0]._id)}>
                            <BookmarkIcon></BookmarkIcon>
                            </IconButton>
                        )
                    } else {
                        return (
                            <IconButton onClick={saveFunction(entry[0]._id)}>
                            <BookmarkBorderIcon></BookmarkBorderIcon>
                            </IconButton>
                        )
                    }
                }

                const renderFollow = () => {
                    if (entry[0].posterEmail === user.email)
                        return "";

                    if (!followingArray?.includes(entry[0].posterEmail)) {
                        return (
                            <IconButton onClick={followFunction(entry[0].posterEmail)}>
                            <PersonAddIcon></PersonAddIcon>
                            </IconButton>
                        )
                    } else {
                        return (
                            <IconButton onClick={followFunction(entry[0].posterEmail)}>
                            <PersonAddDisabledIcon></PersonAddDisabledIcon>
                            </IconButton>
                        )
                    }
                }

                const renderReportIcon = () => {

                    if (entry[0].posterEmail === user.email || entry[0].posterEmail === curPage.moderatorEmail){
                        return (
                            <IconButton disabled>
                            <FlagIcon></FlagIcon>
                            </IconButton>
                        )
                    } else {
                        return (
                            <IconButton onClick={reportFunction(entry[0]._id)}>
                            <FlagIcon></FlagIcon>
                            </IconButton>
                        )
                    }                    
                }

                returnval.push(
                    <div className="single-post-pane">

                        <p>
                            {entry[0].text}
                        </p>

                        <div className="horizontal-line-divider">

                        </div>

                        <div className="posted-by-pane">
                            <div>Posted by: {entry[0].posterEmail}</div>
                            <div>Upvotes: {entry.upvoteCount + upvoteArray?.includes(entry[0]._id)} </div>
                            <div>Downvotes: {entry.downvoteCount + downvoteArray?.includes(entry[0]._id)}</div>
                        </div>

                        <div className="horizontal-line-divider">

                        </div>

                        <div className="icons-pane">
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
                            {
                                renderReportIcon()
                            }
   
                        </div>

                        <div className="horizontal-line-divider">

                        </div>

                        <div className="comment-func-div">
                            {entry[0].comments.length > 0 ? 
                                <div>
                                    <Button onClick={showReplies(entry[0]._id)} id={`showRepliesButton${entry[0]._id}`}>
                                    Show {entry[0].comments.length} Replies
                                    </Button>
                                </div>
                                :
                                <div>
                                    <Button disabled>
                                    No replies yet
                                    </Button>
                                </div>
                            }
                            <div>
                                <Button onClick={addCommentFunction(entry[0]._id)}>
                                Add Comment
                                </Button>
                            </div>
                        </div>

                        {
                            renderComments(entry[0]._id)
                        }

                    </div>
                )
            })

            return returnval;
        } else {
            return "";
        }
    }

    return (
        <div className="subgreddiit-page">

            <div className="subgreddiit-info-pane">
                <img src="https://reactjs.org/logo-og.png" alt="subgreddiit Image"></img>

                <h2 style={{
                    textAlign:'center',
                    marginTop:'30px'
                }}>
                    {curPage.name}
                </h2>

                <p style={{
                    textAlign:'center',
                    marginTop:'10px'
                }}>
                    {curPage.description}
                </p>

                <p style={{
                    textAlign:'center',
                    marginTop:'10px',
                    fontStyle:'italic'
                }}>
                    Moderator: {curPage.moderatorEmail}
                </p>
            </div>

            <div className="middle-line">
            </div>

            <div className="post-pane">
                <div className="post-creation">
                    {/*** MUI Template ***/}
                    <ThemeProvider theme={theme}>
                    <Container component="main" maxWidth="xs">
                        <CssBaseline />

                        <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                        >

                        <Typography component="h1" variant="h5" onClick={toggleCreatePost}
                            id="createPageToggling">
                            Create Post
                        </Typography>

                        {renderPostForm ? renderPostFormHTML() : ""}

                        </Box>
                    </Container>
                    </ThemeProvider>
                    {/******/}

                    <div className="horizontal-pane-line">
                
                    </div>

                    {/*** Posts ***/}
                    <div className="post-div">
                        {renderPosts()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubgreddiitPage;