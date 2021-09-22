import React from 'react';
import { escapeRegExp } from 'lodash';

interface HighlightedTextProps {
	text: string;
	highlight: string;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({
	text = '',
	highlight = '',
}) => {
	if (!highlight.trim()) {
		return <span>{text}</span>;
	}

	const regex = new RegExp(`(${escapeRegExp(highlight)})`, 'gi');
	const parts = text.split(regex);

	return (
		<span>
			{parts
				.filter((part) => part)
				.map((part, i) =>
					regex.test(part) ? (
						// eslint-disable-next-line react/no-array-index-key
						<mark key={i}>{part}</mark>
					) : (
						// eslint-disable-next-line react/no-array-index-key
						<span key={i}>{part}</span>
					),
				)}
		</span>
	);
};

export default HighlightedText;
