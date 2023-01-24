const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String
  },
  lastname: {
    type: String
  },
  username: {
    type: String,
  },
  email: {
    type: String,
    unique: true
  },
  age: {
    type: Number
  },
  contact_number: {
    type: String
  },
  password: {
    type: String
  },
  token: {
    type: String
  }
});

const User = mongoose.model("user", userSchema);

module.exports = User;
