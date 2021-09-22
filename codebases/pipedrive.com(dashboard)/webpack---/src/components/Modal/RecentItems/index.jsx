import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ItemsList from '../ItemsList';
import Skeleton from './Skeleton/Skeleton';
import NoRecentItemsOrKeywords from '../emptyAndErrorViews/NoRecentItemsOrKeywords';

import translator from 'utils/translator';
import {
	getRecentItemsAndKeywords,
	recentErrorSelector,
	recentItemsSelector,
	recentKeywordsSelector,
	recentQueryInProgressSelector,
	resetRecentItems,
} from 'store/modules/recentItems';

import styles from '../style.scss';

function RecentItems() {
	const dispatch = useDispatch();
	const error = useSelector(recentErrorSelector);
	const recentsQueryInProgress = useSelector(recentQueryInProgressSelector);
	const recentKeywords = useSelector(recentKeywordsSelector);
	const recentItems = useSelector(recentItemsSelector);
	const keywordsTitle = translator.gettext('Recent keywords');
	const recentItemsTitle = translator.gettext('Recently viewed');

	useEffect(() => {
		dispatch(getRecentItemsAndKeywords());

		return () => dispatch(resetRecentItems());
	}, []);

	if (!recentsQueryInProgress && recentKeywords.length === 0 && recentItems.length === 0) {
		return <NoRecentItemsOrKeywords />;
	}

	return (
		<div>
			{recentKeywords.length > 0 && (
				<ItemsList items={recentKeywords} title={keywordsTitle} className={styles.recentKeywordsAppear} />
			)}

			{recentsQueryInProgress ? (
				<Skeleton title={recentItemsTitle} />
			) : (
				<ItemsList
					items={recentItems}
					title={recentItemsTitle}
					indexOffset={recentKeywords.length}
					contentClassName={styles.recentItemsAppear}
					titleClassName={styles.recentItemsTitleAppear}
					emptyMessage={getEmptyMessage(error)}
				/>
			)}
		</div>
	);
}

export default RecentItems;

function getEmptyMessage(error) {
	return error
		? translator.gettext('We couldn’t load your recently viewed items.')
		: translator.gettext('Your recently viewed items will be shown here.');
}
