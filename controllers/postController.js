const Post = require('../models/post');

exports.create_post_get = function(req, res, next) {
  // create post form to be handled on frontend
};

exports.create_post = function(req, res, next) {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    comments: [],
    timestamp: new Date(),
    published: req.body.published
  })

  post.save((err, post) => {
    if(err) return next(err);
    res.redirect('/');
  });
};

exports.edit_post_get = function(req, res, next) {
  const post = Post.findById(req.params.id);

  if(req.user.username !== post.username){
    res.status(403).send('You cannot edit another users post');
  }
  res.status(200).send('form for updating post');
};

exports.edit_post = function(req, res, next) {
  const post = Post.findById(req.params.id);

  if(req.user.username !== post.username){
    res.status(403).send('You cannot edit another users post');
  }

  Post.findByIdAndUpdate(req.params.id, 
    {
      title: req.body.title,
      content: req.body.content,
      timestamp: new Date(),
      published: req.body.published
    }, 
    (err, post) => {
      if(err) return next(err);
      if(req.body.published){
        res.send('Post updated');
      }
      else {
        res.send('Post saved for later');
      }
      res.redirect('/');
    });
};

exports.delete_post_get = function(req, res, next) {
  const post = Post.findById(req.params.id);

  if(req.user.username !== post.username){
    res.status(403).send('You cannot edit another users post');
  }

  Post.findByIdAndRemove(req.params.id, (err) => {
    if(err) return next(err);
    res.redirect('/');
  });
};

exports.get_post = function(req, res, next) {
  const post = Post.findById(req.params.id, (err, post) => {
    if(err) return next(err);
    res.send(post);
  });
}