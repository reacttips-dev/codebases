const _ = require('lodash');

function getAllTypeLabelsByField() {
	return {
		email: [
			{ label: 'work', displayLabel: _.gettext('Work') },
			{ label: 'home', displayLabel: _.gettext('Home') },
			{ label: 'other', displayLabel: _.gettext('Other') }
		],
		phone: [
			{ label: 'work', displayLabel: _.gettext('Work') },
			{ label: 'home', displayLabel: _.gettext('Home') },
			{ label: 'mobile', displayLabel: _.gettext('Mobile') },
			{ label: 'other', displayLabel: _.gettext('Other') }
		],
		im: [
			{ label: 'google', displayLabel: 'Google' },
			{ label: 'aim', displayLabel: 'AIM' },
			{ label: 'yahoo', displayLabel: 'Yahoo' },
			{ label: 'skype', displayLabel: 'Skype' },
			{ label: 'qq', displayLabel: 'QQ' },
			{ label: 'icq', displayLabel: 'ICQ' },
			{ label: 'msn', displayLabel: 'MSN' },
			{ label: 'jabber', displayLabel: 'Jabber' },
			{ label: 'icloud', displayLabel: 'iCloud' }
		]
	};
}

module.exports = {
	/**
	 * Returns the whole type labels array for a given field
	 *
	 * @param {String} field - e.g. 'phone', 'im', 'email'
	 * @returns {Object[]} typeLabels
	 */
	getTypeLabels(field) {
		const typeLabels = getAllTypeLabelsByField()[field];

		if (!typeLabels) {
			throw new Error(`Received unsupported field as input parameter: ${field}`);
		}

		return typeLabels;
	},

	/**
	 * Returns the display label for a given field+label combination
	 * The display labels can be translated where-as the labels are hardcoded in English
	 *
	 * @param {String} field - e.g. 'phone', 'im', 'email'
	 * @param {String} label - e.g. 'work', 'home', ...
	 * @returns {Object[]} typeLabels
	 */
	getDisplayLabel(field, label) {
		const { displayLabel } = _.find(module.exports.getTypeLabels(field), { label }) || {};

		return displayLabel || label;
	}
};
