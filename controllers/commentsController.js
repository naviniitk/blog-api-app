const Comment = require('../models/comment');
const Post = require('../models/post');

exports.comment_detail = function(req, res, next) {
  const post = Post.findById(req.params.id);
  const comments = post.comments;
  res.send(comments);
};

exports.add_comment = function(req, res, next) {
  const post = Post.findById(req.params.id).exec();

  const comments = post.comments;

  const newComment = new Comment({
    username: req.username.username,
    comment: req.body.comment,
    timestamp: new Date()
  });

  comments.push(newComment);
  Post.findByIdAndUpdate(req.params.id, {comments}, (err, post) => {
    if(err) return next(err);
    res.redirect(`/posts/${req.params.id}`);
  });
};


