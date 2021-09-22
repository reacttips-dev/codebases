const _ = require('lodash');
const Helpers = require('utils/helpers');
const ccFieldName = 'cc_email';

const bccExtractor = {
	extractBcc: function extractBcc() {
		// eslint-disable-next-line prefer-rest-params
		const possibleModelsWithEmail = _.toArray(arguments);
		const modelWithCCEmail = _.find(possibleModelsWithEmail, function(model) {
			return Helpers.isModel(model) && !!model.get(ccFieldName);
		});

		return modelWithCCEmail ? modelWithCCEmail.get(ccFieldName) : null;
	}
};

module.exports = bccExtractor;
