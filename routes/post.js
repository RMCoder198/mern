var mongoose = require('mongoose');
var Post = mongoose.model('Post');

module.exports.upload = function(req, res, next) {
  res.render('upload');
};

module.exports.getPosts = function(req, res, next) {
  Post.find(function(err, posts) {
    if (err) return console.error(err);
    // res.json({posts : posts});
    res.render('index', {posts: posts});
  })
};

module.exports.createPost = function(req, res, next) {
  var post = new Post();
  post.title = req.body.title;
  post.content = req.body.content;
  post.save(function(err, post) {
    if(err) return next(err);
    res.render('post', {post: post});
  });
};

module.exports.getPost = function(req, res, next) {
  Post.findById(req.params.postId, function(err, post) {
    if(err) return next(err);
    res.render('post', {post: post});
  });
};
