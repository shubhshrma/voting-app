var express = require('express');
var router = express.Router();

var User = require('../models/user');
//Register
router.get('/register', function(req, res) {
	res.render('register');
});

//Login
router.get('/login', function(req, res) {
	res.render('login');
});
	
//register user
router.post('/register', function(req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
    //validation
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
	else{
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

module.exports = router;