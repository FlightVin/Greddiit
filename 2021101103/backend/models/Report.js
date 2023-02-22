const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporterEmail: {
    type: String,
  },
  subgreddiitName: {
    type: String,
  },
  concernText: {
    type: String,
  },
  postID: {
    type: mongoose.ObjectId,
  }
});

const Report = mongoose.model("report", reportSchema);

module.exports = Report;
