const _ = require('lodash');

const user = {
	setUser: (instance) => {
		_.assignIn(user, instance);
	},
	isUserModel: true
};

module.exports = user;
