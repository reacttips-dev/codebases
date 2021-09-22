import React from 'react';

import styles from './style.scss';
import emptySearchImage from './searchEmpty.svg';
import translator from 'utils/translator';
import { Spacing } from '@pipedrive/convention-ui-react';

function NoRecentItemsOrKeywords() {
	const text = translator.gettext('Your recent search history and recently viewed items will be shown here.');
	return (
		<div className={styles.wrapper}>
			<img src={emptySearchImage} alt="no-search-results" />
			<Spacing top="l">
				<div className={styles.centeredText}>{text}</div>
			</Spacing>
		</div>
	);
}

export default NoRecentItemsOrKeywords;
