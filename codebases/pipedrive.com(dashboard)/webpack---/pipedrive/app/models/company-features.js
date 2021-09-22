const { Model } = require('@pipedrive/webapp-core');

const locals = {
	switchFeature: function(featureName, isOn, options) {
		this.set(featureName, isOn);
		this.sync('create', this, options);
	}
};

module.exports = Model.extend({
	url: function() {
		return '/api/v1/companyFeatures';
	},

	initialize: function() {},

	parse: function(response) {
		return response.data;
	},
	switchOn: function(featureName, options) {
		locals.switchFeature.call(this, featureName, true, options);
	},
	switchOff: function(featureName, options) {
		locals.switchFeature.call(this, featureName, false, options);
	}
});
