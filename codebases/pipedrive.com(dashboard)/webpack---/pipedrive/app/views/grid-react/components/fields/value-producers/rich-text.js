const React = require('react');
const PropTypes = require('prop-types');
const modelUtils = require('views/grid-react/utils/model-utils');
const displayName = 'RichTextComponent';
const StripedHtml = require('views/grid-react/components/striped-html');

const RichTextComponent = (props) => {
	const { model, field } = props;
	const html = modelUtils.getModelAttribute(model, field.key, '');

	return <StripedHtml html={html} allowedTags={['a']} />;
};

RichTextComponent.propTypes = {
	model: PropTypes.object,
	field: PropTypes.object.isRequired
};

RichTextComponent.displayName = displayName;

module.exports = RichTextComponent;
