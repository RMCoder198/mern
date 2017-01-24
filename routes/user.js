var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');

module.exports.createUser = function(req, res, next) {
  var user = new User();
  user.email = req.body.email;
  user.name = req.body.name;
  user.facebook = req.body.facebook;
  user.setPassword(req.body.password);
  user.save(function(err, user) {
    if(err) return next(err);
    // 여기서 로그인 유무 변수를 던져줘서 네비게이션을 통제
    var token;
    token = user.generateJwt();
    // 토큰을 만들었지만 프론트 프레임워크가 없기 때문에 지금은 필요가 없다 -> 직접 user 전달
    req.session.user = user;
    res.redirect('profile');
  });
};

module.exports.signIn = function(req, res, next) {
  passport.authenticate('local', function(err, user, info){
    var token;
    if(err) {
      res.status(404).json(err);
      return;
    }
    if(user){
      token = user.generateJwt();
      req.session.user = user;
      res.redirect('profile');
    } else {
      res.status(401).json(info);
    }
  })(req, res);
};
