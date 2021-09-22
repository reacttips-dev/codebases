require('react');
require('react-dom');
const PropTypes = require('prop-types');
const modelUtils = require('views/grid-react/utils/model-utils');
const displayName = 'VarcharComponent';
const linkTextValueProducer = require('./link-text');
const VarcharComponent = (props) => {
	const { model, field } = props;
	const fieldKey = field.key;
	const type = model?.type;
	const id = model?.id;
	const fieldLink = modelUtils.getModelLink(model, fieldKey);
	const linkTextValue = linkTextValueProducer(props);

	if (fieldLink) {
		return {
			id,
			type,
			linkAttributes: {
				href: fieldLink
			},
			value: modelUtils.getModelAttribute(model, fieldKey, '')
		};
	} else {
		return {
			value: linkTextValue
		};
	}
};

VarcharComponent.propTypes = {
	model: PropTypes.object,
	field: PropTypes.object.isRequired
};

VarcharComponent.displayName = displayName;

module.exports = VarcharComponent;
