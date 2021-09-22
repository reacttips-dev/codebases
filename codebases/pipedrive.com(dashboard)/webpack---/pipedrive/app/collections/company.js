const _ = require('lodash');

const users = {
	setUsers: (instance) => {
		_.assignIn(users, instance);
	}
};

module.exports = users;
