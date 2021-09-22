const EnumField = require('./enum');
const _ = require('lodash');

module.exports = EnumField.extend({
	type: 'enum-mandatory',

	/**
	 * Get value for edit or edit_bulk mode
	 * @return {Object} Value object
	 */
	getEditValue: function() {
		const value = {};
		const hasValue = this.hasValue();

		value.style = 'switch-buttons';

		value.options = _.map(
			this.model.get('options'),
			_.bind(function(option, i) {
				const o = _.clone(option);

				o.checked = (hasValue && option.id === this.value) || (!hasValue && i === 0);

				return o;
			}, this)
		);

		return value;
	},

	hasValue: function() {
		return !_.isNull(this.value) && !_.isUndefined(this.value);
	}
});
