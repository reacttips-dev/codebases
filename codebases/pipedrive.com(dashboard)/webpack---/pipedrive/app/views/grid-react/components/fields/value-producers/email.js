const fieldWrapperUtils = require('views/grid-react/utils/fields-utils');
const modelUtils = require('views/grid-react/utils/model-utils');
const User = require('models/user');
const _ = require('lodash');
const bccExtractor = require('utils/bcc-extractor');
const createLink = (email, model) => {
	const bcc = bccExtractor.extractBcc(model.parentModel, model, User);
	const bccEmail = bcc ? `?bcc=${encodeURIComponent(bcc)}` : '';

	return `mailto:${email}${bccEmail}`;
};

module.exports = (props) => {
	const { model, field } = props;
	const fieldValues = modelUtils.getModelAttribute(model, field.key, []);

	return _.map(fieldValues, (fieldValue) => {
		const value = _.isObject(fieldValue) ? fieldValue.value : fieldValue;
		const linkAttributes = {
			href: createLink(value, model)
		};

		if (User.settings.get('open_email_links_in_new_tab')) {
			linkAttributes.target = '_blank';
		}

		return {
			value,
			label: fieldWrapperUtils.formatValueLabel('email', fieldValue.label),
			linkAttributes
		};
	});
};
