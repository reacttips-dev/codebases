const _ = require('lodash');

const signupData = {
	setSignupData: (instance) => {
		_.assignIn(signupData, instance);
	}
};

module.exports = signupData;
