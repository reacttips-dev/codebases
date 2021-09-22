'use strict';

const Pipedrive = require('pipedrive');
const PartyModel = require('models/mail/party');

module.exports = Pipedrive.Collection.extend({
	model: PartyModel,

	url: `${app.config.api}/mailbox/mailParties`,

	search: function(opts) {
		opts.data.search = opts.data.keyword;
		delete opts.data.keyword;

		Pipedrive.Collection.prototype.pull.call(this, opts);
	}
});
