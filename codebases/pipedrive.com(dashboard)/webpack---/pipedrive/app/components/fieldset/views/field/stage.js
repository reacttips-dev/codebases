const Field = require('../field');
const Stages = require('collections/pipeline/stages');

module.exports = Field.extend({
	type: 'stage',

	/**
	 * Get value for read mode
	 * @return {Object} Value object
	 */
	getReadValue: function() {
		const stage = Stages.getStageById(this.value);

		return {
			label: stage ? stage.get('name') : ''
		};
	},

	/**
	 * Get value(s) from editor in edit or edit_bulk mode
	 * @param {Object} $el jQuery element where data should be obtained
	 * @return {Object} Values from editor including subfields if there are any
	 */
	getValueFromEditor: function($el) {
		const value = {};

		value[this.key] = Number($el.find('.widget-radio.active input').val());

		return value;
	}
});
