const React = require('react');
const PropTypes = require('prop-types');
const { sanitizeHtml } = require('@pipedrive/sanitize-html');
const displayName = 'StripedHtmlComponent';
const striptags = require('striptags');
const stripHtml = (html, allowedTags) => {
	return { __html: sanitizeHtml(striptags(html, allowedTags)) };
};

const StripedHtmlComponent = (props) => {
	const { html, allowedTags = [] } = props;

	return (
		// eslint-disable-next-line react/no-danger
		<span dangerouslySetInnerHTML={stripHtml(html, allowedTags)} />
	);
};

StripedHtmlComponent.propTypes = {
	html: PropTypes.string,
	allowedTags: PropTypes.array
};

StripedHtmlComponent.displayName = displayName;

module.exports = StripedHtmlComponent;
