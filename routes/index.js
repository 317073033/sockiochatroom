var express = require('express');
var passport = require('passport');
var svgCaptcha = require('svg-captcha');
var Account = require('./../mongoDbConnection').Account;
var router = express.Router();


router.get('/', function(req, res) {
  if (req.isAuthenticated()) {
    return res.render('main', {
      username: req.user.username
    });
  }
  return res.render('index', {
    message: "",
    user: req.user
  });
});

router.get('/captcha', function(req, res) {
  var captcha = svgCaptcha.create({color: true, size: 4 });
  req.session.captcha = captcha.text;
  res.type('svg');
  res.status(200).send(captcha.data);
})

router.get('/register', function(req, res) {
  res.render('register', {
    message: "",
  });
});

router.post('/register', function(req, res) {

  if (req.session.captcha != req.body.verifyCode) {
    return res.render('register', {
      message: "请输入正确的验证码"
    })
  }

  if (req.body.password != req.body.vpassword) {
    return res.render('register', {
      message: "两次密码不相同"
    })
  }

  let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
  if (!passwordRegex.test(req.body.password)) {
    return res.render('register', {
      message: "password least length is 8 and need to  contain 1 uppercase 1 lowercase and 1 number."
    })
  }

  //"Password must contain 8 characters and at least one number,
  //one letter and one unique character such as !#$%&? "
  // /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/

  Account.register(new Account({
    username: req.body.username
  }), req.body.password, function(err, account) {
    if (err) {
      return res.render('register', {
        account: account,
        message: err
      });
    }

    passport.authenticate('local')(req, res, function() {
      res.redirect('/');
    });
  });
});



router.get('/login', function(req, res) {
  res.redirect('/');
});

// router.post('/login', passport.authenticate('local'), function(req, res) {
//
//     res.render('main');
// });

router.post('/login', function(req, res, next) {

  if (req.session.captcha != req.body.verifyCode) {
    return res.render('index', {
      message: "请输入正确的验证码"
    })
  }

  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render('index', {
        message: "login failed, Please try again"
      })
    }
    req.logIn(user, function(err) { //?
      if (err) {
        return next(err);
      }
      return res.redirect('/')
    });
  })(req, res, next);
});


router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});




module.exports = router;
