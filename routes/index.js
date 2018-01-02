var express = require('express');
var router = express.Router();

var Poll = require('../models/poll');

//Get homepage
router.get('/', function(req, res) {
    Poll.getAllPolls(function(err, polls){
    	if(err) throw err;
 		res.render('index', {polls: polls});
    });
	
});

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated())
		return next();
	else{
		//req.flash('error_msg', 'You are not logged in.');
		res.redirect('/users/login');
	}

}

router.get('/poll/:title', function(req, res) {
	var title = req.params.title;
	Poll.getPoll(title, function(err, poll){
		if(err) throw err;
		res.render('single_poll', {poll: poll});
	});
});

module.exports = router;