const User = require('../models/user');

//REGISTER
//Render the register form: GET
module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

//Actually registering the user: POST
module.exports.register = async(req, res, next) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch(e){
        req.flash('error', e.message);
        res.redirect('register');
    }
}

//LOGIN
//Render the login form: GET
module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

//Actually logging in the user: POST
module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds'
    res.redirect(redirectUrl);
}


//LOGOUT
//Actually logging out the user: GET
module.exports.logout = (req, res) => {
    req.logOut();
    req.flash('success', 'Goodbye!!')
    res.redirect('/campgrounds');
}

