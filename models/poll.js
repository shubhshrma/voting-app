var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var PollSchema = mongoose.Schema({
	username: {
		type: String,
	},
	title: {
		type: String,
		index: true,
		unique: true
	},
	options: {
		type: Array
	}
});

var Poll = module.exports = mongoose.model('Poll', PollSchema);

module.exports.createPoll = function(newPoll, callback) {

	/*bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(newUser.password, salt, function(err, hash) {
			newUser.password = hash;
			newUser.save(callback);
		});
	});*/
	newPoll.save(callback);

};

module.exports.getPoll = function(title, callback) {
	var query = {title: title};
	Poll.findOne(query, callback);

};

module.exports.getAllPolls = function(callback) {
	Poll.find({}, callback);
}

module.exports.getPollsByUsername = function(username, callback) {
	Poll.find( {username: username}, callback);
}


/*module.exports.comparePassword = function(password, hash, callback) {
	bcrypt.compare(password, hash, function(err, isMatch) {
		if(err) throw err;
		callback(null, isMatch);
	});
};

module.exports.getUserById = function(id, callback) {
	User.findById(id, callback);
}; */