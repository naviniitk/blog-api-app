const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

Post.virtual("date_formated").get(function () {
  return this.timestamp.toLocaleDateString();
});

module.exports = mongoose.model('Post', Post);