import React from 'react';
import PropTypes from 'prop-types';

const TextVariablesWrapper = ({ text, children, template }) => {
	const pieces = [];
	const replacements = React.Children.toArray(children);

	text.split(template[0]).forEach(part => {
		const partPieces = part.split(template[1]);

		if (partPieces.length > 1) {
			pieces.push(React.cloneElement(replacements.shift(), {
				key: pieces.length,
				children: partPieces.shift(),
			}));
		}

		pieces.push(partPieces.shift());
	});

	return <>{pieces}</>;
};

TextVariablesWrapper.propTypes = {
	text: PropTypes.string.isRequired,
	children: PropTypes.any.isRequired,
	template: PropTypes.arrayOf(PropTypes.string),
};

TextVariablesWrapper.defaultProps = {
	template: ['{{', '}}'],
};

export default TextVariablesWrapper;