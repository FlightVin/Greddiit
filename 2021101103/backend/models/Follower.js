const mongoose = require('mongoose');

const followerSchema = new mongoose.Schema({
  followerEmail: {
    type: String
  },
  followingEmail: {
    type: String
  }
});

const Follower = mongoose.model("follower", followerSchema);

module.exports = Follower;