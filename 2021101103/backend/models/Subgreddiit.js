const mongoose = require('mongoose');

const subgredditSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  moderatorEmail: {
    type: String
  },
  userEmails: {
    type: Array
  },
  blockedUserEmails: {
    type: Array
  },
  postObjectIDs: {
    type: Array
  },
  bannedWords: {
    type: Array
  },
  description: {
    type: String
  },
  joinRequestEmails: {
    type: Array
  },
  reportedPostObjectIDs: {
    type: Array
  }
});

const Subgreddiit = mongoose.model("subgreddiit", subgredditSchema);

module.exports = Subgreddiit;
