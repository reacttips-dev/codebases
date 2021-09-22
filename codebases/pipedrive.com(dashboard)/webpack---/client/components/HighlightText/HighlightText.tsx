import { findAll, Chunk } from 'highlight-words-core';

import React from 'react';

import styles from './HighlightText.pcss';

interface HighlightTextProps {
	textToHighlight: string;
	searchWords: string[];
}

export function HighlightText({ searchWords, textToHighlight, ...restProps }: HighlightTextProps) {
	const chunks = findAll({
		autoEscape: true,
		caseSensitive: false,
		searchWords,
		textToHighlight,
	});

	const HighlightTag = 'span';

	return (
		<HighlightTag {...restProps}>
			{chunks.map((chunk: Chunk, index: number) => {
				const text = textToHighlight.substr(chunk.start, chunk.end - chunk.start);

				if (chunk.highlight) {
					return (
						<HighlightTag key={index} className={styles.highlighted}>
							{text}
						</HighlightTag>
					);
				}

				return <HighlightTag key={index}>{text}</HighlightTag>;
			})}
		</HighlightTag>
	);
}
