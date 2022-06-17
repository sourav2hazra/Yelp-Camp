const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');


//REGISTER
router.get('/register', users.renderRegister) //Rendering the register form
router.post('/register', catchAsync(users.register)) //Actually registering


//LOGIN
router.get('/login', users.renderLogin) //Rendering the login form
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login) //Actually logging in

//LOGOUT
router.get("/logout", users.logout) //Actually logging out


module.exports = router;