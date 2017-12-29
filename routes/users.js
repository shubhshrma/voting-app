var express = require('express');
var router = express.Router();

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
		console.log('YES');
	}
	else
		console.log("NO");

});

module.exports = router;