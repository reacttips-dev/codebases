const Pipedrive = require('pipedrive');
const MailConnection = Pipedrive.Model.extend({
	type: 'mailConnection',

	initialize: function() {
		this.selfUpdateFromSocket();
	},

	isNylasSetupIncomplete: function() {
		return this.get('status') === 'token_received';
	},

	isRevoked: function() {
		return this.get('status') === 'revoked';
	}
});

module.exports = MailConnection;
