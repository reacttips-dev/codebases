const _ = require('lodash');
const { Model } = require('@pipedrive/webapp-core');

module.exports = Model.extend({
	readonly: [],
	url: function() {
		if (this.get('id')) {
			return `/api/v1/pipelines/${this.get('id')}`;
		} else {
			return '/api/v1/pipelines';
		}
	},
	parse: function(response) {
		if (_.isObject(response.data)) {
			return response.data;
		}

		return response;
	}
});
