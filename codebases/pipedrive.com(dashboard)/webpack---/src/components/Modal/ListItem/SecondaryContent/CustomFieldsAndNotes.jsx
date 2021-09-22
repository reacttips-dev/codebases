/* eslint-disable complexity */
import React from 'react';
import PropTypes from 'prop-types';

import HighlightedText from '../HighlightedText';
import styles from '../style.scss';
import translator from 'utils/translator';
import { TextSpan } from './fragments';

function Note({ note }) {
	return (
		<div>
			<span className={styles.black}>
				{translator.pgettext('A note attached to a deal/org/person', 'Note')}
				{': '}
			</span>
			<HighlightedText>{note}</HighlightedText>
		</div>
	);
}

Note.propTypes = {
	note: PropTypes.string.isRequired,
};

function CustomField({ content }) {
	return (
		<div>
			<span className={styles.black}>
				{translator.pgettext(
					'Match found in custom fields [: the content of the custom field that matched search query]',
					'Match found in custom fields',
				)}
				{': '}
			</span>
			<TextSpan>{content}</TextSpan>{' '}
		</div>
	);
}

CustomField.propTypes = {
	content: PropTypes.string.isRequired,
};

function getMoreMatchesFoundText(customFields, notes) {
	const customFieldsCount = (customFields && customFields.length) || 0;
	const notesCount = (notes && notes.length) || 0;
	const remainingCount = customFieldsCount + notesCount - 1;

	if (customFieldsCount <= 2 && notesCount === 0) {
		return null;
	}

	if (customFieldsCount === 0 && notesCount === 1) {
		return null;
	}

	if (customFieldsCount > 2 && notesCount === 0) {
		return translator.ngettext(
			'+%d more match found in custom fields',
			'+%d more matches found in custom fields',
			remainingCount,
			remainingCount,
		);
	}

	if (customFieldsCount < 2 && notesCount > 0) {
		return translator.ngettext(
			'+%d more match found in notes',
			'+%d more matches found in notes',
			remainingCount,
			remainingCount,
		);
	}

	return translator.ngettext(
		'+%d more match found in custom fields and notes',
		'+%d more matches found in custom fields and notes',
		remainingCount,
		remainingCount,
	);
}

export default function CustomFieldsAndNotes({ item }) {
	const { custom_fields: customFields, notes } = item;
	const hasCustomFields = customFields && customFields.length > 0;
	const hasNotes = notes && notes.length > 0;
	const moreMatchesFound = getMoreMatchesFoundText(customFields, notes);

	if (!hasCustomFields && !hasNotes) {
		return null;
	}

	return (
		<div className={styles.customFieldsAndNotes}>
			{hasCustomFields && <CustomField content={customFields[0]}></CustomField>}
			{customFields.length === 2 && !hasNotes && <CustomField content={customFields[1]}></CustomField>}
			{!hasCustomFields && hasNotes && <Note note={notes[0]}></Note>}
			{moreMatchesFound && <span className={styles.black}>{moreMatchesFound}</span>}
		</div>
	);
}

CustomFieldsAndNotes.propTypes = {
	item: PropTypes.shape({
		custom_fields: PropTypes.array,
		notes: PropTypes.array,
	}),
};
