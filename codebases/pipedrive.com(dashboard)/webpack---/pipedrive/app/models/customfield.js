const Pipedrive = require('pipedrive');

module.exports = Pipedrive.Model.extend({
	defaults: {
		field_type: 'varchar'
	}
});
