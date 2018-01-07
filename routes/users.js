var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var Poll = require('../models/poll');

//Register
router.get('/register', function(req, res) {
	res.render('register');
});

//Login
router.get('/login', function(req, res) {
	res.render('login');

});
	
//Register user
router.post('/register', function(req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
    
    //Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email should be valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(password);
	
	var errors = req.validationErrors();
	if(errors) {
		res.render('register', {
			errors: errors
		});
	}
	else {
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can login now.');
		res.redirect('/users/login');
	}
});

//Passport authentication strategy
passport.use(new LocalStrategy(
  function(username, password, done) { 
  	
  	User.getUserByUsername(username, function(err, user) {
  		if(err) throw err;
  		if(!user) {
  			return done(null, false, {message: "Username not found."});
  		}
  	
    
    User.comparePassword(password, user.password, function(err, isMatch) {
    	if(err) throw err;
    	if(isMatch) {
    		return done(null, user);
    	}
    	else{
    		return done(null, false, {message: 'Invalid Password.'});
    	}
    });

    });

  }));

//Session storage
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login', passport.authenticate('local', {/*successRedirect: '/users/', */failureRedirect:'/users/login', failureFlash: true}), function(req, res) {
 		//console.log(1);
 		res.redirect('/users/'+req.user.username);
});

//Logout
router.get('/logout', function(req, res) {
	req.logout();
	req.flash('success_msg', 'You are logged out.');
	res.redirect('/users/login');
})

//New Poll
router.get('/newpoll', function(req, res) {
	res.render('newpoll');
});

router.post('/newpoll', function(req, res) {
	
	var title = req.body.title;
	
	var username = req.user.username;
	var options = [];
	var optionsHelper = req.body.options.split(',');
	options = optionsHelper.map(function(x) {
		return {
			name: x,
			votes: 0
		}
	});

	var newPoll = new Poll({
		username: username,
		title: title,
		options: options
	});
	Poll.createPoll(newPoll, function(err, poll) {
		if(err) throw err;
		console.log(poll);
	});
	
	req.flash('success_msg', 'Your poll is created.');
	res.redirect('/');
});

//User page
router.get('/:username',  function(req, res) {
	if(req.user){
		var username = req.params.username;
		Poll.getPollsByUsername(username, function(err, polls) {
			if(err) throw err;
			res.render('user', {polls: polls});
		});
	}
	else
	{
		req.flash('error_msg', 'You are not logged in. Please login first');
		res.redirect('/users/login');
	}
});

//User Poll
router.get('/poll/:title', function(req, res) {
	if(req.user){
		var title = req.params.title;
		Poll.getPoll(title, function(err, poll) {
			if(err) throw err;
			res.render('userpoll', {poll: poll});
		});
	}
	else
	{
		req.flash('error_msg', 'You are not logged in. Please login first');
		res.redirect('/users/login');
	}
});
module.exports = router;