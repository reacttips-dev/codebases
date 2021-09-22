const HelpersLodash = require('utils/helpers-lodash');

module.exports = (props) => {
	const { model } = props;

	if (model) {
		model.cacheCalculatedValues();

		return HelpersLodash.timestamp(model.localDueDate, 'compositeDateTime', false);
	}

	return '';
};
