const { Collection } = require('@pipedrive/webapp-core');
const _ = require('lodash');

const AlternativeEmails = Collection.extend({
	isConfirmedAlternativeAddress: function(address) {
		const confirmedAddresses = this.getConfirmedAddresses();

		return confirmedAddresses && _.includes(confirmedAddresses, address);
	},

	getConfirmedAddresses: function() {
		const models = this.where({ confirmed_flag: true });
		const addresses = _.map(models, function(model) {
			return model.get('email');
		});

		return addresses;
	}
});

module.exports = AlternativeEmails;
