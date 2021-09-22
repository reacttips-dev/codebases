import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { highlightRegexSelector } from 'store/modules/itemSearch';

const NON_BREAKING_SPACE = '\u00A0';

function useNonBreakingSpace(substring) {
	return substring === ' ' ? NON_BREAKING_SPACE : substring;
}

function HighlightedText({ children: text }) {
	if (!text) {
		return null;
	}

	const highlightRegex = useSelector(highlightRegexSelector);

	const splitText = text.split(highlightRegex).map(useNonBreakingSpace);

	return (
		<>
			{splitText.map((substring, index) =>
				substring.match(highlightRegex) ? <em key={index}>{substring}</em> : substring,
			)}
		</>
	);
}

export default HighlightedText;

HighlightedText.propTypes = {
	children: PropTypes.string,
};
