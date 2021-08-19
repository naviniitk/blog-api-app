const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  username: {type: String, required: true},
  password: {type: String, required: true},
  posts: [{ type: Schema.Types.ObjectId, ref: 'posts'}]
});

module.exports = mongoose.model('User', User);