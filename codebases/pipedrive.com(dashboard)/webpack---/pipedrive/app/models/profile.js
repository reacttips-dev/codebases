const { Model } = require('@pipedrive/webapp-core');
const UserProfile = Model.extend({
	type: 'userProfile'
});

module.exports = UserProfile;
