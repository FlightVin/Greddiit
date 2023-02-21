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
import AddCommentIcon from '@mui/icons-material/AddComment';import { IconButton } from '@mui/material';
import { Tooltip } from '@mui/material';

const SubgreddiitPage = () => {
    const {name} = useParams();
    const user = JSON.parse(localStorage.getItem('grediit-user-details'));
    const [curPage, setCurPage] = React.useState();
    const [isLoading, setLoading] = React.useState(true);
    const theme = createTheme();
    const [postList, setPostList] = React.useState([]);
    const [changeArray, setChangeArray] = React.useState(true);
    const [arePostsRendered, setArePostsRendered] = React.useState(false);
    const [upvoteArray, setUpvoteArray] = React.useState();
    const [downvoteArray, setDownvoteArray] = React.useState();
    const [savedByArray, setSavedByArray] = React.useState();
    const [followingArray, setFollowingArray] = React.useState();
    const [commentArray, setCommentArray] = React.useState();

    useEffect(() => {
        document.title = `Greddiit | ${name}`;
    }, []);

    useEffect(() => {
        // getting initial data
        setArePostsRendered(false);
        setTimeout(() => {
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

                    // first getting following array
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
                    })

                    // getting all comments
                    fetch(`http://localhost:5000/all-posts/${name}`, {
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
                                    setCommentArray(body);                                    
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

                                body.postObjectIDs
                                    .forEach(
                                        postID =>{
                                            
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
        }, 1000);
    }, [changeArray, user.email, name]);

    const [renderPostForm, setRenderPostForm] = React.useState(false);
    const [postCreationButtonDisabled, setPostCreationButtonDisabled]
        = React.useState(true);
    const [createPostHelperText,setCreatePageHelperText]
        = React.useState('');

    if (isLoading) {
        return (
            <Loading />
        );
    }

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

    const toggleCreatePost = () => {
        if (!curPage.userEmails.includes(user.email)){
            alert("You must be a member to do this!");
            return;
        }

        setRenderPostForm(curState => !curState);
    }

    const toggleShowPosts = () => {
        setArePostsRendered(curState => !curState);
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
              setChangeArray(curState => !curState);
          })
          .catch((err) => {
              console.log(`Couldn't sign up with error ${err}`);
          })

        console.log(submittedData);
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

    const addCommentFunction = (parentID) => {
        return async function() {
            if (!curPage.userEmails.includes(user.email)){
                alert("You must be a member to do this!");
                return;
            }

            console.log("Adding comment for", parentID);

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
                        } else {
                            console.log("COmment wasn't created");
                        }
            
                        setChangeArray(curState => !curState);
                    })
                    .catch((err) => {
                        console.log(`Couldn't sign up with error ${err}`);
                    })
            }
        }
    }

    const renderComments = (commentIDs) => {
        if (commentIDs.length > 0){
            var renderVal = [];
            commentIDs.forEach(
                postID => {
                    var curComment = 
                        commentArray.filter(entry => 
                            entry._id === postID)[0];

                    renderVal.push(
                        <div className="comment-pane">
                            <div className='comment-subpane'>
                                <div><span style={{fontStyle:'italic'}}>{curComment.posterEmail} says</span>: {curComment.text}</div>
                            <AddCommentIcon onClick={addCommentFunction(curComment._id)}></AddCommentIcon>
                            </div>
                            {renderComments(curComment.comments)}
                        </div>
                    )
                }
            )
            return renderVal;
        } else {
            return ""
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

                const renderAddComment = () => {
                    return <AddCommentIcon onClick={addCommentFunction(entry[0]._id)}></AddCommentIcon>
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
                                renderAddComment()
                            }
                        </div>


                        <div className="horizontal-line-divider">

                        </div>

                        {renderComments(entry[0].comments)}

                    </div>
                )
            })

            return returnval;
        } else {
            return "No posts";
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

                    <div className="list-posts">
                        <div className="list-header">
                        <Typography component="h1" variant="h5" onClick={toggleShowPosts}
                            id="createPageToggling">
                            Show Posts
                        </Typography>
                        </div>
                        <div className="post-div">
                            {arePostsRendered ? renderPosts() : ""}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubgreddiitPage;