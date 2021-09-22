const Field = require('../field');
const User = require('models/user');

module.exports = Field.extend({
	type: 'pipeline',

	/**
	 * Get value for read mode
	 * @return {Object} Value object
	 */
	getReadValue: function() {
		const pipeline = User.pipelines.getPipelineById(this.value);

		return {
			label: pipeline ? pipeline.get('name') : ''
		};
	}
});
