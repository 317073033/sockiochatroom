function isLogin(req,res,next){
    req.isAuthenticated() ? next() : res.redirect("/login");
}

module.exports = isLogin;
