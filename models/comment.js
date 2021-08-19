const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = new Schema({
  username: { type: String },
  comment: { type: String, required: true},
  timestamp: { type: Date }
});

module.exports('Comment', Comment);