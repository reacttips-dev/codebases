const Pipedrive = require('pipedrive');

module.exports = Pipedrive.Model.extend({
	defaults: {
		// Custom added fields, not from API
		deals: [],
		goals: []
	}
});
