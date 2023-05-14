const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync.js')
const users = require('../controllers/users')

router.route('/register')
    .get( users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get( users.renderLogin)
    .post( (req, res, next) => {
  let returnTo = req.session.returnTo;
  if(!req.session.returnTo){
    returnTo = '/attraction'
  }
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  })(req, res, next);
}, users.login);

  
router.get('/logout', users.logout);



module.exports = router;