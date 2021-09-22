const TextField = require('./text');
const _ = require('lodash');
const Template = require('../../templates/field/address.html');
const $ = require('jquery');

module.exports = TextField.extend({
	type: 'address',
	template: _.template(Template),

	/**
	 * Get value(s) from editor in edit or edit_bulk mode
	 * @param {Object} $el jQuery element where data should be obtained
	 * @return {Object} Values from editor including subfields if there are any
	 */
	getValueFromEditor: function($el) {
		const value = {};
		const geocodeEl = $el.find('input[name="geocodeData"]');

		if (!_.isEmpty(geocodeEl)) {
			const geocodeData = geocodeEl.data();

			if (!_.isEmpty(geocodeData)) {
				value[`${this.key}_geocoded`] = window.JSON.stringify(geocodeData);
			}
		}

		value[this.key] = $.trim($el.find('input[type="text"]').val());

		return value;
	}
});
