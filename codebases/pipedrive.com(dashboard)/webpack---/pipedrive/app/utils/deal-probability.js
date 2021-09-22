'use strict';
const User = require('models/user');

module.exports = {
	isDealProbabilityTurnedOn: function(pipelineId) {
		const pipeline = User.pipelines.models.find(function(model) {
			return model.id === pipelineId;
		});

		return pipeline ? pipeline.get('deal_probability') : false;
	}
};
