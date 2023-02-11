const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  subgreddiitName: {
    type: String,
  },
  posterEmail: {
    type: String
  },
  text: {
    type: String
  },
  comments: {
    type: Array
  },
  upvotes: {
    type: Number
  },
  downvotes: {
    type: Number
  }
});

const Post = mongoose.model("post", postSchema);

module.exports = Post;
