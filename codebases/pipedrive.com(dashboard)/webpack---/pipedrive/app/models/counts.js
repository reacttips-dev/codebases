const { Model } = require('@pipedrive/webapp-core');
const _ = require('lodash');
const UserCounts = Model.extend({
	type: 'userCounts',

	url: '/api/v1/users/counts',

	initialize: function() {
		this.set('id', app.global.user_id);
		this.selfUpdateFromSocket();
	},

	hasHadNothingInInbox: function() {
		return _.isUndefined(this.get('unread_mail_threads_inbox_count'));
	},

	getUnreadMailCount: function() {
		return this.get('unread_mail_threads_inbox_count');
	}
});

module.exports = UserCounts;
