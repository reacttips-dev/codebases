const User = require('models/user');
const modelUtils = require('views/grid-react/utils/model-utils');
const modals = require('utils/modals');

module.exports = (props) => {
	const result = {};

	const { model, field } = props;
	const fieldKey = field.key;

	result.value = modelUtils.getModelAttribute(model, fieldKey, '');

	if (result.value) {
		result.linkAttributes = {
			href: '#',
			onClick(e) {
				e.preventDefault();

				modals.open('webapp:modal', {
					modal: 'map',
					params: {
						type: model.type,
						field,
						model,
						userSettings: User.settings
					}
				});
			}
		};
	}

	return result;
};
