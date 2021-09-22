import React from 'react';

import { Spacing, Separator } from '@pipedrive/convention-ui-react';
import CTAsForAddingItem from './emptyAndErrorViews/CTAsForAddingItem';
import translator from 'utils/translator';

import styles from './style.scss';

export default function FuzzySearchCTAs() {
	return (
		<Spacing className={styles.itemsListWrapper}>
			<div className={styles.itemListHeader}>{translator.gettext('No direct results found')}</div>
			<Spacing horizontal="l">
				<CTAsForAddingItem />
			</Spacing>
			<Spacing horizontal="l" vertical="m">
				<Separator />
			</Spacing>
		</Spacing>
	);
}
