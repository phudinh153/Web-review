const User = require('../models/user.js');

module.exports.renderRegister = (req, res) => {
    res.render('users/register.ejs');
};

module.exports.register = async(req, res) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, e => {
            if(e) return next(e);
            req.flash('success','Welcome to Tourist Destinations Review');
            res.redirect('/attraction');
        })
        
    }
    catch(e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res, next) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo;
    console.log(req.session);
    if (req.session.returnTo && req.session.returnTo !== redirectUrl) {
      delete req.session.returnTo;
    }
  
    return res.redirect(redirectUrl || '/attraction');
};

module.exports.logout = async (req, res, next)  => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/attraction');
    });
};