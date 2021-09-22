const { Collection } = require('@pipedrive/webapp-core');
const PipelineModel = require('models/pipeline');

module.exports = Collection.extend({
	model: PipelineModel,
	url: '/api/v1/pipelines',
	parse: function(response) {
		if (response.additional_data && response.additional_data.stages) {
			this.additional_data = response.additional_data;
		}

		return response.data;
	},

	getPipelineById: function(id) {
		return this.get(id);
	},

	getSelectedPipelineId: function() {
		const selected = this.find({ selected: true });

		return selected ? selected.id : null;
	}
});
