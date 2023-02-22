const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporterEmail: {
    type: String,
  },
  subgreddiitName: {
    type: String,
  },
  text: {
    type: String,
  },
  postID: {
    type: String,
  },
  isIgnored: {
    type: Boolean,
  },
});

const Report = mongoose.model("report", reportSchema);

module.exports = Report;
