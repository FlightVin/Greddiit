const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

const tokenKey = require("./secret/token");
const User = require('./models/User');
const Follower = require('./models/Follower');
const Subgreddiit = require('./models/Subgreddiit');
const Post = require('./models/Post');
const Report = require('./models/Report');
const {mongoConnect, DB_URI} = require('./database/mongo');

const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

// db connection
mongoConnect();

// token auth
app.post('/auth', async (req, res) => {
  try{
    
    const { token } = req.body;
    console.log(token);

    try {
      const decoded = jwt.verify(token, tokenKey);
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(decoded);
    } catch (err) {
      res.status(401).send("Invalid Token");
    }

  } catch(err) {
    console.log(err);
    res.status(403).send("Invalid Credentials");
  };
});

// login check
app.post('/login', async (req, res) => {
  try{
    const {email, password} = req.body;

    const existingUser = await User.findOne(
      {email}
    );

    if (!existingUser){
      console.log("Email not in use");
      return res.status(403).send("invalid credentials");
    }

    bcrypt.compare(password, existingUser.password)
    .then((result) => {
      if (!result){
        console.log("Password comparison failed");
        return res.status(403).send("Invalid Credentials");
      } else {
        const return_user = existingUser;

        const token = jwt.sign(
          { user_id: return_user._id, email },
          tokenKey,
          {
            expiresIn: "2h",
          }
        );

        return_user.token = token;

        console.log(return_user);

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).send(return_user);
      }
    })

  } catch(err){
    console.log(err);
    return res.status(400).send("Invalid Credentials");
  }
});

// registration
app.post('/register', async (req, res) => {
  try{
    const {
      firstname,
      lastname,
      username,
      email,
      age,
      contact_number,
      password
    } = req.body;

    const existingUser = await User.findOne(
      {email}
    );

    if (existingUser){
      return res.status(409).send("Email already in use");
    }

    // creating encrypted password
    const encryptedPassword = await bcrypt.hash(password, 10);

    const return_user = await User.create({
      firstname,
      lastname,
      email: email.toLowerCase(),
      username,
      age,
      contact_number,
      password: encryptedPassword,
    });

    if (!return_user){
      return res.status(500).send("Could not access database! Internal Server Error");
    }

    const token = jwt.sign(
      { user_id: return_user._id, email },
      tokenKey,
      {
       expiresIn: "2h",
      }
    );

    return_user.token = token;

    res.setHeader('Content-Type', 'application/json');
    return res.status(201).send(return_user);

  } catch(err){
    console.log(err);
  }
});

// edit
app.post('/edit', async (req, res) => {
  try{
    const data = {
      firstname,
      lastname,
      username,
      email,
      age,
      contact_number,
      password
    } = req.body;

    console.log(data);

    const existingUser = await User.findOne(
      {email}
    );

    console.log(existingUser);

    if (!existingUser){
      return res.status(400).send("Doesn't exist!");
    }
    console.log('user found');

    // creating encrypted password
    const encryptedPassword = await bcrypt.hash(password, 10);

    const return_user = await User.findOneAndUpdate({email},{
      firstname,
      lastname,
      username,
      age,
      contact_number,
      password: encryptedPassword
    }, {
      new: true
    });

    if (!return_user){
      return res.status(500).send("Could not access database! Internal Server Error");
    }

    const token = jwt.sign(
      { user_id: return_user._id, email },
      tokenKey,
      {
       expiresIn: "2h",
      }
    );

    return_user.token = token;

    console.log(JSON.stringify(return_user));

    res.setHeader('Content-Type', 'application/json');
    return res.status(204).send(JSON.stringify(return_user));

  } catch(err){
    console.log(err);
    return res.status(400).send("Invalid Credentials");
  }
});

// checking user existence
app.post('/check-user-existence', async (req, res) => {
  try{
    const data = {
      email
    } = req.body;

    console.log(data);

    const existingUser = await User.findOne(
      {email}
    );

    console.log(existingUser);

    if (!existingUser){
      return res.status(400).send("Doesn't exist!");
    }
    console.log('user found');

    return res.status(200).send(JSON.stringify(existingUser));

  } catch(err){
    console.log(err);
    return res.status(400).send("Invalid Credentials");
  }
});

// Adding follower entry
app.post('/add-follower-entry', async (req, res) => {
  try{
    const data = {
      followerEmail,
      followingEmail
    } = req.body;

    console.log(data);

    const existingEntry = await Follower.findOne(
      {followerEmail,
      followingEmail}
    );

    if (existingEntry){
      return res.status(409).send("Email already in use");
    }

    const createdEntry = await Follower.create({
      followerEmail,
      followingEmail
    });

    if (!createdEntry){
      return res.status(500).send("Could not access database! Internal Server Error");
    };

    var timestamp = createdEntry._id.getTimestamp();
    console.log(timestamp);
    timestamp = new Date(timestamp);
    console.log(timestamp);

    return res.status(201).send("Made follower Entry");    
  } catch(err){
    console.log(err);
    return res.status(400).send("Couldn't create follower entry");
  }
});

// returning followers
app.post('/access-followers/:email', async (req, res) => {
  try{
    const currentEmail = req.params['email'];

    console.log(currentEmail);
    
    const followingData = await Follower.find({
      followerEmail: currentEmail
    });

    const followerData = await Follower.find({
      followingEmail: currentEmail
    });

    const returned_data = {
      followers: followerData,
      following: followingData
    };

    // console.log(returned_data)

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(returned_data));

  } catch(err){
    console.log(err);
    return res.status(400).send("Couldn't create follower entry");
  }
});

// deleting follower entry
app.delete('/delete-follower/:followerEmail/:followingEmail', async (req, res) => {
  try{
    const following_email = req.params['followingEmail'];
    const follower_email = req.params['followerEmail'];

    console.log(follower_email, following_email);

    const returned_data = await Follower.findOneAndDelete({
      followerEmail: follower_email,
      followingEmail: following_email
    });
    
    return res.status(200).send(returned_data);

  } catch(err){
    console.log(err);
    return res.status(400).send("Couldn't create follower entry");
  }
});

// creation of subgreddiit
app.post('/create-subgreddiit', async (req, res) => {
  try{
    const {
      name, 
      moderatorEmail,
      description,
      bannedWords,
      subgreddiitTags
    } = req.body;

    const existingPage = await Subgreddiit.findOne(
      {name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}
    );

    if (existingPage){
      return res.status(409).send("Page name already in use");
    }

    const return_page = await Subgreddiit.create({
      name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(), 
      moderatorEmail,
      userEmails: [moderatorEmail],
      description,
      bannedWords:  bannedWords.split(','),
      subgreddiitTags: subgreddiitTags.split(',')
    });

    if (!return_page){
      return res.status(500).send("Could not access database! Internal Server Error");
    }

    return res.status(201).send("created");

  } catch(err){
    console.log(err);
  }
});

// accessing subgreddiit of a user
app.post('/access-subgreddiits/:email', async (req, res) => {
  try{
    const currentEmail = req.params['email'];

    const returned_data = await Subgreddiit.find({
      moderatorEmail: currentEmail
    });

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(returned_data));

  } catch(err){
    console.log(err);
    return res.status(400).send("Couldn't delete follower entry");
  }
});

// accessing all subgreddiit
app.post('/access-subgreddiits', async (req, res) => {
  try{
    const returned_data = await Subgreddiit.find();

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(returned_data));

  } catch(err){
    console.log(err);
    return res.status(400).send("Couldn't delete follower entry");
  }
});

// deleting subgreddiit page
app.delete('/delete-subgreddiit/:name', async (req, res) => {
  try{
    const name = req.params['name'];

    console.log(name);

    // deleting posts and comments
    const returned_data_for_posts = await Post.deleteMany({
      subgreddiitName: name
    })

    if (!returned_data_for_posts){
      return res.status(500).send("Could not access database! Internal Server Error");
    }

    // deleting reports
    const returned_data_for_reports = await Report.deleteMany({
      subgreddiitName: name
    })

    if (!returned_data_for_reports){
      return res.status(500).send("Could not access database! Internal Server Error");
    }    

    // deleting page
    const returned_data = await Subgreddiit.findOneAndDelete({
      name: name
    });

    if (!returned_data){
      return res.status(500).send("Could not access database! Internal Server Error");
    }
    
    return res.status(200).send(returned_data);

  } catch(err){
    console.log(err);
    return res.status(400).send("Couldn't delete subgreddiit");
  }
});

// page auth
app.post('/subgreddiit-auth/:name/:email', async (req, res) => {
  try{
    const name = req.params['name'];
    const email = req.params['email'];

    console.log(name)

    const existingPage = await Subgreddiit.findOne(
      {name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}
    );

    if (existingPage && email === existingPage.moderatorEmail){
      return res.status(200).send("Page exists");
    }

    return res.status(400).send("Doesn't exist");

  } catch(err){
    console.log(err);
  }
});

// page existence
app.post('/subgreddiit-exists/:name', async (req, res) => {
  try{
    const name = req.params['name'];

    console.log(name)

    const existingPage = await Subgreddiit.findOne(
      {name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}
    );

    if (existingPage){
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).send(existingPage);
    }

    return res.status(400).send("Doesn't exist");

  } catch(err){
    console.log(err);
  }
});

// joining a page
app.post('/join-subgreddiit/:name/:email', async (req, res) => {
  try{
    const name = req.params['name'];
    const email = req.params['email'];

    console.log(name, email);

    const existingPage = await Subgreddiit.findOne(
      {name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}
    );

    if (!existingPage){
      return res.status(400).send("Doesn't exist");
    }

    console.log(existingPage.joinRequestEmails);

    if (existingPage.joinRequestEmails.includes(email)){
      return res.status(409).send("ALready requested");
    }

    const return_page = await Subgreddiit.findOneAndUpdate({name},{
      joinRequestEmails: [...existingPage.joinRequestEmails, email]
    }, {
      new: true
    });

    if (!return_page){
      return res.status(500).send("Could not access database! Internal Server Error");
    }

    return res.status(200).send("Page exists");

  } catch(err){
    console.log(err);
  }
});

// joining a page
app.post('/accept-user-subgreddiit/:name/:email', async (req, res) => {
  try{
    const name = req.params['name'];
    const email = req.params['email'];

    console.log(name, email);

    const existingPage = await Subgreddiit.findOne(
      {name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}
    );

    if (!existingPage){
      return res.status(400).send("Doesn't exist");
    }

    if (existingPage.userEmails.includes(email)){
      return res.status(409).send("Already Added");
    }

    const return_page = await Subgreddiit.findOneAndUpdate({name},{
      userEmails: [...existingPage.userEmails, email],
      joinRequestEmails: existingPage.joinRequestEmails.filter(curemail => curemail != email)
    }, {
      new: true
    });

    if (!return_page){
      return res.status(500).send("Could not access database! Internal Server Error");
    }

    return res.status(200).send("Page exists");

  } catch(err){
    console.log(err);
  }
});

// rejecting from a page
app.post('/reject-user-subgreddiit/:name/:email', async (req, res) => {
  try{
    const name = req.params['name'];
    const email = req.params['email'];

    console.log(name, email);

    const existingPage = await Subgreddiit.findOne(
      {name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}
    );

    if (!existingPage){
      return res.status(400).send("Doesn't exist");
    }

    const return_page = await Subgreddiit.findOneAndUpdate({name},{
      joinRequestEmails: existingPage.joinRequestEmails.filter(curemail => curemail != email)
    }, {
      new: true
    });

    if (!return_page){
      return res.status(500).send("Could not access database! Internal Server Error");
    }

    return res.status(200).send("Page exists");

  } catch(err){
    console.log(err);
  }
});

// Banning/blocking a user from a page
app.post('/block-user-subgreddiit/:name/:email', async (req, res) => {
  try{
    const name = req.params['name'];
    const email = req.params['email'];

    console.log(name, email);

    const existingPage = await Subgreddiit.findOne(
      {name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}
    );

    if (!existingPage){
      return res.status(400).send("Doesn't exist");
    }

    if (existingPage.blockedUserEmails.includes(email)){
      return res.status(409).send("Already Added");
    }

    const return_page = await Subgreddiit.findOneAndUpdate({name},{
      userEmails: existingPage.userEmails
          .filter(entry => entry != email),
      blockedUserEmails: [...existingPage.blockedUserEmails, email] 
    }, {
      new: true
    });

    if (!return_page){
      return res.status(500).send("Could not access database! Internal Server Error");
    }

    return res.status(200).send("User exists");

  } catch(err){
    console.log(err);
  }
});

// creating a post
app.post('/create-post', async (req, res) => {
  try{
    const {
      subgreddiitName, 
      posterEmail,
      text,
    } = req.body;

    console.log(subgreddiitName, posterEmail, text);

    const existingPage = await Subgreddiit.findOne({
      name: subgreddiitName
    })

    if (!existingPage){
      return res.status(400).send("Doesn't exist");
    }

    const return_post = await Post.create({
      subgreddiitName: subgreddiitName,
      posterEmail: posterEmail,
      text: text,
      comments: [],
      upvotedBy: [],
      downvotedBy: [],
      savedBy: [],
    });

    if (!return_post){
      return res.status(500).send("Could not access database! Internal Server Error");
    }

    console.log(return_post._id, existingPage.postObjectIDs, existingPage.name);

    const return_page = await Subgreddiit.findOneAndUpdate(
        {name: existingPage.name},
        {
          postObjectIDs: [...existingPage.postObjectIDs, return_post._id]
        }
      );    

    if (!return_page){
      return res.status(500).send("Could not access database! Internal Server Error");
    }

    console.log("Updated page details for new post");

    var status = 201;

    existingPage.bannedWords.forEach(
      (entry) => {
        console.log(text.toLowerCase(), entry);
        if (entry && entry !== '' && text.toLowerCase().includes(entry)){
          console.log(`found ${entry} in ${text}`);
          status = 202;
        }
      }
    );

    return res.status(status).send("created");

  } catch(err){
    console.log(err);
  }
});

// accessing a post (non moderator mode)
app.post('/access-subgreddiit-post/:id', async (req, res) => {
  try{
    const postID = req.params['id'];

    const returned_post = await Post.find({
      _id: postID
    });

    if (!returned_post){
      return res.status(400).send("No such post");
    }

    function replaceAll(str,mapObj){
      var re = new RegExp(Object.keys(mapObj).join("|"),"gi");
  
      return str.replace(re, function(matched){
          return mapObj[matched.toLowerCase()];
      });
    }

    var bannedObj = {};

    const existingPage = await Subgreddiit.findOne({
      name: returned_post[0].subgreddiitName
    })

    if (!existingPage){
      return res.status(400).send("Subgreddiit Doesn't exist");
    }

    existingPage.bannedWords.forEach(entry => {
      bannedObj[entry] = '*'.repeat(entry.length);
    })

    // removing banned words
    console.log('before', returned_post[0].text);
    returned_post[0].text = 
      replaceAll(returned_post[0].text, bannedObj);
    console.log('after', returned_post[0].text);

    // checking whether user is blocked
    if (existingPage.blockedUserEmails.includes(returned_post[0].posterEmail)){
      returned_post[0].posterEmail = "Blocked User"
    }

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(returned_post));

  } catch(err){
    console.log(err);
  }
});

// accessing a post
app.post('/access-post/:id', async (req, res) => {
  try{
    const postID = req.params['id'];

    const returned_post = await Post.find({
      _id: postID
    });

    if (!returned_post){
      return res.status(400).send("No such post");
    }

    function replaceAll(str,mapObj){
      var re = new RegExp(Object.keys(mapObj).join("|"),"gi");
  
      return str.replace(re, function(matched){
          return mapObj[matched.toLowerCase()];
      });
    }

    var bannedObj = {};

    const existingPage = await Subgreddiit.findOne({
      name: returned_post[0].subgreddiitName
    })

    if (!existingPage){
      return res.status(400).send("Subgreddiit Doesn't exist");
    }

    existingPage.bannedWords.forEach(entry => {
      bannedObj[entry] = '*'.repeat(entry.length);
    })

    console.log('before', returned_post[0].text);
    returned_post[0].text = 
      replaceAll(returned_post[0].text, bannedObj);
    console.log('after', returned_post[0].text);

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(returned_post));

  } catch(err){
    console.log(err);
  }
});

// upvoting a post
app.post('/toggle-upvote/:id/:email', async (req, res) => {
  try{
    const postID = req.params['id'];
    const email = req.params['email'];

    const existingPost = await Post.findOne(
      {_id: postID}
    );

    if (!existingPost){
      return res.status(400).send("Doesn't exist");
    }

    if (existingPost.upvotedBy.includes(email)){
      // removing upvote
      const return_post = await Post.findOneAndUpdate({_id: postID},{
        upvotedBy: existingPost.upvotedBy.filter(
          entry => entry != email
        )
      }, {
        new: true
      });
  
      if (!return_post){
        return res.status(500).send("Could not access database! Internal Server Error");
      }
    } else {
      // adding upvote
      const return_post = await Post.findOneAndUpdate({_id: postID},{
        upvotedBy: [...existingPost.upvotedBy, email]
      }, {
        new: true
      });
  
      if (!return_post){
        return res.status(500).send("Could not access database! Internal Server Error");
      }
    }

    return res.status(200).send("upvote processed");

  } catch(err){
    console.log(err);
  }
});

// downvoting a post
app.post('/toggle-downvote/:id/:email', async (req, res) => {
  try{
    const postID = req.params['id'];
    const email = req.params['email'];

    const existingPost = await Post.findOne(
      {_id: postID}
    );

    if (!existingPost){
      return res.status(400).send("Doesn't exist");
    }

    if (existingPost.downvotedBy.includes(email)){
      // removing downvote
      const return_post = await Post.findOneAndUpdate({_id: postID},{
        downvotedBy: existingPost.downvotedBy.filter(
          entry => entry != email
        )
      }, {
        new: true
      });
  
      if (!return_post){
        return res.status(500).send("Could not access database! Internal Server Error");
      }
    } else {
      // adding downvote
      const return_post = await Post.findOneAndUpdate({_id: postID},{
        downvotedBy: [...existingPost.downvotedBy, email]
      }, {
        new: true
      });
  
      if (!return_post){
        return res.status(500).send("Could not access database! Internal Server Error");
      }
    }

    return res.status(200).send("downvoted processed");

  } catch(err){
    console.log(err);
  }
});

// downvoting a post
app.post('/toggle-save/:id/:email', async (req, res) => {
  try{
    const postID = req.params['id'];
    const email = req.params['email'];

    const existingPost = await Post.findOne(
      {_id: postID}
    );

    if (!existingPost){
      return res.status(400).send("Doesn't exist");
    }

    if (existingPost.savedBy.includes(email)){
      // removing save
      const return_post = await Post.findOneAndUpdate({_id: postID},{
        savedBy: existingPost.savedBy.filter(
          entry => entry != email
        )
      }, {
        new: true
      });
  
      if (!return_post){
        return res.status(500).send("Could not access database! Internal Server Error");
      }
    } else {
      // adding save
      const return_post = await Post.findOneAndUpdate({_id: postID},{
        savedBy: [...existingPost.savedBy, email]
      }, {
        new: true
      });
  
      if (!return_post){
        return res.status(500).send("Could not access database! Internal Server Error");
      }
    }

    return res.status(200).send("downvoted processed");

  } catch(err){
    console.log(err);
  }
});

// toggling follower entry
app.post('/toggle-follower/:followerEmail/:followingEmail', async (req, res) => {
  try{
    const following_email = req.params['followingEmail'];
    const follower_email = req.params['followerEmail'];

    console.log(follower_email, following_email);

    const existing_data = await Follower.findOne({
      followerEmail: follower_email,
      followingEmail: following_email
    });

    if (existing_data){
      const returned_data = await Follower.findOneAndDelete({
        followerEmail: follower_email,
        followingEmail: following_email
      });
      
      if (!returned_data){
        return res.status(500).send("Could not access database! Internal Server Error");
      }
      
      return res.status(200).send(returned_data);
    } else {
      const returned_data = await Follower.create({
        followerEmail: follower_email,
        followingEmail: following_email
      });
      
      if (!returned_data){
        return res.status(500).send("Could not access database! Internal Server Error");
      }

      return res.status(200).send(returned_data);
    }

  } catch(err){
    console.log(err);
    return res.status(400).send("Couldn't create follower entry");
  }
});

// returning saved posts
app.post('/access-saved-posts/:email', async (req, res) => {
  try{
    const email = req.params['email'];
    console.log(email);

    const posts = await Post.find({
      savedBy: email
    });

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(posts));

  } catch(err){
    console.log(err);
  }
});

// creating a comment
app.post('/create-comment', async (req, res) => {
  try{
    const {
      subgreddiitName, 
      posterEmail,
      text,
      parentID
    } = req.body;

    console.log(subgreddiitName, posterEmail, text);

    const existingPage = await Subgreddiit.findOne({
      name: subgreddiitName
    })

    if (!existingPage){
      return res.status(400).send("Subgreddiit Doesn't exist");
    }

    const parentComment = await Post.findOne({
      _id: parentID
    })

    if (!parentComment){
      return res.status(400).send("Parent Doesn't exist");
    }

    const return_comment = await Post.create({
      subgreddiitName: subgreddiitName,
      posterEmail: posterEmail,
      text: text,
      comments: [],
      upvotedBy: [],
      downvotedBy: [],
      savedBy: [],
    });

    if (!return_comment){
      return res.status(500).send("Could not access database! Internal Server Error");
    }

    const return_post = await Post.findOneAndUpdate(
      {
        _id: parentID
      },
      {
        comments: [...parentComment.comments, return_comment._id]
      }
    );

    if (!return_post){
      return res.status(500).send("Could not access database! Internal Server Error");
    }

    res.setHeader('Content-Type', 'application/json');
    return res.status(201).send(JSON.stringify(return_comment));

  } catch(err){
    console.log(err);
  }
});

// accessing a post
app.post('/all-posts/:name', async (req, res) => {
  try{
    const name = req.params['name'];

    const returned_post = await Post.find({
      subgreddiitName: name
    });

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(returned_post));

  } catch(err){
    console.log(err);
  }
});

// creating a report
app.post('/create-report', async (req, res) => {
  try{
    const {
      subgreddiitName, 
      reporterEmail,
      text,
      postID
    } = req.body;

    const existingPage = await Subgreddiit.findOne({
      name: subgreddiitName
    })

    if (!existingPage){
      return res.status(400).send("Subgreddiit Doesn't exist");
    }

    const return_report = await Report.create({
      subgreddiitName: subgreddiitName,
      reporterEmail: reporterEmail,
      text: text,
      postID: postID,
      isIgnored: false,
    });

    if (!return_report){
      return res.status(500).send("Could not access database! Internal Server Error");
    }

    return res.status(201).send("Report created");

  } catch(err){
    console.log(err);
  }
});

// accessing reports
app.post('/access-reports/:name', async (req, res) => {
  try{
    const name = req.params['name'];

    const reports = await Report.find({ 
      subgreddiitName: name
    });

    const curDate = new Date();
    const expiryTime = 1000*60*60*24*10;
    // 1000 * 60 seconds * 60 minutes * 24 hours per day

    for (let i = 0; i<reports.length; i++){
      if (curDate - reports[i]._id.getTimestamp() >= expiryTime){
        const returned_data = await Report.findOneAndDelete({
          _id: reports[i]._id,          
        });
      }
    }

    const fixedReports = await Report.find({ 
      subgreddiitName: name
    });

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(fixedReports));

  } catch(err){
    console.log(err);
  }
});

// toggle ignore
app.post('/toggle-report-ignore/:id', async (req, res) => {
  try{
    const id = req.params['id'];

    const existing_report = await Report.findOne({ 
      _id: id
    });

    if (!existing_report){
      return res.status(500).send("Could not access database! Internal Server Error");
    }

    const return_comment = await Report.findOneAndUpdate(
      {_id: id},{
      isIgnored: !existing_report.isIgnored,
    }, {
      new: true
    });

    if (!return_comment){
      return res.status(500).send("Could not access database! Internal Server Error");
    }

    return res.status(200).send("toggled ignore");

  } catch(err){
    console.log(err);
  }
});

// deleting report
app.delete('/delete-report/:id', async (req, res) => {
  try{
    const id = req.params['id'];

    const returned_data = await Report.findOneAndDelete({
      _id: id,
    });
    
    return res.status(200).send(returned_data);

  } catch(err){
    console.log(err);
    return res.status(400).send("Couldn't create follower entry");
  }
});

// server
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
