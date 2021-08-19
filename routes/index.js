var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentsController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/sign-up', function(req, res, next) {
  res.render('sign-up');
});

router.get('/log-in', function(req, res, next) {
  res.render('log-in');
});

router.post('/sign-up', userController.signup_post);

router.post('/log-in', [userController.login_post], (req, res, next) => {
  res.redirect('/user');
});

router.get('/log-out', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

router.get('/user', [userController.checkToken], userController.verifyToken);

router.get('/edit/:id', postController.edit_post_get);

router.post('/edit/:id', postController.edit_post);

router.get('/delete/:id', postController.delete_post_get);

router.get('/:id', postController.get_post);

router.get('/create', postController.create_post_get);

router.post('/create', postController.create_post);

router.post(':id/comments', commentController.add_comment);

router.get(':id/comments', commentController.comment_detail)

module.exports = router;
