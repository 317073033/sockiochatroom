var express = require('express');
var router = express.Router();
var isLogin = require('./islogin');

/* GET users listing. */
router.post('/', isLogin, function(req, res, next) {
  let chatMessage = req.user.username + ':' + req.body.message
  res.io.emit('chat message', chatMessage)
  res.send('Sever got msg');
});

module.exports = router;
