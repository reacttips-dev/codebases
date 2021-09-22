const _ = require('lodash');
const FieldPhone = require('./phone');
const { getDisplayLabel } = require('../../../../views/ui/typeLabels');

module.exports = FieldPhone.extend({
	type: 'im',

	/**
	 * Get formatted field value
	 * @return {String} Formatted field value for current state
	 * @default Read state formatted value
	 */
	getReadValue: function() {
		return _.map(this.value, (item) => {
			const displayLabel = getDisplayLabel('im', item.label);

			return {
				label: item.label,
				displayLabel,
				value: item.value
			};
		});
	},

	// Overwrites the phone class' tracking method. Add im field specific tracking here if needed.
	trackValueClick: null
});
