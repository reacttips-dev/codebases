const React = require('react');
const PropTypes = require('prop-types');
const { createLinks } = require('@pipedrive/sanitize-html');
const modelUtils = require('views/grid-react/utils/model-utils');
const displayName = 'LinkTextComponent';

const LinkTextComponent = (props) => {
	const { model, field } = props;
	const html = modelUtils.getModelAttribute(model, field.key, '');

	function createMarkup() {
		return { __html: createLinks(html, { openLinksInNewTab: true }) };
	}

	return (
		// eslint-disable-next-line react/no-danger
		<span dangerouslySetInnerHTML={createMarkup()} />
	);
};

LinkTextComponent.propTypes = {
	model: PropTypes.object,
	field: PropTypes.object.isRequired
};

LinkTextComponent.displayName = displayName;

module.exports = LinkTextComponent;
