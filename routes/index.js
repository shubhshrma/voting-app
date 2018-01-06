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

//POST req after vote on any poll
router.post('/vote/:title', function(req, res) {

	var option = req.body.option;
    var title = req.params.title;
    console.log(option);
    Poll.getPoll(title, function(err, poll){
		if(err) throw err;

        for(var i=0;i<poll.options.length;i++)
        {
        	if(poll.options[i]["name"]===option)
        		break;
        }
		//poll.set({ options: obj });
        poll.options[i]["votes"]++;
        poll.markModified('options.'+i+'.votes');
		poll.save(function(err, newpoll){
    		if(err) throw err;
    		console.log(newpoll);
    		req.flash('success_msg', 'Your response is recorded successfully.');
    		res.redirect('/');
    	});
		
	});
    
	
});

router.get('/poll/:title', function(req, res) {
	var title = req.params.title;
	Poll.getPoll(title, function(err, poll){
		if(err) throw err;
		res.render('single_poll', {poll: poll});
	});
});

module.exports = router;