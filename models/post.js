const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'comments'
  }],
  timestamp: {
    type: Date,
    required: true,
  },
  published: {
    type: Boolean,
    required: true
  }
});

Post.virtual("date_formated").get(function () {
  return this.timestamp.toLocaleDateString();
});

module.exports = mongoose.model('Post', Post);