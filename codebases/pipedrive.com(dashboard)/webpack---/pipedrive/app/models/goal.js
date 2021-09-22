const Pipedrive = require('pipedrive');

module.exports = Pipedrive.Model.extend({
	defaults: {},
	initialize: function() {
		this.calculateCompleteness();
	},
	calculateCompleteness: function() {
		if (this.get('expected_sum') !== 0) {
			this.percentage = (this.get('delivered_sum') / this.get('expected_sum')) * 100;
			this.expectedType = 'sum';
		} else if (this.get('expected') === 0) {
			this.percentage = 0;
			this.expectedType = null;
		} else {
			this.percentage = (this.get('delivered') / this.get('expected')) * 100;
			this.expectedType = 'count';
		}
	}
});
