'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _post = require('../models/post');

var _post2 = _interopRequireDefault(_post);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// LIST POSTS
router.get('/all', function (req, res, next) {
  _post2.default.find().populate('author').exec(function (err, posts) {
    if (err) return next(err);
    return res.json({
      posts: posts
    });
  });
});

// CREATE POST
router.post('/', function (req, res, next) {
  var post = new _post2.default();
  post.title = req.body.title;
  post.contents = req.body.contents;
  post.author = req.body.userId;
  post.save(function (err, post) {
    if (err) return next(err);
    return res.json({
      post: post
    });
  });

  // 포스트를 하나 저장할 때마다 유저 스키마에 포스트를 저장하고 유저를 업데이트한다
  _user2.default.findByIdAndUpdate(req.body.userId, { $push: { posts: post._id } }, { new: true }, function (err) {
    if (err) return next(err);
    // {new: true} 옵션은 수정된 객체를 반환할 것인가의 유무를 전달한다
  });
});

// RETRIEVE POST
// NOT USED YET
router.get('/:postId', function (req, res, next) {
  _post2.default.findById(req.params.postId).populate('author').exec(function (err, post) {
    if (err) return next(err);
    return res.json({
      post: post
    });
  });
});

// UPDATE POST
router.put('/:postId', function (req, res, next) {
  console.log(req.params.postId);
  _post2.default.findByIdAndUpdate(req.params.postId, { $set: req.body }, { new: true }).populate('author').exec(function (err, post) {
    if (err) return next(err);
    return res.json({
      post: post
    });
  });
});

// DELETE POST
router.delete('/:postId', function (req, res, next) {
  // 게시물 삭제시 User 스키마에서도 ObjectId 삭제
  _post2.default.findByIdAndRemove(req.params.postId, function (err) {
    if (err) return next(err);
    return res.json({
      success: true
    });
  });
});

var _default = router;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(router, 'router', 'server/routes/post.js');

  __REACT_HOT_LOADER__.register(_default, 'default', 'server/routes/post.js');
}();

;