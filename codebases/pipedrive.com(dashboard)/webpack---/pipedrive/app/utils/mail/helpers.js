const User = require('models/user');
const _ = require('lodash');
const MailHelpers = function() {};

_.assignIn(MailHelpers.prototype, {
	/**
	 * Returns party's name, if it's present in the data object.
	 * Returns the email address, if no name available.
	 * Returns "You" if the passed in party is current user / me.
	 *
	 * @param  {Object} partyData 	Data of a single party
	 * @param  {Boolean} short   	If set to "true", returns short version of the name or email of the party
	 * @return {String}
	 */
	getSinglePartyStr: function(partyData, short) {
		let singlePartyStr = '';

		const name = partyData.linked_person_name || partyData.name;
		const email = partyData.email_address;

		if (User.isValidatedEmailAddress(email)) {
			singlePartyStr = _.gettext('You');
		} else if (name) {
			singlePartyStr = short ? name.split(' ')[0] : name;
		} else {
			singlePartyStr = short ? email.split('@')[0].split('.')[0] : email;
		}

		return singlePartyStr;
	},

	removeOpenTrackingPixels: function(bodyStr) {
		const bodyDocument = document.implementation.createHTMLDocument('bodyDocument');
		const bodyContainer = bodyDocument.createElement('div');

		bodyContainer.innerHTML = bodyStr;

		const isNylasTrackingUrl = (url) =>
			['api.nylas.com/open', 'nyl.as/open'].some((trackingUrl) => url.includes(trackingUrl));
		const isPipemailerTrackingUrl = (url) =>
			url.includes(`${app.config.emailTrackingDomain}/o`);

		bodyContainer.querySelectorAll('img').forEach((img) => {
			const imgUrl = img.src || '';

			if (isNylasTrackingUrl(imgUrl) || isPipemailerTrackingUrl(imgUrl)) {
				img.remove();
			}
		});

		return bodyContainer.innerHTML;
	}
});

module.exports = new MailHelpers();
