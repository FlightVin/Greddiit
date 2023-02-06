const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

const tokenKey = require("./secret/token");
const User = require('./models/User');
const Follower = require('./models/Follower');
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
    
    // res.status(200).send("OK token validated");

    jwt.verify(token, tokenKey, (err) => {
      if (err) {
        console.log(`Unauthorized with token ${err}`);
        res.status(401).send("Unauthorized access");
      } else {
        res.status(200).send("Valid token");
      }
    });

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
        res.status(403).send("Invalid Credentials");
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
        res.status(200).send(return_user);
      }
    })

  } catch(err){
    console.log(err);
    res.status(400).send("Invalid Credentials");
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
      res.status(500).send("Could not access database! Internal Server Error");
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
    res.status(201).send(return_user);

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
      res.status(500).send("Could not access database! Internal Server Error");
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
    res.status(204).send(JSON.stringify(return_user));

  } catch(err){
    console.log(err);
    res.status(400).send("Invalid Credentials");
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

    res.status(200).send(JSON.stringify(existingUser));

  } catch(err){
    console.log(err);
    res.status(400).send("Invalid Credentials");
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
      res.status(500).send("Could not access database! Internal Server Error");
    }

    res.status(201).send("Made follower Entry");    
  } catch(err){
    console.log(err);
    res.status(400).send("Couldn't create follower entry");
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
    }

    // console.log(returned_data)

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(returned_data));

  } catch(err){
    console.log(err);
    res.status(400).send("Couldn't create follower entry");
  }
});

// deleting follower entry
app.post('/delete-follower/:followerEmail/:followingEmail', async (req, res) => {
  try{
    const following_email = req.params['followingEmail'];
    const follower_email = req.params['followerEmail'];

    console.log(follower_email, following_email);

    const returned_data = await Follower.findOneAndDelete({
      followerEmail: follower_email,
      followingEmail: following_email
    });
    
    res.status(200).send(returned_data);

  } catch(err){
    console.log(err);
    res.status(400).send("Couldn't create follower entry");
  }
});

// server
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
