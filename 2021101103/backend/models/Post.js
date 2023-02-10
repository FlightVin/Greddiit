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
  }
});

const Post = mongoose.model("post", postSchema);

module.exports = Post;
