const Pipedrive = require('pipedrive');

module.exports = Pipedrive.Model.extend({
	idAttribute: 'code',

	getKey: function(separator) {
		return this.get('language_code') + (separator || '-') + this.get('country_code');
	}
});
