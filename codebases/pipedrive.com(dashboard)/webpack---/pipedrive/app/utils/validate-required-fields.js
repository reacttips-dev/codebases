const componentLoader = require('webapp-component-loader');
const User = require('models/user');
const Pipedrive = require('pipedrive');
const logger = Pipedrive.Logger('required-fields');

module.exports = function({
	dealModel,
	dealUpdateProperties,
	updateDealOnSave,
	onSave,
	onError,
	onCancel
}) {
	const isRequiredFieldsFeatureEnabled = User.companyFeatures.get('required_fields');

	if (!isRequiredFieldsFeatureEnabled) {
		onSave({});

		return;
	}

	componentLoader
		.load('required-fields')
		.then((validateRequiredFields) => {
			validateRequiredFields({
				dealModel,
				dealUpdateProperties,
				updateDealOnSave,
				onSave,
				onError,
				onCancel
			});
		})
		.catch((error) => {
			logger.error('Unable to load Required Fields service', error);
			// We will not block the deal update in case the Mandatory Fields service is down
			onSave({});
		});
};
