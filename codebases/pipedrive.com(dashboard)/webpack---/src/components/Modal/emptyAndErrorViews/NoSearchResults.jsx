import React from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import { completedQuerySelector } from 'store/modules/itemSearch';
import translator from 'utils/translator';
import styles from './style.scss';
import emptySearchImage from './searchEmpty.svg';
import CTAsForAddingItem from './CTAsForAddingItem';
import { ITEM_TYPES, ALL_CATEGORIES } from 'utils/constants';
const { DEAL, LEAD, PERSON, ORGANIZATION, PRODUCT, FILE } = ITEM_TYPES;

function NoSearchResults() {
	const { term, category } = useSelector(completedQuerySelector);

	return (
		<div className={classNames(styles.wrapper, styles.wideSidePaddings, styles.noSearchResults)}>
			<img src={emptySearchImage} alt="no-search-results" />
			<div className={classNames(styles.title, styles.noSearchResultsTitle)}>{titleText(term, category)}</div>
			<CTAsForAddingItem />
		</div>
	);
}

export default NoSearchResults;

function titleText(term, category) {
	if (category === ALL_CATEGORIES) {
		return translator.pgettext(
			'No results for ’[word that was entered to search box]’',
			'No results for ’%s’',
			term,
		);
	}

	const entityTranslations = {
		[DEAL]: translator.gettext('deals'),
		[PERSON]: translator.gettext('persons'),
		[ORGANIZATION]: translator.gettext('organizations'),
		[LEAD]: translator.gettext('leads'),
		[PRODUCT]: translator.gettext('products'),
		[FILE]: translator.gettext('files'),
	};

	return translator.pgettext(
		'No results in [entity type, eg. deals/leads/persons/etc.] for ’[word that was entered to search box]’',
		'No results in %s for ’%s’',
		[entityTranslations[category], term],
	);
}
