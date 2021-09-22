const Pipedrive = require('pipedrive');

/**
 * Model for the v2 mail parties. So they could stay up-to-date via sockets.
 */

const MailPartyModel = Pipedrive.Model.extend({
	type: 'mailParty',

	initialize: function() {
		this.selfUpdateFromSocket();
	},

	/**
	 * Returns the name of the party. If the party is linked to a person, will use the person's name.
	 * @return {String}
	 */
	getName: function() {
		return this.get('linked_person_name') || this.get('name');
	}
});

module.exports = MailPartyModel;
